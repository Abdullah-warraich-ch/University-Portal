"use client";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FirebaseContext } from "@/app/Context";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/app/Firebase";

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
  const { courses, currentUserRecord } = useContext(FirebaseContext)!;
  const currentCourse = courses.find((course) => course.id === id);
  const [attendance, setAttendance] = useState<AttendanceDocument[]>([]);
  const [totalPresent, setTotalPresent] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const uid = currentUserRecord?.uid;

  useEffect(() => {
    const fetchUserAttendance = async () => {
      if (!id || !uid) {
        setAttendance([]);
        setTotalPresent(0);
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

      const presentCount = attendanceData.reduce((count, record) => {
        return record[uid]?.present ? count + 1 : count;
      }, 0);

      setTotalPresent(presentCount);
      setAttendance(attendanceData);
      setIsLoading(false);
    };

    fetchUserAttendance();
  }, [id, uid]);

  if (!currentCourse) {
    return (
      <div className="p-8">
        <div className="rounded-2xl border border-border/40 bg-background-secondary/30 p-6">
          <h1 className="text-xl font-bold text-text-primary">Course not found</h1>
          <p className="mt-2 text-sm text-text-muted">
            This course may no longer be available in your enrolled list.
          </p>
        </div>
      </div>
    );
  }

  const totalClasses = attendance.length;
  const attendancePercent =
    totalClasses > 0 ? (totalPresent / totalClasses) * 100 : 0;
  const isBelowThreshold = totalClasses > 0 && attendancePercent < 75;

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-text-primary">
            Attendance Record
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            {currentCourse.title} ({currentCourse.code})
          </p>
        </div>
        <div className="rounded-full border border-border/40 bg-background-secondary/30 px-3 py-1 text-xs font-medium text-text-muted">
          Minimum target: 75%
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-border/40 bg-background-secondary/30 p-5 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-text-muted">
            Total Classes
          </p>
          <p className="mt-2 text-3xl font-extrabold text-text-primary">
            {totalClasses}
          </p>
        </div>
        <div className="rounded-2xl border border-border/40 bg-background-secondary/30 p-5 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-text-muted">
            Present
          </p>
          <p className="mt-2 text-3xl font-extrabold text-text-primary">
            {totalPresent}
          </p>
        </div>
        <div className="rounded-2xl border border-border/40 bg-background-secondary/30 p-5 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-text-muted">
            Average Attendance
          </p>
          <p
            className={`mt-2 text-3xl font-extrabold ${
              isBelowThreshold ? "text-danger" : "text-text-primary"
            }`}
          >
            {attendancePercent.toFixed(1)}%
          </p>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-secondary/30">
            <div
              style={{ width: `${Math.min(100, attendancePercent)}%` }}
              className={`h-full rounded-full transition-all ${
                isBelowThreshold ? "bg-danger" : "bg-primary"
              }`}
            />
          </div>
          {isBelowThreshold && (
            <div className="mt-2 text-xs font-medium text-danger">
              Warning: Attendance is below 75%.
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-border/40 bg-background-secondary/30 p-2 shadow-sm md:p-4">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-border/40 text-left text-xs uppercase tracking-wide text-text-muted">
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-sm text-text-muted">
                    Loading attendance...
                  </td>
                </tr>
              ) : attendance.length > 0 ? (
                attendance.map((item) => {
                  const isPresent = Boolean(item[uid!]?.present);
                  return (
                    <tr
                      key={item.id}
                      className="border-b border-border/30 text-sm text-text-primary last:border-b-0"
                    >
                      <td className="px-4 py-3 font-medium">{item.id}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                            isPresent
                              ? "bg-primary/15 text-primary"
                              : "bg-danger/15 text-danger"
                          }`}
                        >
                          {isPresent ? "Present" : "Absent"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-text-muted">
                        {item[uid!]?.remarks || "-"}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-sm text-text-muted">
                    No attendance records available yet.
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

export default Attendance;
