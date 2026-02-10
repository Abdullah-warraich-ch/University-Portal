"use client";
import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { FirebaseContext } from "@/app/Context";
import Link from "next/link";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/app/Firebase";

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
      setAttendanceRecords(attendanceData);
      console.log("Fetched attendance data:", attendanceData);
    };
    fetchAttendance();
  }, [id]);

  return (
    <div className="p-8">
      <div className="text-xl md:text-2xl font-extrabold tracking-tight text-text-primary mb-6">
        {currentCourse?.title}
      </div>
      <div className="flex justify-between">
        <h1 className="text-lg font-semibold tracking-tight text-text-primary">
          Attendance
        </h1>
        <Link
          href={`/teacher/attendance/add/${id}`}
          className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/80 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          Mark Attendance
        </Link>
      </div>
      <div className="border border-border/40 rounded-2xl p-4 mt-5 bg-background-secondary/20">
        {/* Attendance content goes here */}
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-background-secondary/40 text-left text-text-muted">
              <th className="py-3 px-4 font-semibold">Date</th>
              <th className="py-3 px-4 font-semibold">Total Students</th>
              <th className="py-3 px-4 font-semibold">Present Students</th>
              <th className="py-3 px-4 font-semibold">Absent Students</th>
              <th className="py-3 px-4 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {/* Example rows - in a real app, this would be dynamically generated */}

            {attendanceRecords.map((day) => {
              const { id: date, ...records } = day;

              const studentRecords =
                Object.values(records).filter(isStudentAttendance);

              const total = studentRecords.length;
              const present = studentRecords.filter((r) => r.present).length;
              const absent = total - present;

              return (
                <tr
                  key={date}
                  className="hover:bg-primary/5 transition-colors"
                >
                  <td className="py-3 px-4">{date}</td>
                  <td className="py-3 px-4">{total}</td>
                  <td className="py-3 px-4">{present}</td>
                  <td className="py-3 px-4">{absent}</td>
                  <td className="py-3 px-4">
                    <Link
                      href={`/teacher/attendance/course/${id}/${date}`}
                      className="p-1 px-3 rounded-lg text-xs text-center m-auto bg-primary hover:bg-primary/80 text-white"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Course;
