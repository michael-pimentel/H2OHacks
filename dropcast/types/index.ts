export interface Reservoir {
  id: string;
  name: string;
  capacityAF: number;
}

export interface ReservoirDataPoint {
  date: string;
  storageAF: number;
}

export interface ReservoirWithData extends Reservoir {
  currentAF: number;
  percentFull: number;
  status: "healthy" | "watch" | "warning" | "critical";
  history: ReservoirDataPoint[];
  loading: boolean;
  dataSource: "live" | "estimated";
}

export type County = "Fresno" | "Tulare" | "Kings" | "Madera" | "Merced" | "San Joaquin";
export type WaterSource = "Canal" | "Groundwater" | "Mixed";

export interface HouseholdEntry {
  id: string;
  month: string;           // "YYYY-MM"
  label: string;           // optional nickname, e.g. "My home"
  county: County;
  people: number;
  gallonsPerMonth: number;
  source: WaterSource;
  notes: string;
}

/** @deprecated use HouseholdEntry */
export type UsageEntry = HouseholdEntry;

export interface PrecipDataPoint {
  month: string;
  inches: number;
}

export interface ForecastResult {
  day30: number;
  day60: number;
  day90: number;
  low: number[];
  high: number[];
  riskLevel: string;
}

export interface AlertCondition {
  id: string;
  title: string;
  description: string;
  severity: "healthy" | "watch" | "warning" | "critical";
  value: string;
  threshold: string;
}

export interface DroughtComparisonPoint {
  reservoir: string;
  current: number;
  drought2015: number;
  drought2021: number;
}
