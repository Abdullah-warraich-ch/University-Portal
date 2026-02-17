import React from "react";
import { MoveRight, TrendingUp, Sparkles } from "lucide-react";
import Link from "next/link";

interface KpiCardProps {
  title: string;
  value: number | string;
  to: string;
  icon?: React.ReactNode;
  trend?: string;
  color?: "primary" | "success" | "warning" | "danger";
}

function Kpicard({
  title,
  value,
  to,
  icon,
  trend,
  color = "primary",
}: KpiCardProps) {
  const colorMap = {
    primary: "border-primary/20 bg-primary/10 text-primary shadow-primary/5",
    success: "border-success/20 bg-success/10 text-success shadow-success/5",
    warning: "border-warning/20 bg-warning/10 text-warning shadow-warning/5",
    danger: "border-danger/20 bg-danger/10 text-danger shadow-danger/5",
  };

  return (
    <Link
      href={to}
      className="group relative overflow-hidden rounded-[2rem] border border-border/40 bg-card/40 backdrop-blur-xl p-8 shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-primary/40"
    >
      <div className={`absolute -top-10 -right-10 h-32 w-32 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-700 blur-3xl ${color === 'primary' ? 'bg-primary' : color === 'success' ? 'bg-success' : color === 'warning' ? 'bg-warning' : 'bg-danger'}`} />

      <div className="flex items-start justify-between mb-6">
        <div className={`p-4 rounded-2xl border ${colorMap[color]} transition-all duration-500 group-hover:scale-110 shadow-lg`}>
          {icon || <TrendingUp size={22} />}
        </div>
        <div className="rounded-xl border border-border/20 p-2 text-text-muted transition-all group-hover:text-primary group-hover:border-primary/40 group-hover:bg-primary/5 group-hover:scale-110">
          <MoveRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </div>
      </div>

      <div className="space-y-2 relative z-10">
        <h3 className="text-xs font-black uppercase tracking-widest text-text-muted/60 group-hover:text-text-primary/70 transition-colors">
          {title}
        </h3>
        <div className="flex items-center gap-3">
          <span className="text-4xl font-black tracking-tighter text-text-primary">
            {value}
          </span>
          {trend && (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-success/10 border border-success/20 text-[10px] font-black uppercase tracking-widest text-success animate-in fade-in slide-in-from-bottom-2 duration-500">
              <Sparkles size={10} />
              {trend}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

export default Kpicard;
