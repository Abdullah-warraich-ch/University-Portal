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
      className="group relative overflow-hidden rounded-[2rem] border border-border/40 bg-card/40 backdrop-blur-xl p-8 shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-primary/40"
    >
      <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-primary/10 opacity-0 group-hover:opacity-20 transition-opacity duration-700 blur-3xl" />

      <div className="flex items-start justify-between mb-6">
        <div className="p-4 rounded-2xl border border-primary/20 bg-primary/10 text-primary transition-all duration-500 group-hover:scale-110 shadow-lg shadow-primary/5">
          <GraduationCap size={22} />
        </div>
        <div className="rounded-xl border border-border/20 p-2 text-text-muted transition-all group-hover:text-primary group-hover:border-primary/40 group-hover:bg-primary/5 group-hover:scale-110">
          <MoveRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </div>
      </div>

      <div className="space-y-4 relative z-10">
        <div>
          <h3 className="text-lg font-black tracking-tight text-text-primary group-hover:text-primary transition-colors leading-snug">
            {title}
          </h3>
          <p className="text-[10px] font-black uppercase tracking-widest text-text-muted/60 mt-1">
            {teacher}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center rounded-lg bg-background-secondary/50 border border-border/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-text-muted transition-colors group-hover:border-primary/40 group-hover:text-primary">
            {code}
          </span>
          <span className="h-1 w-1 rounded-full bg-border/40" />
          <span className="text-[10px] font-black uppercase tracking-widest text-text-muted/40">Registered</span>
        </div>
      </div>
    </Link>
  );
}

export default Kpicard;
