import { fetchAllReservoirs } from "@/lib/cdec";
import { getPrecipData } from "@/lib/seedData";
import ReservoirCard from "@/components/ReservoirCard";
import PrecipChart from "@/components/PrecipChart";
import { CloudSnow, Droplets } from "lucide-react";

export default async function DashboardContent() {
  // 🛡️ SAFE DATA FETCH
  let reservoirs: any[] = [];
  let precip: string | any[] = [];

  try {
    reservoirs = await fetchAllReservoirs();
  } catch (err) {
    console.error("Reservoir fetch failed:", err);
    reservoirs = [];
  }

  try {
    precip = getPrecipData() ?? [];
  } catch (err) {
    console.error("Precip fetch failed:", err);
    precip = [];
  }

  // 🛡️ SAFE REDUCES (prevents crash when empty)
  const totalAF = reservoirs.reduce(
    (s, r) => s + (r?.currentAF ?? 0),
    0
  );

  const totalCap = reservoirs.reduce(
    (s, r) => s + (r?.capacityAF ?? 0),
    0
  );

  const systemPct =
    totalCap > 0
      ? Math.round((totalAF / totalCap) * 100)
      : 0;

  const homesEquivalent = Math.round((totalAF / 1_000_000) * 2);

  return (
    <div className="space-y-8">

      {/* SYSTEM SUMMARY */}
      <div className="rounded-xl bg-gradient-to-r from-sky-900/30 to-slate-900 border border-blue-900/60 px-6 py-4 flex flex-wrap gap-6 items-center">
        <div>
          <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">
            Total Water Stored
          </div>

          <div className="text-3xl font-bold text-white">
            {(totalAF / 1_000_000).toFixed(2)}M{" "}
            <span className="text-base font-normal text-slate-400">
              acre-feet
            </span>
          </div>

          <div className="text-xs text-slate-400">
            {systemPct}% full across {reservoirs.length || 0} reservoirs · enough for ~
            {homesEquivalent}M homes for a year
          </div>
        </div>

        <div className="h-8 w-px bg-blue-900/60 hidden sm:block" />

        <div>
          <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">
            Overall Health
          </div>

          <div
            className={`text-sm font-semibold capitalize px-3 py-1 rounded-full ring-1 inline-block ${
              systemPct >= 60
                ? "bg-emerald-500/10 text-emerald-400 ring-emerald-500/30"
                : systemPct >= 45
                ? "bg-sky-500/10 text-sky-400 ring-sky-500/30"
                : systemPct >= 30
                ? "bg-amber-500/10 text-amber-400 ring-amber-500/30"
                : "bg-red-500/10 text-red-400 ring-red-500/30"
            }`}
          >
            {systemPct >= 60
              ? "Healthy"
              : systemPct >= 45
              ? "Watch"
              : systemPct >= 30
              ? "Warning"
              : "Critical"}
          </div>
        </div>
      </div>

      {/* RESERVOIRS */}
      <section>
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
          Reservoir Status
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {reservoirs.length > 0 ? (
            reservoirs.map((r) => (
              <ReservoirCard key={r.id} reservoir={r} />
            ))
          ) : (
            <div className="text-slate-500 text-sm">
              No reservoir data available
            </div>
          )}
        </div>
      </section>

      {/* SNOW + PRECIP */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* SNOWPACK */}
        <div className="rounded-xl bg-slate-900 border border-blue-900/60 p-6">
          <div className="flex items-center gap-3 mb-4">
            <CloudSnow className="h-5 w-5 text-sky-400" />
            <h3 className="text-sm font-semibold text-white">
              Sierra Nevada Snowpack
            </h3>
          </div>

          <div className="text-xs text-slate-400">
            73% of average (static until API added)
          </div>
        </div>

        {/* PRECIP */}
        <div className="rounded-xl bg-slate-900 border border-blue-900/60 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Droplets className="h-5 w-5 text-sky-400" />
            <h3 className="text-sm font-semibold text-white">
              Monthly Precipitation
            </h3>
          </div>

          {precip?.length ? (
            <PrecipChart data={precip} />
          ) : (
            <div className="text-slate-500 text-sm">
              No precipitation data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}