"use client";
import { db } from "@/app/Firebase";
import { doc, getDoc, collection, DocumentData } from "firebase/firestore";
import { useContext, useState } from "react";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { FirebaseContext } from "@/app/Context";
import { UserRecord } from "@/app/Context";

export default function AttendanceDay() {
  interface AttendanceInfo {
    present: boolean;
    remarks?: string;
  }

  const { id, date } = useParams(); // id = courseId, date = date document
  const [attendanceData, setAttendanceData] = useState<
    Record<string, AttendanceInfo>[]
  >([]);

  const { students } = useContext(FirebaseContext)!;
  const FindName = (id: string) => {
    const student = students.find((s:UserRecord) => s.uid === id);
    return student ? student.name : "Unknown Student";
  };
  console.log("Students in AttendanceDay:", students);
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
        <h1 className="text-2xl font-bold mb-4">
          Attendance for course{" "}
          <span className="border-b-2 border-b-primary"> {id}</span> on{" "}
          <span className="border-b-2 border-b-primary">{date}</span>
        </h1>
        <table className="w-full border-collapse border-spacing-0">
          <thead>
            <tr className="bg-background-secondary border-b border-b-border text-left text-text-muted">
              <th className="py-2">Student Name</th>
              <th className="py-2">Present</th>
              <th className="py-2">Remarks</th>
            </tr>
          </thead>
          <tbody>
              {attendanceData.flatMap((dayObject, dayIndex) =>
                Object.entries(dayObject).map(([id, info]) => (
                  <tr
                    key={`${dayIndex}-${id}`}
                    className="border-b border-b-border"
                  >
                    <td className="py-2">{FindName(id)}</td>
                    <td className="py-2">{info.present ? "Yes" : "No"}</td>
                    <td className="py-2">{info.remarks || "None"}</td>
                  </tr>
                )),
              )}
          </tbody>
        </table>
      </div>
    )
  );
}
