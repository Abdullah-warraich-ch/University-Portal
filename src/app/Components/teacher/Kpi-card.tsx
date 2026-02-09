import React from "react";
import { MoveRight } from "lucide-react";
import Link from "next/link";
function Kpicard({
  title,
  value,
  to,
}: {
  title: string;
  value: string | React.ReactNode;
  to: string;
}) {
  return (
    <Link
      href={to}
      className="rounded-2xl border group border-white/10 bg-card/70 p-6 backdrop-blur-md shadow-xl"
    >
      <div className="flex  justify-between mb-2">
        <h3 className="mb-2 text-lg font-semibold text-text-primary">
          {title}
        </h3>
        <MoveRight className="text-gray-400 group-hover:translate-x-1 transition-transform duration-200" />
      </div>
      <p className="text-sm text-text-muted">Total Students: {value}</p>
    </Link>
  );
}

export default Kpicard;
