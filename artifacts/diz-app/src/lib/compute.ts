import { ScenarioMode } from "@/components/simulator/types";

export const BEAMTE_DELAY   = 0.30;
export const FK_INTEGRATION = 0.80;
export const RENTE_RISK     = 0.82;

export type Schuldenbremse = "aktuell" | "reformiert" | "ausgesetzt" | "abgeschafft";
export type Atomkraft      = "ausstieg" | "statusquo" | "verlaengerung" | "neubau";
export type Kohleausstieg  = "2030" | "2035" | "2038" | "offen";
export type VmBetrieb      = "voll" | "halb" | "befreit";

export interface ComputeParams {
  beamte: number; ministerien: number; verteidigung: number; entwicklung: number;
  fluechtlinge: number; fachkraefte: number; beitragssatz: number;
  buergergeld: number; rentenalter: number; rentenniveau: number;
  einkommensteuer: number; unternehmenssteuer: number;
  vermoegenssteuer: boolean; erbschaftssteuer: number;
  einheitsversicherung: boolean; privatAbschaffen: boolean;
  euZuwanderung: boolean;
  vmFreibetrag: number; vmRate: number; vmBetrieb: VmBetrieb;
  estSpitzenbeginn: number;
  reichensteuerAktiv: boolean; reichensteuerSchwelle: number; reichensteuerSatz: number;
  schuldenbremse: Schuldenbremse;
  co2Preis: number; windausbau: number; solarausbau: number;
  atomkraft: Atomkraft; kohleausstieg: Kohleausstieg;
  sozialwohnungen: number; mietpreisbremse: boolean; wohngeld: number;
  bildungsausgaben: number; kitaAusbau: number; bafoeg: number;
}

export const DEFAULT_PARAMS: ComputeParams = {
  beamte: 4900, ministerien: 16, verteidigung: 2.0, entwicklung: 0.4,
  fluechtlinge: 180, fachkraefte: 200, beitragssatz: 14.6,
  buergergeld: 502, rentenalter: 67, rentenniveau: 48,
  einkommensteuer: 42, unternehmenssteuer: 29.9,
  vermoegenssteuer: false, erbschaftssteuer: 400,
  einheitsversicherung: false, privatAbschaffen: false,
  euZuwanderung: true,
  vmFreibetrag: 1, vmRate: 1.0, vmBetrieb: "halb",
  estSpitzenbeginn: 80,
  reichensteuerAktiv: false, reichensteuerSchwelle: 250, reichensteuerSatz: 47,
  schuldenbremse: "aktuell",
  co2Preis: 60, windausbau: 100, solarausbau: 100,
  atomkraft: "ausstieg", kohleausstieg: "2030",
  sozialwohnungen: 30, mietpreisbremse: false, wohngeld: 0,
  bildungsausgaben: 4.3, kitaAusbau: 0, bafoeg: 0,
};

export function computeKPIs(s: ScenarioMode, smVal: number, params: ComputeParams) {
  const {
    beamte, ministerien, verteidigung, entwicklung, fluechtlinge, fachkraefte,
    beitragssatz, buergergeld, rentenalter, rentenniveau, einkommensteuer,
    unternehmenssteuer, vermoegenssteuer, erbschaftssteuer, einheitsversicherung, privatAbschaffen,
    euZuwanderung,
    vmFreibetrag, vmRate, vmBetrieb,
    estSpitzenbeginn, reichensteuerAktiv, reichensteuerSchwelle, reichensteuerSatz,
    schuldenbremse,
    co2Preis, windausbau, solarausbau, atomkraft, kohleausstieg,
    sozialwohnungen, mietpreisbremse, wohngeld,
    bildungsausgaben, kitaAusbau, bafoeg,
  } = params;

  const vmFreibetragF = vmFreibetrag === 1 ? 1.4 : vmFreibetrag === 2 ? 1.0 : vmFreibetrag === 5 ? 0.6 : vmFreibetrag === 10 ? 0.38 : 0.22;
  const vmRateF       = vmRate === 0.5 ? 0.5 : vmRate === 1.0 ? 1.0 : vmRate === 1.5 ? 1.35 : vmRate === 2.0 ? 1.6 : 1.8;
  const vmBetriebF    = vmBetrieb === "voll" ? 1.0 : vmBetrieb === "halb" ? 0.75 : 0.5;
  const vmScenF       = s === "optimistisch" ? 0.90 : s === "realistisch" ? 0.72 : 0.50;
  const vmEinnahmen   = vermoegenssteuer ? 8 * vmFreibetragF * vmRateF * vmBetriebF * vmScenF : 0;

  const estSchwelleDelta = -(estSpitzenbeginn - 80) * 0.036;

  const rStThreshF   = reichensteuerSchwelle === 250 ? 1.0 : reichensteuerSchwelle === 500 ? 0.42 : 0.18;
  const rStRateF     = Math.max(0, (reichensteuerSatz - 45) / 5);
  const rStEmigr     = reichensteuerAktiv && reichensteuerSatz >= 55 ? (reichensteuerSatz - 50) * 0.4 : 0;
  const rStEinnahmen = reichensteuerAktiv
    ? Math.max(0, 3 * rStThreshF * rStRateF * (s === "optimistisch" ? 0.85 : s === "realistisch" ? 0.68 : 0.45) - rStEmigr)
    : 0;

  const schdbMap: Record<Schuldenbremse, { ausgaben: number; growth: number; zinsen: number; invest: number }> = {
    aktuell:    { ausgaben:  0, growth: 0,    zinsen:  0, invest:  0 },
    reformiert: { ausgaben: 20, growth: 0.12, zinsen:  2, invest: 18 },
    ausgesetzt: { ausgaben: 50, growth: 0.18, zinsen:  6, invest: 44 },
    abgeschafft:{ ausgaben: 80, growth: 0.10, zinsen: 14, invest: 66 },
  };
  const schdb = schdbMap[schuldenbremse];

  const co2Delta         = co2Preis - 60;
  const co2EinnahmenD    = co2Delta * 0.018;
  const windDelta        = windausbau - 100;
  const solarDelta       = solarausbau - 100;
  const erneuerbareAusg  = windDelta * 0.12 + solarDelta * 0.06;
  const atomEffekt       = atomkraft === "verlaengerung" ? { stromD: -2, emD: -20, ausgD: -1 }
                         : atomkraft === "neubau"        ? { stromD: -4, emD: -50, ausgD: 15 }
                         : { stromD: 0, emD: 0, ausgD: 0 };
  const kohleEffekt      = kohleausstieg === "2035" ? { stromD: -1, emD:  25 }
                         : kohleausstieg === "2038" ? { stromD: -2, emD:  45 }
                         : kohleausstieg === "offen"? { stromD: -3, emD:  70 }
                         : { stromD: 0, emD: 0 };
  const co2GrowthEffect  = -(Math.max(0, co2Delta) * 0.002);
  const co2Emissionen    = Math.max(0, 670 - co2Delta * 1.8 - windDelta * 0.8 - solarDelta * 0.3 + atomEffekt.emD + kohleEffekt.emD);
  const strompreis       = Math.max(8, 32 + co2Delta * 0.02 - windDelta * 0.025 - solarDelta * 0.01 + atomEffekt.stromD + kohleEffekt.stromD);

  const sozWohnAusg  = (sozialwohnungen - 30) * 0.045;
  const wohngeldAusg = wohngeld * 0.05;
  const mietindex    = Math.max(60, 100 - (sozialwohnungen - 30) * 0.15 + (mietpreisbremse ? -5 : 0));
  const wohnraumdef  = Math.max(0, 700 - sozialwohnungen * 1.5 + (mietpreisbremse ? 20 : 0));

  const bildAusg        = (bildungsausgaben - 4.3) * 43.06;
  const kitaAusg        = kitaAusbau * 0.13;
  const bafoegAusg      = bafoeg * 0.03;
  const bildGrowthEff   = (bildungsausgaben - 4.3) * 0.015 + kitaAusbau * 0.0008;
  const bildFachluecke  = -(bildungsausgaben - 4.3) * 60;

  const vertDelta          = verteidigung - 2.0;
  const defenseGrowthImpact = s === "optimistisch" ? vertDelta * 0.3 : s === "realistisch" ? 0 : vertDelta * -0.2;

  const ausgabenDelta =
    vertDelta                     * 43.06  +
    (entwicklung  - 0.4)          * 43.06  +
    (beamte       - 4900)         * 0.072 * BEAMTE_DELAY +
    (ministerien  - 16)           * 0.8   +
    (fluechtlinge - 180)          * 0.018 +
    (buergergeld  - 502)          * 0.066 +
    (rentenniveau - 48)           * 4.0   -
    (rentenalter  - 67)           * 18.5  * RENTE_RISK -
    (beitragssatz - 14.6)         * 4.0   +
    (einheitsversicherung ? 18 : 0) +
    (privatAbschaffen     ? 11 : 0) +
    schdb.ausgaben + schdb.zinsen  +
    erneuerbareAusg                +
    atomEffekt.ausgD               +
    sozWohnAusg                    +
    wohngeldAusg                   +
    bildAusg + kitaAusg + bafoegAusg;

  const einnahmenDelta =
    (einkommensteuer    - 42)     * 3.2   +
    (fachkraefte        - 200)    * 0.0145 * FK_INTEGRATION +
    vmEinnahmen                            +
    (unternehmenssteuer - 29.9)   * 3.0   +
    (400 - erbschaftssteuer)      * 0.005 +
    (einheitsversicherung ? 22 : 0) +
    (privatAbschaffen     ?  7 : 0) +
    (euZuwanderung        ?  0 : -10) +
    co2EinnahmenD + rStEinnahmen + estSchwelleDelta;

  const netDelta = (ausgabenDelta - einnahmenDelta) * smVal;
  const defizit  = -(34.2 + netDelta);

  const alq = Math.max(0,
    5.7
    - (fachkraefte - 200)  * 0.003
    + (buergergeld - 502)  * 0.0015
    + (rentenalter - 67)   * 0.05
    + (euZuwanderung ? 0 : 0.2));

  const wachstum = (
    0.8
    + (fachkraefte        - 200)  * 0.0008
    + defenseGrowthImpact
    - (einkommensteuer    - 42)   * 0.008
    - (unternehmenssteuer - 29.9) * 0.015
    - (beamte             - 4900) * 0.00002
    - (euZuwanderung ? 0 : 0.35)
    + schdb.growth
    + co2GrowthEffect
    + bildGrowthEff
  ) * smVal;

  const chainSteuer  = (wachstum - 0.8) * 20 - (alq - 5.7) * 15;
  const steuer       = 948 + einnahmenDelta * smVal + chainSteuer;
  const rentenKosten = 362 + (rentenniveau - 48) * 4 - (rentenalter - 67) * 18.5 * RENTE_RISK;
  const fachluecke   = Math.max(0, 890 - (fachkraefte - 200) * 1.5 + (euZuwanderung ? 0 : 180) + bildFachluecke);

  return {
    defizit, steuer, alq, wachstum, rentenKosten, fachluecke,
    einnahmenDelta, ausgabenDelta,
    co2Emissionen, strompreis, mietindex, wohnraumdef,
    schdbInvest: schdb.invest,
  };
}
