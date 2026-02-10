"use client";
import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { FirebaseContext } from "@/app/Context";
import {
  collection,
  doc,
  DocumentData,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { db } from "@/app/Firebase";
import { useRouter } from "next/navigation";
function Add() {
  const router = useRouter();
  const { id } = useParams();
  if (!id) {
    throw new Error("Course ID is missing");
  }

  const today = new Date().toISOString().split("T")[0];
  const [attendance, setAttendance] = React.useState<{
    [key: string]: { present: boolean; remarks: string };
  }>({});
  const { courses } = React.useContext(FirebaseContext)!;
  const [students, setStudents] = React.useState<DocumentData[]>([]);
  const CurrentCourse = courses.find((course) => course.code === id);

  async function SetAttendance(e: React.FormEvent) {
    e.preventDefault();
    console.log("Submitting attendance:", attendance);
    const attendanceRef = collection(db, "courses", id as string, "attendance");
    const attendanceDoc = doc(attendanceRef, today);
    await setDoc(attendanceDoc, attendance);
    router.push(`/teacher/attendance/course/${id}`);
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

  useEffect(() => {
    const studentRef = collection(db, "courses", id as string, "students");
    const fetchStudents = async () => {
      const studentSnap = await getDocs(studentRef);
      const studentList = studentSnap?.docs?.map((doc) => doc.data());
      setStudents(studentList || []);
      console.log(studentList);
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
  console.log(attendance);
  return (
    <div className="p-8">
      <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-text-primary">
        Add Attendance for {CurrentCourse?.title}
      </h1>
      <div>
        {/* Add attendance form or content goes here */}
        <form className="mt-5 space-y-4" onSubmit={SetAttendance}>
          <div>
            <label className="block mb-1 font-medium">Date</label>
            <input
              type="date"
              defaultValue={today}
              className="w-full border border-border rounded px-3 py-2"
            />
          </div>
          <div>
            <table className="w-full text-sm border border-border/40 rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-background-secondary/40 text-left text-text-muted">
                  <th className="px-4 py-3 font-semibold">Student Name</th>
                  <th className="px-4 py-3 font-semibold">Present</th>
                  <th className="px-4 py-3 font-semibold">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {students.map((student) => (
                  <tr
                    key={student.uid}
                    className="hover:bg-primary/5 transition-colors"
                  >
                    <td className="px-4 py-3">{student.name}</td>
                    <td className="px-4 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={attendance[student.uid]?.present || false}
                        onChange={(e) =>
                          handleAttendanceChange(student.uid, e.target.checked)
                        }
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        placeholder="Remarks"
                        value={attendance[student.uid]?.remarks || ""}
                        onChange={(e) =>
                          handleRemarksChange(student.uid, e.target.value)
                        }
                        className="w-full rounded-lg border border-border/40 bg-background px-3 py-2"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/80 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            Submit Attendance
          </button>
        </form>
      </div>
    </div>
  );
}

export default Add;
