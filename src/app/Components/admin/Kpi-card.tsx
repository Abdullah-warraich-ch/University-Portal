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
      className="p-4 bg-card group rounded-lg h-auto shadow-md w-64"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-text-muted">{title}</h3>
        <MoveRight className="text-gray-400 group-hover:translate-x-1 transition-transform duration-200" />
      </div>
      <p className="text-3xl font-medium text-text-primary">{value}</p>
    </Link>
  );
}

export default Kpicard;
