"use client";
import { FirebaseContext } from "@/app/Context";
import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { db } from "@/app/Firebase";
import {
  doc,
  collection,
  getDoc,
  getDocs,
  DocumentData,
} from "firebase/firestore";

function Course() {
  type GradeRecord = {
    id: string;
    type: string;
    marks: Record<string, number>;
    totalMarks: number;
  };
  const [grades, setGrades] = useState<DocumentData>([]);
  const { id } = useParams();
  const { courses, currentUserRecord } = useContext(FirebaseContext)!;
  const currentCourse = courses.find((course) => course.id === id);
  const uid = currentUserRecord?.uid;
  console.log("Current Course", currentCourse);
  console.log("current User:", currentUserRecord);
  function AssignmentNameFinder(type: string) {
    if (!currentCourse) return "Unknown Assignment";
    switch (type) {
      case "ass1":
        return "Assignment 1";
      case "ass2":
        return "Assignment 2";
      case "ass3":
        return "Assignment 3";
      case "ass4":
        return "Assignment 4";
      case "quiz1":
        return "Quiz 1";
      case "quiz2":
        return "Quiz 2";
      case "quiz3":
        return "Quiz 3";
      case "quiz4":
        return "Quiz 4";
      case "midterm":
        return "Mid Semester Exam";
      case "final":
        return "Final Exam";
      default:
        return "Other Assignment";
    }
  }
  useEffect(() => {
    async function fetchGrades() {
      const gradeRef = collection(db, "courses", id as string, "grades");
      const gradeSnap = await getDocs(gradeRef);
      const grade = gradeSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log(grade);
      setGrades(grade);
    }
    fetchGrades();
  }, [uid, id]);
  return (
    <div className="p-8">
      <h1 className="text-2xl font-extrabold text-text-primary tracking-tight border-b-2 border-b-primary inline-block">
        {currentCourse?.title || "Dummy"}
      </h1>
      <div className="mt-6">
        <table className="w-full">
          <tr className="text-left text-text-muted text-sm border-b border-b-border/30 ">
            <th className="p-2">Title</th>
            <th className="p-2">Obtained Marks</th>
            <th className="p-2">Total Marks</th>
            <th className="p-2">Percentage</th>
          </tr>
          {grades.length > 0 ? (
            grades.map((grade: GradeRecord) => (
              <tr
                key={grade.id}
                className="border-b border-b-border/30 text-sm"
              >
                <td className="p-2">{AssignmentNameFinder(grade.type)}</td>
                <td
                  className={`${grade.marks?.[uid!] !== undefined && grade.totalMarks > 0 ? "font-medium" : "text-text-muted"} p-2`}
                >
                  {grade.marks?.[uid!] || "Not Marked Yet"}
                </td>
                <td className="p-2">{grade.totalMarks}</td>
                <td
                  className={`${grade.marks?.[uid!] !== undefined && grade.totalMarks > 0 ? "font-semibold" : "text-text-muted"} p-2`}
                >
                  {grade.marks?.[uid!] !== undefined && grade.totalMarks > 0
                    ? Math.round((grade.marks[uid!] / grade.totalMarks) * 100) +
                      "%"
                    : "N/A"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center p-4 text-text-muted">
                No grades available.
              </td>
            </tr>
          )}
        </table>
      </div>
    </div>
  );
}

export default Course;
