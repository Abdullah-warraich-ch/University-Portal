"use client";
import React, { useContext, useEffect, useState } from "react";
import Heading from "../../universal/Heading";
import { FirebaseContext } from "@/app/Context";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/app/Firebase";
import { CheckCircle2, XCircle, Info, Activity } from "lucide-react";

interface StudentAttendance {
  present: boolean;
  remarks: string;
}

interface AttendanceRecord {
  id: string;
  code: string;
  data: Record<string, StudentAttendance | boolean | number>;
}

function AverageAttendance() {
  const { currentUserRecord, enrolledCourses } = useContext(
    FirebaseContext,
  ) as unknown as {
    currentUserRecord: {
      uid?: string;
      name?: string;
      email?: string;
      registeredCourses?: string[];
    } | null;
    enrolledCourses: { code?: string; title?: string; teacher?: string }[];
  };

  const [currentUserAttendance, setCurrentUserAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUserRecord?.uid || !currentUserRecord.registeredCourses?.length) {
      setLoading(false);
      return;
    }

    const fetchUserAttendance = async () => {
      const userAttendanceArray: AttendanceRecord[] = [];
      const courses = currentUserRecord.registeredCourses ?? [];

      await Promise.all(
        courses.map(async (code) => {
          const AttendanceRef = collection(db, "courses", code, "attendance");
          const snapshot = await getDocs(AttendanceRef);
          let presentCount = 0;
          let totalCount = 0;

          snapshot.forEach((doc) => {
            const data = doc.data();
            if (currentUserRecord.uid && currentUserRecord.uid in data) {
              const raw = data[currentUserRecord.uid];
              let value: number | null = null;

              if (typeof raw === "boolean") {
                value = raw ? 1 : 0;
              } else if (typeof raw === "number") {
                value = raw;
              } else if (raw && typeof raw === "object" && "present" in raw) {
                value = (raw as StudentAttendance).present ? 1 : 0;
              }

              if (value !== null) {
                presentCount += value;
                totalCount += 1;
              }
            }
          });

          if (totalCount > 0) {
            userAttendanceArray.push({
              id: `average-${code}`,
              code,
              data: { average: presentCount / totalCount },
            });
          }
        }),
      );

      setCurrentUserAttendance(userAttendanceArray);
      setLoading(false);
    };

    fetchUserAttendance();
  }, [currentUserRecord]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Activity className="animate-pulse text-primary mr-2" />
        <span className="text-text-muted font-medium">Calculating stats...</span>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {enrolledCourses.map((course) => {
          const avgRecord = currentUserAttendance.find(
            (record) => record.id === `average-${course.code}`,
          );
          const avg = avgRecord?.data?.average;
          const percent = typeof avg === "number" ? Math.max(0, Math.min(100, avg * 100)) : 0;
          const isLow = percent < 75;

          return (
            <div
              key={course.code}
              className="group relative overflow-hidden rounded-3xl border border-border/40 bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-primary/20"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="font-bold text-lg text-text-primary group-hover:text-primary transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-xs font-mono text-text-muted uppercase tracking-widest">{course.code}</p>
                </div>
                <div className={`p-2 rounded-xl border ${isLow ? 'bg-danger/10 border-danger/20 text-danger' : 'bg-success/10 border-success/20 text-success'}`}>
                  {isLow ? <XCircle size={20} /> : <CheckCircle2 size={20} />}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-tighter text-text-muted mb-0.5">Presence Rate</p>
                    <p className={`text-3xl font-black tracking-tight ${isLow ? 'text-danger' : 'text-text-primary'}`}>
                      {typeof avg === "number" ? `${percent.toFixed(1)}%` : "N/A"}
                    </p>
                  </div>
                  <div className={`text-[10px] font-bold px-2 py-1 rounded-md border ${isLow ? 'border-danger/20 bg-danger/5 text-danger' : 'border-success/20 bg-success/5 text-success'}`}>
                    {isLow ? "Needs Attention" : "Excelent"}
                  </div>
                </div>

                {typeof avg === "number" ? (
                  <div className="relative h-2.5 w-full rounded-full bg-background-secondary overflow-hidden border border-border/20">
                    <div
                      style={{ width: `${percent}%` }}
                      className={`absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out ${isLow ? "bg-gradient-to-r from-danger to-warning" : "bg-gradient-to-r from-success to-primary"
                        }`}
                    />
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-border/40 p-4 text-center">
                    <Info size={16} className="mx-auto text-text-muted mb-1 opacity-40" />
                    <p className="text-[10px] text-text-muted font-medium italic">Data pending upload</p>
                  </div>
                )}
              </div>
              <div className="absolute bottom-0 right-0 -m-6 h-24 w-24 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AverageAttendance;
