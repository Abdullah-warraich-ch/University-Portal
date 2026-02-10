"use client";
import React, { use, useEffect } from "react";
import { FirebaseContext } from "@/app/Context";
import { useParams } from "next/navigation";
import Link from "next/link";
import { db } from "@/app/Firebase";
import { collection, DocumentData, getDocs } from "firebase/firestore";

function CourseContent() {
  const { courses } = React.useContext(FirebaseContext)!;
  const [grades, setGrades] = React.useState<DocumentData[]>([]);
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
      <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-text-primary mb-6">
        {course ? course.title : "Course Not Found"}
      </h1>
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold tracking-tight text-text-primary">
          Grades
        </h1>
        <div className="flex gap-4">
          <Link
            href={`/teacher/courses/${id}/grade`}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/80 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            Add Grade
          </Link>
          <Link
            href={`/teacher/courses/${id}/add`}
            className="inline-flex items-center justify-center rounded-lg border border-border/60 bg-background px-4 py-2 text-sm font-semibold text-text-primary transition hover:bg-primary/5 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            Add Task
          </Link>
        </div>
      </div>
      <div className="mt-4">
        {grades.length === 0 ? (
          <p>No grades available.</p>
        ) : (
          <div className="border border-border/40 rounded-2xl bg-background-secondary/20 p-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-background-secondary/40 text-left text-text-muted">
                  <th className="px-4 py-3 font-semibold">Type</th>
                  <th className="px-4 py-3 font-semibold">Title</th>
                  <th className="px-4 py-3 font-semibold">Description</th>
                  <th className="px-4 py-3 font-semibold">Total Marks</th>
                  <th className="px-4 py-3 font-semibold">Due Date</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {grades.map((grade, index) => (
                  <tr
                    key={index}
                    className="hover:bg-primary/5 transition-colors"
                  >
                    <td className="px-4 py-3">{grade.type}</td>
                    <td className="px-4 py-3">{grade.title}</td>
                    <td className="px-4 py-3">{grade.description}</td>
                    <td className="px-4 py-3">{grade.totalMarks}</td>
                    <td className="px-4 py-3">{grade.DueDate}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                    {!grade.graded && (
                      <Link
                        href={`/teacher/courses/${id}/grade/${grade.type}`}
                        className={
                          grade.graded
                            ? "bg-secondary text-white px-2 py-1 rounded hover:bg-secondary/80 disabled:opacity-50 cursor-not-allowed text-xs"
                            : "bg-primary text-white px-2 py-1 rounded hover:bg-primary/80 text-xs"
                        }
                      >
                        {grade.graded ? "Graded" : "Grade"}
                      </Link>
                    )}
                    {grade.graded && (
                      <Link
                        href={`/teacher/courses/${id}/view/${grade.type}`}
                        className={
                          "bg-success text-white px-2 py-1 rounded hover:bg-success/80 text-xs"
                        }
                      >
                        View
                      </Link>
                    )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default CourseContent;
