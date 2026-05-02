"use client";
import { useMemo, useState } from "react";
import { useUsageStore, computeStats } from "@/lib/store";
import { forecastEngine } from "@/lib/forecast";
import { getSeededReservoirs } from "@/lib/cdec";
import ForecastChart from "@/components/ForecastChart";

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
              {reservoir.percentFull}% full · {(reservoir.currentAF / 1000).toFixed(0)}K acre-feet current storage
            </p>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-400">Capacity</div>
            <div className="text-sm font-semibold text-white">
              {(reservoir.capacityAF / 1_000_000).toFixed(2)}M acre-feet
            </div>
          </div>
        </div>

        <ForecastChart reservoir={reservoir} forecast={forecast} />
      </div>

    </div>
  );
}
