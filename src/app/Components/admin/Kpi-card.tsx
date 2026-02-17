import React from "react";
import { MoveRight, TrendingUp } from "lucide-react";
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
    primary: "border-primary/20 bg-primary/5 text-primary",
    success: "border-success/20 bg-success/5 text-success",
    warning: "border-warning/20 bg-warning/5 text-warning",
    danger: "border-danger/20 bg-danger/5 text-danger",
  };

  return (
    <Link
      href={to}
      className="group relative overflow-hidden rounded-2xl border border-border/40 bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/30"
    >
      <div className="absolute top-0 right-0 -m-4 h-24 w-24 rounded-full bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl" />

      <div className="flex items-start justify-between mb-4">
        <div className={`p-2.5 rounded-xl border ${colorMap[color]} transition-colors duration-300`}>
          {icon || <TrendingUp className="h-5 w-5" />}
        </div>
        <div className="rounded-full border border-border/40 p-2 text-text-muted transition-all group-hover:text-primary group-hover:border-primary/30 group-hover:bg-primary/5">
          <MoveRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="text-sm font-medium text-text-muted group-hover:text-text-primary transition-colors">
          {title}
        </h3>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold tracking-tight text-text-primary">
            {value}
          </span>
          {trend && (
            <span className="text-xs font-semibold text-success animate-in fade-in slide-in-from-bottom-1">
              {trend}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default Kpicard;
