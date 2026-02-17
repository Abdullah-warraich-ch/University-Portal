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
    <div className="space-y-4 max-h-[400px] overflow-y-auto premium-scrollbar p-3">
      {assignments.length > 0 ? (
        assignments.map((assignment, index) => {
          const isUrgent = new Date(assignment.DueDate).getTime() - new Date().getTime() < 86400000 * 2;

          return (
            <Link
              key={index}
              href={`/student/grades/${assignment.courseCode}`}
              className="group relative overflow-hidden flex flex-col gap-3 p-4 rounded-2xl border border-border/40 bg-card/40 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/30"
            >
              <div className="flex items-start justify-between">
                <div className="z-10">
                  <h4 className="text-sm font-black text-text-primary group-hover:text-primary transition-colors line-clamp-1 uppercase tracking-tight">
                    {assignment.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[9px] font-black text-primary uppercase tracking-[0.1em] bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-lg">
                      {assignment.courseCode}
                    </span>
                  </div>
                </div>
                {isUrgent && (
                  <div className="z-10 text-danger flex items-center gap-1.5 px-3 py-1 rounded-full bg-danger/10 border border-danger/20 animate-pulse-subtle">
                    <AlertCircle size={10} />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em]">Urgent</span>
                  </div>
                )}
              </div>

              <div className="z-10 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-text-muted mt-2">
                <div className="flex items-center gap-2">
                  <Calendar size={12} className="text-primary/60" />
                  <span className="opacity-80">{new Date(assignment.DueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={12} className="text-primary/40" />
                  <span className="opacity-60 italic">23:59 GMT</span>
                </div>
              </div>

              <div className="absolute top-0 right-0 -m-4 h-16 w-16 bg-primary/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
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
