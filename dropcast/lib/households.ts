import type { County, WaterSource } from "@/types";

// Approximate household counts by county (2020 Census)
export const COUNTY_HOUSEHOLDS: Record<County, number> = {
  Fresno:      320_000,
  Tulare:      125_000,
  Kings:        38_000,
  Madera:       45_000,
  Merced:       78_000,
  "San Joaquin": 244_000,
};

// Fraction of households primarily on each source (estimated from SWRCB data)
export const SOURCE_FRACTION: Record<County, Record<WaterSource, number>> = {
  Fresno:        { Canal: 0.55, Groundwater: 0.30, Mixed: 0.15 },
  Tulare:        { Canal: 0.45, Groundwater: 0.42, Mixed: 0.13 },
  Kings:         { Canal: 0.50, Groundwater: 0.38, Mixed: 0.12 },
  Madera:        { Canal: 0.42, Groundwater: 0.45, Mixed: 0.13 },
  Merced:        { Canal: 0.52, Groundwater: 0.35, Mixed: 0.13 },
  // Stockton / San Joaquin: heavily Delta surface water, some groundwater
  "San Joaquin": { Canal: 0.62, Groundwater: 0.25, Mixed: 0.13 },
};

export const COUNTY_RESERVOIR: Record<County, string> = {
  Fresno:        "Millerton Lake",
  Tulare:        "Terminus Reservoir",
  Kings:         "Pine Flat Lake",
  Madera:        "Millerton Lake",
  Merced:        "San Luis Reservoir",
  "San Joaquin": "New Hogan Lake",
};

export const COUNTY_RESERVOIR_CAPACITY_AF: Record<County, number> = {
  Fresno:          520_500,
  Tulare:          148_000,
  Kings:         1_000_000,
  Madera:          520_500,
  Merced:        2_041_000,
  "San Joaquin":   317_000,
};

export function getSimilarHouseholds(county: County, source: WaterSource): number {
  return Math.round(COUNTY_HOUSEHOLDS[county] * SOURCE_FRACTION[county][source]);
}

export const SOURCE_LABEL: Record<WaterSource, string> = {
  Canal:       "City / Canal Water",
  Groundwater: "Well / Groundwater",
  Mixed:       "Both (Mixed)",
};
