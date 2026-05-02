"use client";
import { useUsageStore, computeStats } from "@/lib/store";
import {
  getSimilarHouseholds,
  COUNTY_RESERVOIR,
  COUNTY_RESERVOIR_CAPACITY_AF,
  SOURCE_LABEL,
} from "@/lib/households";
import { Users, Droplets, BarChart2 } from "lucide-react";

function fmt(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toLocaleString();
}

export default function UsageTable() {
  const { entries } = useUsageStore();
  const stats = computeStats(entries);

  if (entries.length === 0) {
    return (
      <div className="rounded-xl bg-slate-900 border border-blue-900/60 p-10 text-center">
        <p className="text-slate-400 text-sm">No entries yet. Log your first month above.</p>
      </div>
    );
  }

  // Use most recent entry for the scaling panel
  const latest = entries[0];
  const similarHouseholds = getSimilarHouseholds(latest.county, latest.source);
  const scaledGallonsMonth = latest.gallonsPerMonth * similarHouseholds;
  const scaledAFMonth = scaledGallonsMonth / 325_851;
  const reservoirName = COUNTY_RESERVOIR[latest.county];
  const reservoirCapacity = COUNTY_RESERVOIR_CAPACITY_AF[latest.county];
  const pctOfReservoir = (scaledAFMonth / reservoirCapacity) * 100;

  return (
    <div className="space-y-6">
      {/* Summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Avg monthly usage",
            value: fmt(Math.round(entries.reduce((s, e) => s + e.gallonsPerMonth, 0) / entries.length)),
            unit: "gallons",
            icon: <Droplets className="h-4 w-4 text-sky-400" />,
          },
          {
            label: "Avg per person",
            value: Math.round(stats.avgGallonsPerPerson).toLocaleString(),
            unit: "gallons / person / month",
            icon: <Users className="h-4 w-4 text-sky-400" />,
          },
          {
            label: "Entries logged",
            value: stats.count.toString(),
            unit: "months recorded",
            icon: <BarChart2 className="h-4 w-4 text-sky-400" />,
          },
        ].map(({ label, value, unit, icon }) => (
          <div key={label} className="rounded-xl bg-slate-900 border border-blue-900/60 p-4">
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
              {icon}
              {label}
            </div>
            <div className="text-2xl font-bold text-white">{value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{unit}</div>
          </div>
        ))}
      </div>

      {/* Community Scale panel */}
      <div className="rounded-xl bg-gradient-to-br from-sky-900/20 to-slate-900 border border-sky-700/40 p-6">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-white">Community Scale</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            What if every <span className="text-sky-300 font-medium">{SOURCE_LABEL[latest.source]}</span> household
            in <span className="text-sky-300 font-medium">{latest.county} County</span> used the same as you?
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
          <div className="rounded-lg bg-slate-800/60 p-4 text-center">
            <div className="text-2xl font-bold text-white">{fmt(similarHouseholds)}</div>
            <div className="text-xs text-slate-400 mt-1">similar households in {latest.county} County</div>
          </div>
          <div className="rounded-lg bg-slate-800/60 p-4 text-center">
            <div className="text-2xl font-bold text-white">{fmt(Math.round(scaledGallonsMonth / 1_000_000))}M</div>
            <div className="text-xs text-slate-400 mt-1">gallons used per month combined</div>
          </div>
          <div className="rounded-lg bg-slate-800/60 p-4 text-center">
            <div className="text-2xl font-bold text-sky-400">{fmt(Math.round(scaledAFMonth))}</div>
            <div className="text-xs text-slate-400 mt-1">acre-feet per month combined</div>
          </div>
        </div>

        {/* Reservoir bar */}
        <div>
          <div className="flex justify-between text-xs text-slate-400 mb-1.5">
            <span>
              Monthly draw vs. <span className="text-white">{reservoirName}</span> total capacity
            </span>
            <span className="font-semibold text-sky-400">{pctOfReservoir.toFixed(2)}%</span>
          </div>
          <div className="h-3 w-full rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-sky-500 transition-all duration-700"
              style={{ width: `${Math.min(pctOfReservoir * 10, 100)}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 mt-2">
            At this rate, all similar households together would use{" "}
            <span className="text-slate-300 font-medium">{pctOfReservoir.toFixed(2)}%</span> of {reservoirName}&apos;s
            full capacity every month — about{" "}
            <span className="text-slate-300 font-medium">{Math.round(12 * pctOfReservoir)}%</span> per year.
          </p>
        </div>
      </div>

    </div>
  );
}
