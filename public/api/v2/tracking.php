<?php
if (!isset($action)) {
    http_response_code(404);
    exit();
}
function trackingSchema(PDO $db): void
{
    $db->exec(
        "CREATE TABLE IF NOT EXISTS vehicles(id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,plate VARCHAR(20) NOT NULL UNIQUE,data_json LONGTEXT NOT NULL,version INT NOT NULL DEFAULT 1,active TINYINT NOT NULL DEFAULT 1) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
    );
    $db->exec(
        "CREATE TABLE IF NOT EXISTS vehicle_records(id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,vehicle_id INT UNSIGNED NOT NULL,data_json LONGTEXT NOT NULL,version INT NOT NULL DEFAULT 1,active TINYINT NOT NULL DEFAULT 1,FOREIGN KEY(vehicle_id) REFERENCES vehicles(id)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
    );
    $db->exec(
        "CREATE TABLE IF NOT EXISTS vehicle_payments(record_id INT UNSIGNED NOT NULL,event_id BIGINT UNSIGNED NOT NULL,PRIMARY KEY(event_id),FOREIGN KEY(record_id) REFERENCES vehicle_records(id),FOREIGN KEY(event_id) REFERENCES fin_events(id)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
    );
    $db->exec(
        "CREATE TABLE IF NOT EXISTS campaigns(id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,data_json LONGTEXT NOT NULL,version INT NOT NULL DEFAULT 1,active TINYINT NOT NULL DEFAULT 1) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
    );
    $db->exec(
        "CREATE TABLE IF NOT EXISTS campaign_entries(id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,campaign_id INT UNSIGNED NOT NULL,event_id BIGINT UNSIGNED NOT NULL,received DECIMAL(12,2) NOT NULL DEFAULT 0,confirmed TINYINT NOT NULL DEFAULT 0,version INT NOT NULL DEFAULT 1,active TINYINT NOT NULL DEFAULT 1,UNIQUE KEY campaign_event(campaign_id,event_id),FOREIGN KEY(campaign_id) REFERENCES campaigns(id),FOREIGN KEY(event_id) REFERENCES fin_events(id)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
    );
}
function trackingRows(PDO $db, string $table): array
{
    $rows = $db->query("SELECT * FROM $table ORDER BY id")->fetchAll();
    foreach ($rows as &$r) {
        $json = isset($r["data_json"])
            ? json_decode($r["data_json"], true)
            : [];
        unset($r["data_json"]);
        $r = $r + ($json ?: []);
        foreach (
            ["id", "version", "vehicle_id", "campaign_id", "event_id"]
            as $key
        ) {
            if (isset($r[$key])) {
                $r[$key] = (int) $r[$key];
            }
        }
        $r["active"] = (bool) $r["active"];
        if (isset($r["confirmed"])) {
            $r["confirmed"] = (bool) $r["confirmed"];
        }
        if (isset($r["received"])) {
            $r["received"] = (float) $r["received"];
        }
    }
    return $rows;
}
function trackingState(PDO $db, array $state): array
{
    $state["vehicles"] = trackingRows($db, "vehicles");
    $state["vehicle_records"] = trackingRows($db, "vehicle_records");
    $state["campaigns"] = trackingRows($db, "campaigns");
    $state["campaign_entries"] = trackingRows($db, "campaign_entries");
    $links = $db->query("SELECT * FROM vehicle_payments")->fetchAll();
    foreach ($state["vehicle_records"] as &$record) {
        $record["payment_events"] = array_map(
            fn($link) => (int) $link["event_id"],
            array_values(
                array_filter(
                    $links,
                    fn($link) => (int) $link["record_id"] === $record["id"],
                ),
            ),
        );
    }
    return $state;
}
function trackingInteger(array $b, string $key, int $max = 10000000): int
{
    $v = $b[$key] ?? 0;
    if (
        filter_var($v, FILTER_VALIDATE_INT) === false ||
        (int) $v < 0 ||
        (int) $v > $max
    ) {
        throw new DomainException("Sayı alanını kontrol edin: " . $key);
    }
    return (int) $v;
}
function trackingDate(array $b, string $key, bool $required = false): string
{
    $v = field($b, $key, 10, $required);
    return $v === "" ? "" : validDate($v, true);
}
function trackingEnum(array $b, string $key, array $values): string
{
    $v = field($b, $key, 40, true);
    if (!in_array($v, $values, true)) {
        throw new DomainException("Seçimi kontrol edin: " . $key);
    }
    return $v;
}
function trackingIds(PDO $db, array $b, string $key, string $table): array
{
    $values = $b[$key] ?? [];
    if (!is_array($values) || !array_is_list($values) || count($values) > 100) {
        throw new DomainException("Listeyi kontrol edin: " . $key);
    }
    $result = [];
    foreach ($values as $v) {
        if (filter_var($v, FILTER_VALIDATE_INT) === false || (int) $v <= 0) {
            throw new DomainException("Geçersiz kayıt seçimi.");
        }
        $id = (int) $v;
        row($db, $table, $id);
        $result[] = $id;
    }
    return array_values(array_unique($result));
}
function vehiclePaymentAmount(array $e): int
{
    if (
        $e["cancelled"] ||
        $e["scheduled"] ||
        in_array(
            $e["operation"],
            [
                "transfer",
                "card_payment",
                "cash_advance",
                "card_transfer",
                "opening",
                "salary",
            ],
            true,
        )
    ) {
        return 0;
    }
    return max(0, -cashEffect($e)) +
        (!empty($e["card_id"]) ? max(0, cardEffect($e)) : 0);
}
function saveTracking(PDO $db, string $entity, array $b): array
{
    $table = [
        "vehicle" => "vehicles",
        "vehicle_record" => "vehicle_records",
        "campaign" => "campaigns",
        "campaign_entry" => "campaign_entries",
    ][$entity];
    $id = isset($b["id"]) ? (int) $b["id"] : null;
    $old = $id ? row($db, $table, $id) : null;
    if ($old) {
        versionCheck($old, $b);
    }
    $v = [];
    $data = [];
    $active = array_key_exists("active", $b) ? (int) (bool) $b["active"] : 1;
    if ($old && (int) $old["active"] !== $active) {
        permit("admin");
    }
    if ($entity === "vehicle") {
        $plate = strtoupper(str_replace(" ", "", field($b, "plate", 20, true)));
        if (!preg_match('/^[A-Z0-9-]{3,20}$/D', $plate)) {
            throw new DomainException("Plakayı kontrol edin.");
        }
        $v["plate"] = $plate;
        $q = $db->prepare("SELECT id FROM vehicles WHERE plate=? AND id<>?");
        $q->execute([$plate, $id ?? 0]);
        if ($q->fetchColumn()) {
            throw new DomainException("Bu plaka zaten kayıtlı.");
        }
        foreach (
            ["name" => 160, "owner" => 160, "vin" => 40, "notes" => 2000]
            as $key => $len
        ) {
            $data[$key] = field($b, $key, $len, $key === "name");
        }
        $data["vehicle_kind"] = trackingEnum(
            ["vehicle_kind" => $b["vehicle_kind"] ?? "car"],
            "vehicle_kind",
            ["car", "motorcycle", "van"],
        );
        $data["body_style"] = trackingEnum(
            ["body_style" => $b["body_style"] ?? "other"],
            "body_style",
            ["other", "sedan", "suv", "hatchback", "wagon"],
        );
        $data["year"] = trackingInteger($b, "year", 2200);
        if ($data["year"] && $data["year"] < 1900) {
            throw new DomainException("Model yılını kontrol edin.");
        }
        $data["km"] = trackingInteger($b, "km");
        $previous = $old ? json_decode($old["data_json"], true) : [];
        $data["km_updated"] =
            !$old || $data["km"] !== ($previous["km"] ?? null)
                ? today($db)
                : $previous["km_updated"] ?? today($db);
    } elseif ($entity === "vehicle_record") {
        $vehicle = row($db, "vehicles", trackingInteger($b, "vehicle_id"));
        if (!$vehicle["active"]) {
            throw new DomainException("Arşivlenmiş araca kayıt eklenemez.");
        }
        $v["vehicle_id"] = $vehicle["id"];
        $data["maintenance_kind"] = trackingEnum(
            ["maintenance_kind" => $b["maintenance_kind"] ?? "periodic"],
            "maintenance_kind",
            [
                "periodic",
                "oil",
                "oil_filter",
                "air_filter",
                "summer_tyre",
                "winter_tyre",
                "other",
            ],
        );
        $data["type"] = trackingEnum($b, "type", [
            "insurance",
            "casco",
            "tax",
            "maintenance",
            "inspection",
        ]);
        foreach (
            [
                "title" => 160,
                "company" => 160,
                "policy_no" => 160,
                "notes" => 2000,
            ]
            as $key => $len
        ) {
            $data[$key] = field($b, $key, $len, $key === "title");
        }
        foreach (["date", "end_date", "due_date", "next_date"] as $key) {
            $data[$key] = trackingDate($b, $key, $key === "date");
        }
        if ($data["end_date"] && $data["end_date"] < $data["date"]) {
            throw new DomainException("Bitiş tarihi başlangıçtan önce olamaz.");
        }
        if ($data["next_date"] && $data["next_date"] < $data["date"]) {
            throw new DomainException(
                "Sonraki bakım tarihi işlemden önce olamaz.",
            );
        }
        $data["km"] = trackingInteger($b, "km");
        $data["next_km"] = trackingInteger($b, "next_km");
        if ($data["next_km"] && $data["next_km"] < $data["km"]) {
            throw new DomainException(
                "Sonraki bakım kilometresi işlem kilometresinden küçük olamaz.",
            );
        }
        $data["amount_cents"] = cents($b);
        if ($data["amount_cents"] < 0) {
            throw new DomainException("Tutar negatif olamaz.");
        }
        $data["estimated"] = !empty($b["estimated"]);
        $data["reminder_days"] = trackingInteger($b, "reminder_days", 365);
        $data["installments"] = [];
        $schedule = $b["installments"] ?? [];
        if (
            !is_array($schedule) ||
            !array_is_list($schedule) ||
            count($schedule) > 36
        ) {
            throw new DomainException("Ödeme planını kontrol edin.");
        }
        $scheduled = 0;
        foreach ($schedule as $item) {
            if (!is_array($item)) {
                throw new DomainException("Ödeme satırını kontrol edin.");
            }
            $amount = cents($item);
            if ($amount <= 0) {
                throw new DomainException("Taksit tutarı pozitif olmalı.");
            }
            $data["installments"][] = [
                "date" => trackingDate($item, "date", true),
                "amount_cents" => $amount,
            ];
            $scheduled += $amount;
        }
        if ($schedule && $scheduled !== $data["amount_cents"]) {
            throw new DomainException(
                "Taksitlerin toplamı kayıt tutarına eşit olmalı.",
            );
        }
        usort(
            $data["installments"],
            fn($a, $b) => strcmp($a["date"], $b["date"]),
        );
        $links = trackingIds($db, $b, "payment_events", "fin_events");
        $paid = 0;
        foreach ($links as $event) {
            $e = row($db, "fin_events", $event);
            $amount = vehiclePaymentAmount($e);
            $q = $db->prepare(
                "SELECT record_id FROM vehicle_payments WHERE event_id=?",
            );
            $q->execute([$event]);
            $owner = $q->fetchColumn();
            if ($owner && (!$id || (int) $owner !== $id)) {
                throw new DomainException("Bu ödeme başka araç kaydına bağlı.");
            }
            if (!$amount && !$owner) {
                throw new DomainException(
                    "Yalnız gerçekleşmiş gider veya kart harcaması bağlanabilir.",
                );
            }
            $paid += $amount;
        }
        if ($paid > $data["amount_cents"]) {
            throw new DomainException(
                "Bağlanan ödemeler kayıt tutarını aşamaz.",
            );
        }
    } elseif ($entity === "campaign") {
        foreach (
            ["name" => 160, "notes" => 2000, "source_url" => 1000]
            as $key => $len
        ) {
            $data[$key] = field($b, $key, $len, $key === "name");
        }
        if (
            $data["source_url"] &&
            (!filter_var($data["source_url"], FILTER_VALIDATE_URL) ||
                !in_array(
                    strtolower(
                        parse_url($data["source_url"], PHP_URL_SCHEME) ?? "",
                    ),
                    ["https", "http"],
                    true,
                ))
        ) {
            throw new DomainException(
                "Kampanya kaynağı geçerli bir http/https adresi olmalı.",
            );
        }
        $data["start_date"] = trackingDate($b, "start_date", true);
        $data["end_date"] = trackingDate($b, "end_date", true);
        $data["join_by"] = trackingDate($b, "join_by");
        if (
            $data["end_date"] < $data["start_date"] ||
            ($data["join_by"] && $data["join_by"] > $data["end_date"])
        ) {
            throw new DomainException("Kampanya tarihlerini kontrol edin.");
        }
        $data["participation"] = trackingEnum($b, "participation", [
            "not_required",
            "required",
            "joined",
        ]);
        $data["reward_type"] = trackingEnum($b, "reward_type", [
            "points",
            "cashback",
            "installments",
            "deferment",
        ]);
        $data["reward_mode"] = trackingEnum($b, "reward_mode", [
            "fixed",
            "percent",
        ]);
        foreach (["reward_value", "per_tx_cap", "total_cap"] as $key) {
            $data[$key] = cents($b, $key) / 100;
        }
        if ($data["reward_mode"] === "percent" && $data["reward_value"] > 100) {
            throw new DomainException("Kazanç oranı yüzde 100’ü aşamaz.");
        }
        $data["min_spend_cents"] = cents($b, "min_spend");
        $data["required_count"] = max(
            1,
            trackingInteger($b, "required_count", 1000),
        );
        $data["extra_installments"] = trackingInteger(
            $b,
            "extra_installments",
            36,
        );
        $data["defer_days"] = trackingInteger($b, "defer_days", 365);
        $data["card_ids"] = trackingIds($db, $b, "card_ids", "cards");
        if (!$data["card_ids"]) {
            throw new DomainException("En az bir kart seçin.");
        }
        $data["party_ids"] = trackingIds($db, $b, "party_ids", "parties");
        $data["pos_programs"] = $b["pos_programs"] ?? [];
        if (
            !is_array($data["pos_programs"]) ||
            !array_is_list($data["pos_programs"]) ||
            count($data["pos_programs"]) > 3
        ) {
            throw new DomainException("POS seçeneklerini kontrol edin.");
        }
        foreach ($data["pos_programs"] as $pos) {
            if (
                !in_array(
                    $pos,
                    ["garanti:bonus", "akbank:axess", "yapikredi:world"],
                    true,
                )
            ) {
                throw new DomainException("POS programını kontrol edin.");
            }
        }
        $data["tags"] = $b["tags"] ?? [];
        if (
            !is_array($data["tags"]) ||
            !array_is_list($data["tags"]) ||
            count($data["tags"]) > 30
        ) {
            throw new DomainException("Etiketleri kontrol edin.");
        }
        foreach ($data["tags"] as $tag) {
            if (!is_string($tag) || preg_match_all("/./us", $tag) > 80) {
                throw new DomainException("Etiketi kontrol edin.");
            }
        }
    } else {
        $campaign = row($db, "campaigns", trackingInteger($b, "campaign_id"));
        $definition = json_decode($campaign["data_json"], true);
        $event = row($db, "fin_events", trackingInteger($b, "event_id"));
        if (
            $event["cancelled"] ||
            $event["scheduled"] ||
            !in_array((int) $event["card_id"], $definition["card_ids"], true) ||
            cardEffect($event) <= 0 ||
            in_array(
                $event["operation"],
                ["cash_advance", "card_transfer"],
                true,
            )
        ) {
            throw new DomainException(
                "Kampanyaya bağlanacak kart harcamasını kontrol edin.",
            );
        }
        if (
            $event["event_date"] < $definition["start_date"] ||
            $event["event_date"] > $definition["end_date"]
        ) {
            throw new DomainException("İşlem kampanya tarihleri dışında.");
        }
        if (!$campaign["active"] && !$old) {
            throw new DomainException(
                "Arşivlenmiş kampanyaya işlem bağlanamaz.",
            );
        }
        $spend = (int) ($event["settled_cents"] ?: $event["amount_cents"]);
        if ($event["installment_group"]) {
            $q = $db->prepare(
                "SELECT SUM(IF(settled_cents>0,settled_cents,amount_cents)) FROM fin_events WHERE installment_group=? AND cancelled=0 AND scheduled=0",
            );
            $q->execute([$event["installment_group"]]);
            $spend = (int) $q->fetchColumn();
        }
        if (
            $spend < $definition["min_spend_cents"] ||
            ($definition["party_ids"] &&
                !in_array(
                    (int) $event["party_id"],
                    $definition["party_ids"],
                    true,
                )) ||
            ($definition["tags"] &&
                !in_array($event["tag"] ?: "Genel", $definition["tags"], true))
        ) {
            throw new DomainException(
                "Harcama kampanyanın tutar, cari veya etiket koşullarına uymuyor.",
            );
        }
        if ($definition["pos_programs"]) {
            $party = $event["party_id"]
                ? row($db, "parties", $event["party_id"])
                : null;
            $programs = $party
                ? json_decode($party["pos_programs"] ?? "[]", true)
                : [];
            if (
                !array_intersect($definition["pos_programs"], $programs ?: [])
            ) {
                throw new DomainException(
                    "Tedarikçinin POS programı kampanyayla eşleşmiyor.",
                );
            }
        }
        $q = $db->prepare(
            "SELECT ce.id FROM campaign_entries ce JOIN fin_events e ON e.id=ce.event_id WHERE ce.campaign_id=? AND ce.id<>? AND (ce.event_id=? OR (?<>'' AND e.installment_group=?))",
        );
        $q->execute([
            $campaign["id"],
            $id ?? 0,
            $event["id"],
            $event["installment_group"],
            $event["installment_group"],
        ]);
        if ($q->fetchColumn()) {
            throw new DomainException("Bu alışveriş kampanyaya zaten bağlı.");
        }
        $v = [
            "campaign_id" => $campaign["id"],
            "event_id" => $event["id"],
            "received" => cents($b, "received") / 100,
            "confirmed" => (int) !empty($b["confirmed"]),
        ];
    }
    if ($entity !== "campaign_entry") {
        $v["data_json"] = json_encode(
            $data,
            JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR,
        );
    }
    $v["active"] = $active;
    if ($old) {
        $db->prepare(
            "UPDATE $table SET " .
                implode(",", array_map(fn($k) => "$k=?", array_keys($v))) .
                ",version=version+1 WHERE id=?",
        )->execute([...array_values($v), $id]);
    } else {
        $db->prepare(
            "INSERT INTO $table (" .
                implode(",", array_keys($v)) .
                ") VALUES(" .
                implode(",", array_fill(0, count($v), "?")) .
                ")",
        )->execute(array_values($v));
        $id = (int) $db->lastInsertId();
    }
    if ($entity === "vehicle_record") {
        if ($old) {
            $q = $db->prepare(
                "SELECT event_id FROM vehicle_payments WHERE record_id=? ORDER BY event_id",
            );
            $q->execute([$id]);
            $old["payment_events"] = array_map(
                "intval",
                $q->fetchAll(PDO::FETCH_COLUMN),
            );
        }
        $db->prepare("DELETE FROM vehicle_payments WHERE record_id=?")->execute(
            [$id],
        );
        $q = $db->prepare(
            "INSERT INTO vehicle_payments(record_id,event_id) VALUES(?,?)",
        );
        foreach ($links as $event) {
            $q->execute([$id, $event]);
        }
    }
    $after = row($db, $table, $id);
    if ($entity === "vehicle_record") {
        $after["payment_events"] = $links;
    }
    audit(
        $db,
        $entity,
        (string) $id,
        $old ? "edit" : "create",
        $old,
        $after,
        field($b, "reason", 1000),
    );
    return ["id" => $id];
}
function seedTrackingDemo(PDO $db, array $cards, array $parties): void
{
    $first = saveTracking($db, "vehicle", [
        "plate" => "34 DEMO 180",
        "name" => "Örnek şirket aracı",
        "vehicle_kind" => "car",
        "body_style" => "sedan",
        "year" => 2023,
        "km" => 60500,
        "owner" => "Örnek Kullanıcı",
    ])["id"];
    $second = saveTracking($db, "vehicle", [
        "plate" => "06 DEMO 180",
        "name" => "Örnek servis aracı",
        "vehicle_kind" => "van",
        "year" => 2021,
        "km" => 128000,
        "owner" => "Örnek Kullanıcı",
    ])["id"];
    foreach (
        [
            [
                "vehicle_id" => $first,
                "type" => "insurance",
                "title" => "Önceki trafik poliçesi",
                "date" => "2025-10-20",
                "end_date" => "2026-10-20",
                "amount" => "9000",
                "estimated" => true,
            ],
            [
                "vehicle_id" => $first,
                "type" => "insurance",
                "title" => "Yenilenen trafik poliçesi",
                "date" => "2026-10-20",
                "end_date" => "2027-10-20",
                "amount" => "12000",
                "installments" => [
                    ["date" => "2026-10-20", "amount" => "6000"],
                    ["date" => "2026-11-20", "amount" => "6000"],
                ],
            ],
            [
                "vehicle_id" => $first,
                "type" => "casco",
                "title" => "Kasko yenilemesi",
                "date" => "2025-10-27",
                "end_date" => "2026-10-27",
                "amount" => "18500",
                "estimated" => true,
            ],
            [
                "vehicle_id" => $first,
                "type" => "maintenance",
                "title" => "60.000 km periyodik bakım",
                "date" => "2026-10-08",
                "km" => 60000,
                "next_km" => 75000,
                "next_date" => "2027-04-08",
                "amount" => "3000",
            ],
            [
                "vehicle_id" => $second,
                "type" => "maintenance",
                "title" => "Yağ ve filtre bakımı",
                "date" => "2026-04-01",
                "km" => 113000,
                "next_km" => 125000,
                "next_date" => "2026-10-15",
                "amount" => "6000",
                "estimated" => true,
            ],
            [
                "vehicle_id" => $second,
                "type" => "tax",
                "title" => "2026 MTV ikinci taksit",
                "date" => "2026-07-01",
                "due_date" => "2026-10-16",
                "amount" => "3500",
            ],
            [
                "vehicle_id" => $second,
                "type" => "inspection",
                "title" => "Periyodik muayene",
                "date" => "2025-11-01",
                "end_date" => "2026-11-01",
                "amount" => "2000",
                "estimated" => true,
            ],
        ]
        as $record
    ) {
        saveTracking($db, "vehicle_record", [
            "reminder_days" => 30,
            "company" => "Örnek kurum",
            ...$record,
        ]);
    }
    foreach (
        [
            [
                "maintenance_kind" => "oil_filter",
                "title" => "Yağ filtresi değişimi",
                "date" => "2026-04-13",
                "km" => 52000,
                "next_km" => 62000,
                "next_date" => "2027-04-13",
            ],
            [
                "maintenance_kind" => "air_filter",
                "title" => "Hava filtresi değişimi",
                "date" => "2026-04-13",
                "km" => 52000,
                "next_km" => 67000,
                "next_date" => "2027-04-13",
            ],
            [
                "maintenance_kind" => "summer_tyre",
                "title" => "Yazlık lastik takımı",
                "date" => "2026-04-01",
                "km" => 50000,
                "next_date" => "2026-11-01",
            ],
            [
                "maintenance_kind" => "winter_tyre",
                "title" => "Kışlık lastik takımı",
                "date" => "2025-11-01",
                "km" => 42000,
                "next_date" => "2026-11-01",
            ],
        ]
        as $record
    ) {
        saveTracking($db, "vehicle_record", [
            "vehicle_id" => $first,
            "type" => "maintenance",
            "amount" => "0",
            "estimated" => true,
            "reminder_days" => 30,
            ...$record,
        ]);
    }
    // Comprehensive synthetic vehicle history. Actual payments are created once, then linked.
    $third = saveTracking($db, "vehicle", [
        "plate" => "35 DEMO 110",
        "name" => "Örnek aile aracı",
        "vehicle_kind" => "car",
        "body_style" => "suv",
        "year" => 2024,
        "km" => 45200,
        "owner" => "Örnek Kullanıcı",
    ])["id"];
    $fourth = saveTracking($db, "vehicle", [
        "plate" => "16 DEMO 110",
        "name" => "Örnek saha aracı",
        "vehicle_kind" => "motorcycle",
        "year" => 2020,
        "km" => 186500,
        "owner" => "Örnek Kullanıcı",
    ])["id"];
    $demoRecord = function (
        array $record,
        ?string $payment = null,
        ?int $cardId = null,
    ) use ($db) {
        $links = [];
        if ($payment !== null) {
            $request = sprintf(
                "%08x-%04x-%04x-%04x-%012x",
                random_int(1, 0xfffffff),
                random_int(0, 65535),
                random_int(0, 65535),
                random_int(0, 65535),
                random_int(0, 0xffffffffff),
            );
            $event = saveOperation($db, [
                "requestId" => $request,
                "operation" => "expense",
                "account" => $cardId ? "" : "bank",
                "cardId" => $cardId ?: "",
                "amount" => $payment,
                "settled" => "0",
                "date" => $record["date"],
                "periodDate" => $record["date"],
                "time" => "09:30",
                "description" => "Demo araç · " . $record["title"],
                "tag" => "Araç",
            ]);
            $links[] = $event["id"];
        }
        saveTracking($db, "vehicle_record", [
            "reminder_days" => 30,
            "company" => "Örnek servis / sigorta",
            "payment_events" => $links,
            ...$record,
        ]);
    };
    foreach ([$first, $second, $third, $fourth] as $index => $vehicleId) {
        foreach (range(4, 9) as $month) {
            $amount = (string) (1200 + $index * 250 + $month * 100);
            $km = (int) (20000 + $index * 35000 + $month * 2500);
            $demoRecord(
                [
                    "vehicle_id" => $vehicleId,
                    "type" => "maintenance",
                    "title" => "Demo " . $month . ". ay servis kaydı",
                    "date" => sprintf("2026-%02d-08", $month),
                    "km" => $km,
                    "next_km" => $km + 10000,
                    "amount" => $amount,
                    "active" => false,
                    "notes" =>
                        "Tamamlanan geçmiş bakım; güncel hatırlatmanın yerine geçmez.",
                ],
                $amount,
                $month % 2 ? $cards[$index % count($cards)] : null,
            );
        }
        $demoRecord(
            [
                "vehicle_id" => $vehicleId,
                "type" => "tax",
                "title" => "2026 MTV birinci taksit",
                "date" => "2026-04-12",
                "due_date" => "2026-04-12",
                "amount" => (string) (2800 + $index * 400),
                "active" => false,
            ],
            (string) (2800 + $index * 400),
        );
    }
    $demoRecord(
        [
            "vehicle_id" => $third,
            "type" => "insurance",
            "title" => "Aile aracı trafik poliçesi",
            "policy_no" => "DEMO-TR-110-001",
            "date" => "2026-09-19",
            "end_date" => "2026-10-19",
            "amount" => "8400",
            "notes" => "Kısa dönem sentetik poliçe; yenileme uyarısı örneği.",
        ],
        "8400",
    );
    $demoRecord(
        [
            "vehicle_id" => $third,
            "type" => "casco",
            "title" => "Aile aracı kasko poliçesi",
            "policy_no" => "DEMO-KS-110-001",
            "date" => "2026-09-25",
            "end_date" => "2026-10-25",
            "amount" => "18000",
            "installments" => [
                ["date" => "2026-09-25", "amount" => "9000"],
                ["date" => "2026-10-25", "amount" => "9000"],
            ],
        ],
        "9000",
        $cards[0],
    );
    $demoRecord([
        "vehicle_id" => $third,
        "type" => "tax",
        "title" => "Aile aracı MTV ikinci taksit",
        "date" => "2026-07-31",
        "due_date" => "2026-07-31",
        "amount" => "3500",
    ]);
    $demoRecord(
        [
            "vehicle_id" => $third,
            "type" => "maintenance",
            "title" => "45.000 km yağ ve filtre bakımı",
            "date" => "2026-10-10",
            "km" => 45000,
            "next_km" => 55000,
            "next_date" => "2027-04-10",
            "amount" => "4200",
        ],
        "4200",
    );
    $demoRecord(
        [
            "vehicle_id" => $third,
            "type" => "inspection",
            "title" => "Aile aracı muayenesi",
            "date" => "2026-04-15",
            "end_date" => "2028-04-15",
            "amount" => "2600",
        ],
        "2600",
    );
    $demoRecord(
        [
            "vehicle_id" => $fourth,
            "type" => "insurance",
            "title" => "Saha aracı trafik poliçesi",
            "policy_no" => "DEMO-TR-110-002",
            "date" => "2026-05-15",
            "end_date" => "2027-05-15",
            "amount" => "11200",
        ],
        "11200",
    );
    $demoRecord(
        [
            "vehicle_id" => $fourth,
            "type" => "casco",
            "title" => "Saha aracı kasko poliçesi",
            "policy_no" => "DEMO-KS-110-002",
            "date" => "2026-06-01",
            "end_date" => "2027-06-01",
            "amount" => "22000",
            "installments" => [
                ["date" => "2026-06-01", "amount" => "11000"],
                ["date" => "2026-12-01", "amount" => "11000"],
            ],
        ],
        "11000",
        $cards[1],
    );
    $demoRecord([
        "vehicle_id" => $fourth,
        "type" => "maintenance",
        "title" => "185.000 km bakım kontrolü",
        "date" => "2026-09-01",
        "km" => 175000,
        "next_km" => 185000,
        "next_date" => "2026-10-10",
        "amount" => "6200",
        "estimated" => true,
    ]);
    $demoRecord([
        "vehicle_id" => $fourth,
        "type" => "inspection",
        "title" => "Saha aracı muayene yenileme",
        "date" => "2025-10-18",
        "end_date" => "2026-10-18",
        "amount" => "2900",
        "estimated" => true,
    ]);
    // A linked payment on an existing record exercises editing without a second expense.
    $q = $db->prepare(
        "SELECT id,data_json FROM vehicle_records WHERE vehicle_id=? AND JSON_UNQUOTE(JSON_EXTRACT(data_json,'$.title'))='60.000 km periyodik bakım'",
    );
    $q->execute([$first]);
    $maintenance = $q->fetch();
    if ($maintenance) {
        $request = sprintf(
            "%08x-%04x-%04x-%04x-%012x",
            random_int(1, 0xfffffff),
            random_int(0, 65535),
            random_int(0, 65535),
            random_int(0, 65535),
            random_int(0, 0xffffffffff),
        );
        $event = saveOperation($db, [
            "requestId" => $request,
            "operation" => "expense",
            "account" => "bank",
            "amount" => "3000",
            "date" => "2026-10-08",
            "time" => "09:30",
            "description" => "Demo araç · 60.000 km bakım ödemesi",
            "tag" => "Araç",
        ]);
        $db->prepare(
            "INSERT INTO vehicle_payments(record_id,event_id) VALUES(?,?)",
        )->execute([$maintenance["id"], $event["id"]]);
    }
    $base = [
        "start_date" => "2026-10-01",
        "end_date" => "2026-10-31",
        "participation" => "joined",
        "reward_type" => "points",
        "reward_mode" => "percent",
        "reward_value" => "5",
        "per_tx_cap" => "200",
        "total_cap" => "500",
        "min_spend" => "100",
        "required_count" => 1,
        "card_ids" => [$cards[0]],
        "party_ids" => [],
        "tags" => [],
        "pos_programs" => [],
    ];
    $campaign = saveTracking($db, "campaign", [
        "name" => "Örnek Bonus puan kampanyası",
        ...$base,
    ])["id"];
    $q = $db->prepare(
        "SELECT id FROM fin_events WHERE card_id=? AND operation='expense' AND event_date BETWEEN '2026-10-01' AND '2026-10-13' AND installment_group='' ORDER BY id LIMIT 1",
    );
    $q->execute([$cards[0]]);
    $event = $q->fetchColumn();
    if ($event) {
        saveTracking($db, "campaign_entry", [
            "campaign_id" => $campaign,
            "event_id" => $event,
            "received" => "50",
            "confirmed" => true,
        ]);
    }
    saveTracking($db, "campaign", [
        "name" => "Örnek Axess nakit iade",
        "join_by" => "2026-10-18",
        ...$base,
        "card_ids" => [$cards[2]],
        "participation" => "required",
        "reward_type" => "cashback",
        "reward_value" => "3",
        "total_cap" => "300",
    ]);
    $db->prepare("UPDATE parties SET pos_programs=? WHERE id=?")->execute([
        json_encode(["garanti:bonus", "akbank:axess"]),
        $parties[0],
    ]);
}
