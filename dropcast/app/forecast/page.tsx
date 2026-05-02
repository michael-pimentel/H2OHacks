import { Suspense } from "react";
import ForecastPageContent from "./ForecastContent";
import { TrendingUp } from "lucide-react";

function ForecastSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="rounded-xl bg-slate-900 border border-blue-900/60 p-6 h-24" />
      <div className="rounded-xl bg-slate-900 border border-blue-900/60 p-6 h-96" />
    </div>
  );
}

export default function ForecastPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/20 ring-1 ring-sky-500/30">
          <TrendingUp className="h-6 w-6 text-sky-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Predictive Forecast</h1>
          <p className="text-slate-400 text-sm">
              What water levels might look like in the future
          </p>
        </div>
        <div className="ml-auto hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 ring-1 ring-amber-500/30">
          <span className="text-xs text-amber-400 font-medium">Linear Model</span>
        </div>
      </div>

      <Suspense fallback={<ForecastSkeleton />}>
        <ForecastPageContent />
      </Suspense>
    </div>
  );
}
