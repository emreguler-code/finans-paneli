import { test } from "node:test";
import assert from "node:assert/strict";
import { auditFailures } from "../scripts/audit.mjs";
const lock = { packages: { "node_modules/picomatch": { version: "4.0.7" } } };
const advisory = {
  name: "picomatch",
  url: "https://github.com/advisories/GHSA-fc5q-39xc-vjpf",
  range: "<=4.0.7",
  severity: "high",
};
const report = () => ({
  metadata: {},
  vulnerabilities: {
    picomatch: { severity: "high", via: [advisory] },
    vite: { severity: "high", via: ["picomatch"] },
  },
});
test("Only the documented, unexpired build-only advisory and its dependency chain are accepted", () => {
  assert.deepEqual(auditFailures(report(), lock, "2026-11-18"), []);
  assert.deepEqual(
    auditFailures({ metadata: {}, vulnerabilities: {} }, lock, "2027-01-01"),
    [],
  );
});
test("New advisories, changed lock, malformed response and expiry fail closed", () => {
  const next = report();
  next.vulnerabilities.picomatch.via = [
    { ...advisory, url: "https://github.com/advisories/NEW" },
  ];
  assert.ok(auditFailures(next, lock, "2026-11-18").length);
  assert.ok(auditFailures(report(), lock, "2026-12-19").length);
  assert.ok(auditFailures(report(), {}, "2026-11-18").length);
  assert.ok(auditFailures({ error: {} }, lock).length);
  const critical = report();
  critical.vulnerabilities.picomatch.severity = "critical";
  assert.ok(auditFailures(critical, lock, "2026-11-18").length);
});
