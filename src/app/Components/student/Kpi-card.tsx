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
      className="p-4 bg-card group rounded-lg h-auto shadow-md  flex justify-between items-center mb-4 hover:shadow-lg transition-shadow duration-200"
    >
      <div className="flex flex-col items-start justify-between mb-5">
        <h3 className="text-sm font-semibold text-text-primary">
          Title: {title}
        </h3>
        <h4 className="text-sm font-medium text-text-muted">
          Course Code: {code}
        </h4>
        <p className="text-sm font-medium text-text-primary">
          Instructor: <span className="text-text-muted">{teacher}</span>
        </p>
      </div>
      <MoveRight className="text-gray-400 group-hover:translate-x-1 transition-transform duration-200" />
    </Link>
  );
}

export default Kpicard;
