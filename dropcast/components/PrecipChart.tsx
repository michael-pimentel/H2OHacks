"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import type { PrecipDataPoint } from "@/types";

interface Props {
  data: PrecipDataPoint[];
}

export default function PrecipChart({ data }: Props) {
  const max = Math.max(...data.map((d) => d.inches));

  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fill: "#64748b", fontSize: 10 }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tick={{ fill: "#64748b", fontSize: 10 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `${v}"`}
        />
        <Tooltip
          contentStyle={{
            background: "#0f172a",
            border: "1px solid rgba(30,58,138,0.6)",
            borderRadius: "8px",
            fontSize: "12px",
            color: "#f1f5f9",
          }}
          formatter={(val) => [`${Number(val)}"`, "Precipitation"]}
        />
        <Bar dataKey="inches" radius={[3, 3, 0, 0]} isAnimationActive animationDuration={800}>
          {data.map((entry, i) => (
            <Cell
              key={i}
              fill={entry.inches === max ? "#0ea5e9" : entry.inches > 1 ? "#0ea5e9bb" : "#0ea5e955"}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
