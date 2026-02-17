"use client";
import React, { use, useEffect } from "react";
import { FirebaseContext } from "@/app/Context";
import { useParams } from "next/navigation";
import Link from "next/link";
import { db } from "@/app/Firebase";
import { collection, DocumentData, getDocs } from "firebase/firestore";

import { ChevronLeft, GraduationCap, Plus, ListChecks, Calendar, ExternalLink, Settings2, FileText, AlertCircle } from "lucide-react";

function CourseContent() {
  const { courses } = React.useContext(FirebaseContext)!;
  const [grades, setGrades] = React.useState<DocumentData[]>([]);
  const { id } = useParams();
  const course = courses.find((course) => course.code === id);

  useEffect(() => {
    const fetchData = async () => {
      const GradeRef = collection(db, "courses", id as string, "grades");
      const gradeSnap = await getDocs(GradeRef);
      const gradesData = gradeSnap.docs.map((doc) => doc.data());
      setGrades(gradesData);
    };
    fetchData();
  }, [id]);

  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <Link
            href="/teacher"
            className="inline-flex items-center gap-2 text-text-muted hover:text-primary transition-colors text-xs font-black uppercase tracking-widest mb-2 group"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-lg shadow-primary/5">
              <GraduationCap size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-text-primary uppercase leading-tight">
                {course?.title || "Course Details"} <span className="text-primary">.</span>
              </h1>
              <p className="text-text-muted text-sm font-bold uppercase tracking-widest flex items-center gap-2 mt-1 opacity-70">
                <FileText size={14} className="text-primary" /> Manage Assignments & Grades
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/teacher/courses/${id}/add`}
            className="group flex items-center justify-center gap-2 bg-background border border-border/50 text-text-primary px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all hover:bg-primary/5 hover:border-primary/20 active:scale-95"
          >
            <Plus size={16} />
            New Assignment
          </Link>
          <Link
            href={`/teacher/courses/${id}/grade`}
            className="group flex items-center justify-center gap-2 bg-primary text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 active:scale-95"
          >
            <ListChecks size={16} />
            Quick Grade
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-4">
          <h2 className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] flex items-center gap-2">
            <Settings2 size={14} className="text-primary" /> Active Tasks & Assessments
          </h2>
          <span className="text-[9px] font-black text-text-muted/40 uppercase tracking-widest">{grades.length} Total Entries</span>
        </div>

        <div className="relative overflow-hidden rounded-[2.5rem] border border-border/40 bg-card/30 backdrop-blur-2xl shadow-2xl">
          <div className="overflow-x-auto premium-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-background-secondary/50 border-b border-border/20">
                  <th className="py-5 px-8 font-black text-[10px] uppercase tracking-[0.2em] text-text-primary/40">Category</th>
                  <th className="py-5 px-8 font-black text-[10px] uppercase tracking-[0.2em] text-text-primary/40">Task Name</th>
                  <th className="py-5 px-8 font-black text-[10px] uppercase tracking-[0.2em] text-text-primary/40">Max Score</th>
                  <th className="py-5 px-8 font-black text-[10px] uppercase tracking-[0.2em] text-text-primary/40">Deadline</th>
                  <th className="py-5 px-8 font-black text-[10px] uppercase tracking-[0.2em] text-text-primary/40 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/10">
                {grades.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-32 text-center">
                      <div className="flex flex-col items-center gap-4 opacity-30">
                        <AlertCircle size={48} />
                        <p className="text-xs font-black uppercase tracking-widest">No tasks found for this course</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  grades.map((grade, index) => (
                    <tr
                      key={index}
                      className="group transition-all duration-300 hover:bg-primary/[0.02]"
                    >
                      <td className="py-6 px-8">
                        <span className="text-[10px] font-black px-2.5 py-1 rounded-lg bg-primary/10 text-primary uppercase tracking-tighter">
                          {grade.type}
                        </span>
                      </td>
                      <td className="py-6 px-8">
                        <div className="flex flex-col">
                          <span className="font-bold text-text-primary group-hover:text-primary transition-colors">{grade.title}</span>
                          <span className="text-[10px] font-semibold text-text-muted/60 mt-0.5 max-w-[200px] truncate">{grade.description}</span>
                        </div>
                      </td>
                      <td className="py-6 px-8">
                        <span className="text-sm font-black text-text-primary">{grade.totalMarks}</span>
                      </td>
                      <td className="py-6 px-8">
                        <div className="flex items-center gap-2 text-text-muted">
                          <Calendar size={14} className="opacity-40" />
                          <span className="text-[11px] font-bold">{grade.DueDate || "No date set"}</span>
                        </div>
                      </td>
                      <td className="py-6 px-8">
                        <div className="flex items-center justify-center gap-2">
                          {!grade.graded ? (
                            <Link
                              href={`/teacher/courses/${id}/grade/${grade.type}`}
                              className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all active:scale-95"
                            >
                              Grade Now
                              <ExternalLink size={12} />
                            </Link>
                          ) : (
                            <Link
                              href={`/teacher/courses/${id}/view/${grade.type}`}
                              className="inline-flex items-center gap-2 bg-success text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-success/20 active:scale-95"
                            >
                              View Grades
                              <ExternalLink size={12} />
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseContent;
