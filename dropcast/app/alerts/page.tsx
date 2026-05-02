import { getDroughtComparisonData } from "@/lib/seedData";
import DroughtComparisonChart from "@/components/DroughtComparisonChart";
import { Bell, AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react";
import type { AlertCondition } from "@/types";

const ALERTS: AlertCondition[] = [
  {
    id: "1",
    title: "San Luis Reservoir Below Watch Threshold",
    description:
      "San Luis Reservoir is at 62% capacity (1,265K AF). While above the critical 30% threshold, continued above-normal temperatures may accelerate drawdown through summer.",
    severity: "watch",
    value: "62%",
    threshold: "45% watch",
  },
  {
    id: "2",
    title: "Terminus Reservoir — Elevated Monitoring",
    description:
      "Terminus Reservoir is at 50% capacity. Given its smaller 148,000 AF capacity, it is more sensitive to agricultural draw. Summer irrigation demand expected to push storage below 40%.",
    severity: "warning",
    value: "50%",
    threshold: "45% watch",
  },
  {
    id: "3",
    title: "Sierra Snowpack Below Normal",
    description:
      "April 1 snowpack survey shows 73% of average statewide. Reduced spring runoff will limit reservoir recharge, extending reliance on stored water through the summer dry season.",
    severity: "warning",
    value: "73% of avg",
    threshold: "100% normal",
  },
  {
    id: "4",
    title: "Lake Oroville Healthy — No Action Required",
    description:
      "Lake Oroville remains at 67% capacity (2,370K AF), well above both the 50% and 30% threshold lines. Continue routine monitoring.",
    severity: "healthy",
    value: "67%",
    threshold: "30% critical",
  },
  {
    id: "5",
    title: "Groundwater Overdraft Risk — Fresno County",
    description:
      "Reduced surface water availability increases pressure on groundwater. SGMA sustainable yield limits apply. Farmers relying on groundwater should monitor extraction vs. recharge rates.",
    severity: "warning",
    value: "Elevated",
    threshold: "SGMA limits",
  },
  {
    id: "6",
    title: "Water Year 2025–26 Outlook",
    description:
      "Current water year is tracking near-normal following 2023's atmospheric river recovery. System-wide storage at ~61% is above drought-year comparisons but below pre-drought averages of 75–85%.",
    severity: "watch",
    value: "Near-normal",
    threshold: "Historical avg",
  },
];

const SEVERITY_STYLES: Record<AlertCondition["severity"], { border: string; bg: string; icon: string; badge: string }> = {
  healthy: {
    border: "border-emerald-500/30",
    bg: "bg-emerald-500/5",
    icon: "text-emerald-400",
    badge: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/30",
  },
  watch: {
    border: "border-sky-500/30",
    bg: "bg-sky-500/5",
    icon: "text-sky-400",
    badge: "bg-sky-500/10 text-sky-400 ring-sky-500/30",
  },
  warning: {
    border: "border-amber-500/30",
    bg: "bg-amber-500/5",
    icon: "text-amber-400",
    badge: "bg-amber-500/10 text-amber-400 ring-amber-500/30",
  },
  critical: {
    border: "border-red-500/30",
    bg: "bg-red-500/5",
    icon: "text-red-400",
    badge: "bg-red-500/10 text-red-400 ring-red-500/30",
  },
};

const SEVERITY_ICONS = {
  healthy: CheckCircle,
  watch: Info,
  warning: AlertTriangle,
  critical: XCircle,
};

export default function AlertsPage() {
  const droughtData = getDroughtComparisonData();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/20 ring-1 ring-amber-500/30">
          <Bell className="h-6 w-6 text-amber-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Water Conditions & Alerts</h1>
          <p className="text-slate-400 text-sm">Current Central Valley status · Historical drought comparison</p>
        </div>
        <div className="ml-auto hidden sm:flex items-center gap-2">
          <span className="text-xs text-slate-500">Updated: May 2, 2025</span>
        </div>
      </div>

      {/* Summary badges */}
      <div className="flex flex-wrap gap-3">
        {(["critical", "warning", "watch", "healthy"] as const).map((sev) => {
          const count = ALERTS.filter((a) => a.severity === sev).length;
          const styles = SEVERITY_STYLES[sev];
          return count > 0 ? (
            <div
              key={sev}
              className={`px-4 py-2 rounded-full text-sm font-medium ring-1 capitalize ${styles.badge}`}
            >
              {count} {sev}{count !== 1 ? (sev === "watch" ? "" : "") : ""}
            </div>
          ) : null;
        })}
      </div>

      {/* Alert cards */}
      <section>
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Active Conditions</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {ALERTS.map((alert) => {
            const styles = SEVERITY_STYLES[alert.severity];
            const Icon = SEVERITY_ICONS[alert.severity];
            return (
              <div
                key={alert.id}
                className={`rounded-xl border p-5 ${styles.border} ${styles.bg}`}
              >
                <div className="flex items-start gap-3">
                  <Icon className={`h-5 w-5 mt-0.5 shrink-0 ${styles.icon}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-sm font-semibold text-white leading-snug">{alert.title}</h3>
                      <span className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ring-1 capitalize ${styles.badge}`}>
                        {alert.severity}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{alert.description}</p>
                    <div className="mt-3 flex gap-4">
                      <div>
                        <div className="text-xs text-slate-500">Current</div>
                        <div className={`text-sm font-bold ${styles.icon}`}>{alert.value}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">Threshold</div>
                        <div className="text-sm font-medium text-slate-300">{alert.threshold}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Drought comparison */}
      <section>
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
          Drought Year Comparison
        </h2>
        <div className="rounded-xl bg-slate-900 border border-blue-900/60 p-6">
          <p className="text-xs text-slate-400 mb-5">
            Current storage levels (2025–26) compared against drought years 2015 and 2021 at comparable time of year.
            Higher is better.
          </p>
          <DroughtComparisonChart data={droughtData} />
          <div className="flex flex-wrap gap-4 mt-4 text-xs">
            {[
              { color: "#0ea5e9", label: "Current (2025–26)" },
              { color: "#f59e0b", label: "Drought 2021" },
              { color: "#ef4444", label: "Drought 2015" },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: color }} />
                <span className="text-slate-400">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
