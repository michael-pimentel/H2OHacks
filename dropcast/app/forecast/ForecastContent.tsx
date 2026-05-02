"use client";
import { useMemo, useState } from "react";
import { useUsageStore, computeStats } from "@/lib/store";
import { forecastEngine } from "@/lib/forecast";
import { getSeededReservoirs } from "@/lib/cdec";
import ForecastChart from "@/components/ForecastChart";
import { Info } from "lucide-react";

const SEEDED = getSeededReservoirs();

export default function ForecastPageContent() {
  const entries = useUsageStore((s) => s.entries);
  const stats = computeStats(entries);

  const [selectedId, setSelectedId] = useState(SEEDED[0].id);
  const reservoir = SEEDED.find((r) => r.id === selectedId) ?? SEEDED[0];

  const forecast = useMemo(() => {
    const storageHistory = reservoir.history.map((p) => p.storageAF);
    const month = new Date().getMonth() + 1;
    return forecastEngine({
      storageHistory,
      userDailyUsageAF: stats.dailyAF,
      month,
      capacityAF: reservoir.capacityAF,
    });
  }, [reservoir, stats.dailyAF]);

  return (
    <div className="space-y-6">
      {/* Model info banner */}
      <div className="rounded-xl bg-slate-900 border border-blue-900/60 p-4 flex items-start gap-3">
        <Info className="h-4 w-4 text-sky-400 mt-0.5 shrink-0" />
        <div className="text-xs text-slate-400 leading-relaxed">
          <span className="text-white font-medium">Baseline model</span> uses a linear trend over the last 30 days of reservoir data,
          adjusted for seasonal evaporation coefficients and your logged daily usage (
          <span className="text-sky-400">{stats.dailyAF.toFixed(2)} AF/day</span> from {stats.count} logged entries).
          Replace <code className="bg-slate-800 px-1 rounded text-sky-300">forecastEngine()</code> in{" "}
          <code className="bg-slate-800 px-1 rounded text-sky-300">lib/forecast.ts</code> to plug in a DNN or external model API.
        </div>
      </div>

      {/* Reservoir selector */}
      <div className="flex flex-wrap gap-2">
        {SEEDED.map((r) => (
          <button
            key={r.id}
            onClick={() => setSelectedId(r.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedId === r.id
                ? "bg-sky-500/20 text-sky-400 ring-1 ring-sky-500/40"
                : "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
            }`}
          >
            {r.name}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="rounded-xl bg-slate-900 border border-blue-900/60 p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-white">{reservoir.name}</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {reservoir.percentFull}% full · {(reservoir.currentAF / 1000).toFixed(0)}K AF current storage
            </p>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-400">Capacity</div>
            <div className="text-sm font-semibold text-white">
              {(reservoir.capacityAF / 1_000_000).toFixed(2)}M AF
            </div>
          </div>
        </div>

        <ForecastChart reservoir={reservoir} forecast={forecast} />
      </div>

      {/* Usage context */}
      {entries.length === 0 && (
        <div className="rounded-xl bg-amber-500/5 border border-amber-500/20 p-4 text-xs text-amber-400">
          No usage entries logged yet. Visit the{" "}
          <a href="/usage" className="underline hover:text-amber-300">Usage page</a> to log water use — it will
          refine the forecast by subtracting your daily consumption from projected storage.
        </div>
      )}
    </div>
  );
}
