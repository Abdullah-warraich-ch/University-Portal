"use client";
import { FirebaseContext } from "@/app/Context";
import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { db } from "@/app/Firebase";
import { collection, getDocs } from "firebase/firestore";

function Course() {
  type GradeRecord = {
    id: string;
    type: string;
    marks: Record<string, number>;
    totalMarks: number;
  };
  const [grades, setGrades] = useState<GradeRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const { courses, currentUserRecord } = useContext(FirebaseContext)!;
  const currentCourse = courses.find((course) => course.id === id);
  const uid = currentUserRecord?.uid;

  const toNumber = (value: unknown) => {
    const num = Number(value);
    return Number.isFinite(num) ? num : null;
  };

  const getStudentScore = (grade: GradeRecord) => {
    if (!uid) return null;
    return toNumber(grade.marks?.[uid]);
  };

  function AssignmentNameFinder(type: string) {
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
      if (!id) {
        setGrades([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const gradeRef = collection(db, "courses", id as string, "grades");
      const gradeSnap = await getDocs(gradeRef);
      const grade = gradeSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as GradeRecord[];
      setGrades(grade);
      setIsLoading(false);
    }

    fetchGrades();
  }, [id]);

  if (!currentCourse) {
    return (
      <div className="p-8">
        <div className="rounded-2xl border border-border/40 bg-background-secondary/30 p-6">
          <h1 className="text-xl font-bold text-text-primary">Course not found</h1>
          <p className="mt-2 text-sm text-text-muted">
            This course may no longer be available in your enrolled list.
          </p>
        </div>
      </div>
    );
  }

  const markedGrades = grades.filter((grade) => getStudentScore(grade) !== null);
  const obtainedMarks = markedGrades.reduce((sum, grade) => {
    return sum + (getStudentScore(grade) ?? 0);
  }, 0);
  const totalMarks = markedGrades.reduce((sum, grade) => {
    return sum + Math.max(0, toNumber(grade.totalMarks) ?? 0);
  }, 0);
  const overallPercent = totalMarks > 0 ? (obtainedMarks / totalMarks) * 100 : 0;
  const pendingCount = grades.length - markedGrades.length;

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-text-primary">
            Gradebook
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            {currentCourse.title} ({currentCourse.code})
          </p>
        </div>
        <div className="rounded-full border border-border/40 bg-background-secondary/30 px-3 py-1 text-xs font-medium text-text-muted">
          {markedGrades.length} of {grades.length} graded
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-border/40 bg-background-secondary/30 p-5 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-text-muted">
            Overall Percentage
          </p>
          <p className="mt-2 text-3xl font-extrabold text-text-primary">
            {overallPercent.toFixed(1)}%
          </p>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-secondary/30">
            <div
              style={{ width: `${Math.min(100, overallPercent)}%` }}
              className="h-full rounded-full bg-primary transition-all"
            />
          </div>
        </div>
        <div className="rounded-2xl border border-border/40 bg-background-secondary/30 p-5 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-text-muted">
            Marks Scored
          </p>
          <p className="mt-2 text-3xl font-extrabold text-text-primary">
            {obtainedMarks}/{totalMarks || 0}
          </p>
        </div>
        <div className="rounded-2xl border border-border/40 bg-background-secondary/30 p-5 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-text-muted">
            Pending Items
          </p>
          <p
            className={`mt-2 text-3xl font-extrabold ${
              pendingCount > 0 ? "text-danger" : "text-text-primary"
            }`}
          >
            {Math.max(0, pendingCount)}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-border/40 bg-background-secondary/30 p-2 shadow-sm md:p-4">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-border/40 text-left text-xs uppercase tracking-wide text-text-muted">
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Obtained Marks</th>
                <th className="px-4 py-3">Total Marks</th>
                <th className="px-4 py-3">Percentage</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-sm text-text-muted">
                    Loading grades...
                  </td>
                </tr>
              ) : grades.length > 0 ? (
                grades.map((grade) => {
                  const score = getStudentScore(grade);
                  const hasMarks = score !== null;
                  const maxMarks = Math.max(0, toNumber(grade.totalMarks) ?? 0);
                  const percent =
                    hasMarks && maxMarks > 0
                      ? (score / maxMarks) * 100
                      : null;

                  return (
                    <tr
                      key={grade.id}
                      className="border-b border-border/30 text-sm text-text-primary last:border-b-0"
                    >
                      <td className="px-4 py-3 font-medium">
                        {AssignmentNameFinder(grade.type)}
                      </td>
                      <td
                        className={`px-4 py-3 ${
                          hasMarks ? "font-semibold text-text-primary" : "text-text-muted"
                        }`}
                      >
                        {hasMarks ? score : "Not marked yet"}
                      </td>
                      <td className="px-4 py-3">{maxMarks}</td>
                      <td className="px-4 py-3">
                        {percent !== null ? (
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                              percent >= 80
                                ? "bg-primary/15 text-primary"
                                : percent >= 50
                                  ? "bg-secondary/30 text-text-primary"
                                  : "bg-danger/15 text-danger"
                            }`}
                          >
                            {Math.round(percent)}%
                          </span>
                        ) : (
                          <span className="text-text-muted">N/A</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-sm text-text-muted">
                    No grades available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Course;
