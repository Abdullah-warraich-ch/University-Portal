"use client";
import { db } from "@/app/Firebase";
import { doc, getDoc, collection, DocumentData } from "firebase/firestore";
import { useContext, useState } from "react";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { FindName } from "@/app/Components/teacher/actions/findStudentName";

export default function AttendanceDay() {
  interface AttendanceInfo {
    present: boolean;
    remarks?: string;
  }

  const { id, date } = useParams(); // id = courseId, date = date document
  const [attendanceData, setAttendanceData] = useState<
    Record<string, AttendanceInfo>[]
  >([]);

  return (
    useEffect(() => {
      const AttendanceData = async () => {
        const AttendanceRef = doc(
          db,
          "courses",
          id as string,
          "attendance",
          date as string,
        );
        const AttendanceSnap = await getDoc(AttendanceRef);
        const AttendanceList = AttendanceSnap.data();
        console.log(AttendanceList);
        setAttendanceData(AttendanceList ? [AttendanceList] : []);
      };
      AttendanceData();
    }, [date, id]),
    (
      <div className="p-8">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-text-primary mb-4">
          Attendance for course{" "}
          <span className="text-primary"> {id}</span> on{" "}
          <span className="text-primary">{date}</span>
        </h1>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-background-secondary/40 text-left text-text-muted">
              <th className="py-3 px-4 font-semibold">Student Name</th>
              <th className="py-3 px-4 font-semibold">Present</th>
              <th className="py-3 px-4 font-semibold">Remarks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {attendanceData.flatMap((dayObject, dayIndex) =>
              Object.entries(dayObject).map(([id, info]) => (
                <tr
                  key={`${dayIndex}-${id}`}
                  className="hover:bg-primary/5 transition-colors"
                >
                  <td className="py-3 px-4">{FindName(id)}</td>
                  <td className="py-3 px-4">{info.present ? "Yes" : "No"}</td>
                  <td className="py-3 px-4">{info.remarks || "None"}</td>
                </tr>
              )),
            )}
          </tbody>
        </table>
      </div>
    )
  );
}
