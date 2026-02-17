"use client";
import React, { useContext, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FirebaseContext } from "@/app/Context";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/app/Firebase";
import { ChevronLeft, Calendar, UserCheck, UserX, AlertTriangle, Sparkles, BookOpen, Clock } from "lucide-react";
import Link from "next/link";
import { Spinner } from "@/app/Components/ui/spinner";

function Attendance() {
  type AttendanceDocument = {
    id: string;
  } & Record<
    string,
    {
      present: boolean;
      remarks: string;
    }
  >;

  const { id } = useParams();
  const router = useRouter();
  const { courses, currentUserRecord } = useContext(FirebaseContext)! as any;
  const currentCourse = courses.find((course: any) => course.id === id);
  const [attendance, setAttendance] = useState<AttendanceDocument[]>([]);
  const [totalPresent, setTotalPresent] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const uid = currentUserRecord?.uid;

  useEffect(() => {
    const fetchUserAttendance = async () => {
      if (!id || !uid) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const attendanceRef = collection(db, "courses", String(id), "attendance");
      const attendanceSnap = await getDocs(attendanceRef);
      const attendanceData = attendanceSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as AttendanceDocument[];

      attendanceData.sort((a, b) => b.id.localeCompare(a.id));

      const presentCount = attendanceData.reduce((count, record) => {
        return record[uid]?.present ? count + 1 : count;
      }, 0);

      setTotalPresent(presentCount);
      setAttendance(attendanceData);
      setIsLoading(false);
    };

    fetchUserAttendance();
  }, [id, uid]);

  if (!currentCourse && !isLoading) {
    return (
      <div className="p-8 animate-in fade-in duration-500">
        <div className="rounded-[2.5rem] border border-border/40 bg-card/40 backdrop-blur-xl p-10 text-center shadow-2xl">
          <AlertTriangle className="mx-auto text-danger mb-4" size={48} />
          <h1 className="text-2xl font-black text-text-primary uppercase tracking-tight">Course Not Found</h1>
          <p className="mt-2 text-sm text-text-muted font-bold opacity-60 uppercase tracking-widest leading-relaxed">
            This course doesn't seem to be in your enrollment list.
          </p>
          <Link href="/student" className="mt-8 inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all">
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const totalClasses = attendance.length;
  const attendancePercent = totalClasses > 0 ? (totalPresent / totalClasses) * 100 : 0;
  const isBelowThreshold = totalClasses > 0 && attendancePercent < 75;

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
              <Clock size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-text-primary uppercase leading-tight">
                Attendance Details <span className="text-primary">.</span>
              </h1>
              <p className="text-text-muted text-sm font-bold uppercase tracking-widest flex items-center gap-2 mt-1 opacity-70">
                <BookOpen size={14} className="text-primary" /> {currentCourse?.title || "Course Details"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-card/40 border border-border/40 px-5 py-3 rounded-2xl backdrop-blur-xl">
          <div className={`w-3 h-3 rounded-full ${isBelowThreshold ? 'bg-danger animate-pulse' : 'bg-success shadow-[0_0_10px_rgba(16,185,129,0.5)]'}`} />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">
            Status: <span className={isBelowThreshold ? 'text-danger' : 'text-success'}>{isBelowThreshold ? 'Low' : 'Good'}</span>
          </span>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Classes', value: totalClasses, icon: Calendar, color: 'primary' },
          { label: 'Classes Attended', value: totalPresent, icon: UserCheck, color: 'success' },
          { label: 'Attendance %', value: `${attendancePercent.toFixed(1)}%`, icon: Sparkles, color: isBelowThreshold ? 'danger' : 'primary' }
        ].map((stat, i) => (
          <div key={i} className="bg-card/30 border border-border/40 rounded-3xl p-6 relative group overflow-hidden hover:border-primary/20 transition-all shadow-xl">
            <div className={`w-12 h-12 rounded-2xl bg-${stat.color}/10 border border-${stat.color}/20 flex items-center justify-center text-${stat.color} mb-4`}>
              <stat.icon size={22} />
            </div>
            <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">{stat.label}</p>
            <p className={`text-4xl font-black tracking-tighter text-${stat.color === 'danger' ? 'danger' : 'text-primary'}`}>{stat.value}</p>

            {stat.label === 'Avg Presence' && (
              <div className="mt-4 h-1.5 w-full bg-background-secondary rounded-full overflow-hidden border border-border/20">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${isBelowThreshold ? 'bg-danger' : 'bg-primary'}`}
                  style={{ width: `${Math.min(100, attendancePercent)}%` }}
                />
              </div>
            )}

            <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
              <stat.icon size={80} />
            </div>
          </div>
        ))}
      </div>

      {/* Attendance History */}
      <div className="relative overflow-hidden rounded-[2.5rem] border border-border/40 bg-card/20 shadow-2xl backdrop-blur-2xl">
        <div className="overflow-x-auto premium-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background-secondary/50 border-b border-border/20">
                <th className="py-5 px-8 font-black text-[10px] uppercase tracking-[0.25em] text-text-primary/40">Date</th>
                <th className="py-5 px-8 font-black text-[10px] uppercase tracking-[0.25em] text-text-primary/40">Status</th>
                <th className="py-5 px-8 font-black text-[10px] uppercase tracking-[0.25em] text-text-primary/40 text-right">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/10">
              {isLoading ? (
                <tr>
                  <td colSpan={3} className="py-24 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <Spinner className="w-8 h-8 text-primary" />
                      <span className="text-xs font-black uppercase tracking-widest text-text-muted opacity-40">Loading records...</span>
                    </div>
                  </td>
                </tr>
              ) : attendance.length > 0 ? (
                attendance.map((item) => {
                  const isPresent = Boolean(item[uid!]?.present);
                  return (
                    <tr key={item.id} className="group hover:bg-primary/[0.04] transition-all">
                      <td className="py-6 px-8">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-background-secondary border border-border/50 flex items-center justify-center text-text-muted transition-transform group-hover:scale-110">
                            <Calendar size={18} />
                          </div>
                          <span className="font-mono text-sm font-black text-text-primary tracking-tighter opacity-80">{item.id}</span>
                        </div>
                      </td>
                      <td className="py-6 px-8">
                        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest ${isPresent
                          ? "bg-success/5 border-success/30 text-success"
                          : "bg-danger/5 border-danger/30 text-danger"
                          }`}>
                          {isPresent ? <UserCheck size={12} /> : <UserX size={12} />}
                          {isPresent ? "Present" : "Absent"}
                        </div>
                      </td>
                      <td className="py-6 px-8 text-right">
                        <span className={`text-xs font-semibold ${item[uid!]?.remarks ? 'text-text-primary/80 italic' : 'text-text-muted/30 uppercase tracking-tighter'}`}>
                          {item[uid!]?.remarks || "No notes"}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={3} className="py-32 text-center">
                    <div className="opacity-30 flex flex-col items-center gap-4">
                      <Sparkles size={40} className="text-text-muted" />
                      <p className="text-xs font-black text-text-muted uppercase tracking-[0.3em]">No attendance recorded yet</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isBelowThreshold && (
        <div className="bg-danger/5 border border-danger/20 rounded-3xl p-6 flex items-center gap-4 animate-bounce-subtle">
          <div className="w-10 h-10 rounded-2xl bg-danger/10 border border-danger/20 flex items-center justify-center text-danger">
            <AlertTriangle size={20} />
          </div>
          <div>
            <h4 className="font-black text-sm text-danger uppercase tracking-tight leading-none mb-1">Attendance Alert</h4>
            <p className="text-xs font-bold text-danger/70 leading-relaxed uppercase opacity-80">
              Your attendance is below 75%. Try to attend more classes to stay on track.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Attendance;
