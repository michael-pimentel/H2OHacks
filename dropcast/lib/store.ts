"use client";
import { create } from "zustand";
import type { HouseholdEntry } from "@/types";

interface UsageStore {
  entries: HouseholdEntry[];
  addEntry: (entry: HouseholdEntry) => void;
  removeEntry: (id: string) => void;
}

export const useUsageStore = create<UsageStore>()((set) => ({
  entries: [],
  addEntry: (entry) =>
    set((state) => ({ entries: [entry, ...state.entries] })),
  removeEntry: (id) =>
    set((state) => ({ entries: state.entries.filter((e) => e.id !== id) })),
}));

export function computeStats(entries: HouseholdEntry[]) {
  const count = entries.length;
  if (count === 0) return { totalAF: 0, avgGallonsPerPerson: 0, count: 0, dailyAF: 0 };

  const avgGallonsMonth =
    entries.reduce((sum, e) => sum + e.gallonsPerMonth, 0) / count;
  const avgPeople =
    entries.reduce((sum, e) => sum + e.people, 0) / count;
  const avgGallonsPerPerson = avgPeople > 0 ? avgGallonsMonth / avgPeople : 0;

  // 1 acre-foot = 325,851 gallons; forecast engine expects AF/day
  const dailyAF = avgGallonsMonth / 325_851 / 30.44;
  const totalAF = entries.reduce((sum, e) => sum + e.gallonsPerMonth / 325_851, 0);

  return { totalAF, avgGallonsPerPerson, count, dailyAF };
}
