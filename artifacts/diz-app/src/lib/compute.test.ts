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

// ─── Beamte ───────────────────────────────────────────────────────────────────
describe("Beamte", () => {
  it("+1000 Beamte erhöhen ausgabenDelta um 21,6 Mrd. (0,072 × BEAMTE_DELAY)", () => {
    const r = computeKPIs("realistisch", 1.0, { ...DEFAULT_PARAMS, beamte: 5900 });
    expect(r.ausgabenDelta).toBeCloseTo(1000 * 0.072 * 0.30, 5);
  });

  it("+1000 Beamte senken das Wachstum um 0,02pp", () => {
    const base = computeKPIs("realistisch", 1.0, DEFAULT_PARAMS);
    const mehr = computeKPIs("realistisch", 1.0, { ...DEFAULT_PARAMS, beamte: 5900 });
    expect(base.wachstum - mehr.wachstum).toBeCloseTo(0.02, 5);
  });

  it("−1000 Beamte senken ausgabenDelta um 21,6 Mrd.", () => {
    const r = computeKPIs("realistisch", 1.0, { ...DEFAULT_PARAMS, beamte: 3900 });
    expect(r.ausgabenDelta).toBeCloseTo(-1000 * 0.072 * 0.30, 5);
  });
});

// ─── Ministerien ─────────────────────────────────────────────────────────────
describe("Ministerien", () => {
  it("−4 Ministerien (16→12) sparen 3,2 Mrd.", () => {
    const r = computeKPIs("realistisch", 1.0, { ...DEFAULT_PARAMS, ministerien: 12 });
    expect(r.ausgabenDelta).toBeCloseTo(-3.2, 5);
  });

  it("+4 Ministerien (16→20) kosten 3,2 Mrd.", () => {
    const r = computeKPIs("realistisch", 1.0, { ...DEFAULT_PARAMS, ministerien: 20 });
    expect(r.ausgabenDelta).toBeCloseTo(3.2, 5);
  });
});

// ─── Entwicklungshilfe ───────────────────────────────────────────────────────
describe("Entwicklungshilfe", () => {
  it("+0,3pp BIP (0,4→0,7%) erhöht ausgabenDelta um ~12,92 Mrd.", () => {
    const r = computeKPIs("realistisch", 1.0, { ...DEFAULT_PARAMS, entwicklung: 0.7 });
    expect(r.ausgabenDelta).toBeCloseTo(0.3 * 43.06, 2);
  });

  it("UN-Ziel 0,7% erhöht das Defizit", () => {
    const base = computeKPIs("realistisch", 1.0, DEFAULT_PARAMS);
    const ziel = computeKPIs("realistisch", 1.0, { ...DEFAULT_PARAMS, entwicklung: 0.7 });
    expect(ziel.defizit).toBeLessThan(base.defizit);
  });
});

// ─── Flüchtlinge ─────────────────────────────────────────────────────────────
describe("Flüchtlingsaufnahme", () => {
  it("+100k Flüchtlinge erhöhen ausgabenDelta um 1,8 Mrd.", () => {
    const r = computeKPIs("realistisch", 1.0, { ...DEFAULT_PARAMS, fluechtlinge: 280 });
    expect(r.ausgabenDelta).toBeCloseTo(1.8, 5);
  });

  it("−100k Flüchtlinge senken ausgabenDelta um 1,8 Mrd.", () => {
    const r = computeKPIs("realistisch", 1.0, { ...DEFAULT_PARAMS, fluechtlinge: 80 });
    expect(r.ausgabenDelta).toBeCloseTo(-1.8, 5);
  });
});

// ─── Bürgergeld ──────────────────────────────────────────────────────────────
describe("Bürgergeld", () => {
  it("+100 EUR Bürgergeld erhöht ausgabenDelta um 6,6 Mrd.", () => {
    const r = computeKPIs("realistisch", 1.0, { ...DEFAULT_PARAMS, buergergeld: 602 });
    expect(r.ausgabenDelta).toBeCloseTo(6.6, 5);
  });

  it("+100 EUR Bürgergeld erhöht Arbeitslosenquote um 0,15pp", () => {
    const r = computeKPIs("realistisch", 1.0, { ...DEFAULT_PARAMS, buergergeld: 602 });
    expect(r.alq).toBeCloseTo(5.85, 5);
  });

  it("−100 EUR Bürgergeld (502→402) senkt ausgabenDelta und alq", () => {
    const r = computeKPIs("realistisch", 1.0, { ...DEFAULT_PARAMS, buergergeld: 402 });
    expect(r.ausgabenDelta).toBeCloseTo(-6.6, 5);
    expect(r.alq).toBeCloseTo(5.55, 5);
  });
});

// ─── Beitragssatz GKV ────────────────────────────────────────────────────────
describe("Krankenversicherungs-Beitragssatz", () => {
  it("+1pp Beitragssatz senkt ausgabenDelta um 4 Mrd.", () => {
    const r = computeKPIs("realistisch", 1.0, { ...DEFAULT_PARAMS, beitragssatz: 15.6 });
    expect(r.ausgabenDelta).toBeCloseTo(-4.0, 5);
  });

  it("+1pp Beitragssatz verbessert das Defizit", () => {
    const base = computeKPIs("realistisch", 1.0, DEFAULT_PARAMS);
    const hoch = computeKPIs("realistisch", 1.0, { ...DEFAULT_PARAMS, beitragssatz: 15.6 });
    expect(hoch.defizit).toBeGreaterThan(base.defizit);
  });
});

// ─── Einheitsversicherung ────────────────────────────────────────────────────
describe("Einheitsversicherung", () => {
  it("Aktivierung erhöht ausgabenDelta um 18 Mrd.", () => {
    const r = computeKPIs("realistisch", 1.0, { ...DEFAULT_PARAMS, einheitsversicherung: true });
    expect(r.ausgabenDelta).toBeCloseTo(18, 5);
  });

  it("Aktivierung erhöht einnahmenDelta um 22 Mrd.", () => {
    const r = computeKPIs("realistisch", 1.0, { ...DEFAULT_PARAMS, einheitsversicherung: true });
    expect(r.einnahmenDelta).toBeCloseTo(22, 5);
  });

  it("Netto-Effekt: Einnahmen übersteigen Ausgaben um 4 Mrd.", () => {
    const r = computeKPIs("realistisch", 1.0, { ...DEFAULT_PARAMS, einheitsversicherung: true });
    expect(r.einnahmenDelta - r.ausgabenDelta).toBeCloseTo(4, 5);
  });
});

// ─── PKV abschaffen ──────────────────────────────────────────────────────────
describe("Private Krankenversicherung abschaffen", () => {
  it("Abschaffung erhöht ausgabenDelta um 11 Mrd.", () => {
    const r = computeKPIs("realistisch", 1.0, { ...DEFAULT_PARAMS, privatAbschaffen: true });
    expect(r.ausgabenDelta).toBeCloseTo(11, 5);
  });

  it("Abschaffung erhöht einnahmenDelta um 7 Mrd.", () => {
    const r = computeKPIs("realistisch", 1.0, { ...DEFAULT_PARAMS, privatAbschaffen: true });
    expect(r.einnahmenDelta).toBeCloseTo(7, 5);
  });

  it("Netto-Effekt: Ausgaben übersteigen Einnahmen um 4 Mrd.", () => {
    const r = computeKPIs("realistisch", 1.0, { ...DEFAULT_PARAMS, privatAbschaffen: true });
    expect(r.ausgabenDelta - r.einnahmenDelta).toBeCloseTo(4, 5);
  });
});

// ─── Vermögensteuer ──────────────────────────────────────────────────────────
describe("Vermögensteuer (Boolean)", () => {
  it("Aktivierung mit Standardwerten (Freibetrag 1 Mio., 1%, halb) generiert ~6,05 Mrd.", () => {
    const r = computeKPIs("realistisch", 1.0, { ...DEFAULT_PARAMS, vermoegenssteuer: true });
    expect(r.einnahmenDelta).toBeCloseTo(8 * 1.4 * 1.0 * 0.75 * 0.72, 3);
  });

  it("Deaktivierung generiert 0 Einnahmen", () => {
    const r = computeKPIs("realistisch", 1.0, { ...DEFAULT_PARAMS, vermoegenssteuer: false });
    expect(r.einnahmenDelta).toBeCloseTo(0, 5);
  });
});

describe("Vermögensteuer – Freibetrag", () => {
  const base = { ...DEFAULT_PARAMS, vermoegenssteuer: true };

  it("Freibetrag 1 Mio. → Faktor 1,4 (höchstes Aufkommen)", () => {
    const r = computeKPIs("realistisch", 1.0, { ...base, vmFreibetrag: 1 });
    expect(r.einnahmenDelta).toBeCloseTo(8 * 1.4 * 1.0 * 0.75 * 0.72, 3);
  });

  it("Freibetrag 2 Mio. → Faktor 1,0 (weniger als 1 Mio.)", () => {
    const r1 = computeKPIs("realistisch", 1.0, { ...base, vmFreibetrag: 1 });
    const r2 = computeKPIs("realistisch", 1.0, { ...base, vmFreibetrag: 2 });
    expect(r2.einnahmenDelta).toBeCloseTo(8 * 1.0 * 1.0 * 0.75 * 0.72, 3);
    expect(r2.einnahmenDelta).toBeLessThan(r1.einnahmenDelta);
  });

  it("Freibetrag 5 Mio. → Faktor 0,6", () => {
    const r = computeKPIs("realistisch", 1.0, { ...base, vmFreibetrag: 5 });
    expect(r.einnahmenDelta).toBeCloseTo(8 * 0.6 * 1.0 * 0.75 * 0.72, 3);
  });

  it("Freibetrag 20 Mio. → Faktor 0,22 (geringstes Aufkommen)", () => {
    const r20 = computeKPIs("realistisch", 1.0, { ...base, vmFreibetrag: 20 });
    const r1  = computeKPIs("realistisch", 1.0, { ...base, vmFreibetrag: 1 });
    expect(r20.einnahmenDelta).toBeCloseTo(8 * 0.22 * 1.0 * 0.75 * 0.72, 3);
    expect(r20.einnahmenDelta).toBeLessThan(r1.einnahmenDelta);
  });
});

describe("Vermögensteuer – Steuersatz", () => {
  const base = { ...DEFAULT_PARAMS, vermoegenssteuer: true };

  it("0,5% → halbes Aufkommen gegenüber 1,0%", () => {
    const r05 = computeKPIs("realistisch", 1.0, { ...base, vmRate: 0.5 });
    const r10 = computeKPIs("realistisch", 1.0, { ...base, vmRate: 1.0 });
    expect(r05.einnahmenDelta).toBeCloseTo(r10.einnahmenDelta * 0.5, 3);
  });

  it("1,5% → Faktor 1,35 (Laffer-Dämpfung beginnt)", () => {
    const r = computeKPIs("realistisch", 1.0, { ...base, vmRate: 1.5 });
    expect(r.einnahmenDelta).toBeCloseTo(8 * 1.4 * 1.35 * 0.75 * 0.72, 3);
  });

  it("3,0% → Faktor 1,8 (stärkste Dämpfung)", () => {
    const r3 = computeKPIs("realistisch", 1.0, { ...base, vmRate: 3.0 });
    const r2 = computeKPIs("realistisch", 1.0, { ...base, vmRate: 2.0 });
    expect(r3.einnahmenDelta).toBeCloseTo(8 * 1.4 * 1.8 * 0.75 * 0.72, 3);
    expect(r3.einnahmenDelta).toBeGreaterThan(r2.einnahmenDelta);
  });
});

describe("Vermögensteuer – Betriebsvermögen", () => {
  const base = { ...DEFAULT_PARAMS, vermoegenssteuer: true };

  it("'voll' → Faktor 1,0 (maximales Aufkommen)", () => {
    const r = computeKPIs("realistisch", 1.0, { ...base, vmBetrieb: "voll" });
    expect(r.einnahmenDelta).toBeCloseTo(8 * 1.4 * 1.0 * 1.0 * 0.72, 3);
  });

  it("'halb' → Faktor 0,75", () => {
    const r = computeKPIs("realistisch", 1.0, { ...base, vmBetrieb: "halb" });
    expect(r.einnahmenDelta).toBeCloseTo(8 * 1.4 * 1.0 * 0.75 * 0.72, 3);
  });

  it("'befreit' → Faktor 0,5 (geringstes Aufkommen)", () => {
    const r = computeKPIs("realistisch", 1.0, { ...base, vmBetrieb: "befreit" });
    expect(r.einnahmenDelta).toBeCloseTo(8 * 1.4 * 1.0 * 0.5 * 0.72, 3);
  });

  it("Reihenfolge: voll > halb > befreit", () => {
    const voll    = computeKPIs("realistisch", 1.0, { ...base, vmBetrieb: "voll"    });
    const halb    = computeKPIs("realistisch", 1.0, { ...base, vmBetrieb: "halb"    });
    const befreit = computeKPIs("realistisch", 1.0, { ...base, vmBetrieb: "befreit" });
    expect(voll.einnahmenDelta).toBeGreaterThan(halb.einnahmenDelta);
    expect(halb.einnahmenDelta).toBeGreaterThan(befreit.einnahmenDelta);
  });
});

// ─── Einkommensteuer-Spitzenbeginn ───────────────────────────────────────────
describe("Einkommensteuer – Spitzensteuerbeginn", () => {
  it("Anhebung um 10k € (80→90) senkt einnahmenDelta um 0,36 Mrd.", () => {
    const r = computeKPIs("realistisch", 1.0, { ...DEFAULT_PARAMS, estSpitzenbeginn: 90 });
    expect(r.einnahmenDelta).toBeCloseTo(-0.36, 5);
  });

  it("Absenkung um 10k € (80→70) erhöht einnahmenDelta um 0,36 Mrd.", () => {
    const r = computeKPIs("realistisch", 1.0, { ...DEFAULT_PARAMS, estSpitzenbeginn: 70 });
    expect(r.einnahmenDelta).toBeCloseTo(0.36, 5);
  });

  it("Standardwert 80k€ liefert keine Änderung", () => {
    const r = computeKPIs("realistisch", 1.0, DEFAULT_PARAMS);
    expect(r.einnahmenDelta).toBeCloseTo(0, 5);
  });
});

// ─── Reichensteuer ───────────────────────────────────────────────────────────
describe("Reichensteuer", () => {
  it("Aktivierung (Schwelle 250k, Satz 47%) generiert ~0,816 Mrd.", () => {
    const r = computeKPIs("realistisch", 1.0, {
      ...DEFAULT_PARAMS, reichensteuerAktiv: true, reichensteuerSchwelle: 250, reichensteuerSatz: 47,
    });
    expect(r.einnahmenDelta).toBeCloseTo(3 * 1.0 * 0.4 * 0.68, 3);
  });

  it("Schwelle 500k (Faktor 0,42) reduziert Aufkommen gegenüber 250k", () => {
    const r250 = computeKPIs("realistisch", 1.0, {
      ...DEFAULT_PARAMS, reichensteuerAktiv: true, reichensteuerSchwelle: 250, reichensteuerSatz: 47,
    });
    const r500 = computeKPIs("realistisch", 1.0, {
      ...DEFAULT_PARAMS, reichensteuerAktiv: true, reichensteuerSchwelle: 500, reichensteuerSatz: 47,
    });
    expect(r500.einnahmenDelta).toBeLessThan(r250.einnahmenDelta);
    expect(r500.einnahmenDelta).toBeCloseTo(3 * 0.42 * 0.4 * 0.68, 3);
  });

  it("Satz 60% löst Emigrationseffekt aus und dämpft Einnahmen", () => {
    const r47 = computeKPIs("realistisch", 1.0, {
      ...DEFAULT_PARAMS, reichensteuerAktiv: true, reichensteuerSchwelle: 250, reichensteuerSatz: 47,
    });
    const r60 = computeKPIs("realistisch", 1.0, {
      ...DEFAULT_PARAMS, reichensteuerAktiv: true, reichensteuerSchwelle: 250, reichensteuerSatz: 60,
    });
    const emigrAbzug = (60 - 50) * 0.4;
    const rateF60    = (60 - 45) / 5;
    expect(r60.einnahmenDelta).toBeCloseTo(
      Math.max(0, 3 * 1.0 * rateF60 * 0.68 - emigrAbzug), 3,
    );
    expect(r60.einnahmenDelta).toBeGreaterThan(r47.einnahmenDelta);
  });

  it("Deaktivierung liefert 0 Zusatzeinnahmen", () => {
    const r = computeKPIs("realistisch", 1.0, {
      ...DEFAULT_PARAMS, reichensteuerAktiv: false, reichensteuerSchwelle: 250, reichensteuerSatz: 60,
    });
    expect(r.einnahmenDelta).toBeCloseTo(0, 5);
  });
});

// ─── Windkraft & Solar (direkte Tests) ───────────────────────────────────────
describe("Windkraftausbau", () => {
  it("+50% Ausbau (100→150) erhöht ausgabenDelta um 6 Mrd.", () => {
    const r = computeKPIs("realistisch", 1.0, { ...DEFAULT_PARAMS, windausbau: 150 });
    expect(r.ausgabenDelta).toBeCloseTo(50 * 0.12, 5);
  });

  it("+50% Windausbau senkt CO₂ um 40 Mt", () => {
    const base = computeKPIs("realistisch", 1.0, DEFAULT_PARAMS);
    const mehr = computeKPIs("realistisch", 1.0, { ...DEFAULT_PARAMS, windausbau: 150 });
    expect(base.co2Emissionen - mehr.co2Emissionen).toBeCloseTo(40, 1);
  });
});

describe("Solarausbau", () => {
  it("+50% Ausbau (100→150) erhöht ausgabenDelta um 3 Mrd.", () => {
    const r = computeKPIs("realistisch", 1.0, { ...DEFAULT_PARAMS, solarausbau: 150 });
    expect(r.ausgabenDelta).toBeCloseTo(50 * 0.06, 5);
  });

  it("+50% Solarausbau senkt CO₂ um 15 Mt", () => {
    const base = computeKPIs("realistisch", 1.0, DEFAULT_PARAMS);
    const mehr = computeKPIs("realistisch", 1.0, { ...DEFAULT_PARAMS, solarausbau: 150 });
    expect(base.co2Emissionen - mehr.co2Emissionen).toBeCloseTo(15, 1);
  });
});

// ─── Atomkraft ───────────────────────────────────────────────────────────────
describe("Atomkraft", () => {
  it("'ausstieg' (Baseline) – keine Kosten-, Strom- oder CO₂-Änderung", () => {
    const r = computeKPIs("realistisch", 1.0, { ...DEFAULT_PARAMS, atomkraft: "ausstieg" });
    expect(r.ausgabenDelta).toBeCloseTo(0, 5);
    expect(r.strompreis).toBeCloseTo(32, 5);
  });

  it("'verlaengerung' – spart 1 Mrd. Ausgaben und senkt Strompreis um 2 ct/kWh", () => {
    const r = computeKPIs("realistisch", 1.0, { ...DEFAULT_PARAMS, atomkraft: "verlaengerung" });
    expect(r.ausgabenDelta).toBeCloseTo(-1, 5);
    expect(r.strompreis).toBeCloseTo(30, 5);
  });

  it("'neubau' – kostet 15 Mrd. Ausgaben und senkt Strompreis um 4 ct/kWh", () => {
    const r = computeKPIs("realistisch", 1.0, { ...DEFAULT_PARAMS, atomkraft: "neubau" });
    expect(r.ausgabenDelta).toBeCloseTo(15, 5);
    expect(r.strompreis).toBeCloseTo(28, 5);
  });
});

// ─── Kohleausstieg ───────────────────────────────────────────────────────────
describe("Kohleausstieg", () => {
  it("'2030' (Baseline) – keine CO₂- oder Strompreisänderung", () => {
    const r = computeKPIs("realistisch", 1.0, { ...DEFAULT_PARAMS, kohleausstieg: "2030" });
    expect(r.co2Emissionen).toBeCloseTo(670, 1);
    expect(r.strompreis).toBeCloseTo(32, 5);
  });

  it("'2035' – erhöht CO₂ um 25 Mt und senkt Strompreis um 1 ct/kWh", () => {
    const r = computeKPIs("realistisch", 1.0, { ...DEFAULT_PARAMS, kohleausstieg: "2035" });
    expect(r.co2Emissionen).toBeCloseTo(695, 1);
    expect(r.strompreis).toBeCloseTo(31, 5);
  });

  it("'2038' – erhöht CO₂ um 45 Mt", () => {
    const r = computeKPIs("realistisch", 1.0, { ...DEFAULT_PARAMS, kohleausstieg: "2038" });
    expect(r.co2Emissionen).toBeCloseTo(715, 1);
  });

  it("'offen' – erhöht CO₂ um 70 Mt (maximale Abweichung vom 2030-Ziel)", () => {
    const basis = computeKPIs("realistisch", 1.0, { ...DEFAULT_PARAMS, kohleausstieg: "2030" });
    const offen = computeKPIs("realistisch", 1.0, { ...DEFAULT_PARAMS, kohleausstieg: "offen" });
    expect(offen.co2Emissionen - basis.co2Emissionen).toBeCloseTo(70, 1);
  });
});

// ─── Wohngeld ────────────────────────────────────────────────────────────────
describe("Wohngeld", () => {
  it("+20pp Erhöhung kostet 1 Mrd. Ausgaben", () => {
    const r = computeKPIs("realistisch", 1.0, { ...DEFAULT_PARAMS, wohngeld: 20 });
    expect(r.ausgabenDelta).toBeCloseTo(20 * 0.05, 5);
  });

  it("+10pp Erhöhung kostet 0,5 Mrd.", () => {
    const r = computeKPIs("realistisch", 1.0, { ...DEFAULT_PARAMS, wohngeld: 10 });
    expect(r.ausgabenDelta).toBeCloseTo(0.5, 5);
  });

  it("Wohngeld-Erhöhung verschlechtert das Defizit", () => {
    const base = computeKPIs("realistisch", 1.0, DEFAULT_PARAMS);
    const erh  = computeKPIs("realistisch", 1.0, { ...DEFAULT_PARAMS, wohngeld: 50 });
    expect(erh.defizit).toBeLessThan(base.defizit);
  });
});

// ─── Kita-Ausbau ─────────────────────────────────────────────────────────────
describe("Kita-Ausbau", () => {
  it("Slider 50 erhöht ausgabenDelta um 6,5 Mrd.", () => {
    const r = computeKPIs("realistisch", 1.0, { ...DEFAULT_PARAMS, kitaAusbau: 50 });
    expect(r.ausgabenDelta).toBeCloseTo(50 * 0.13, 5);
  });

  it("Slider 50 erhöht das Wachstum um 0,04pp", () => {
    const base = computeKPIs("realistisch", 1.0, DEFAULT_PARAMS);
    const kita = computeKPIs("realistisch", 1.0, { ...DEFAULT_PARAMS, kitaAusbau: 50 });
    expect(kita.wachstum - base.wachstum).toBeCloseTo(50 * 0.0008, 5);
  });

  it("Vollausbau (Slider 100) kostet 13 Mrd.", () => {
    const r = computeKPIs("realistisch", 1.0, { ...DEFAULT_PARAMS, kitaAusbau: 100 });
    expect(r.ausgabenDelta).toBeCloseTo(13, 5);
  });
});

// ─── BAföG ───────────────────────────────────────────────────────────────────
describe("BAföG", () => {
  it("+10pp Erhöhung kostet 0,3 Mrd.", () => {
    const r = computeKPIs("realistisch", 1.0, { ...DEFAULT_PARAMS, bafoeg: 10 });
    expect(r.ausgabenDelta).toBeCloseTo(10 * 0.03, 5);
  });

  it("+50pp Erhöhung kostet 1,5 Mrd.", () => {
    const r = computeKPIs("realistisch", 1.0, { ...DEFAULT_PARAMS, bafoeg: 50 });
    expect(r.ausgabenDelta).toBeCloseTo(1.5, 5);
  });

  it("BAföG-Erhöhung verschlechtert das Defizit", () => {
    const base = computeKPIs("realistisch", 1.0, DEFAULT_PARAMS);
    const erh  = computeKPIs("realistisch", 1.0, { ...DEFAULT_PARAMS, bafoeg: 100 });
    expect(erh.defizit).toBeLessThan(base.defizit);
  });
});
