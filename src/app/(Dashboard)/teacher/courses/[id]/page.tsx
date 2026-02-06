"use client";
import React, { use, useEffect } from "react";
import { FirebaseContext } from "@/app/Context";
import { useParams } from "next/navigation";
import Link from "next/link";
import { db } from "@/app/Firebase";
import { collection, getDocs } from "firebase/firestore";
import type { UserRecord } from "@/app/Context";

function CourseContent() {
  const { courses } = React.useContext(FirebaseContext)!;
  const [grades, setGrades] = React.useState<UserRecord[]>([]);
  const { id } = useParams();
  const course = courses.find((course) => course.code === id);
  useEffect(() => {
    const fetchData = async () => {
      const GradeRef = collection(db, "courses", id as string, "grades");
      const gradeSnap = await getDocs(GradeRef);
      const gradesData = gradeSnap.docs.map((doc) => doc.data());
      console.log("Fetched grades data:", gradesData);
      setGrades(gradesData);
    };
    fetchData();
  }, []);
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold  border-b-2 border-b-primary mb-7 inline-block">
        {course ? course.title : "Course Not Found"}
      </h1>
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold mb-2">Grades</h1>
        <div className="flex gap-4">
          <button className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/80">
            Add Grade
          </button>
          <Link
            href={`/teacher/courses/${id}/add`}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/80"
          >
            Add Task
          </Link>
        </div>
      </div>
      <div className="mt-4">
        {grades.length === 0 ? (
          <p>No grades available.</p>
        ) : (
          <table className="w-full rounded">
            <thead>
              <tr className="border-b border-b-border text-left">
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Description</th>
                <th className="px-4 py-2">Total Marks</th>
                <th className="px-4 py-2">Due Date</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {grades.map((grade, index) => (
                <tr key={index} className="border-b border-b-border">
                  <td className="px-4 py-2">{grade.type}</td>
                  <td className="px-4 py-2">{grade.title}</td>
                  <td className="px-4 py-2">{grade.description}</td>
                  <td className="px-4 py-2">{grade.totalMarks}</td>
                  <td className="px-4 py-2">{grade.DueDate}</td>
                  <td className="px-4 gap-4 py-2 flex justify-center items-center">
                    <button
                      className={
                        grade.graded
                          ? "bg-secondary text-white px-2 py-1 rounded hover:bg-secondary/80 disabled:opacity-50 cursor-not-allowed"
                          : "bg-primary text-white px-2 py-1 rounded hover:bg-primary/80"
                      }
                    >
                      {grade.graded ? "Graded" : "Grade"}
                    </button>
                    <button
                      className={
                        grade.graded
                          ? "bg-primary text-white px-2 py-1 rounded hover:bg-primary/80"
                          : "bg-secondary text-white px-2 py-1 rounded hover:bg-secondary/80 disabled:opacity-50 cursor-not-allowed"
                      }
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default CourseContent;
