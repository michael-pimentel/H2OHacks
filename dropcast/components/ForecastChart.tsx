"use client";
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { ReservoirWithData } from "@/types";
import type { ForecastResult } from "@/types";

interface DataPoint {
  label: string;
  historical?: number;
  forecast?: number;
  low?: number;
  high?: number;
  isProjected: boolean;
}

interface Props {
  reservoir: ReservoirWithData;
  forecast: ForecastResult;
}

function formatAF(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toFixed(0);
}

export default function ForecastChart({ reservoir, forecast }: Props) {
  const history = reservoir.history.slice(-90);
  const capacity = reservoir.capacityAF;
  const threshold50 = capacity * 0.5;
  const threshold30 = capacity * 0.3;

  const data: DataPoint[] = [
    ...history.map((p) => ({
      label: p.date.slice(5),
      historical: p.storageAF,
      isProjected: false,
    })),
  ];

  // Add 90 projected days
  for (let d = 0; d < 90; d++) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + d + 1);
    const label = futureDate.toISOString().slice(5, 10);
    data.push({
      label,
      forecast: forecast.low[d] + (forecast.high[d] - forecast.low[d]) / 2,
      low: forecast.low[d],
      high: forecast.high[d],
      isProjected: true,
    });
  }

  // Downsample for display (show every 3rd point to avoid overcrowding)
  const displayData = data.filter((_, i) => i % 3 === 0 || i === data.length - 1);

  const RISK_COLOR: Record<string, string> = {
    low: "#10b981",
    moderate: "#0ea5e9",
    elevated: "#f59e0b",
    critical: "#ef4444",
  };
  const riskColor = RISK_COLOR[forecast.riskLevel] ?? "#0ea5e9";

  return (
    <div className="w-full">
      {/* Risk badge */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xs text-slate-400 uppercase tracking-wider">90-day risk:</span>
        <span
          className="text-sm font-semibold capitalize px-3 py-1 rounded-full ring-1"
          style={{ color: riskColor, backgroundColor: `${riskColor}18`, outline: `1px solid ${riskColor}40` }}
        >
          {forecast.riskLevel}
        </span>
        <span className="text-xs text-slate-500">
          Projected at {formatAF(forecast.day90)} AF ({Math.round((forecast.day90 / capacity) * 100)}% capacity)
        </span>
      </div>

      <ResponsiveContainer width="100%" height={340}>
        <ComposedChart data={displayData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
          <defs>
            <linearGradient id="histGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="confGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={riskColor} stopOpacity={0.15} />
              <stop offset="95%" stopColor={riskColor} stopOpacity={0.05} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis
            dataKey="label"
            tick={{ fill: "#64748b", fontSize: 10 }}
            tickLine={false}
            interval={14}
          />
          <YAxis
            tickFormatter={(v) => formatAF(v as number)}
            tick={{ fill: "#64748b", fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            width={55}
          />
          <Tooltip
            contentStyle={{
              background: "#0f172a",
              border: "1px solid rgba(30,58,138,0.6)",
              borderRadius: "8px",
              fontSize: "12px",
              color: "#f1f5f9",
            }}
            formatter={(val, name) => {
              const labels: Record<string, string> = {
                historical: "Historical",
                forecast: "Projected",
                high: "Upper band",
                low: "Lower band",
              };
              return [`${formatAF(Number(val))} AF`, labels[String(name)] ?? String(name)];
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: "12px", color: "#94a3b8" }}
          />

          {/* 50% capacity threshold */}
          <ReferenceLine
            y={threshold50}
            stroke="#f59e0b"
            strokeDasharray="4 4"
            strokeWidth={1.5}
            label={{ value: "50% cap", fill: "#f59e0b", fontSize: 10, position: "insideTopRight" }}
          />
          {/* 30% capacity threshold */}
          <ReferenceLine
            y={threshold30}
            stroke="#ef4444"
            strokeDasharray="4 4"
            strokeWidth={1.5}
            label={{ value: "30% cap", fill: "#ef4444", fontSize: 10, position: "insideTopRight" }}
          />

          {/* Confidence band */}
          <Area
            type="monotone"
            dataKey="high"
            stroke="transparent"
            fill="url(#confGrad)"
            name="high"
            isAnimationActive={true}
            animationDuration={1000}
          />
          <Area
            type="monotone"
            dataKey="low"
            stroke="transparent"
            fill="transparent"
            name="low"
            isAnimationActive={true}
            animationDuration={1000}
          />

          {/* Historical */}
          <Area
            type="monotone"
            dataKey="historical"
            stroke="#0ea5e9"
            strokeWidth={2}
            fill="url(#histGrad)"
            name="historical"
            dot={false}
            isAnimationActive={true}
            animationDuration={800}
          />

          {/* Projected (dashed) */}
          <Line
            type="monotone"
            dataKey="forecast"
            stroke={riskColor}
            strokeWidth={2}
            strokeDasharray="6 3"
            dot={false}
            name="forecast"
            isAnimationActive={true}
            animationDuration={1200}
          />
        </ComposedChart>
      </ResponsiveContainer>

      {/* Milestone boxes */}
      <div className="grid grid-cols-3 gap-3 mt-4">
        {[
          { label: "30-day", val: forecast.day30 },
          { label: "60-day", val: forecast.day60 },
          { label: "90-day", val: forecast.day90 },
        ].map(({ label, val }) => {
          const pct = Math.round((val / capacity) * 100);
          const col = pct >= 60 ? "#10b981" : pct >= 45 ? "#0ea5e9" : pct >= 30 ? "#f59e0b" : "#ef4444";
          return (
            <div key={label} className="rounded-lg bg-slate-800/60 border border-blue-900/40 p-3 text-center">
              <div className="text-xs text-slate-400 mb-1">{label} outlook</div>
              <div className="text-lg font-bold text-white">{formatAF(val)} <span className="text-xs font-normal text-slate-400">AF</span></div>
              <div className="text-xs font-semibold mt-0.5" style={{ color: col }}>{pct}% full</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
