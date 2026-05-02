"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Droplets } from "lucide-react";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/usage", label: "Usage" },
  { href: "/forecast", label: "Forecast" },
  { href: "/alerts", label: "Alerts" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 border-b border-blue-900/60 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/20 ring-1 ring-sky-500/40 group-hover:ring-sky-500/70 transition-all">
            <Droplets className="h-4 w-4 text-sky-400" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-white">DropCast</span>
            <span className="ml-1 text-xs text-sky-400/70 hidden sm:inline">CV Water Intelligence</span>
          </div>
        </Link>

        <div className="flex items-center gap-1">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  active
                    ? "bg-sky-500/20 text-sky-400 ring-1 ring-sky-500/40"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
