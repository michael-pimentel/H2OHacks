import type { ReservoirDataPoint, PrecipDataPoint, DroughtComparisonPoint } from "@/types";

const RESERVOIRS = [
  { id: "MIL", name: "Millerton Lake", capacityAF: 520500 },
  { id: "SNL", name: "San Luis Reservoir", capacityAF: 2041000 },
  { id: "PNF", name: "Pine Flat Lake", capacityAF: 1000000 },
  { id: "TRM", name: "Terminus Reservoir", capacityAF: 148000 },
  { id: "ORO", name: "Lake Oroville", capacityAF: 3537577 },
];

export { RESERVOIRS };

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function addNoise(value: number, pct: number): number {
  return value * (1 + (Math.random() - 0.5) * pct);
}

// Generates 365 days of synthetic reservoir storage history
// Reflects: 2021-22 drought lows, 2023 recovery, moderate 2024-25 levels
export function generateReservoirHistory(
  capacityAF: number,
  stationId: string
): ReservoirDataPoint[] {
  const points: ReservoirDataPoint[] = [];
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 364);

  // Each station has slightly different drought/recovery profiles
  const profiles: Record<string, { droughtLow: number; recoveryPeak: number; current: number }> = {
    MIL: { droughtLow: 0.22, recoveryPeak: 0.78, current: 0.58 },
    SNL: { droughtLow: 0.18, recoveryPeak: 0.85, current: 0.62 },
    PNF: { droughtLow: 0.25, recoveryPeak: 0.82, current: 0.55 },
    TRM: { droughtLow: 0.20, recoveryPeak: 0.74, current: 0.50 },
    ORO: { droughtLow: 0.28, recoveryPeak: 0.91, current: 0.67 },
  };

  const profile = profiles[stationId] ?? { droughtLow: 0.23, recoveryPeak: 0.80, current: 0.58 };

  for (let i = 0; i < 365; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    const t = i / 364; // 0..1 across the year

    // The year starts ~May 2024 (moderate), trends through summer drawdown, then winter refill
    // Approximate seasonal sine wave with a general upward bias from drought recovery
    const seasonal = Math.sin((t * 2 * Math.PI) - Math.PI / 2) * 0.08; // ±8% swing
    const base = lerp(profile.current - 0.05, profile.current + 0.05, t) + seasonal;
    const pct = Math.max(0.08, Math.min(0.98, addNoise(base, 0.04)));

    points.push({
      date: d.toISOString().slice(0, 10),
      storageAF: Math.round(capacityAF * pct),
    });
  }

  return points;
}

export function getPrecipData(): PrecipDataPoint[] {
  const months = [
    "Jun", "Jul", "Aug", "Sep", "Oct", "Nov",
    "Dec", "Jan", "Feb", "Mar", "Apr", "May",
  ];
  // Typical Central Valley precipitation (inches) — dry summers, wet winters
  const baseline = [0.05, 0.02, 0.03, 0.15, 0.8, 2.1, 3.2, 3.8, 4.1, 2.9, 1.2, 0.4];
  return months.map((month, i) => ({
    month,
    inches: parseFloat((baseline[i] * (0.9 + Math.random() * 0.2)).toFixed(2)),
  }));
}

export function getDroughtComparisonData(): DroughtComparisonPoint[] {
  return RESERVOIRS.map((r) => {
    const profiles: Record<string, { d2015: number; d2021: number; cur: number }> = {
      MIL: { d2015: 0.19, d2021: 0.22, cur: 0.58 },
      SNL: { d2015: 0.12, d2021: 0.18, cur: 0.62 },
      PNF: { d2015: 0.21, d2021: 0.25, cur: 0.55 },
      TRM: { d2015: 0.17, d2021: 0.20, cur: 0.50 },
      ORO: { d2015: 0.23, d2021: 0.28, cur: 0.67 },
    };
    const p = profiles[r.id] ?? { d2015: 0.20, d2021: 0.23, cur: 0.58 };
    return {
      reservoir: r.name.replace(" Reservoir", "").replace(" Lake", ""),
      current: Math.round(p.cur * 100),
      drought2015: Math.round(p.d2015 * 100),
      drought2021: Math.round(p.d2021 * 100),
    };
  });
}
