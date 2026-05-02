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
}

export type County = "Fresno" | "Tulare" | "Kings" | "Madera" | "Merced";
export type CropType =
  | "Almonds"
  | "Pistachios"
  | "Grapes"
  | "Cotton"
  | "Wheat"
  | "Tomatoes"
  | "Citrus"
  | "Other";
export type WaterSource = "Canal" | "Groundwater" | "Mixed";

export interface UsageEntry {
  id: string;
  date: string;
  farmName: string;
  county: County;
  acres: number;
  cropType: CropType;
  waterUsedAF: number;
  source: WaterSource;
  notes: string;
}

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
