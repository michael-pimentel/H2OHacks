import UsageForm from "@/components/UsageForm";
import UsageTable from "@/components/UsageTable";
import { ClipboardList } from "lucide-react";

export default function UsagePage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/20 ring-1 ring-sky-500/30">
          <ClipboardList className="h-6 w-6 text-sky-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Farmer Water Log</h1>
          <p className="text-slate-400 text-sm">Track your water usage to feed the predictive forecast model</p>
        </div>
      </div>

      <UsageForm />
      <UsageTable />
    </div>
  );
}
