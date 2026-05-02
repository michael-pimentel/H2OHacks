"use client";
import { useState } from "react";
import { useUsageStore } from "@/lib/store";
import { SOURCE_LABEL } from "@/lib/households";
import type { County, WaterSource, HouseholdEntry } from "@/types";
import { PlusCircle, Lightbulb } from "lucide-react";

const COUNTIES: County[] = ["Fresno", "Tulare", "Kings", "Madera", "Merced"];
const SOURCES: WaterSource[] = ["Canal", "Groundwater", "Mixed"];
const PEOPLE_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8];

const thisMonth = new Date().toISOString().slice(0, 7);

const EMPTY = {
  month: thisMonth,
  label: "",
  county: "San Joaquin" as County,
  people: "2",
  gallonsPerMonth: "",
  source: "Canal" as WaterSource,
  notes: "",
};

// CA average: ~80 gallons/person/day
const AVG_GALLONS_PER_PERSON_DAY = 80;

export default function UsageForm() {
  const addEntry = useUsageStore((s) => s.addEntry);
  const [form, setForm] = useState(EMPTY);
  const [saved, setSaved] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleEstimate() {
    const people = parseInt(form.people) || 2;
    const estimated = Math.round(people * AVG_GALLONS_PER_PERSON_DAY * 30);
    setForm((f) => ({ ...f, gallonsPerMonth: String(estimated) }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const entry: HouseholdEntry = {
      id: crypto.randomUUID(),
      month: form.month,
      label: form.label || "My home",
      county: form.county,
      people: parseInt(form.people),
      gallonsPerMonth: parseFloat(form.gallonsPerMonth),
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
      <h2 className="text-lg font-semibold text-white mb-1 flex items-center gap-2">
        <PlusCircle className="h-5 w-5 text-sky-400" />
        Log Your Household Usage
      </h2>
      <p className="text-xs text-slate-500 mb-5">
        Find your monthly gallons on your water bill, or use the estimate button below.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className={labelCls}>Month</label>
          <input
            type="month"
            name="month"
            value={form.month}
            onChange={handleChange}
            required
            className={inputCls}
          />
        </div>

        <div>
          <label className={labelCls}>Nickname (optional)</label>
          <input
            type="text"
            name="label"
            value={form.label}
            onChange={handleChange}
            placeholder="e.g. My home, Apt 3B"
            className={inputCls}
          />
        </div>

        <div>
          <label className={labelCls}>County</label>
          <select name="county" value={form.county} onChange={handleChange} className={inputCls}>
            {COUNTIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelCls}>People in household</label>
          <select name="people" value={form.people} onChange={handleChange} className={inputCls}>
            {PEOPLE_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n === 8 ? "8+" : n} {n === 1 ? "person" : "people"}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelCls}>Monthly water use (gallons)</label>
          <div className="flex gap-2">
            <input
              type="number"
              name="gallonsPerMonth"
              value={form.gallonsPerMonth}
              onChange={handleChange}
              required
              min="1"
              step="1"
              placeholder={`e.g. ${Math.round(parseInt(form.people || "2") * AVG_GALLONS_PER_PERSON_DAY * 30)}`}
              className={inputCls}
            />
            <button
              type="button"
              onClick={handleEstimate}
              title="Fill in the CA average for your household size"
              className="shrink-0 flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs font-medium transition-colors whitespace-nowrap"
            >
              <Lightbulb className="h-3.5 w-3.5 text-amber-400" />
              Estimate
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Check your water bill, or hit Estimate for the CA average ({AVG_GALLONS_PER_PERSON_DAY} gal/person/day).
          </p>
        </div>

        <div>
          <label className={labelCls}>Water source</label>
          <select name="source" value={form.source} onChange={handleChange} className={inputCls}>
            {SOURCES.map((s) => (
              <option key={s} value={s}>
                {SOURCE_LABEL[s]}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2 lg:col-span-3">
          <label className={labelCls}>Notes (optional)</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            rows={2}
            placeholder="Any extra context — drought restrictions, lawn watering, etc."
            className={`${inputCls} resize-none`}
          />
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
            ✓ Saved
          </span>
        )}
      </div>
    </form>
  );
}
