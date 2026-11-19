<?php
declare(strict_types=1);
if (!isset($action) || PHP_SAPI !== "cli") {
    http_response_code(404);
    exit();
}
// Caller owns finans_update advisory lock, also used by restore/reset/backup.
function staffAccrual(PDO $db, ?DateTimeImmutable $clock = null): array
{
    global $actor;
    $clock = ($clock ?? new DateTimeImmutable())->setTimezone(
        new DateTimeZone("Europe/Istanbul"),
    );
    $period = $clock->format("Y-m");
    $day = (int) $clock->format("j");
    if ($day > 3 || $clock->format("H") !== "12") {
        return ["skipped" => true, "failed" => [], "created" => 0];
    }
    $actor = [
        "id" => null,
        "role" => "admin",
        "short_name" => "Sistem · Aylık hakediş",
        "username" => "cron",
    ];
    $attempt = $db->prepare(
        "SELECT after_json FROM audit_log WHERE entity='automation' AND entity_id=? AND operation='attempt' ORDER BY id DESC LIMIT 1",
    );
    $attempt->execute(["staff-" . $period]);
    $previous = $attempt->fetchColumn();
    if ($previous) {
        $prior = json_decode($previous, true);
        if (($prior["attempt_date"] ?? "") === $clock->format("Y-m-d")) {
            return [
                "skipped" => true,
                "created" => 0,
                "failed" => $prior["failed"] ?? [],
            ];
        }
    }
    $periodId = "staff-" . $period;
    $query = $db->prepare(
        "SELECT after_json FROM audit_log WHERE entity='automation' AND entity_id=? AND operation='plan' ORDER BY id LIMIT 1",
    );
    $query->execute([$periodId]);
    $manifest = $query->fetchColumn();
    if ($manifest) {
        $items = json_decode($manifest, true, 512, JSON_THROW_ON_ERROR);
    } else {
        $items = [];
        foreach (
            $db->query(
                "SELECT * FROM parties WHERE type='Personel' AND active=1",
            )
            as $p
        ) {
            $profile = json_decode($p["profile_json"] ?? "{}", true) ?: [];
            $start = $profile["automation_start_month"] ?? "";
            if (!$start || $start > $period) {
                continue;
            }
            foreach (
                ["salary" => "salary_cents", "meal" => "meal_monthly_cents"]
                as $op => $field
            ) {
                $amount = (int) ($profile[$field] ?? 0);
                if ($amount > 0) {
                    $items[] = [
                        "party" => $p["id"],
                        "operation" => $op,
                        "cents" => $amount,
                    ];
                }
            }
        }
        $db->beginTransaction();
        audit(
            $db,
            "automation",
            $periodId,
            "plan",
            null,
            $items,
            "Aylık tutarların dönem başı görüntüsü",
        );
        $db->commit();
    }
    $created = 0;
    $failed = [];
    $months = [
        "ocak",
        "şubat",
        "mart",
        "nisan",
        "mayıs",
        "haziran",
        "temmuz",
        "ağustos",
        "eylül",
        "ekim",
        "kasım",
        "aralık",
    ];
    foreach ($items as $item) {
        $key = staffAccrualKey(
            $period,
            (int) $item["party"],
            $item["operation"],
        );
        try {
            $db->beginTransaction();
            $q = $db->prepare("SELECT id FROM fin_events WHERE request_key=?");
            $q->execute([$key]);
            if ($q->fetchColumn()) {
                $db->commit();
                continue;
            }
            $p = row($db, "parties", $item["party"]);
            if (!$p["active"] || $p["type"] !== "Personel") {
                $db->commit();
                continue;
            }
            $payload = [
                "requestId" => $key,
                "operation" => $item["operation"],
                "partyId" => $item["party"],
                "amount" => number_format($item["cents"] / 100, 2, ".", ""),
                "settled" => "0",
                "date" => $period . "-01",
                "time" => "12:00:00",
                "tag" => "Personel",
                "description" =>
                    $months[(int) $clock->format("n") - 1] .
                    " " .
                    $clock->format("Y") .
                    " " .
                    ($item["operation"] === "salary"
                        ? "maaşı"
                        : "yemek ücreti"),
            ];
            saveOperation($db, $payload);
            $db->commit();
            $created++;
        } catch (Throwable $e) {
            if ($db->inTransaction()) {
                $db->rollBack();
            }
            $failed[] = [
                "party" => $item["party"],
                "operation" => $item["operation"],
                "error" => $e->getMessage(),
            ];
        }
    }
    $result = [
        "created" => $created,
        "failed" => $failed,
        "period" => $period,
        "attempt_date" => $clock->format("Y-m-d"),
    ];
    $db->beginTransaction();
    audit(
        $db,
        "automation",
        $periodId,
        "attempt",
        null,
        $result,
        "Zamanlanmış aylık hakediş kontrolü",
    );
    $db->commit();
    return $result;
}
