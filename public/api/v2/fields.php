<?php
if (!isset($action)) {
    http_response_code(404);
    exit();
}
function invalidField(string $message): never
{
    if (PHP_SAPI === "cli") {
        throw new DomainException($message);
    }
    fail($message);
}
function field(
    array $body,
    string $key,
    int $max = 160,
    bool $required = false,
): string {
    if (isset($body[$key]) && !is_string($body[$key])) {
        invalidField("Geçersiz alan: " . $key);
    }
    $s = trim($body[$key] ?? "");
    if (
        !preg_match("//u", $s) ||
        preg_match_all("/./us", $s) > $max ||
        ($required && $s === "")
    ) {
        invalidField("Alanı kontrol edin: " . $key);
    }
    return $s;
}
