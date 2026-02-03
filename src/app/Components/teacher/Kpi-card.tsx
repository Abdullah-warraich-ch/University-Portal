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
      className="p-4 bg-card group rounded-lg h-auto flex flex-col justify-between  shadow-md w-64"
    >
      <div className="flex  justify-between mb-2">
        <h3 className="text-xs font-semibold text-text-primary max-w-4/6 ">
          Course Name:{title}
        </h3>
        <MoveRight className="text-gray-400 group-hover:translate-x-1 transition-transform duration-200" />
      </div>
      <p className="text-xl font-medium text-text-muted">
        Total Students: {value}
      </p>
    </Link>
  );
}

export default Kpicard;
