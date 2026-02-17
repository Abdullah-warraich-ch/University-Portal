"use client";
import { FirebaseContext } from "@/app/Context";
import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { db } from "@/app/Firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { ChevronLeft, GraduationCap, Trophy, Target, Clock, AlertCircle, FileText, Sparkles, Wand2 } from "lucide-react";
import Link from "next/link";
import { Spinner } from "@/app/Components/ui/spinner";

function Course() {
  type GradeRecord = {
    id: string;
    type: string;
    marks: Record<string, number>;
    totalMarks: number;
    title?: string;
  };
  const [grades, setGrades] = useState<GradeRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const { courses, currentUserRecord } = useContext(FirebaseContext)! as any;
  const currentCourse = courses.find((course: any) => course.id === id);
  const uid = currentUserRecord?.uid;

  const toNumber = (value: unknown) => {
    const num = Number(value);
    return Number.isFinite(num) ? num : null;
  };

  const getStudentScore = (grade: GradeRecord) => {
    if (!uid) return null;
    return toNumber(grade.marks?.[uid]);
  };

  function AssignmentNameFinder(type: string, title?: string) {
    if (title) return title;
    switch (type) {
      case "ass1": return "Assignment 1";
      case "ass2": return "Assignment 2";
      case "ass3": return "Assignment 3";
      case "ass4": return "Assignment 4";
      case "quiz1": return "Quiz 1";
      case "quiz2": return "Quiz 2";
      case "quiz3": return "Quiz 3";
      case "quiz4": return "Quiz 4";
      case "midterm": return "Mid Semester Exam";
      case "final": return "Final Exam";
      default: return "Other Assignment";
    }
  }

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    const gradeRef = collection(db, "courses", id as string, "grades");
    const unsub = onSnapshot(gradeRef, (snap) => {
      const gradeData = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as GradeRecord[];
      setGrades(gradeData);
      setIsLoading(false);
    });
    return () => unsub();
  }, [id]);

  if (!currentCourse && !isLoading) {
    return (
      <div className="p-8 animate-in fade-in duration-500">
        <div className="rounded-[2.5rem] border border-border/40 bg-card/40 backdrop-blur-xl p-10 text-center shadow-2xl">
          <AlertCircle className="mx-auto text-danger mb-4" size={48} />
          <h1 className="text-2xl font-black text-text-primary uppercase tracking-tight">Course Not Found</h1>
          <Link href="/student" className="mt-8 inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all">
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const markedGrades = grades.filter((grade) => getStudentScore(grade) !== null);
  const obtainedMarks = markedGrades.reduce((sum, grade) => sum + (getStudentScore(grade) ?? 0), 0);
  const totalMarks = markedGrades.reduce((sum, grade) => sum + Math.max(0, toNumber(grade.totalMarks) ?? 0), 0);
  const overallPercent = totalMarks > 0 ? (obtainedMarks / totalMarks) * 100 : 0;
  const pendingCount = grades.length - markedGrades.length;

  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <Link
            href="/student"
            className="inline-flex items-center gap-2 text-text-muted hover:text-primary transition-colors text-xs font-black uppercase tracking-widest mb-2 group"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-lg shadow-primary/5">
              <Trophy size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-text-primary uppercase leading-tight">
                My Grades <span className="text-primary">.</span>
              </h1>
              <p className="text-text-muted text-sm font-bold uppercase tracking-widest flex items-center gap-2 mt-1 opacity-70">
                <GraduationCap size={14} className="text-primary" /> {currentCourse?.title} • {currentCourse?.code}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card/40 border border-border/40 px-5 py-3 rounded-2xl backdrop-blur-xl flex items-center gap-3">
          <Wand2 size={16} className="text-primary animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">
            Status: <span className="text-text-primary">{markedGrades.length} / {grades.length} Marked</span>
          </span>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Score', value: `${overallPercent.toFixed(1)}%`, icon: Target, color: 'primary', bar: true },
          { label: 'Obtained Marks', value: `${obtainedMarks} / ${totalMarks}`, icon: FileText, color: 'success' },
          { label: 'Pending Tasks', value: pendingCount, icon: Clock, color: pendingCount > 0 ? 'warning' : 'success' }
        ].map((stat, i) => (
          <div key={i} className="bg-card/30 border border-border/40 rounded-3xl p-6 relative group overflow-hidden hover:border-primary/20 transition-all shadow-xl">
            <div className={`w-12 h-12 rounded-2xl bg-${stat.color}/10 border border-${stat.color}/20 flex items-center justify-center text-${stat.color} mb-4`}>
              <stat.icon size={22} />
            </div>
            <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-3xl font-black tracking-tighter text-text-primary">{stat.value}</p>

            {stat.bar && (
              <div className="mt-4 h-1.5 w-full bg-background-secondary rounded-full overflow-hidden border border-border/20">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min(100, overallPercent)}%` }}
                />
              </div>
            )}

            <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
              <stat.icon size={80} />
            </div>
          </div>
        ))}
      </div>

      {/* Grades Table */}
      <div className="relative overflow-hidden rounded-[2.5rem] border border-border/40 bg-card/20 shadow-2xl backdrop-blur-2xl">
        <div className="overflow-x-auto premium-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background-secondary/50 border-b border-border/20">
                <th className="py-5 px-8 font-black text-[10px] uppercase tracking-[0.25em] text-text-primary/40">Assignment / Exam</th>
                <th className="py-5 px-8 font-black text-[10px] uppercase tracking-[0.25em] text-text-primary/40">My Marks</th>
                <th className="py-5 px-8 font-black text-[10px] uppercase tracking-[0.25em] text-text-primary/40">Total</th>
                <th className="py-5 px-8 font-black text-[10px] uppercase tracking-[0.25em] text-text-primary/40 text-right">Result %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/10">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="py-24 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <Spinner className="w-8 h-8 text-primary" />
                      <span className="text-xs font-black uppercase tracking-widest text-text-muted opacity-40">Fetching results...</span>
                    </div>
                  </td>
                </tr>
              ) : grades.length > 0 ? (
                grades.map((grade) => {
                  const score = getStudentScore(grade);
                  const hasMarks = score !== null;
                  const maxMarks = Math.max(0, toNumber(grade.totalMarks) ?? 0);
                  const percent = hasMarks && maxMarks > 0 ? (score / maxMarks) * 100 : null;

                  return (
                    <tr key={grade.id} className="group hover:bg-primary/[0.04] transition-all">
                      <td className="py-6 px-8">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-background-secondary border border-border/50 flex items-center justify-center text-text-muted transition-transform group-hover:scale-110">
                            <FileText size={18} />
                          </div>
                          <div>
                            <span className="block font-bold text-text-primary leading-none mb-1 group-hover:text-primary transition-colors">
                              {AssignmentNameFinder(grade.type, grade.title)}
                            </span>
                            <span className="text-[9px] font-black text-text-muted uppercase tracking-widest opacity-60">ID: {grade.id.substring(0, 8)}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-6 px-8">
                        <span className={`text-sm font-black tracking-tight ${hasMarks ? "text-text-primary" : "text-text-muted italic opacity-50"}`}>
                          {hasMarks ? score : "Pending..."}
                        </span>
                      </td>
                      <td className="py-6 px-8">
                        <span className="text-sm font-bold text-text-muted">{maxMarks}</span>
                      </td>
                      <td className="py-6 px-8 text-right">
                        {percent !== null ? (
                          <div className="inline-flex items-center gap-2">
                            <div className="hidden sm:block h-1 w-12 bg-background-secondary rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${percent >= 80 ? 'bg-success' : percent >= 50 ? 'bg-primary' : 'bg-danger'}`}
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                            <span className={`inline-flex px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${percent >= 80 ? "bg-success/10 text-success" :
                                percent >= 50 ? "bg-primary/10 text-primary" :
                                  "bg-danger/10 text-danger"
                              }`}>
                              {Math.round(percent)}%
                            </span>
                          </div>
                        ) : (
                          <span className="text-[10px] font-black text-text-muted/40 uppercase tracking-widest">Unavailable</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} className="py-32 text-center">
                    <div className="opacity-30 flex flex-col items-center gap-4">
                      <Sparkles size={40} className="text-text-muted" />
                      <p className="text-xs font-black text-text-muted uppercase tracking-[0.3em]">No records found.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Course;
