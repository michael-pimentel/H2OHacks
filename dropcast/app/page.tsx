import { Suspense } from "react";
import DashboardContent from "./DashboardContent";
import { ReservoirCardSkeleton } from "@/components/ReservoirCard";
import { Droplets } from "lucide-react";

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <ReservoirCardSkeleton key={i} />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl bg-slate-900 border border-blue-900/60 p-6 animate-pulse h-48" />
        <div className="rounded-xl bg-slate-900 border border-blue-900/60 p-6 animate-pulse h-48" />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/20 ring-1 ring-sky-500/30">
          <Droplets className="h-6 w-6 text-sky-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Central Valley Water Intelligence</h1>
          <p className="text-slate-400 text-sm">Live reservoir status · Sierra snowpack · Precipitation trends</p>
        </div>
        <div className="ml-auto hidden sm:flex items-center gap-2 text-xs text-slate-500">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Live data
        </div>
      </div>

      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}
