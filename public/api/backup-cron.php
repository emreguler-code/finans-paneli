<?php
declare(strict_types=1);
// Hosting cron only. Never expose backup creation or configuration over HTTP.
if (PHP_SAPI !== "cli") {
    http_response_code(404);
    exit();
}
date_default_timezone_set("Europe/Istanbul");
if (!is_file(__DIR__ . "/config.php")) {
    fwrite(STDERR, "Finans yapılandırması bulunamadı.\n");
    exit(1);
}
$config = require __DIR__ . "/config.php";
$action = "cron";
require __DIR__ . "/v2/core.php";
require __DIR__ . "/v2/backups.php";
$db = null;
try {
    $db = new PDO(
        "mysql:host=" .
            $config["db_host"] .
            ";port=" .
            ($config["db_port"] ?? 3306) .
            ";dbname=" .
            $config["db_name"] .
            ";charset=utf8mb4",
        $config["db_user"],
        $config["db_password"],
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ],
    );
    $db->exec("SET time_zone = '+03:00'");
    if (
        (int) $db
            ->query("SELECT schema_version FROM app_meta WHERE id=1")
            ->fetchColumn() !== 12
    ) {
        throw new DomainException("Önce şema güncellemesini tamamlayın.");
    }
    if (
        !(int) $db->query("SELECT GET_LOCK('finans_update',5)")->fetchColumn()
    ) {
        throw new DomainException(
            "Başka bir bakım işlemi sürüyor; sonraki cron kontrolünde yeniden deneyin.",
        );
    }
    $backup = backupAutomatic($db);
    fwrite(
        STDOUT,
        $backup
            ? "Finans otomatik yedeği oluşturuldu.\n"
            : "Yeni otomatik yedek gerekmiyor veya seçenek kapalı.\n",
    );
} catch (Throwable $e) {
    fwrite(
        STDERR,
        "Finans otomatik yedeği alınamadı: " . $e->getMessage() . "\n",
    );
    exit(1);
} finally {
    if ($db) {
        if ($db->inTransaction()) {
            $db->rollBack();
        }
        $db->query("SELECT RELEASE_LOCK('finans_update')");
    }
}
