import { fetchAllReservoirs } from "@/lib/cdec";
import { getPrecipData } from "@/lib/seedData";
import ReservoirCard from "@/components/ReservoirCard";
import PrecipChart from "@/components/PrecipChart";
import { CloudSnow, Droplets } from "lucide-react";

export default async function DashboardContent() {
  const reservoirs = await fetchAllReservoirs();
  const precip = getPrecipData();

  const totalAF = reservoirs.reduce((s, r) => s + r.currentAF, 0);
  const totalCap = reservoirs.reduce((s, r) => s + r.capacityAF, 0);
  const systemPct = Math.round((totalAF / totalCap) * 100);

  return (
    <div className="space-y-8">
      {/* System-wide summary */}
      <div className="rounded-xl bg-gradient-to-r from-sky-900/30 to-slate-900 border border-blue-900/60 px-6 py-4 flex flex-wrap gap-6 items-center">
        <div>
          <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">System Storage</div>
          <div className="text-3xl font-bold text-white">
            {(totalAF / 1_000_000).toFixed(2)}M <span className="text-base font-normal text-slate-400">AF</span>
          </div>
          <div className="text-xs text-slate-400">{systemPct}% of combined capacity across 5 reservoirs</div>
        </div>
        <div className="h-8 w-px bg-blue-900/60 hidden sm:block" />
        <div>
          <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">System Status</div>
          <div className={`text-sm font-semibold capitalize px-3 py-1 rounded-full ring-1 inline-block ${
            systemPct >= 60
              ? "bg-emerald-500/10 text-emerald-400 ring-emerald-500/30"
              : systemPct >= 45
              ? "bg-sky-500/10 text-sky-400 ring-sky-500/30"
              : systemPct >= 30
              ? "bg-amber-500/10 text-amber-400 ring-amber-500/30"
              : "bg-red-500/10 text-red-400 ring-red-500/30"
          }`}>
            {systemPct >= 60 ? "Healthy" : systemPct >= 45 ? "Watch" : systemPct >= 30 ? "Warning" : "Critical"}
          </div>
        </div>
        <div className="h-8 w-px bg-blue-900/60 hidden sm:block" />
        <div>
          <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Water Year</div>
          <div className="text-sm font-semibold text-white">2024–25</div>
          <div className="text-xs text-slate-400">Oct 1 – Sep 30</div>
        </div>
      </div>

      {/* Reservoir cards */}
      <section>
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Reservoir Status</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {reservoirs.map((r) => <ReservoirCard key={r.id} reservoir={r} />)}
        </div>
      </section>

      {/* Bottom row: snowpack + precip */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Snowpack card */}
        <div className="rounded-xl bg-slate-900 border border-blue-900/60 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500/15 ring-1 ring-sky-500/30">
              <CloudSnow className="h-5 w-5 text-sky-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Sierra Nevada Snowpack</h3>
              <p className="text-xs text-slate-400">April 1 survey · Statewide average</p>
            </div>
          </div>

          {/* Snowpack indicator */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                <span>Current SWE</span>
                <span className="text-sky-400 font-semibold">73% of average</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full rounded-full bg-sky-500 transition-all duration-700" style={{ width: "73%" }} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { label: "North Sierra", val: "81%" },
                { label: "Central Sierra", val: "69%" },
                { label: "South Sierra", val: "68%" },
              ].map(({ label, val }) => (
                <div key={label} className="rounded-lg bg-slate-800/60 p-3">
                  <div className="text-lg font-bold text-sky-400">{val}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{label}</div>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500">
              Below-normal snowpack indicates potential summer water stress. Runoff peak expected mid-April.
            </p>
          </div>
        </div>

        {/* Precipitation chart */}
        <div className="rounded-xl bg-slate-900 border border-blue-900/60 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500/15 ring-1 ring-sky-500/30">
              <Droplets className="h-5 w-5 text-sky-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Monthly Precipitation</h3>
              <p className="text-xs text-slate-400">Central Valley · Last 12 months · inches</p>
            </div>
          </div>
          <PrecipChart data={precip} />
        </div>
      </div>
    </div>
  );
}
