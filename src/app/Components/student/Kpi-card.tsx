import React from "react";
import { MoveRight } from "lucide-react";
import Link from "next/link";
function Kpicard({
  title,
  teacher,
  to,
  code,
}: {
  title: string;
  teacher: string;
  to: string;
  code: string;
}) {
  return (
    <Link
      href={to}
      className="group rounded-2xl border border-border/40 bg-background-secondary/30 p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold tracking-tight text-text-primary leading-snug">
            {title}
          </h3>
          <p className="mt-1 text-sm text-text-muted">{teacher}</p>
          <span className="mt-3 inline-flex items-center rounded-full border border-border/40 px-2 py-1 text-[11px] text-text-muted">
            {code}
          </span>
        </div>
        <div className="mt-1 rounded-full border border-border/40 p-2 text-text-muted transition-all group-hover:text-text-primary group-hover:border-primary/40 group-hover:bg-primary/5">
          <MoveRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform duration-200" />
        </div>
      </div>
    </Link>
  );
}

export default Kpicard;
