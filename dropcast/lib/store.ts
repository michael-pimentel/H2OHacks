"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UsageEntry } from "@/types";

interface UsageStore {
  entries: UsageEntry[];
  addEntry: (entry: UsageEntry) => void;
  removeEntry: (id: string) => void;
}

export const useUsageStore = create<UsageStore>()(
  persist(
    (set) => ({
      entries: [],
      addEntry: (entry) =>
        set((state) => ({ entries: [entry, ...state.entries] })),
      removeEntry: (id) =>
        set((state) => ({ entries: state.entries.filter((e) => e.id !== id) })),
    }),
    { name: "dropcast-usage" }
  )
);

export function computeStats(entries: UsageEntry[]) {
  const totalAF = entries.reduce((sum, e) => sum + e.waterUsedAF, 0);
  const totalAcres = entries.reduce((sum, e) => sum + e.acres, 0);
  const avgAFPerAcre = totalAcres > 0 ? totalAF / totalAcres : 0;

  // Estimate average daily usage across the logged period
  const dates = entries.map((e) => new Date(e.date).getTime());
  const spanDays =
    dates.length >= 2
      ? (Math.max(...dates) - Math.min(...dates)) / 86400000 + 1
      : 1;
  const dailyAF = totalAF / spanDays;

  return { totalAF, avgAFPerAcre, count: entries.length, dailyAF };
}
