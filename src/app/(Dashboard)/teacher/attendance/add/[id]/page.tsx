"use client";
import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { FirebaseContext } from "@/app/Context";
import {
  collection,
  doc,
  DocumentData,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { db } from "@/app/Firebase";
import { ChevronLeft, Calendar, Save, UserCheck, UserX, MessageSquare, Sparkles, User, Info } from "lucide-react";
import Link from "next/link";
import { Spinner } from "@/app/Components/ui/spinner";

function Add() {
  const router = useRouter();
  const { id } = useParams();

  const today = new Date().toISOString().split("T")[0];
  const [loading, setLoading] = React.useState(false);
  const [attendance, setAttendance] = React.useState<{
    [key: string]: { present: boolean; remarks: string };
  }>({});
  const { courses } = React.useContext(FirebaseContext)!;
  const [students, setStudents] = React.useState<DocumentData[]>([]);
  const CurrentCourse = courses.find((course) => course.code === id);

  async function handleSubmission(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const attendanceRef = collection(db, "courses", id as string, "attendance");
      const attendanceDoc = doc(attendanceRef, today);
      await setDoc(attendanceDoc, attendance);
      router.push(`/teacher/attendance/course/${id}`);
    } catch (err) {
      console.error(err);
      alert("Could not save. Please check your internet.");
    } finally {
      setLoading(false);
    }
  }

  const handleRemarksChange = (studentId: string, remarks: string) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        remarks,
      },
    }));
  };

  const handleAttendanceChange = (studentId: string, present: boolean) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        present,
      },
    }));
  };

  const toggleAll = (present: boolean) => {
    const newAttendance = { ...attendance };
    students.forEach(student => {
      newAttendance[student.uid] = { ...newAttendance[student.uid], present };
    });
    setAttendance(newAttendance);
  }

  useEffect(() => {
    const studentRef = collection(db, "courses", id as string, "students");
    const fetchStudents = async () => {
      const studentSnap = await getDocs(studentRef);
      const studentList = studentSnap?.docs?.map((doc) => doc.data()) || [];
      setStudents(studentList);

      const initialAttendance: {
        [key: string]: { present: boolean; remarks: string };
      } = {};
      studentList.forEach((student) => {
        initialAttendance[student.uid] = { present: false, remarks: "" };
      });
      setAttendance(initialAttendance);
    };
    fetchStudents();
  }, [id]);

  const presentCount = Object.values(attendance).filter(a => a.present).length;
  const totalCount = students.length;

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
            Attendance
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Sparkles size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-text-primary uppercase leading-tight">
                Mark Attendance <span className="text-primary">.</span>
              </h1>
              <p className="text-text-muted text-sm font-bold uppercase tracking-widest flex items-center gap-2 mt-1 opacity-70">
                <Calendar size={14} className="text-primary" /> {CurrentCourse?.title}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden lg:block text-right mr-4">
            <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-1">Marked</p>
            <p className="text-xl font-black text-text-primary tracking-tighter">
              <span className="text-primary">{presentCount}</span> / {totalCount}
            </p>
          </div>
          <button
            onClick={handleSubmission}
            disabled={loading}
            className="group flex items-center justify-center gap-3 bg-primary text-white px-10 py-4 rounded-2xl font-black text-sm transition-all shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 active:scale-95 disabled:opacity-50"
          >
            {loading ? <Spinner className="w-5 h-5 border-white" /> : <Save size={18} />}
            {loading ? "Saving..." : "Save Attendance"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Attendance List */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between px-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => toggleAll(true)}
                className="text-[10px] font-black text-success uppercase tracking-widest border border-success/20 bg-success/5 px-4 py-2 rounded-xl hover:bg-success hover:text-white transition-all shadow-sm active:scale-95"
              >
                Mark All Present
              </button>
              <button
                onClick={() => toggleAll(false)}
                className="text-[10px] font-black text-danger uppercase tracking-widest border border-danger/20 bg-danger/5 px-4 py-2 rounded-xl hover:bg-danger hover:text-white transition-all shadow-sm active:scale-95"
              >
                Reset Selection
              </button>
            </div>
            <div className="flex items-center gap-2 text-text-muted text-[10px] font-bold uppercase tracking-widest opacity-60">
              <Info size={14} /> Click save to finalize
            </div>
          </div>

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
                  {students.map((student) => {
                    const isPresent = attendance[student.uid]?.present;
                    return (
                      <tr
                        key={student.uid}
                        className={`group transition-all duration-300 ${isPresent ? 'bg-primary/[0.04]' : 'hover:bg-primary/[0.02]'}`}
                      >
                        <td className="py-5 px-8">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${isPresent ? 'bg-primary border-primary/20 text-white scale-110 shadow-lg shadow-primary/20' : 'bg-background-secondary border-border/50 text-text-muted'}`}>
                              <User size={18} />
                            </div>
                            <div className="flex flex-col">
                              <span className={`font-bold transition-colors ${isPresent ? 'text-primary' : 'text-text-primary'}`}>{student.name}</span>
                              <span className="text-[10px] font-black text-text-muted uppercase tracking-tighter opacity-70">UID: {student.uid.slice(-6)}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-5 px-8">
                          <div className="flex items-center justify-center">
                            <button
                              onClick={() => handleAttendanceChange(student.uid, !isPresent)}
                              className={`w-16 h-8 rounded-full border transition-all relative flex items-center px-1 ${isPresent ? 'bg-success/20 border-success/40' : 'bg-background-secondary border-border/50'}`}
                            >
                              <div className={`w-6 h-6 rounded-full shadow-md transition-all flex items-center justify-center ${isPresent ? 'translate-x-8 bg-success text-white' : 'translate-x-0 bg-text-muted text-card'}`}>
                                {isPresent ? <UserCheck size={12} /> : <UserX size={12} />}
                              </div>
                            </button>
                          </div>
                        </td>
                        <td className="py-5 px-8">
                          <div className="relative group/remark">
                            <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted opacity-40 group-focus-within/remark:text-primary transition-colors" size={14} />
                            <input
                              type="text"
                              placeholder="Add a note..."
                              value={attendance[student.uid]?.remarks || ""}
                              onChange={(e) => handleRemarksChange(student.uid, e.target.value)}
                              className="w-full bg-background-secondary/30 border border-border/50 rounded-xl py-2.5 pl-9 pr-4 outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/50 transition-all font-semibold text-xs placeholder:text-text-muted/30"
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Action Sidebar */}
        <div className="space-y-6">
          <div className="bg-card/40 border border-border/40 rounded-[2rem] p-6 shadow-xl backdrop-blur-xl">
            <h3 className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-6 border-b border-border/20 pb-2 flex items-center gap-2">
              <Calendar size={14} className="text-primary" /> Class Date
            </h3>
            <div className="space-y-4">
              <div className="space-y-2 group">
                <label className="text-[9px] font-black uppercase tracking-widest text-text-muted px-1 group-focus-within:text-primary">Today's Date</label>
                <input
                  type="date"
                  defaultValue={today}
                  className="w-full bg-background-secondary/50 border border-border/50 rounded-2xl py-3 px-5 outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/50 transition-all font-mono font-bold text-sm text-text-primary"
                />
              </div>
              <div className="pt-4 space-y-3">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">
                  <span>Status</span>
                  <span className="text-success flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" /> In Session</span>
                </div>
                <div className="h-px bg-border/20" />
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">
                  <span>Visibility</span>
                  <span className="text-text-primary">Publicly Visible</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-[2rem] p-6 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Info size={20} />
            </div>
            <h4 className="font-black text-xs uppercase tracking-widest text-text-primary">Quick Note</h4>
            <p className="text-text-muted text-xs leading-relaxed font-semibold">
              Mark students as present or absent and click save. You can also add brief notes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Add;
