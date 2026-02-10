import React from "react";
import { MoveRight } from "lucide-react";
import Link from "next/link";
function Kpicard({
  title,
  value,
  to,
}: {
  title: string;
  value: number;
  to: string;
}) {
  return (
    <Link
      href={to}
      className="group rounded-2xl border border-border/40 bg-background-secondary/30 p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-sm font-semibold tracking-tight text-text-primary">
          {title}
        </h3>
        <div className="rounded-full border border-border/40 p-2 text-text-muted transition-all group-hover:text-text-primary group-hover:border-primary/40 group-hover:bg-primary/5">
          <MoveRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform duration-200" />
        </div>
      </div>
      <div className="mt-3 text-3xl font-semibold text-text-primary">
        {value}
      </div>
    </Link>
  );
}

export default Kpicard;
