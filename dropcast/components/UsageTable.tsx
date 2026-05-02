"use client";
import { useUsageStore, computeStats } from "@/lib/store";
import { Trash2 } from "lucide-react";

export default function UsageTable() {
  const { entries, removeEntry } = useUsageStore();
  const stats = computeStats(entries);

  if (entries.length === 0) {
    return (
      <div className="rounded-xl bg-slate-900 border border-blue-900/60 p-10 text-center">
        <p className="text-slate-400 text-sm">No usage entries yet. Log your first entry above.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total AF Logged", value: stats.totalAF.toFixed(2), unit: "AF" },
          { label: "Avg AF / Acre", value: stats.avgAFPerAcre.toFixed(3), unit: "AF/ac" },
          { label: "Total Entries", value: stats.count.toString(), unit: "records" },
        ].map(({ label, value, unit }) => (
          <div key={label} className="rounded-xl bg-slate-900 border border-blue-900/60 p-4">
            <div className="text-xs text-slate-400 mb-1">{label}</div>
            <div className="text-2xl font-bold text-white">{value}</div>
            <div className="text-xs text-slate-500">{unit}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl bg-slate-900 border border-blue-900/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-blue-900/40 bg-slate-800/50">
                {["Date", "Farm", "County", "Crop", "Acres", "AF Used", "AF/Acre", "Source", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, i) => (
                <tr
                  key={entry.id}
                  className={`border-b border-blue-900/20 hover:bg-slate-800/40 transition-colors ${
                    i % 2 === 0 ? "bg-transparent" : "bg-slate-800/20"
                  }`}
                >
                  <td className="px-4 py-3 text-slate-300 whitespace-nowrap">{entry.date}</td>
                  <td className="px-4 py-3 text-white font-medium whitespace-nowrap">{entry.farmName}</td>
                  <td className="px-4 py-3 text-slate-300 whitespace-nowrap">{entry.county}</td>
                  <td className="px-4 py-3 text-slate-300 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 text-xs ring-1 ring-sky-500/20">
                      {entry.cropType}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-300">{entry.acres.toFixed(1)}</td>
                  <td className="px-4 py-3 text-white font-medium">{entry.waterUsedAF.toFixed(2)}</td>
                  <td className="px-4 py-3 text-slate-300">{(entry.waterUsedAF / entry.acres).toFixed(3)}</td>
                  <td className="px-4 py-3 text-slate-300">
                    <span className={`px-2 py-0.5 rounded-full text-xs ring-1 ${
                      entry.source === "Canal"
                        ? "bg-sky-500/10 text-sky-400 ring-sky-500/20"
                        : entry.source === "Groundwater"
                        ? "bg-amber-500/10 text-amber-400 ring-amber-500/20"
                        : "bg-purple-500/10 text-purple-400 ring-purple-500/20"
                    }`}>
                      {entry.source}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => removeEntry(entry.id)}
                      className="text-slate-600 hover:text-red-400 transition-colors"
                      title="Remove entry"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
