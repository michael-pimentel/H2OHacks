"use client";
import { useState } from "react";
import {
  COUNTY_HOUSEHOLDS,
  SOURCE_FRACTION,
  COUNTY_RESERVOIR,
  COUNTY_RESERVOIR_CAPACITY_AF,
  SOURCE_LABEL,
} from "@/lib/households";
import type { County, WaterSource } from "@/types";
import { Home, Lightbulb } from "lucide-react";

const COUNTIES: County[] = ["San Joaquin", "Fresno", "Tulare", "Kings", "Madera", "Merced"];
const SOURCES: WaterSource[] = ["Canal", "Groundwater", "Mixed"];
const GALLONS_PER_PERSON_DAY = 80;

function fmt(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toLocaleString();
}

export default function UsagePage() {
  const [county, setCounty] = useState<County>("San Joaquin");
  const [source, setSource] = useState<WaterSource>("Canal");
  const [people, setPeople] = useState("2");
  const [gallons, setGallons] = useState("");

  const gallonsNum = parseFloat(gallons) || 0;
  const peopleNum = parseInt(people) || 1;

  const similarHouseholds = Math.round(
    COUNTY_HOUSEHOLDS[county] * SOURCE_FRACTION[county][source]
  );
  const scaledGallonsMonth = gallonsNum * similarHouseholds;
  const scaledAFMonth = scaledGallonsMonth / 325_851;
  const reservoirName = COUNTY_RESERVOIR[county];
  const reservoirCapacity = COUNTY_RESERVOIR_CAPACITY_AF[county];
  const pctOfReservoir = reservoirCapacity > 0 ? (scaledAFMonth / reservoirCapacity) * 100 : 0;

  const hasResult = gallonsNum > 0;

  const inputCls =
    "w-full rounded-lg bg-slate-800 border border-blue-900/50 text-white text-sm px-3 py-2 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all";
  const labelCls = "block text-xs font-medium text-slate-400 mb-1";

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/20 ring-1 ring-sky-500/30">
          <Home className="h-6 w-6 text-sky-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Household Water Usage</h1>
          <p className="text-slate-400 text-sm">Enter your home&apos;s usage to see how it scales across your county</p>
        </div>
      </div>

      {/* Household input */}
      <div className="rounded-xl bg-slate-900 border border-blue-900/60 p-6">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Your Household</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className={labelCls}>County</label>
            <select value={county} onChange={(e) => setCounty(e.target.value as County)} className={inputCls}>
              {COUNTIES.map((c) => <option key={c} value={c}>{c} County</option>)}
            </select>
          </div>

          <div>
            <label className={labelCls}>Water source</label>
            <select value={source} onChange={(e) => setSource(e.target.value as WaterSource)} className={inputCls}>
              {SOURCES.map((s) => <option key={s} value={s}>{SOURCE_LABEL[s]}</option>)}
            </select>
          </div>

          <div>
            <label className={labelCls}>People in household</label>
            <select value={people} onChange={(e) => setPeople(e.target.value)} className={inputCls}>
              {[1,2,3,4,5,6,7,8].map((n) => (
                <option key={n} value={n}>{n} {n === 1 ? "person" : "people"}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelCls}>Monthly water use (gallons)</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={gallons}
                onChange={(e) => setGallons(e.target.value)}
                min="1"
                step="10"
                placeholder={String(peopleNum * GALLONS_PER_PERSON_DAY * 30)}
                className={inputCls}
              />
              <button
                type="button"
                onClick={() => setGallons(String(peopleNum * GALLONS_PER_PERSON_DAY * 30))}
                title="Use CA average for your household size"
                className="shrink-0 flex items-center px-2.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors"
              >
                <Lightbulb className="h-4 w-4 text-amber-400" />
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              From your bill, or click the bulb for the CA average.
            </p>
            <p className="text-xs text-sky-400/70 mt-1">
              Estimate: {peopleNum} {peopleNum === 1 ? "person" : "people"} × 80 gal/day × 30 days
              = <span className="font-semibold text-sky-400">{(peopleNum * GALLONS_PER_PERSON_DAY * 30).toLocaleString()} gal/month</span>
            </p>
          </div>
        </div>
      </div>

      {/* Community scale results */}
      {hasResult ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl bg-slate-900 border border-blue-900/60 p-5">
              <div className="text-xs text-slate-400 mb-2">
                {SOURCE_LABEL[source]} households in {county} County
              </div>
              <div className="text-3xl font-bold text-white">{fmt(similarHouseholds)}</div>
              <div className="text-xs text-slate-500 mt-1">
                using the same source as you
              </div>
            </div>

            <div className="rounded-xl bg-slate-900 border border-blue-900/60 p-5">
              <div className="text-xs text-slate-400 mb-2">Combined monthly usage</div>
              <div className="text-3xl font-bold text-white">
                {fmt(Math.round(scaledGallonsMonth / 1_000_000))}M
              </div>
              <div className="text-xs text-slate-500 mt-1">
                gallons · {fmt(Math.round(scaledAFMonth))} acre-feet
              </div>
            </div>

            <div className="rounded-xl bg-slate-900 border border-blue-900/60 p-5">
              <div className="text-xs text-slate-400 mb-2">
                Monthly draw on {reservoirName}
              </div>
              <div className="text-3xl font-bold text-sky-400">{pctOfReservoir.toFixed(1)}%</div>
              <div className="text-xs text-slate-500 mt-1">of full reservoir capacity</div>
            </div>
          </div>

          <div className="rounded-xl bg-gradient-to-br from-sky-900/20 to-slate-900 border border-sky-700/40 p-6">
            <div className="flex justify-between text-xs text-slate-400 mb-2">
              <span>
                Monthly household draw vs. <span className="text-white">{reservoirName}</span> capacity
              </span>
              <span className="text-sky-400 font-semibold">{pctOfReservoir.toFixed(2)}%</span>
            </div>
            <div className="h-4 w-full rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-sky-500 transition-all duration-500"
                style={{ width: `${Math.min(pctOfReservoir * 5, 100)}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-3">
              If every <span className="text-slate-300">{SOURCE_LABEL[source]}</span> household
              in <span className="text-slate-300">{county} County</span> used the same{" "}
              <span className="text-slate-300 font-medium">{Number(gallons).toLocaleString()} gallons/month</span> as you,
              together they would draw{" "}
              <span className="text-slate-300 font-medium">{pctOfReservoir.toFixed(1)}%</span> of{" "}
              {reservoirName}&apos;s capacity every month —{" "}
              about <span className="text-slate-300 font-medium">{Math.round(pctOfReservoir * 12)}%</span> per year.
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-xl bg-slate-900 border border-blue-900/60 p-10 text-center">
          <p className="text-slate-400 text-sm">Enter your monthly gallons above to see the community estimate.</p>
        </div>
      )}
    </div>
  );
}
