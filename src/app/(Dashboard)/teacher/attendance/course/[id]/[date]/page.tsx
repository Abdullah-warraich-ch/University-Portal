"use client";
import { db } from "@/app/Firebase";
import { doc, getDoc, collection, DocumentData } from "firebase/firestore";
import { useContext, useState } from "react";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { FindName } from "@/app/Components/teacher/actions/findStudentName";

import { ChevronLeft, Calendar, Users, UserCheck, UserX, FileText, GraduationCap } from "lucide-react";
import Link from "next/link";

export default function AttendanceDay() {
  interface AttendanceInfo {
    present: boolean;
    remarks?: string;
  }

  const { id, date } = useParams();
  const [attendanceData, setAttendanceData] = useState<Record<string, AttendanceInfo>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      setIsLoading(true);
      try {
        const AttendanceRef = doc(db, "courses", id as string, "attendance", date as string);
        const AttendanceSnap = await getDoc(AttendanceRef);
        if (AttendanceSnap.exists()) {
          setAttendanceData(AttendanceSnap.data() as Record<string, AttendanceInfo>);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAttendanceData();
  }, [date, id]);

  const studentEntries = Object.entries(attendanceData).filter(([key]) => key !== 'id');
  const presentCount = studentEntries.filter(([_, info]) => info.present).length;
  const totalCount = studentEntries.length;

  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <Link
            href={`/teacher/attendance/course/${id}`}
            className="inline-flex items-center gap-2 text-text-muted hover:text-primary transition-colors text-xs font-black uppercase tracking-widest mb-2 group"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to History
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-lg shadow-primary/5">
              <Calendar size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-text-primary uppercase leading-tight">
                Class Attendance <span className="text-primary">.</span>
              </h1>
              <p className="text-text-muted text-sm font-bold uppercase tracking-widest flex items-center gap-2 mt-1 opacity-70">
                <GraduationCap size={14} className="text-primary" /> {id} • {date}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-card/40 border border-border/40 rounded-2xl px-5 py-3 backdrop-blur-xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center text-success">
              <UserCheck size={18} />
            </div>
            <div>
              <p className="text-[9px] font-black text-text-muted uppercase tracking-widest leading-none mb-1">Present</p>
              <p className="text-lg font-black text-text-primary tracking-tighter">{presentCount} / {totalCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative overflow-hidden rounded-[2.5rem] border border-border/40 bg-card/30 backdrop-blur-2xl shadow-2xl">
        <div className="overflow-x-auto premium-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background-secondary/50 border-b border-border/20">
                <th className="py-5 px-8 font-black text-[10px] uppercase tracking-[0.2em] text-text-primary/40">Student Name</th>
                <th className="py-5 px-8 font-black text-[10px] uppercase tracking-[0.2em] text-text-primary/40 text-center">Status</th>
                <th className="py-5 px-8 font-black text-[10px] uppercase tracking-[0.2em] text-text-primary/40">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/10">
              {isLoading ? (
                <tr>
                  <td colSpan={3} className="py-20 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  </td>
                </tr>
              ) : studentEntries.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-20 text-center">
                    <p className="text-text-muted font-bold text-xs uppercase tracking-widest opacity-40">No records found for this day</p>
                  </td>
                </tr>
              ) : (
                studentEntries.map(([studentId, info]) => (
                  <tr key={studentId} className="group hover:bg-primary/[0.02] transition-colors">
                    <td className="py-6 px-8">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                          {studentId.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="font-bold text-text-primary group-hover:text-primary transition-colors">{FindName(studentId)}</span>
                      </div>
                    </td>
                    <td className="py-6 px-8 text-center text-center justify-center">
                      <div className="flex justify-center">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${info.present
                            ? "bg-success/10 text-success"
                            : "bg-danger/10 text-danger"
                          }`}>
                          {info.present ? <UserCheck size={12} /> : <UserX size={12} />}
                          {info.present ? "Present" : "Absent"}
                        </span>
                      </div>
                    </td>
                    <td className="py-6 px-8">
                      <div className="flex items-center gap-2 text-text-muted/60 text-sm">
                        <FileText size={14} className="opacity-30 shrink-0" />
                        <span className="italic">{info.remarks || "No notes added"}</span>
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
  );
}
