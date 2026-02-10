"use client";
import React, { useEffect } from "react";
import {  } from "@/app/Context"; 
import { useParams } from "next/navigation";

import { db } from "@/app/Firebase";
import { doc, DocumentData, getDoc } from "firebase/firestore";
import { FindName } from "@/app/Components/teacher/actions/findStudentName";

function View() {
  const { id, type } = useParams();
  const [taskData, setTaskData] = React.useState<DocumentData | null>(null);
  useEffect(() => {
    const fetchGrades = async () => {
      const currentCourseStudentsRef = doc(
        db,
        "courses",
        id as string,
        "grades",
        type as string,
      );
      const studentsSnap = await getDoc(currentCourseStudentsRef);
      if (!studentsSnap.exists()) {
        console.log("No such document!");
        return;
      }
      setTaskData(studentsSnap.data());
      console.log("Grade details:", studentsSnap.data());
    };
    fetchGrades();
  }, [id, type]);
  return (
    <div className="p-8">
      <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-text-primary mb-6">
        View Grade
      </h1>
      <div>
        <h1 className="text-lg font-semibold tracking-tight text-text-primary">
          {taskData?.title?.toUpperCase()}
        </h1>
      </div>
      <div className="mt-4">
        <p className="mb-2">
          <span className="font-semibold">Description: </span>
          {taskData?.description}
        </p>
        <p className="mb-2">
          <span className="font-semibold">Total Marks: </span>
          {taskData?.totalMarks}
        </p>
      </div>
      <div className="border border-border/40 rounded-2xl bg-background-secondary/20 p-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-background-secondary/40 text-left text-text-muted">
              <th className="px-4 py-3 font-semibold">Student Name</th>
              <th className="px-4 py-3 font-semibold">Marks Obtained</th>
              <th className="px-4 py-3 font-semibold">Percentage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {taskData?.marks &&
              Object.entries(taskData.marks).map(([studentId, marks]) => (
                <tr
                  key={studentId}
                  className="hover:bg-primary/5 transition-colors"
                >
                  <td className="px-4 py-3">{FindName(studentId)}</td>
                  <td className="px-4 py-3">{Number(marks)}</td>
                  <td className="px-4 py-3">
                    {(
                      (Number(marks) / Number(taskData.totalMarks)) *
                      100
                    ).toFixed(0)}
                    %
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default View;
