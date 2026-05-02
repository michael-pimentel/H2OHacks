"use client";
import { useState } from "react";
import { useUsageStore } from "@/lib/store";
import type { County, CropType, WaterSource, UsageEntry } from "@/types";
import { PlusCircle } from "lucide-react";

const COUNTIES: County[] = ["Fresno", "Tulare", "Kings", "Madera", "Merced"];
const CROPS: CropType[] = ["Almonds", "Pistachios", "Grapes", "Cotton", "Wheat", "Tomatoes", "Citrus", "Other"];
const SOURCES: WaterSource[] = ["Canal", "Groundwater", "Mixed"];

const today = new Date().toISOString().slice(0, 10);

const EMPTY = {
  date: today,
  farmName: "",
  county: "Fresno" as County,
  acres: "",
  cropType: "Almonds" as CropType,
  waterUsedAF: "",
  source: "Canal" as WaterSource,
  notes: "",
};

export default function UsageForm() {
  const addEntry = useUsageStore((s) => s.addEntry);
  const [form, setForm] = useState(EMPTY);
  const [saved, setSaved] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const entry: UsageEntry = {
      id: crypto.randomUUID(),
      date: form.date,
      farmName: form.farmName,
      county: form.county,
      acres: parseFloat(form.acres),
      cropType: form.cropType,
      waterUsedAF: parseFloat(form.waterUsedAF),
      source: form.source,
      notes: form.notes,
    };
    addEntry(entry);
    setForm(EMPTY);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const inputCls =
    "w-full rounded-lg bg-slate-800 border border-blue-900/50 text-white text-sm px-3 py-2 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50 transition-all";
  const labelCls = "block text-xs font-medium text-slate-400 mb-1";

  return (
    <form onSubmit={handleSubmit} className="rounded-xl bg-slate-900 border border-blue-900/60 p-6">
      <h2 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
        <PlusCircle className="h-5 w-5 text-sky-400" />
        Log Water Usage
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className={labelCls}>Date</label>
          <input type="date" name="date" value={form.date} onChange={handleChange} required className={inputCls} />
        </div>

        <div>
          <label className={labelCls}>Farm Name</label>
          <input type="text" name="farmName" value={form.farmName} onChange={handleChange} required placeholder="e.g. Miller Ranch" className={inputCls} />
        </div>

        <div>
          <label className={labelCls}>County</label>
          <select name="county" value={form.county} onChange={handleChange} className={inputCls}>
            {COUNTIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className={labelCls}>Acres Irrigated</label>
          <input type="number" name="acres" value={form.acres} onChange={handleChange} required min="0.1" step="0.1" placeholder="0.0" className={inputCls} />
        </div>

        <div>
          <label className={labelCls}>Crop Type</label>
          <select name="cropType" value={form.cropType} onChange={handleChange} className={inputCls}>
            {CROPS.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className={labelCls}>Water Used (Acre-Feet)</label>
          <input type="number" name="waterUsedAF" value={form.waterUsedAF} onChange={handleChange} required min="0.01" step="0.01" placeholder="0.00" className={inputCls} />
        </div>

        <div>
          <label className={labelCls}>Water Source</label>
          <select name="source" value={form.source} onChange={handleChange} className={inputCls}>
            {SOURCES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className={labelCls}>Notes (optional)</label>
          <textarea name="notes" value={form.notes} onChange={handleChange} rows={2} placeholder="Any additional context..." className={`${inputCls} resize-none`} />
        </div>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <button
          type="submit"
          className="px-6 py-2.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-white text-sm font-semibold transition-colors"
        >
          Save Entry
        </button>
        {saved && (
          <span className="text-sm text-emerald-400 font-medium animate-pulse">
            ✓ Entry saved
          </span>
        )}
      </div>
    </form>
  );
}
