"use client";
import React, { useEffect, useState, useContext } from "react";
import { db } from "@/app/Firebase";
import { collection, getDocs } from "firebase/firestore";
import { FirebaseContext } from "@/app/Context";
import { Calendar, Clock, AlertCircle } from "lucide-react";
import Link from "next/link";

interface Assignment {
  title: string;
  DueDate: string;
  courseCode: string;
}

function UpcomingAssignments() {
  const { enrolledCourses } = useContext(FirebaseContext)!;
  const [assignments, setAssignments] = useState<Assignment[] | null>(null);

  useEffect(() => {
    async function fetchAssignments() {
      const allAssignments: Assignment[] = [];

      for (const course of enrolledCourses) {
        if (!course.code) continue;

        const assignmentsRef = collection(db, "courses", course.code, "grades");
        const snapshot = await getDocs(assignmentsRef);
        snapshot.forEach((doc) => {
          const data = doc.data();
          if (!data.DueDate) return;

          const DueDate = new Date(data.DueDate);
          const now = new Date();
          now.setHours(0, 0, 0, 0);

          if (DueDate >= now) {
            allAssignments.push({
              title: data.title,
              DueDate: data.DueDate,
              courseCode: course.code || "Unknown",
            });
          }
        });
      }
      // Sort by due date
      allAssignments.sort((a, b) => new Date(a.DueDate).getTime() - new Date(b.DueDate).getTime());
      setAssignments(allAssignments);
    }

    fetchAssignments();
  }, [enrolledCourses]);

  if (assignments === null) {
    return (
      <div className="flex items-center justify-center p-8 animate-pulse">
        <div className="h-4 w-4 bg-primary rounded-full animate-bounce" />
        <span className="ml-2 text-text-muted text-sm font-medium">Crunching deadlines...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar p-2">
      {assignments.length > 0 ? (
        assignments.map((assignment, index) => {
          const isUrgent = new Date(assignment.DueDate).getTime() - new Date().getTime() < 86400000 * 2;

          return (
            <Link
              key={index}
              href={`/student/grades/${assignment.courseCode}`}
              className="group flex flex-col gap-3 p-4 rounded-xl border border-border/40 bg-background-secondary/10 transition-all hover:bg-primary/5 hover:border-primary/20"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors line-clamp-1">
                    {assignment.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-tighter bg-background-secondary px-1.5 py-0.5 rounded">
                      {assignment.courseCode}
                    </span>
                  </div>
                </div>
                {isUrgent && (
                  <div className="text-danger flex items-center gap-1 animate-pulse">
                    <AlertCircle size={12} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Urgent</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-[11px] font-medium text-text-muted">
                <div className="flex items-center gap-1.5">
                  <Calendar size={12} className="text-primary" />
                  <span>{new Date(assignment.DueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={12} />
                  <span>Due tonight</span>
                </div>
              </div>
            </Link>
          );
        })
      ) : (
        <div className="p-10 text-center space-y-2">
          <Calendar size={32} className="mx-auto text-text-muted opacity-20" />
          <p className="text-sm font-semibold text-text-muted">No upcoming deadlines</p>
          <p className="text-xs text-text-muted opacity-60">Enjoy your free time!</p>
        </div>
      )}
    </div>
  );
}

export default UpcomingAssignments;
