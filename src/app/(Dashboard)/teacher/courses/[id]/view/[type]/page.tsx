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
      <h1 className="text-2xl font-bold  border-b-2 border-b-primary mb-7 inline-block">
        View Grade
      </h1>
      <div>
        <h1 className="text-xl font-semibold">
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
      <div>
        <table className="w-full rounded">
          <thead>
            <tr className="border-b border-b-border text-left">
              <th className="px-4 py-2">Student Name</th>
              <th className="px-4 py-2">Marks Obtained</th>
              <th className="px-4 py-2">Percentage</th>
            </tr>
          </thead>
          <tbody>
            {taskData?.marks &&
              Object.entries(taskData.marks).map(([studentId, marks]) => (
                <tr key={studentId} className="border-b border-b-border">
                  <td className="px-4 py-2">{FindName(studentId)}</td>
                  <td className="px-4 py-2">{Number(marks)}</td>
                  <td className="px-4 py-2">
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
