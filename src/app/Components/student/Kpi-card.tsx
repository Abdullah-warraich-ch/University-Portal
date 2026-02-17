import React from "react";
import { GraduationCap, MoveRight } from "lucide-react";
import Link from "next/link";

interface KpiCardProps {
  title: string;
  teacher: string;
  to: string;
  code: string;
}

function Kpicard({ title, teacher, to, code }: KpiCardProps) {
  return (
    <Link
      href={to}
      className="group relative overflow-hidden rounded-2xl border border-border/40 bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/30"
    >
      <div className="absolute top-0 right-0 -m-4 h-24 w-24 rounded-full bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl" />

      <div className="flex items-start justify-between mb-4">
        <div className="p-2.5 rounded-xl border border-primary/20 bg-primary/5 text-primary transition-colors duration-300">
          <GraduationCap className="h-5 w-5" />
        </div>
        <div className="rounded-full border border-border/40 p-2 text-text-muted transition-all group-hover:text-primary group-hover:border-primary/30 group-hover:bg-primary/5">
          <MoveRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <h3 className="text-base font-bold text-text-primary leading-tight group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm text-text-muted mt-1 italic">
            {teacher}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center rounded-lg bg-background-secondary/50 border border-border/40 px-2 py-1 text-[11px] font-mono text-text-muted transition-colors group-hover:border-primary/30 group-hover:text-primary">
            {code}
          </span>
          <span className="h-1 w-1 rounded-full bg-border" />
          <span className="text-[11px] text-text-muted">Semester Grade</span>
        </div>
      </div>
    </Link>
  );
}

export default Kpicard;
