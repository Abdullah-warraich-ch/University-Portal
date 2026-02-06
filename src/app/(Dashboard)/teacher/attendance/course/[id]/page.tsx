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
      <div className="text-xl font-semibold mb-7">{currentCourse?.title}</div>
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Attendance</h1>
        <Link
          href={`/teacher/attendance/add/${id}`}
          className="bg-primary font-medium hover:bg-primary/80 cursor-pointer text-white px-4 py-2 rounded"
        >
          Mark Attendance
        </Link>
      </div>
      <div className="border border-border rounded-lg p-4 mt-5">
        {/* Attendance content goes here */}
        <table className="w-full border-collapse border-spacing-0">
          <thead>
            <tr className="bg-background-secondary border-b border-b-border text-left text-text-muted">
              <th className="py-2 ">Date</th>
              <th className="py-2">Total Students</th>
              <th className="py-2 ">Present Students</th>
              <th className="py-2 ">Absent Students</th>
              <th className="py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {/* Example rows - in a real app, this would be dynamically generated */}

            {attendanceRecords.map((day) => {
              const { id: date, ...records } = day;

              const studentRecords =
                Object.values(records).filter(isStudentAttendance);

              const total = studentRecords.length;
              const present = studentRecords.filter((r) => r.present).length;
              const absent = total - present;

              return (
                <tr key={date} className="border-b border-b-border">
                  <td className="py-2">{date}</td>
                  <td>{total}</td>
                  <td>{present}</td>
                  <td>{absent}</td>
                  <td>
                    <Link
                      href={`/teacher/attendance/course/${id}/${date}`}
                      className="p-1 px-2 rounded-sm text-xs text-center m-auto bg-primary"
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
