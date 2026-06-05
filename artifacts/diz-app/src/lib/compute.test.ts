import { describe, it, expect } from "vitest";
import { computeKPIs, DEFAULT_PARAMS, RENTE_RISK } from "./compute";

// ─── Baseline ─────────────────────────────────────────────────────────────────
describe("Baseline (alle Standardwerte)", () => {
  const result = computeKPIs("realistisch", 1.0, DEFAULT_PARAMS);

  it("defizit entspricht dem Ausgangswert −34,2 Mrd.", () => {
    expect(result.defizit).toBeCloseTo(-34.2, 5);
  });

  it("steuer entspricht dem Ausgangswert 948 Mrd.", () => {
    expect(result.steuer).toBeCloseTo(948, 5);
  });

  it("alq entspricht dem Ausgangswert 5,7 %", () => {
    expect(result.alq).toBeCloseTo(5.7, 5);
  });

  it("wachstum entspricht dem Ausgangswert 0,8 % BIP", () => {
    expect(result.wachstum).toBeCloseTo(0.8, 5);
  });

  it("rentenKosten entsprechen dem Ausgangswert 362 Mrd.", () => {
    expect(result.rentenKosten).toBeCloseTo(362, 5);
  });

  it("einnahmenDelta und ausgabenDelta sind beide 0", () => {
    expect(result.einnahmenDelta).toBeCloseTo(0, 5);
    expect(result.ausgabenDelta).toBeCloseTo(0, 5);
  });

  it("co2Emissionen entsprechen dem Ausgangswert 670 Mt", () => {
    expect(result.co2Emissionen).toBeCloseTo(670, 1);
  });

  it("mietindex ist 100 (Baseline, keine Bremse, kein Ausbau)", () => {
    expect(result.mietindex).toBe(100);
  });
});

// ─── Verteidigung ─────────────────────────────────────────────────────────────
describe("Verteidigung", () => {
  it("+1% BIP erhöht ausgabenDelta um ~43,06 Mrd.", () => {
    const r = computeKPIs("realistisch", 1.0, { ...DEFAULT_PARAMS, verteidigung: 3.0 });
    expect(r.ausgabenDelta).toBeCloseTo(43.06, 1);
  });

  it("erhöhte Ausgaben verschlechtern das Defizit", () => {
    const r = computeKPIs("realistisch", 1.0, { ...DEFAULT_PARAMS, verteidigung: 3.0 });
    expect(r.defizit).toBeLessThan(-34.2);
  });

  it("im optimistischen Szenario liefert Verteidigung Wachstumsbeitrag", () => {
    const base = computeKPIs("optimistisch", 1.3, DEFAULT_PARAMS);
    const hohe = computeKPIs("optimistisch", 1.3, { ...DEFAULT_PARAMS, verteidigung: 3.0 });
    expect(hohe.wachstum).toBeGreaterThan(base.wachstum);
  });

  it("im pessimistischen Szenario schadet höhere Verteidigung dem Wachstum", () => {
    const base = computeKPIs("pessimistisch", 0.65, DEFAULT_PARAMS);
    const hohe = computeKPIs("pessimistisch", 0.65, { ...DEFAULT_PARAMS, verteidigung: 3.0 });
    expect(hohe.wachstum).toBeLessThan(base.wachstum);
  });
});

// ─── Fachkräftezuwanderung ────────────────────────────────────────────────────
describe("Fachkräftezuwanderung", () => {
  it("+100k Fachkräfte senken die Arbeitslosenquote", () => {
    const r = computeKPIs("realistisch", 1.0, { ...DEFAULT_PARAMS, fachkraefte: 300 });
    expect(r.alq).toBeLessThan(5.7);
  });

  it("+100k Fachkräfte erhöhen das Wachstum", () => {
    const r = computeKPIs("realistisch", 1.0, { ...DEFAULT_PARAMS, fachkraefte: 300 });
    expect(r.wachstum).toBeGreaterThan(0.8);
  });

  it("+100k Fachkräfte reduzieren die Fachkräftelücke um 150k", () => {
    const r = computeKPIs("realistisch", 1.0, { ...DEFAULT_PARAMS, fachkraefte: 300 });
    expect(r.fachluecke).toBeCloseTo(890 - 150, 1);
  });

  it("maximale Fachkräftezuwanderung (500k) führt zu keiner negativen Lücke", () => {
    const r = computeKPIs("realistisch", 1.0, { ...DEFAULT_PARAMS, fachkraefte: 500 });
    expect(r.fachluecke).toBeGreaterThanOrEqual(0);
  });
});

// ─── Schuldenbremse ───────────────────────────────────────────────────────────
describe("Schuldenbremse", () => {
  it("'aktuell' verändert weder Ausgaben noch Invest", () => {
    const r = computeKPIs("realistisch", 1.0, { ...DEFAULT_PARAMS, schuldenbremse: "aktuell" });
    expect(r.schdbInvest).toBe(0);
    expect(r.defizit).toBeCloseTo(-34.2, 5);
  });

  it("'abgeschafft' erhöht das Defizit um 94 Mrd. (80 Mrd. Ausgaben + 14 Zinsen)", () => {
    const r = computeKPIs("realistisch", 1.0, { ...DEFAULT_PARAMS, schuldenbremse: "abgeschafft" });
    expect(r.defizit).toBeCloseTo(-34.2 - 94, 0);
  });

  it("'abgeschafft' erhöht den Investitionsrahmen um 66 Mrd.", () => {
    const r = computeKPIs("realistisch", 1.0, { ...DEFAULT_PARAMS, schuldenbremse: "abgeschafft" });
    expect(r.schdbInvest).toBe(66);
  });

  it("'reformiert' verbessert das Wachstum", () => {
    const base     = computeKPIs("realistisch", 1.0, DEFAULT_PARAMS);
    const reformed = computeKPIs("realistisch", 1.0, { ...DEFAULT_PARAMS, schuldenbremse: "reformiert" });
    expect(reformed.wachstum).toBeGreaterThan(base.wachstum);
  });
});

// ─── Steuern ─────────────────────────────────────────────────────────────────
describe("Steuereinnahmen", () => {
  it("+1pp Einkommensteuer erhöht einnahmenDelta um 3,2 Mrd.", () => {
    const r = computeKPIs("realistisch", 1.0, { ...DEFAULT_PARAMS, einkommensteuer: 43 });
    expect(r.einnahmenDelta).toBeCloseTo(3.2, 5);
  });

  it("+1pp Unternehmenssteuer erhöht einnahmenDelta um 3,0 Mrd.", () => {
    const r = computeKPIs("realistisch", 1.0, { ...DEFAULT_PARAMS, unternehmenssteuer: 30.9 });
    expect(r.einnahmenDelta).toBeCloseTo(3.0, 5);
  });

  it("+1pp Unternehmenssteuer senkt das Wachstum um 0,015pp", () => {
    const base = computeKPIs("realistisch", 1.0, DEFAULT_PARAMS);
    const hohe = computeKPIs("realistisch", 1.0, { ...DEFAULT_PARAMS, unternehmenssteuer: 30.9 });
    expect(base.wachstum - hohe.wachstum).toBeCloseTo(0.015, 5);
  });

  it("Erbschaft-Freibetrag auf 300k erhöht einnahmenDelta um 0,5 Mrd.", () => {
    const r = computeKPIs("realistisch", 1.0, { ...DEFAULT_PARAMS, erbschaftssteuer: 300 });
    expect(r.einnahmenDelta).toBeCloseTo(0.5, 5);
  });
});

// ─── Rente ────────────────────────────────────────────────────────────────────
describe("Rente", () => {
  it("+1pp Rentenniveau erhöht rentenKosten um 4 Mrd.", () => {
    const r = computeKPIs("realistisch", 1.0, { ...DEFAULT_PARAMS, rentenniveau: 49 });
    expect(r.rentenKosten).toBeCloseTo(362 + 4, 5);
  });

  it("+1 Jahr Renteneintrittsalter spart ~15,17 Mrd. (18,5 × RENTE_RISK)", () => {
    const r = computeKPIs("realistisch", 1.0, { ...DEFAULT_PARAMS, rentenalter: 68 });
    expect(r.rentenKosten).toBeCloseTo(362 - 18.5 * RENTE_RISK, 5);
  });

  it("höheres Rentenniveau verschlechtert das Defizit", () => {
    const r = computeKPIs("realistisch", 1.0, { ...DEFAULT_PARAMS, rentenniveau: 52 });
    expect(r.defizit).toBeLessThan(-34.2);
  });
});

// ─── EU-Freizügigkeit ─────────────────────────────────────────────────────────
describe("EU-Freizügigkeit", () => {
  it("Abschaffung kostet 10 Mrd. Einnahmen", () => {
    const r = computeKPIs("realistisch", 1.0, { ...DEFAULT_PARAMS, euZuwanderung: false });
    expect(r.einnahmenDelta).toBeCloseTo(-10, 5);
  });

  it("Abschaffung erhöht Arbeitslosenquote um 0,2pp", () => {
    const r = computeKPIs("realistisch", 1.0, { ...DEFAULT_PARAMS, euZuwanderung: false });
    expect(r.alq).toBeCloseTo(5.9, 5);
  });

  it("Abschaffung senkt Wachstum um 0,35pp (vor Szenario-Multiplikator)", () => {
    const base = computeKPIs("realistisch", 1.0, DEFAULT_PARAMS);
    const ohne = computeKPIs("realistisch", 1.0, { ...DEFAULT_PARAMS, euZuwanderung: false });
    expect(base.wachstum - ohne.wachstum).toBeCloseTo(0.35, 4);
  });

  it("Abschaffung erhöht Fachkräftelücke um 180k", () => {
    const base = computeKPIs("realistisch", 1.0, DEFAULT_PARAMS);
    const ohne = computeKPIs("realistisch", 1.0, { ...DEFAULT_PARAMS, euZuwanderung: false });
    expect(ohne.fachluecke - base.fachluecke).toBe(180);
  });
});

// ─── Szenarien ────────────────────────────────────────────────────────────────
describe("Szenario-Multiplikator", () => {
  it("smVal=0 → alle Deltas sind 0, Baseline-Werte bleiben erhalten", () => {
    const r = computeKPIs("pessimistisch", 0, { ...DEFAULT_PARAMS, verteidigung: 3.0 });
    expect(r.defizit).toBeCloseTo(-34.2, 5);
  });

  it("pessimistischer Multiplier dämpft alle Deltas — Wachstum ist schlechter als realistisch", () => {
    const params = { ...DEFAULT_PARAMS, fachkraefte: 400 };
    const real = computeKPIs("realistisch", 1.0, params);
    const pess = computeKPIs("pessimistisch", 0.65, params);
    expect(pess.wachstum).toBeLessThan(real.wachstum);
  });

  it("optimistischer Multiplier erzeugt besseres Defizit als realistisch", () => {
    const params = { ...DEFAULT_PARAMS, verteidigung: 1.0 };
    const real = computeKPIs("realistisch", 1.0, params);
    const opt  = computeKPIs("optimistisch", 1.3, params);
    expect(opt.defizit).toBeGreaterThan(real.defizit);
  });
});

// ─── Klima & Energie ─────────────────────────────────────────────────────────
describe("CO₂-Preis", () => {
  it("+60 €/t CO₂-Preis generiert ca. 1,08 Mrd. Mehreinnahmen", () => {
    const r = computeKPIs("realistisch", 1.0, { ...DEFAULT_PARAMS, co2Preis: 120 });
    expect(r.einnahmenDelta).toBeCloseTo(60 * 0.018, 5);
  });

  it("höherer CO₂-Preis reduziert Emissionen", () => {
    const base = computeKPIs("realistisch", 1.0, DEFAULT_PARAMS);
    const hohe = computeKPIs("realistisch", 1.0, { ...DEFAULT_PARAMS, co2Preis: 200 });
    expect(hohe.co2Emissionen).toBeLessThan(base.co2Emissionen);
  });

  it("Emissionen können nicht negativ werden", () => {
    const r = computeKPIs("realistisch", 1.0, {
      ...DEFAULT_PARAMS, co2Preis: 250, windausbau: 200, solarausbau: 200,
    });
    expect(r.co2Emissionen).toBeGreaterThanOrEqual(0);
  });
});

// ─── Wohnen ──────────────────────────────────────────────────────────────────
describe("Wohnen", () => {
  it("Mietpreisbremse senkt den Mietindex um 5 Punkte", () => {
    const ohne = computeKPIs("realistisch", 1.0, DEFAULT_PARAMS);
    const mit  = computeKPIs("realistisch", 1.0, { ...DEFAULT_PARAMS, mietpreisbremse: true });
    expect(ohne.mietindex - mit.mietindex).toBe(5);
  });

  it("Sozialwohnungen +100k senken den Mietindex um 15 Punkte", () => {
    const base  = computeKPIs("realistisch", 1.0, DEFAULT_PARAMS);
    const ausbau = computeKPIs("realistisch", 1.0, { ...DEFAULT_PARAMS, sozialwohnungen: 130 });
    expect(base.mietindex - ausbau.mietindex).toBeCloseTo(100 * 0.15, 5);
  });

  it("Mietindex unterschreitet nie 60", () => {
    const r = computeKPIs("realistisch", 1.0, {
      ...DEFAULT_PARAMS, sozialwohnungen: 250, mietpreisbremse: true,
    });
    expect(r.mietindex).toBeGreaterThanOrEqual(60);
  });
});

// ─── Bildung ─────────────────────────────────────────────────────────────────
describe("Bildungsausgaben", () => {
  it("+1% BIP Bildung kostet ~43,06 Mrd.", () => {
    const r = computeKPIs("realistisch", 1.0, { ...DEFAULT_PARAMS, bildungsausgaben: 5.3 });
    expect(r.ausgabenDelta).toBeCloseTo(43.06, 1);
  });

  it("+1% BIP Bildung erhöht das Wachstum um 0,015pp", () => {
    const base = computeKPIs("realistisch", 1.0, DEFAULT_PARAMS);
    const hohe = computeKPIs("realistisch", 1.0, { ...DEFAULT_PARAMS, bildungsausgaben: 5.3 });
    expect(hohe.wachstum - base.wachstum).toBeCloseTo(0.015, 5);
  });
});
