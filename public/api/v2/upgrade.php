<?php
if (!isset($action)) {
    http_response_code(404);
    exit();
}
function addColumn(
    PDO $db,
    string $table,
    string $name,
    string $definition,
): void {
    $q = $db->prepare(
        "SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME=? AND COLUMN_NAME=?",
    );
    $q->execute([$table, $name]);
    if (!$q->fetchColumn()) {
        $db->exec("ALTER TABLE `$table` ADD COLUMN `$name` $definition");
    }
}
function backupDatabase(PDO $db): string
{
    global $config;
    $root =
        sys_get_temp_dir() .
        "/finans-backups-" .
        substr(
            hash("sha256", $config["db_name"] . $config["setup_token"]),
            0,
            20,
        );
    if (!is_dir($root) && !mkdir($root, 0700, true)) {
        throw new RuntimeException("Yedek dizini oluşturulamadı.");
    }
    chmod($root, 0700);
    $name =
        $root .
        "/backup-" .
        date("Ymd-His") .
        "-" .
        bin2hex(random_bytes(6)) .
        ".jsonl";
    $f = fopen($name, "xb");
    if (!$f) {
        throw new RuntimeException("Yedek açılamadı.");
    }
    chmod($name, 0600);
    $write = function ($data) use ($f) {
        $s =
            json_encode($data, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR) .
            "\n";
        if (fwrite($f, $s) !== strlen($s)) {
            throw new RuntimeException("Yedek tamamlanamadı.");
        }
    };
    try {
        $db->beginTransaction();
        $write(["format" => "finans-backup-1", "date" => date(DATE_ATOM)]);
        foreach (
            $db->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN)
            as $table
        ) {
            $safe = str_replace("`", "``", $table);
            $ddl = $db
                ->query("SHOW CREATE TABLE `$safe`")
                ->fetch(PDO::FETCH_NUM);
            $write(["table" => $table, "ddl" => $ddl[1]]);
            $q = $db->query("SELECT * FROM `$safe`");
            while ($r = $q->fetch()) {
                $write(["table" => $table, "row" => $r]);
            }
        }
        $write(["complete" => true]);
        fflush($f);
        fclose($f);
        $db->commit();
        return $name;
    } catch (Throwable $e) {
        if ($db->inTransaction()) {
            $db->rollBack();
        }
        fclose($f);
        throw $e;
    }
}
function upgradeLegacy(PDO $db): array
{
    permit("admin");
    $v = (int) $db
        ->query("SELECT schema_version FROM app_meta WHERE id=1")
        ->fetchColumn();
    if ($v >= 3) {
        return ["ok" => true, "message" => "Güncel sürüm zaten uygulanmış."];
    }
    if (
        !(int) $db->query("SELECT GET_LOCK('finans_update',0)")->fetchColumn()
    ) {
        throw new DomainException("Başka bir güncelleme devam ediyor.");
    }
    try {
        $backup = backupDatabase($db);
        $_SESSION["backup_path"] = $backup;
        $_SESSION["backup_created"] = time();
        // Version 1 to 2 is bundled; users never import SQL manually.
        if ($v < 2) {
            $sql = require __DIR__ . "/legacy-cari.php";
            $db->exec($sql);
        }
        foreach (
            [
                "role" => "VARCHAR(20) NOT NULL DEFAULT 'viewer'",
                "short_name" => "VARCHAR(80) NOT NULL DEFAULT ''",
                "active" => "TINYINT NOT NULL DEFAULT 1",
                "version" => "INT NOT NULL DEFAULT 1",
            ]
            as $n => $d
        ) {
            addColumn($db, "users", $n, $d);
        }
        foreach (
            [
                "bank" => "VARCHAR(160) NOT NULL DEFAULT ''",
                "iban" => "VARCHAR(40) NOT NULL DEFAULT ''",
                "holder" => "VARCHAR(160) NOT NULL DEFAULT ''",
                "active" => "TINYINT NOT NULL DEFAULT 1",
                "version" => "INT NOT NULL DEFAULT 1",
            ]
            as $n => $d
        ) {
            addColumn($db, "accounts", $n, $d);
        }
        foreach (
            [
                "opening_debt_cents" => "BIGINT NOT NULL DEFAULT 0",
                "opening_unbilled_cents" => "BIGINT NOT NULL DEFAULT 0",
                "statement_date" => "DATE NULL",
                "opening_statement_date" => "DATE NULL",
                "statement_needs_review" => "TINYINT NOT NULL DEFAULT 0",
                "cut_day" => "INT NOT NULL DEFAULT 1",
                "last_four" => "VARCHAR(4) NOT NULL DEFAULT ''",
                "active" => "TINYINT NOT NULL DEFAULT 1",
                "version" => "INT NOT NULL DEFAULT 1",
            ]
            as $n => $d
        ) {
            addColumn($db, "cards", $n, $d);
        }
        addColumn($db, "parties", "active", "TINYINT NOT NULL DEFAULT 1");
        $db->exec(
            "CREATE TABLE IF NOT EXISTS fin_events (id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,request_key VARCHAR(80) NOT NULL UNIQUE,version INT NOT NULL DEFAULT 1,kind VARCHAR(40) NOT NULL,amount_cents BIGINT NOT NULL,event_date DATE NOT NULL,event_time TIME NOT NULL,due_date DATE NULL,party_id INT UNSIGNED NULL,account_id VARCHAR(40) NULL,target_id VARCHAR(40) NULL,card_id INT UNSIGNED NULL,direction VARCHAR(10) NOT NULL DEFAULT 'Alacak',description VARCHAR(1000) NOT NULL,category VARCHAR(80) NOT NULL DEFAULT 'Diğer',document_no VARCHAR(160) NOT NULL DEFAULT '',created_by INT UNSIGNED NULL,cancelled TINYINT NOT NULL DEFAULT 0,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,FOREIGN KEY(party_id) REFERENCES parties(id),FOREIGN KEY(account_id) REFERENCES accounts(id),FOREIGN KEY(target_id) REFERENCES accounts(id),FOREIGN KEY(card_id) REFERENCES cards(id),FOREIGN KEY(created_by) REFERENCES users(id),INDEX events_date(event_date,id),INDEX events_party(party_id,event_date)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
        );
        $db->exec(
            "CREATE TABLE IF NOT EXISTS audit_log (id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,entity VARCHAR(40) NOT NULL,entity_id VARCHAR(80) NOT NULL,operation VARCHAR(30) NOT NULL,actor_id INT UNSIGNED NULL,actor_name VARCHAR(80) NOT NULL,before_json LONGTEXT NULL,after_json LONGTEXT NULL,reason VARCHAR(1000) NOT NULL DEFAULT '',created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,INDEX audit_entity(entity,entity_id,id)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
        );
        $db->exec(
            "CREATE TABLE IF NOT EXISTS write_requests (request_key CHAR(36) PRIMARY KEY,payload_hash CHAR(64) NOT NULL,result_json LONGTEXT NOT NULL,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
        );
        $db->beginTransaction();
        $db->query("SELECT id FROM app_meta WHERE id=1 FOR UPDATE")->fetch();
        $db->exec(
            "UPDATE users SET role=CASE WHEN id=(SELECT x.id FROM (SELECT MIN(id) id FROM users) x) THEN 'admin' ELSE 'viewer' END,short_name=SUBSTRING_INDEX(username,' ',1)",
        );
        $db->exec(
            "UPDATE cards c SET opening_debt_cents=debt_cents+COALESCE((SELECT SUM(-amount_cents) FROM movements m WHERE m.card_id=c.id),0),opening_unbilled_cents=debt_cents-statement_cents,statement_date=NULL,opening_statement_date=NULL,statement_needs_review=1,cut_day=1",
        );
        // Retired cached balances are no longer authoritative; clear them after capture so their legacy CHECK cannot block limit edits.
        $db->exec("UPDATE cards SET debt_cents=0,statement_cents=0");
        $insert = $db->prepare(
            "INSERT INTO fin_events(request_key,kind,amount_cents,event_date,event_time,due_date,party_id,account_id,target_id,card_id,direction,description,category,document_no,created_by) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        );
        $cash = [];
        foreach (
            $db
                ->query(
                    "SELECT m.*,j.created_by FROM movements m LEFT JOIN journal j ON j.id=m.journal_id ORDER BY m.id",
                )
                ->fetchAll()
            as $m
        ) {
            $cash[$m["journal_id"]][] = $m;
        }
        $claims = $db->query("SELECT * FROM claims ORDER BY id")->fetchAll();
        $used = [];
        $claimed = [];
        foreach (
            $db->query("SELECT * FROM party_entries ORDER BY id")->fetchAll()
            as $e
        ) {
            $j = $e["journal_id"];
            $m = $j ? $cash[$j][0] ?? null : null;
            $due = $e["entry_date"];
            foreach ($claims as $cl) {
                if (
                    !isset($used[$cl["id"]]) &&
                    (($e["migration_claim_id"] &&
                        $cl["id"] == $e["migration_claim_id"]) ||
                        (!$e["migration_claim_id"] &&
                            $cl["party_id"] == $e["party_id"] &&
                            $cl["description"] === $e["description"]))
                ) {
                    $due = $cl["due"];
                    $used[$cl["id"]] = true;
                    break;
                }
            }
            $insert->execute([
                "legacy-party-" . $e["id"],
                $e["kind"],
                abs((int) $e["amount_cents"]),
                $e["entry_date"],
                $e["entry_time"],
                $due,
                $e["party_id"],
                $e["account_id"],
                null,
                null,
                (int) $e["amount_cents"] < 0 ? "Borç" : "Alacak",
                $e["description"],
                $m["category"] ?? "Cari işlem",
                $e["document_no"],
                $e["created_by"],
            ]);
            if ($j) {
                $claimed[$j] = true;
            }
        }
        foreach ($cash as $j => $rows) {
            if (isset($claimed[$j])) {
                continue;
            }
            $m = $rows[0];
            $target = null;
            $kind = $m["kind"];
            if ($kind === "Transfer") {
                $kind = "Virman";
                foreach ($rows as $r) {
                    if ($r["amount_cents"] < 0) {
                        $m = $r;
                    } else {
                        $target = $r["account_id"];
                    }
                }
                if (!$target) {
                    throw new RuntimeException(
                        "Eski virman kaydının karşı hesabı eksik.",
                    );
                }
            }
            $insert->execute([
                "legacy-cash-" . $j,
                $kind,
                abs((int) $m["amount_cents"]),
                $m["movement_date"],
                $m["movement_time"],
                null,
                null,
                $m["account_id"],
                $target,
                $m["card_id"],
                "Alacak",
                $m["description"] ?: $m["name"],
                $m["category"],
                $m["document_no"],
                $m["created_by"],
            ]);
        }
        audit(
            $db,
            "system",
            "3",
            "upgrade",
            ["version" => $v],
            ["version" => 3, "backup" => basename($backup)],
            "Finans 1.2 güncellemesi",
        );
        $db->exec("UPDATE app_meta SET schema_version=3 WHERE id=1");
        $db->commit();
        return [
            "ok" => true,
            "message" => "Finans 1.2 güncellemesi tamamlandı.",
            "backupReady" => true,
        ];
    } catch (Throwable $e) {
        if ($db->inTransaction()) {
            $db->rollBack();
        }
        error_log("Finans upgrade: " . $e->getMessage());
        throw new DomainException(
            "Güncelleme durduruldu. Yedek korundu; sunucu günlüğünü kontrol edip tekrar deneyin.",
        );
    } finally {
        $db->query("SELECT RELEASE_LOCK('finans_update')");
    }
}
function upgradeV14(PDO $db): array
{
    permit("admin");
    $v = (int) $db
        ->query("SELECT schema_version FROM app_meta WHERE id=1")
        ->fetchColumn();
    if ($v >= 5) {
        return ["ok" => true, "message" => "Finans 1.4 güncel."];
    }
    if ($v < 3) {
        upgradeLegacy($db);
    }
    if (
        !(int) $db->query("SELECT GET_LOCK('finans_update',0)")->fetchColumn()
    ) {
        throw new DomainException("Başka bir güncelleme devam ediyor.");
    }
    try {
        // Keep the earliest backup when a legacy upgrade and this step run together.
        if ($v >= 3) {
            $_SESSION["backup_path"] = backupDatabase($db);
            $_SESSION["backup_created"] = time();
        }
        addColumn($db, "accounts", "maturity_date", "DATE NULL");
        addColumn(
            $db,
            "accounts",
            "bank_code",
            "VARCHAR(40) NOT NULL DEFAULT ''",
        );
        foreach (["bank_code", "program_code", "network_code"] as $name) {
            addColumn($db, "cards", $name, "VARCHAR(40) NOT NULL DEFAULT ''");
        }
        $db->beginTransaction();
        $db->query("SELECT id FROM app_meta WHERE id=1 FOR UPDATE")->fetch();
        audit(
            $db,
            "system",
            "5",
            "upgrade",
            ["version" => $v],
            ["version" => 5],
            "Finans 1.4: Sade Netlik, ortak takvim ve banka / kart programı",
        );
        $db->exec("UPDATE app_meta SET schema_version=5 WHERE id=1");
        $db->commit();
        return [
            "ok" => true,
            "message" => "Finans 1.4 güncellemesi tamamlandı.",
            "backupReady" => true,
        ];
    } catch (Throwable $e) {
        if ($db->inTransaction()) {
            $db->rollBack();
        }
        error_log("Finans 1.3 upgrade: " . $e->getMessage());
        throw new DomainException(
            "Güncelleme durduruldu. Yedek korundu; tekrar deneyin.",
        );
    } finally {
        $db->query("SELECT RELEASE_LOCK('finans_update')");
    }
}
function upgradeV15(PDO $db): array
{
    permit("admin");
    $v = (int) $db
        ->query("SELECT schema_version FROM app_meta WHERE id=1")
        ->fetchColumn();
    if ($v >= 6) {
        addColumn(
            $db,
            "fin_events",
            "return_mode",
            "VARCHAR(20) NOT NULL DEFAULT 'offset'",
        );
        return ["ok" => true, "message" => "Finans 1.5 güncel."];
    }
    if ($v < 5) {
        upgradeV14($db);
    }
    if (
        !(int) $db->query("SELECT GET_LOCK('finans_update',0)")->fetchColumn()
    ) {
        throw new DomainException("Başka bir güncelleme devam ediyor.");
    }
    try {
        if ($v >= 5) {
            $_SESSION["backup_path"] = backupDatabase($db);
            $_SESSION["backup_created"] = time();
        }
        foreach (
            [
                "return_mode" => "VARCHAR(20) NOT NULL DEFAULT 'offset'",
                "operation" => "VARCHAR(40) NOT NULL DEFAULT ''",
                "tag" => "VARCHAR(80) NOT NULL DEFAULT 'Genel'",
                "settled_cents" => "BIGINT NOT NULL DEFAULT 0",
                "scheduled" => "TINYINT NOT NULL DEFAULT 0",
                "period_date" => "DATE NULL",
                "linked_id" => "BIGINT UNSIGNED NULL",
                "target_card_id" => "INT UNSIGNED NULL",
                "installment_group" => "VARCHAR(80) NOT NULL DEFAULT ''",
                "payment_purpose" => "VARCHAR(40) NOT NULL DEFAULT ''",
            ]
            as $name => $definition
        ) {
            addColumn($db, "fin_events", $name, $definition);
        }
        addColumn($db, "cards", "holder", "VARCHAR(160) NOT NULL DEFAULT ''");
        $db->exec(
            "CREATE TABLE IF NOT EXISTS card_statements(id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,card_id INT UNSIGNED NOT NULL,cut_date DATE NOT NULL,due_date DATE NOT NULL,total_cents BIGINT NOT NULL,version INT NOT NULL DEFAULT 1,created_by INT UNSIGNED NULL,UNIQUE KEY card_cut(card_id,cut_date),FOREIGN KEY(card_id) REFERENCES cards(id)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
        );
        $db->beginTransaction();
        $db->query("SELECT id FROM app_meta WHERE id=1 FOR UPDATE")->fetch();
        $db->exec(
            "UPDATE fin_events SET period_date=event_date WHERE period_date IS NULL",
        );
        audit(
            $db,
            "system",
            "6",
            "upgrade",
            ["version" => $v],
            ["version" => 6],
            "Finans 1.5: cari türleri, carousel, ekstre uzlaştırması ve etiketler",
        );
        $db->exec("UPDATE app_meta SET schema_version=6 WHERE id=1");
        $db->commit();
        return [
            "ok" => true,
            "message" => "Finans 1.5 güncellemesi tamamlandı.",
            "backupReady" => true,
        ];
    } finally {
        if ($db->inTransaction()) {
            $db->rollBack();
        }
        $db->query("SELECT RELEASE_LOCK('finans_update')");
    }
}
function upgradeV16(PDO $db): array
{
    permit("admin");
    $v = (int) $db
        ->query("SELECT schema_version FROM app_meta WHERE id=1")
        ->fetchColumn();
    if ($v >= 7) {
        return ["ok" => true, "message" => "Finans 1.6 güncel."];
    }
    if ($v < 6) {
        upgradeV15($db);
    }
    if (
        !(int) $db->query("SELECT GET_LOCK('finans_update',0)")->fetchColumn()
    ) {
        throw new DomainException("Başka bir güncelleme devam ediyor.");
    }
    try {
        if ($v >= 6) {
            $_SESSION["backup_path"] = backupDatabase($db);
            $_SESSION["backup_created"] = time();
        }
        addColumn(
            $db,
            "accounts",
            "credit_limit_cents",
            "BIGINT NOT NULL DEFAULT 0",
        );
        addColumn($db, "accounts", "daily_interest_rate", "DECIMAL(9,6) NULL");
        $db->beginTransaction();
        $db->query("SELECT id FROM app_meta WHERE id=1 FOR UPDATE")->fetch();
        audit(
            $db,
            "system",
            "7",
            "upgrade",
            ["version" => $v],
            ["version" => 7],
            "Finans 1.6: cari yön/tutar uyumu, mobil düzen ve KMH",
        );
        $db->exec("UPDATE app_meta SET schema_version=7 WHERE id=1");
        $db->commit();
        return [
            "ok" => true,
            "message" => "Finans 1.6 güncellemesi tamamlandı.",
            "backupReady" => true,
        ];
    } finally {
        if ($db->inTransaction()) {
            $db->rollBack();
        }
        $db->query("SELECT RELEASE_LOCK('finans_update')");
    }
}
function upgradePos(PDO $db): array
{
    permit("admin");
    $v = (int) $db
        ->query("SELECT schema_version FROM app_meta WHERE id=1")
        ->fetchColumn();
    if ($v >= 8) {
        return ["ok" => true, "message" => "Veritabanı güncel."];
    }
    if ($v < 7) {
        upgradeV16($db);
    }
    if (
        !(int) $db->query("SELECT GET_LOCK('finans_update',0)")->fetchColumn()
    ) {
        throw new DomainException("Başka bir güncelleme devam ediyor.");
    }
    try {
        if ($v >= 7) {
            $_SESSION["backup_path"] = backupDatabase($db);
            $_SESSION["backup_created"] = time();
        }
        addColumn($db, "parties", "pos_programs", "TEXT NULL");
        $db->beginTransaction();
        $db->query("SELECT id FROM app_meta WHERE id=1 FOR UPDATE")->fetch();
        audit(
            $db,
            "system",
            "8",
            "upgrade",
            ["version" => $v],
            ["version" => 8],
            "Tedarikçi cari kartları için isteğe bağlı POS programları",
        );
        $db->exec("UPDATE app_meta SET schema_version=8 WHERE id=1");
        $db->commit();
        return [
            "ok" => true,
            "message" => "Tedarikçi POS bilgileri güncellemesi tamamlandı.",
            "backupReady" => true,
        ];
    } finally {
        if ($db->inTransaction()) {
            $db->rollBack();
        }
        $db->query("SELECT RELEASE_LOCK('finans_update')");
    }
}
function upgradeTracking(PDO $db): array
{
    permit("admin");
    $v = (int) $db
        ->query("SELECT schema_version FROM app_meta WHERE id=1")
        ->fetchColumn();
    if ($v >= 9) {
        return ["ok" => true, "message" => "Veritabanı güncel."];
    }
    if ($v < 8) {
        upgradePos($db);
    }
    if (
        !(int) $db->query("SELECT GET_LOCK('finans_update',0)")->fetchColumn()
    ) {
        throw new DomainException("Başka bir güncelleme devam ediyor.");
    }
    try {
        if ($v >= 8) {
            $_SESSION["backup_path"] = backupDatabase($db);
            $_SESSION["backup_created"] = time();
        }
        trackingSchema($db);
        $db->beginTransaction();
        $db->query("SELECT id FROM app_meta WHERE id=1 FOR UPDATE")->fetch();
        audit(
            $db,
            "system",
            "9",
            "upgrade",
            ["version" => $v],
            ["version" => 9],
            "Kampanyalar ve Araçlarım; finansal kayıtlar korunur",
        );
        $db->exec("UPDATE app_meta SET schema_version=9 WHERE id=1");
        $db->commit();
        return [
            "ok" => true,
            "message" => "Kampanyalar ve Araçlarım güncellemesi tamamlandı.",
            "backupReady" => true,
        ];
    } finally {
        if ($db->inTransaction()) {
            $db->rollBack();
        }
        $db->query("SELECT RELEASE_LOCK('finans_update')");
    }
}
function upgradeCardLink(PDO $db): array
{
    permit("admin");
    $v = (int) $db
        ->query("SELECT schema_version FROM app_meta WHERE id=1")
        ->fetchColumn();
    if ($v >= 10) {
        return ["ok" => true, "message" => "Veritabanı güncel."];
    }
    if ($v < 9) {
        upgradeTracking($db);
    }
    if (
        !(int) $db->query("SELECT GET_LOCK('finans_update',0)")->fetchColumn()
    ) {
        throw new DomainException("Başka bir güncelleme devam ediyor.");
    }
    try {
        if ($v >= 9) {
            $_SESSION["backup_path"] = backupDatabase($db);
            $_SESSION["backup_created"] = time();
        }
        addColumn($db, "cards", "linked_account_id", "VARCHAR(40) NULL");
        $db->beginTransaction();
        $db->query("SELECT id FROM app_meta WHERE id=1 FOR UPDATE")->fetch();
        audit(
            $db,
            "system",
            "10",
            "upgrade",
            ["version" => $v],
            ["version" => 10],
            "İsteğe bağlı kredi kartı hesap bağlantısı; mevcut kayıtlar korunur",
        );
        $db->exec("UPDATE app_meta SET schema_version=10 WHERE id=1");
        $db->commit();
        return [
            "ok" => true,
            "message" => "Kart hesap bağlantısı güncellemesi tamamlandı.",
            "backupReady" => true,
        ];
    } finally {
        if ($db->inTransaction()) {
            $db->rollBack();
        }
        $db->query("SELECT RELEASE_LOCK('finans_update')");
    }
}
function upgradeProfiles(PDO $db): array
{
    permit("admin");
    $v = (int) $db
        ->query("SELECT schema_version FROM app_meta WHERE id=1")
        ->fetchColumn();
    if ($v >= 11) {
        return ["ok" => true, "message" => "Veritabanı güncel."];
    }
    if ($v < 10) {
        upgradeCardLink($db);
    }
    if (
        !(int) $db->query("SELECT GET_LOCK('finans_update',0)")->fetchColumn()
    ) {
        throw new DomainException("Başka bir güncelleme devam ediyor.");
    }
    try {
        if ($v >= 10) {
            $_SESSION["backup_path"] = backupDatabase($db);
            $_SESSION["backup_created"] = time();
        }
        addColumn($db, "parties", "profile_json", "LONGTEXT NULL");
        $db->beginTransaction();
        $db->query("SELECT id FROM app_meta WHERE id=1 FOR UPDATE")->fetch();
        audit(
            $db,
            "system",
            "11",
            "upgrade",
            ["version" => $v],
            ["version" => 11],
            "İsteğe bağlı cari bilgi alanları; finansal kayıtlar korunur",
        );
        $db->exec("UPDATE app_meta SET schema_version=11 WHERE id=1");
        $db->commit();
        return [
            "ok" => true,
            "message" => "Cari bilgi alanları güncellendi.",
            "backupReady" => true,
        ];
    } finally {
        if ($db->inTransaction()) {
            $db->rollBack();
        }
        $db->query("SELECT RELEASE_LOCK('finans_update')");
    }
}
function upgrade(PDO $db): array
{
    permit("admin");
    $v = (int) $db
        ->query("SELECT schema_version FROM app_meta WHERE id=1")
        ->fetchColumn();
    if ($v >= 12) {
        return ["ok" => true, "message" => "Veritabanı güncel."];
    }
    if ($v < 11) {
        upgradeProfiles($db);
    }
    if (
        !(int) $db->query("SELECT GET_LOCK('finans_update',0)")->fetchColumn()
    ) {
        throw new DomainException("Başka bir güncelleme devam ediyor.");
    }
    try {
        if ($v >= 11) {
            $_SESSION["backup_path"] = backupDatabase($db);
            $_SESSION["backup_created"] = time();
        }
        addColumn($db, "cards", "bank", "VARCHAR(160) NOT NULL DEFAULT ''");
        $db->beginTransaction();
        $db->query("SELECT id FROM app_meta WHERE id=1 FOR UPDATE")->fetch();
        audit(
            $db,
            "system",
            "12",
            "upgrade",
            ["version" => $v],
            ["version" => 12],
            "Ortak banka adları için kart metadata alanı; finansal kayıtlar korunur",
        );
        $db->exec("UPDATE app_meta SET schema_version=12 WHERE id=1");
        $db->commit();
        return [
            "ok" => true,
            "message" => "Banka bilgisi alanı güncellendi.",
            "backupReady" => true,
        ];
    } finally {
        if ($db->inTransaction()) {
            $db->rollBack();
        }
        $db->query("SELECT RELEASE_LOCK('finans_update')");
    }
}
if ($action === "update_status") {
    permit("admin");
    reply([
        "version" => (int) $db
            ->query("SELECT schema_version FROM app_meta WHERE id=1")
            ->fetchColumn(),
        "target" => 12,
        "backupReady" =>
            isset($_SESSION["backup_path"]) &&
            is_file($_SESSION["backup_path"]),
    ]);
}
if ($action === "update_backup") {
    permit("admin");
    $p = $_SESSION["backup_path"] ?? "";
    if (!$p || !is_file($p)) {
        fail("Bu oturumda yedek bulunamadı.", 404);
    }
    header("Content-Type: application/octet-stream");
    header(
        'Content-Disposition: attachment; filename="finans-yedek-' .
            date("Ymd") .
            '.jsonl"',
    );
    header("Cache-Control: no-store");
    readfile($p);
    exit();
}
if ($action === "update_apply" && $method === "POST") {
    permit("admin");
    reply(upgrade($db));
}
