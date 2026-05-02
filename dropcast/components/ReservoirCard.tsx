"use client";
import { ResponsiveContainer, AreaChart, Area, Tooltip } from "recharts";
import type { ReservoirWithData } from "@/types";

const STATUS_COLORS: Record<ReservoirWithData["status"], string> = {
  healthy: "#10b981",
  watch: "#0ea5e9",
  warning: "#f59e0b",
  critical: "#ef4444",
};

const STATUS_BG: Record<ReservoirWithData["status"], string> = {
  healthy: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/30",
  watch: "bg-sky-500/10 text-sky-400 ring-sky-500/30",
  warning: "bg-amber-500/10 text-amber-400 ring-amber-500/30",
  critical: "bg-red-500/10 text-red-400 ring-red-500/30",
};

interface Props {
  reservoir: ReservoirWithData;
}

export default function ReservoirCard({ reservoir }: Props) {
  const last90 = reservoir.history.slice(-90).map((p) => ({
    date: p.date,
    val: p.storageAF,
  }));

  const color = STATUS_COLORS[reservoir.status];

  const formatAF = (n: number) => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
    return n.toFixed(0);
  };

  return (
    <div className="rounded-xl bg-slate-900 border border-blue-900/60 p-5 flex flex-col gap-3 hover:border-blue-700/60 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-white leading-tight">{reservoir.name}</h3>
        <span
          className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ring-1 capitalize ${STATUS_BG[reservoir.status]}`}
        >
          {reservoir.status}
        </span>
      </div>

      <div>
        <div className="text-2xl font-bold text-white">
          {formatAF(reservoir.currentAF)}{" "}
          <span className="text-sm font-normal text-slate-400">acre-feet stored</span>
        </div>
        <div className="text-xs text-slate-400 mt-0.5">
          out of {formatAF(reservoir.capacityAF)} acre-feet total capacity
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${reservoir.percentFull}%`, backgroundColor: color }}
        />
      </div>
      <div className="text-right text-xs font-semibold" style={{ color }}>
        {reservoir.percentFull}% full
      </div>

      {/* Sparkline */}
      <div className="h-16">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={last90} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
            <defs>
              <linearGradient id={`spark-${reservoir.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="val"
              stroke={color}
              strokeWidth={1.5}
              fill={`url(#spark-${reservoir.id})`}
              dot={false}
              isAnimationActive={true}
              animationDuration={800}
            />
            <Tooltip
              contentStyle={{
                background: "#0f172a",
                border: "1px solid rgba(30,58,138,0.6)",
                borderRadius: "6px",
                fontSize: "11px",
                color: "#f1f5f9",
              }}
              formatter={(val) => [`${formatAF(Number(val))} acre-feet`, "Water stored"]}
              labelFormatter={(label) => label}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center justify-between -mt-1">
        <div className="text-xs text-slate-500">Last 90 days</div>
        <div className={`text-xs px-1.5 py-0.5 rounded font-medium ${
          reservoir.dataSource === "live"
            ? "bg-emerald-500/10 text-emerald-400"
            : "bg-slate-700/60 text-slate-400"
        }`}>
          {reservoir.dataSource === "live" ? "Live data" : "Estimated"}
        </div>
      </div>
    </div>
  );
}

export function ReservoirCardSkeleton() {
  return (
    <div className="rounded-xl bg-slate-900 border border-blue-900/60 p-5 flex flex-col gap-3 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="h-4 w-32 rounded bg-slate-800" />
        <div className="h-5 w-16 rounded-full bg-slate-800" />
      </div>
      <div className="h-8 w-24 rounded bg-slate-800" />
      <div className="h-1.5 w-full rounded-full bg-slate-800" />
      <div className="h-16 w-full rounded bg-slate-800" />
    </div>
  );
}
