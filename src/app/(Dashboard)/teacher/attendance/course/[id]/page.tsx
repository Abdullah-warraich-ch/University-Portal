"use client";
import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { FirebaseContext } from "@/app/Context";
import Link from "next/link";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/app/Firebase";
import { ChevronLeft, Calendar, Users, UserCheck, UserX, Eye, Sparkles, BookOpen } from "lucide-react";

function Course() {
  type StudentAttendance = {
    present: boolean;
    remarks: string;
  };
  type AttendanceDocument = {
    id: string; // date (doc.id)
    [studentId: string]: StudentAttendance | string;
  };

  function isStudentAttendance(value: unknown): value is StudentAttendance {
    return (
      typeof value === "object" &&
      value !== null &&
      "present" in value &&
      "remarks" in value
    );
  }

  const { id } = useParams();
  const router = useRouter();
  const { courses } = React.useContext(FirebaseContext)!;
  const [attendanceRecords, setAttendanceRecords] = React.useState<
    AttendanceDocument[]
  >([]);

  const currentCourse = courses.find((course) => course.code === id);

  useEffect(() => {
    const AttendanceRef = collection(db, "courses", id as string, "attendance");
    const fetchAttendance = async () => {
      const attendanceSnapshot = await getDocs(AttendanceRef);
      const attendanceData: AttendanceDocument[] = attendanceSnapshot.docs.map(
        (doc) => ({
          id: doc.id,
          ...(doc.data() as Record<string, StudentAttendance>),
        }),
      );
      setAttendanceRecords(attendanceData.sort((a, b) => b.id.localeCompare(a.id)));
    };
    fetchAttendance();
  }, [id]);

  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <Link
            href="/teacher/attendance"
            className="inline-flex items-center gap-2 text-text-muted hover:text-primary transition-colors text-xs font-black uppercase tracking-widest mb-2 group"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <BookOpen size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-text-primary uppercase leading-tight">
                {currentCourse?.title} <span className="text-primary">.</span>
              </h1>
              <p className="text-text-muted text-sm font-bold uppercase tracking-widest flex items-center gap-2 mt-1 opacity-70">
                <Calendar size={14} className="text-primary" /> Attendance History
              </p>
            </div>
          </div>
        </div>

        <Link
          href={`/teacher/attendance/add/${id}`}
          className="group flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-2xl font-black text-sm transition-all shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 active:scale-95"
        >
          <Sparkles size={18} className="group-hover:rotate-12 transition-transform" />
          Mark New Attendance
        </Link>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Sessions', value: attendanceRecords.length, icon: Calendar, color: 'primary' },
          { label: 'Average Attendance', value: '84%', icon: Users, color: 'success' },
          { label: 'Completion', value: '18/32', icon: Sparkles, color: 'warning' }
        ].map((stat, i) => (
          <div key={i} className="bg-card/40 border border-border/40 rounded-3xl p-5 backdrop-blur-xl flex items-center gap-4 group hover:border-primary/30 transition-all">
            <div className={`w-12 h-12 rounded-2xl bg-${stat.color}/10 border border-${stat.color}/20 flex items-center justify-center text-${stat.color}`}>
              <stat.icon size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-text-muted uppercase tracking-widest leading-none mb-1">{stat.label}</p>
              <p className="text-2xl font-black text-text-primary tracking-tighter">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Attendance Table */}
      <div className="relative overflow-hidden rounded-[2.5rem] border border-border/40 bg-card/30 backdrop-blur-2xl shadow-2xl">
        <div className="overflow-x-auto premium-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background-secondary/50 border-b border-border/20">
                <th className="py-5 px-8 font-black text-[10px] uppercase tracking-[0.2em] text-text-primary/40">Date</th>
                <th className="py-5 px-8 font-black text-[10px] uppercase tracking-[0.2em] text-text-primary/40">Students Marked</th>
                <th className="py-5 px-8 font-black text-[10px] uppercase tracking-[0.2em] text-text-primary/40">Present</th>
                <th className="py-5 px-8 font-black text-[10px] uppercase tracking-[0.2em] text-text-primary/40">Absent</th>
                <th className="py-5 px-8 font-black text-[10px] uppercase tracking-[0.2em] text-text-primary/40 text-right">Attendance %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/10">
              {attendanceRecords.length > 0 ? (
                attendanceRecords.map((day) => {
                  const { id: date, ...records } = day;
                  const studentRecords = Object.values(records).filter(isStudentAttendance);
                  const total = studentRecords.length;
                  const present = studentRecords.filter((r) => r.present).length;
                  const absent = total - present;
                  const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

                  return (
                    <tr key={date} className="group hover:bg-primary/[0.03] transition-colors">
                      <td className="py-6 px-8">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-background-secondary border border-border/50 flex items-center justify-center text-text-muted group-hover:text-primary transition-colors">
                            <Calendar size={18} />
                          </div>
                          <span className="font-mono text-sm font-black text-text-primary tracking-tighter">{date}</span>
                        </div>
                      </td>
                      <td className="py-6 px-8 font-bold text-text-primary/70">{total} Students</td>
                      <td className="py-6 px-8">
                        <div className="flex items-center gap-2 text-success font-black text-sm">
                          <UserCheck size={16} /> {present}
                        </div>
                      </td>
                      <td className="py-6 px-8">
                        <div className="flex items-center gap-2 text-danger font-black text-sm opacity-60">
                          <UserX size={16} /> {absent}
                        </div>
                      </td>
                      <td className="py-6 px-8 text-right">
                        <div className="flex items-center justify-end gap-4">
                          <div className="hidden md:flex flex-col items-end gap-1">
                            <div className="h-1.5 w-24 bg-background-secondary rounded-full overflow-hidden border border-border/20">
                              <div
                                className="h-full bg-primary rounded-full"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-[9px] font-black text-text-muted uppercase tracking-tighter">{percentage}% Attendance</span>
                          </div>
                          <Link
                            href={`/teacher/attendance/course/${id}/${date}`}
                            className="p-3 rounded-2xl border border-border/50 bg-background-secondary/50 text-text-muted hover:text-primary hover:bg-primary/10 hover:border-primary/30 transition-all active:scale-95 shadow-sm"
                          >
                            <Eye size={18} />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <p className="text-text-muted font-bold text-sm tracking-widest uppercase opacity-40">No attendance records found for this period</p>
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
