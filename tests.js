// Run with: node tests.js
const assert = require("assert");
const { calculate } = require("./app.js");

const base = {
  type: "superannuation",
  dob: "1966-03-10",
  appointment: "1996-03-10",
  retirement: "2026-03-09",
  nonQualifying: { y: 0, m: 0, d: 0 },
  roundUp: true,
  segments: [{ pay: 100000, months: 24 }],
  addNotional: false,
  notionalIncrement: 0,
  commutationPct: 35,
  commutationFactor: 0,
  voluntaryRatePct: null,
  increasePct: 0
};
const run = (o) => calculate(Object.assign({}, base, o));
let n = 0;
const t = (name, fn) => { fn(); n++; console.log("ok -", name); };

t("30 years gives 70% of average emoluments", () => {
  const r = run({});
  assert.strictEqual(r.qualifyingYears, 30);
  assert.strictEqual(r.regime, "new");
  assert.strictEqual(Math.round(r.grossPension), 70000);
  assert.strictEqual(Math.round(r.surrendered), 24500);
  assert.strictEqual(Math.round(r.netPension), 45500);
});

t("service above 30 years is capped", () => {
  const r = run({ appointment: "1990-01-01" });
  assert.strictEqual(r.qualifyingYears, 30);
  assert.strictEqual(Math.round(r.grossPension), 70000);
});

t("20 years = 140/300", () => {
  const r = run({ appointment: "2006-03-10" });
  assert.strictEqual(r.qualifyingYears, 20);
  assert.strictEqual(Math.round(r.grossPension), Math.round(100000 * 140 / 300));
});

t("averaging across pay periods", () => {
  const r = run({ segments: [{ pay: 90000, months: 10 }, { pay: 100000, months: 14 }] });
  assert.ok(Math.abs(r.averageEmoluments - (900000 + 1400000) / 24) < 1e-6);
});

t("notional increment is added after averaging", () => {
  const r = run({ addNotional: true, notionalIncrement: 2000 });
  assert.strictEqual(Math.round(r.averageEmoluments), 102000);
});

t("legacy regime uses 12 months", () => {
  const r = run({ dob: "1962-01-01", appointment: "1992-01-01", retirement: "2021-12-31", segments: [{ pay: 50000, months: 12 }] });
  assert.strictEqual(r.regime, "legacy");
  assert.strictEqual(r.requiredMonths, 12);
  assert.strictEqual(r.warnings.length, 0);
});

t("under 10 years gives gratuity only", () => {
  const r = run({ appointment: "2020-03-10", dob: "1990-01-01", retirement: "2026-03-09" });
  assert.strictEqual(r.eligibleForPension, false);
  assert.ok(r.gratuity > 0);
});

t("voluntary retirement reduction at 3%/yr", () => {
  const r = run({ type: "voluntary", dob: "1971-03-10", appointment: "1996-03-10", retirement: "2026-03-09" });
  // 25 yrs service, ~5 years before age 60 (60th birthday 2031-03-10) => about 15% reduction
  assert.ok(r.reductionPct > 14.9 && r.reductionPct <= 15, "reduction " + r.reductionPct);
  assert.ok(r.grossPension < r.grossBeforeReduction);
});

t("commutation capped at 35% and lump sum uses factor", () => {
  const r = run({ commutationPct: 50, commutationFactor: 8 });
  assert.strictEqual(r.commutationPct, 35);
  assert.strictEqual(Math.round(r.lumpSum), Math.round(24500 * 12 * 8));
});

t("validation errors", () => {
  const r = calculate({ segments: [] });
  assert.ok(r.errors.length >= 3);
});

console.log("\n" + n + " tests passed");
