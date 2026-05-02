"use client";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import type { DroughtComparisonPoint } from "@/types";

interface Props {
  data: DroughtComparisonPoint[];
}

export default function DroughtComparisonChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -10, bottom: 0 }} barCategoryGap="20%">
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
        <XAxis dataKey="reservoir" tick={{ fill: "#94a3b8", fontSize: 11 }} tickLine={false} axisLine={false} />
        <YAxis
          tick={{ fill: "#64748b", fontSize: 10 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `${v}%`}
          domain={[0, 100]}
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
              current: "Current (2024–25)",
              drought2021: "Drought 2021",
              drought2015: "Drought 2015",
            };
            return [`${Number(val)}%`, labels[String(name)] ?? String(name)];
          }}
        />
        <Bar dataKey="current" name="current" fill="#0ea5e9" radius={[3, 3, 0, 0]} isAnimationActive animationDuration={800} />
        <Bar dataKey="drought2021" name="drought2021" fill="#f59e0b" radius={[3, 3, 0, 0]} isAnimationActive animationDuration={900} />
        <Bar dataKey="drought2015" name="drought2015" fill="#ef4444" radius={[3, 3, 0, 0]} isAnimationActive animationDuration={1000} />
      </BarChart>
    </ResponsiveContainer>
  );
}
