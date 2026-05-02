// TODO: Replace forecastEngine() with DNN/AI model API call
// Expected input/output shape is defined above — plug in here
// Input:  { storageHistory: number[], userDailyUsageAF: number, month: number }
// Output: { day30: number, day60: number, day90: number, low: number[], high: number[], riskLevel: string }

import type { ForecastResult } from "@/types";

// Summer months have higher evaporation loss
const SEASONAL_COEFFICIENTS: Record<number, number> = {
  1: -0.0008,  // Jan  — wet season, slight recovery
  2: -0.0006,
  3: -0.0002,
  4: 0.0005,   // Apr — spring drawdown begins
  5: 0.0012,
  6: 0.0020,   // Jun  — peak evaporation / irrigation demand
  7: 0.0025,
  8: 0.0022,
  9: 0.0018,
  10: 0.0008,
  11: -0.0002, // Nov — winter recharge begins
  12: -0.0010,
};

function linearSlope(values: number[]): number {
  const n = values.length;
  if (n < 2) return 0;
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
  for (let i = 0; i < n; i++) {
    sumX += i;
    sumY += values[i];
    sumXY += i * values[i];
    sumX2 += i * i;
  }
  return (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
}

function getRiskLevel(pctFull: number): string {
  if (pctFull >= 60) return "low";
  if (pctFull >= 45) return "moderate";
  if (pctFull >= 30) return "elevated";
  return "critical";
}

export function forecastEngine({
  storageHistory,
  userDailyUsageAF,
  month,
  capacityAF,
}: {
  storageHistory: number[];
  userDailyUsageAF: number;
  month: number;
  capacityAF: number;
}): ForecastResult {
  const window30 = storageHistory.slice(-30);
  const trendPerDay = linearSlope(window30);
  const seasonal = SEASONAL_COEFFICIENTS[month] ?? 0;
  const currentStorage = storageHistory[storageHistory.length - 1] ?? 0;

  const dailyDelta = trendPerDay - seasonal * capacityAF - userDailyUsageAF;

  const project = (days: number): number =>
    Math.max(0, Math.min(capacityAF, currentStorage + dailyDelta * days));

  const CONFIDENCE = 0.15;
  const points90: number[] = [];
  const lows: number[] = [];
  const highs: number[] = [];

  for (let d = 1; d <= 90; d++) {
    const val = project(d);
    points90.push(val);
    lows.push(val * (1 - CONFIDENCE));
    highs.push(val * (1 + CONFIDENCE));
  }

  const day30 = points90[29];
  const day60 = points90[59];
  const day90 = points90[89];

  const pctAt90 = (day90 / capacityAF) * 100;

  return {
    day30,
    day60,
    day90,
    low: lows,
    high: highs,
    riskLevel: getRiskLevel(pctAt90),
  };
}
