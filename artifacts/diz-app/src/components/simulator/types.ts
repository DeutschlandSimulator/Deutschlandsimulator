export type EvidenzLevel = "hoch" | "mittel" | "gering";
export type ScenarioMode = "optimistisch" | "realistisch" | "pessimistisch";

export interface SliderInfo {
  titel: string;
  beschreibung: string;
  aktuellerWert: string;
  berechnungslogik: string;
  annahmen: string[];
  quellen: { name: string; url: string; aktualisiert: string }[];
  evidenz: EvidenzLevel;
  evidenzHinweis: string;
}

export interface KPIMeta {
  label: string;
  value: string;
  color: string;
  sparkPoints: string;
  sparkColor: string;
  source: string;
  updated: string;
  confidence: EvidenzLevel;
}
