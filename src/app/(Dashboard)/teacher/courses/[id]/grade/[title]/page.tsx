"use client";
import React, { useEffect, useState } from "react";
import { FirebaseContext } from "@/app/Context";
import { db } from "@/app/Firebase";
import {
  collection,
  DocumentData,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";


import { useParams, useRouter } from "next/navigation";

function Grade() {
  // Define the type: key is a string (UID), value is a number or string
  interface GradeMap {
    [key: string]: number | string | undefined;
  }

  const router = useRouter();

  const { id, title } = useParams();
  const [assignments, setAssignments] = React.useState<DocumentData>([]);
  const [students, setStudents] = React.useState<DocumentData>([]);
  const [marks, setMarks] = React.useState<GradeMap>({});

  const setMarksForStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    const gradesRef = doc(
      db,
      "courses",
      id as string,
      "grades",
      title as string,
    );
    await updateDoc(gradesRef, {
      graded: true,
      marks: marks,
    });
    router.push(`/teacher/courses/${id}`);
  };

  //skeleton for Marks input and submission

  useEffect(() => {
    const fetchGrades = async () => {
      const GradeRef = collection(db, "courses", id as string, "grades");
      const currentCourseStudentsRef = collection(
        db,
        "courses",
        id as string,
        "students",
      );
      const gradeSnap = await getDocs(GradeRef);
      const gradesData = gradeSnap.docs.map((doc) => doc.data());
      const studentsSnap = await getDocs(currentCourseStudentsRef);
      const studentsData = studentsSnap.docs.map((doc) => doc.data());
      console.log("Enrolled students:", studentsData);
      const foundGrade = gradesData.find((grade) => grade.type === title);
      console.log("Found grade:", foundGrade);
      if (foundGrade) {
        setAssignments(foundGrade);
      }
      setStudents(studentsData);
    };

    fetchGrades();
  }, [id, title]);

  console.log("Marks state:", marks);

  const AssignmentName = (title: string) => {
    switch (title) {
      case "ass1":
        return "Assignment 1";
      case "ass2":
        return "Assignment 2";
      case "ass3":
        return "Assignment 3";
      case "ass4":
        return "Assignment 4";
      default:
        return title;
    }
  };
  return (
    <div className="p-8">
      <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-text-primary mb-4">
        {AssignmentName(assignments?.type)} Grades
      </h1>
      <div className="border border-border/40 rounded-2xl bg-background-secondary/20 p-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-background-secondary/40 text-left text-text-muted">
              <th className="py-3 px-4 font-semibold">Student Name</th>
              <th className="py-3 px-4 font-semibold">Grade</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {students?.map((student: DocumentData) => (
              <tr
                key={student.uid}
                className="hover:bg-primary/5 transition-colors"
              >
                <td className="py-3 px-4">{student.name}</td>
                <td className="py-3 px-4">
                  <input
                    type="number"
                    value={marks[student.uid] || ""}
                    onChange={(e) =>
                      setMarks({
                        ...marks,
                        [student.uid]: e.target.value,
                      })
                    }
                    required
                    className="outline-1 bg-secondary/20 outline-primary rounded w-12 mr-2 px-2 py-1 text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  /{assignments?.totalMarks}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex w-full justify-center items-center">
        <button
          onClick={setMarksForStudent}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/80 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          Save Grades
        </button>
      </div>
    </div>
  );
}

export default Grade;
