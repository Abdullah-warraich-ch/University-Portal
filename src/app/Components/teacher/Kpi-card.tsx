import React from "react";
import { BookOpen, MoveRight } from "lucide-react";
import Link from "next/link";

interface KpiCardProps {
  title: string;
  value: string | React.ReactNode;
  to: string;
  subtitle?: string;
}

function Kpicard({
  title,
  value,
  to,
  subtitle = "Students enrolled",
}: KpiCardProps) {
  return (
    <Link
      href={to}
      className="group relative overflow-hidden rounded-2xl border border-border/40 bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/30"
    >
      <div className="absolute top-0 right-0 -m-4 h-24 w-24 rounded-full bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl" />

      <div className="flex items-start justify-between mb-4">
        <div className="p-2.5 rounded-xl border border-primary/20 bg-primary/5 text-primary transition-colors duration-300">
          <BookOpen className="h-5 w-5" />
        </div>
        <div className="rounded-full border border-border/40 p-2 text-text-muted transition-all group-hover:text-primary group-hover:border-primary/30 group-hover:bg-primary/5">
          <MoveRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>

      <div className="space-y-2">
        <div>
          <h3 className="text-base font-semibold text-text-primary leading-tight">
            {title}
          </h3>
          <p className="text-xs text-text-muted group-hover:text-primary transition-colors">
            {subtitle}
          </p>
        </div>
        <div className="text-3xl font-bold tracking-tight text-text-primary">
          {value}
        </div>
      </div>
    </Link>
  );
}

export default Kpicard;
