<?php
declare(strict_types=1);
date_default_timezone_set("Europe/Istanbul");
header("Content-Type: application/json; charset=utf-8");
header("Cache-Control: no-store, private");
header("X-Content-Type-Options: nosniff");
function reply(array $data, int $status = 200): never
{
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
    exit();
}
function fail(string $message, int $status = 422): never
{
    reply(["error" => $message], $status);
}
if (!is_file(__DIR__ . "/config.php")) {
    fail("api/config.php dosyasını kurulum kılavuzuna göre hazırlayın.", 503);
}
$config = require __DIR__ . "/config.php";
$secure = isset($_SERVER["HTTPS"]) && $_SERVER["HTTPS"] !== "off";
if (($config["require_https"] ?? true) && !$secure) {
    fail("Bu kurulum HTTPS bağlantısı gerektiriyor.", 403);
}
session_name("finans_session");
ini_set("session.use_strict_mode", "1");
session_set_cookie_params([
    "httponly" => true,
    "secure" => $secure,
    "samesite" => "Strict",
    "path" => "/",
]);
session_start();
if (!isset($_SESSION["csrf"])) {
    $_SESSION["csrf"] = bin2hex(random_bytes(32));
}
$action = $_GET["action"] ?? "state";
require __DIR__ . "/v2/private-storage.php";
$method = $_SERVER["REQUEST_METHOD"];
if (!in_array($method, ["GET", "POST"], true)) {
    fail("Desteklenmeyen yöntem.", 405);
}
$body = [];
if ($method === "POST") {
    if (
        (int) ($_SERVER["CONTENT_LENGTH"] ?? 0) >
        ($action === "backup_upload" ? 34603008 : 16384)
    ) {
        fail("İstek çok büyük.", 413);
    }
    if (!hash_equals($_SESSION["csrf"], $_SERVER["HTTP_X_CSRF_TOKEN"] ?? "")) {
        fail("Oturum doğrulaması geçersiz. Sayfayı yenileyin.", 403);
    }
    if ($action === "backup_upload") {
        $body = [];
    } else {
        try {
            $body = json_decode(
                file_get_contents("php://input"),
                true,
                32,
                JSON_THROW_ON_ERROR,
            );
        } catch (Throwable $e) {
            fail("Geçersiz JSON.");
        }
        if (!is_array($body)) {
            fail("Geçersiz istek.");
        }
    }
}
function field(
    array $body,
    string $key,
    int $max = 160,
    bool $required = false,
): string {
    if (isset($body[$key]) && !is_string($body[$key])) {
        fail("Geçersiz alan: " . $key);
    }
    $s = trim($body[$key] ?? "");
    if (
        !preg_match("//u", $s) ||
        preg_match_all("/./us", $s) > $max ||
        ($required && $s === "")
    ) {
        fail("Alanı kontrol edin: " . $key);
    }
    return $s;
}
require __DIR__ . "/v2/core.php";
require __DIR__ . "/v2/finance.php";
require __DIR__ . "/v2/tracking.php";
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
    $actor = v2Actor($db);
    if ($action === "session" && $method === "GET") {
        reply([
            "csrf" => $_SESSION["csrf"],
            "user" => $actor,
            "setupRequired" =>
                (int) $db
                    ->query("SELECT COUNT(*) FROM users")
                    ->fetchColumn() === 0,
        ]);
    }
    if (in_array($action, ["login", "setup"], true) && $method === "POST") {
        $ip = hash("sha256", $_SERVER["REMOTE_ADDR"] ?? "local");
        $q = $db->prepare(
            "SELECT COUNT(*) FROM login_attempts WHERE ip_hash=? AND attempted_at>DATE_SUB(NOW(),INTERVAL 15 MINUTE)",
        );
        $q->execute([$ip]);
        if ((int) $q->fetchColumn() >= 10) {
            fail("Çok fazla deneme. 15 dakika sonra tekrar deneyin.", 429);
        }
        $db->prepare("INSERT INTO login_attempts(ip_hash) VALUES(?)")->execute([
            $ip,
        ]);
        $db->exec(
            "DELETE FROM login_attempts WHERE attempted_at<DATE_SUB(NOW(),INTERVAL 1 DAY)",
        );
        $username = field($body, "username", 80, true);
        $password = field($body, "password", 128, true);
        if (strlen($password) > 72) {
            fail("Parola en fazla 72 bayt olmalı.");
        }
        if ($action === "setup") {
            $token = (string) ($config["setup_token"] ?? "");
            if (
                strlen($token) < 32 ||
                str_starts_with($token, "CHANGE_ME") ||
                !hash_equals($token, field($body, "token", 256, true))
            ) {
                fail("Kurulum anahtarı geçersiz.", 403);
            }
            if (strlen($password) < 12) {
                fail("En az 12 karakterli parola belirleyin.");
            }
            $db->beginTransaction();
            $db->query(
                "SELECT id FROM app_meta WHERE id=1 FOR UPDATE",
            )->fetch();
            if (
                (int) $db->query("SELECT COUNT(*) FROM users")->fetchColumn() >
                0
            ) {
                $db->rollBack();
                fail("İlk kurulum zaten tamamlandı.", 409);
            }
            $db->prepare(
                "INSERT INTO users(username,password_hash) VALUES(?,?)",
            )->execute([$username, password_hash($password, PASSWORD_DEFAULT)]);
            $id = (int) $db->lastInsertId();
            if (
                (int) $db
                    ->query("SELECT schema_version FROM app_meta WHERE id=1")
                    ->fetchColumn() >= 3
            ) {
                $db->prepare(
                    "UPDATE users SET role='admin',short_name=? WHERE id=?",
                )->execute([$username, $id]);
            }
            $db->commit();
        } else {
            $q = $db->prepare("SELECT * FROM users WHERE username=?");
            $q->execute([$username]);
            $user = $q->fetch();
            if (
                !$user ||
                (isset($user["active"]) && !$user["active"]) ||
                !password_verify($password, $user["password_hash"])
            ) {
                fail("Kullanıcı adı veya parola hatalı.", 401);
            }
            $id = (int) $user["id"];
            $username = $user["username"];
        }
        session_regenerate_id(true);
        $_SESSION["uid"] = $id;
        $_SESSION["username"] = $username;
        $_SESSION["last_seen"] = time();
        $_SESSION["csrf"] = bin2hex(random_bytes(32));
        $_SESSION["workspace_epoch"] = workspaceEpoch();
        $db->prepare("DELETE FROM login_attempts WHERE ip_hash=?")->execute([
            $ip,
        ]);
        reply(["user" => $username, "csrf" => $_SESSION["csrf"]]);
    }
    if (
        !isset($_SESSION["uid"]) ||
        time() - ($_SESSION["last_seen"] ?? 0) > 7200
    ) {
        unset($_SESSION["uid"], $_SESSION["username"]);
        fail("Devam etmek için giriş yapın.", 401);
    }
    $_SESSION["last_seen"] = time();
    if ($action === "logout" && $method === "POST") {
        $_SESSION = [];
        session_destroy();
        reply(["ok" => true]);
    }
    $actor = v2Actor($db);
    if (!$actor) {
        fail("Hesabınız etkin değil. Yeniden giriş yapın.", 401);
    }
    require __DIR__ . "/v2/upgrade.php";
    if (
        (int) $db
            ->query("SELECT schema_version FROM app_meta WHERE id=1")
            ->fetchColumn() < 12
    ) {
        reply(
            [
                "error" => "Yeni sürüm için yönetici güncellemesi gerekiyor.",
                "upgradeRequired" => true,
            ],
            503,
        );
    }
    require __DIR__ . "/v2/backups.php";
    require __DIR__ . "/v2/main.php";
} catch (DomainException $e) {
    if (isset($db) && $db->inTransaction()) {
        $db->rollBack();
    }
    fail($e->getMessage());
} catch (Throwable $e) {
    if (isset($db) && $db->inTransaction()) {
        $db->rollBack();
    }
    error_log("Finans API error: " . $e->getMessage());
    fail(
        "İşlem tamamlanamadı. Veritabanı bağlantısını ve sunucu hata günlüğünü kontrol edin.",
        503,
    );
}
