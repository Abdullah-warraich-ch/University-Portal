"use client";
import  { useContext } from "react";
import { FirebaseContext } from "@/app/Context";
import {
  updateDoc,
  doc,
  arrayUnion,
  setDoc,
} from "firebase/firestore";
import { db } from "@/app/Firebase";
import Kpicard from "@/app/Components/student/Kpi-card";
import Heading from "@/app/Components/universal/Heading";
import AverageAttendance from "@/app/Components/student/divs/AverageAttendance";

function Student() {
  const { currentUserRecord, enrolledCourses, availableCourses } = useContext(
    FirebaseContext,
  ) as unknown as {
    currentUserRecord: {
      uid?: string;
      name?: string;
      email?: string;
      registeredCourses?: string[];
    } | null;
    enrolledCourses: { code?: string; title?: string; teacher?: string }[];
    availableCourses: { code?: string; title?: string; teacher?: string }[];
  };

    async function RegisterCourse(code: string) {
    if (!currentUserRecord || typeof currentUserRecord.uid !== "string") return;

    const userRef = doc(db, "users", String(currentUserRecord.uid));
    const courseRef = doc(
      db,
      "courses",
      String(code),
      "students",
      String(currentUserRecord.uid),
    );
    await updateDoc(userRef, {
      registeredCourses: arrayUnion(String(code)),
    });
    await setDoc(
      courseRef,
      {
        name: String(currentUserRecord.name),
        email: String(currentUserRecord.email),
        uid: String(currentUserRecord.uid),
        timestamp: new Date(),
      },
      { merge: true },
    );
  }

  return (
    <div className="p-8">
      {availableCourses.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-5">
            <Heading>Available Courses</Heading>
            <span className="text-xs text-text-muted">
              Explore and register
            </span>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {availableCourses.map((course) => (
              <div
                key={String(course.code)}
                className="rounded-2xl border border-border/40 bg-background-secondary/30 p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-text-primary font-semibold text-lg leading-snug">
                      {String(course.title)}
                    </h2>
                    <p className="text-text-muted text-sm">
                      {String(course.teacher)}
                    </p>
                  </div>
                  <span className="text-[11px] px-2 py-1 rounded-full border border-border/40 text-text-muted">
                    {String(course.code)}
                  </span>
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => RegisterCourse(String(course.code))}
                    className="w-full inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/80 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-primary/40"
                  >
                    Register
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-10">
        <div>
          <div className="flex items-center justify-between mb-5 mt-8">
            <Heading>Enrolled Courses</Heading>
            <span className="text-xs text-text-muted">Quick access</span>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-2">
            {enrolledCourses.length > 0 ? (
              enrolledCourses.map((course) => (
                <Kpicard
                  key={String(course.code)}
                  title={String(course.title)}
                  teacher={String(course.teacher)}
                  to={`/student/course/${String(course.code)}`}
                  code={String(course.code)}
                />
              ))
            ) : (
              <h1 className="text-text-muted">No Courses Enrolled Yet.</h1>
            )}
          </div>
        </div>
        <div className="pt-8">
          <Heading>Upcoming Assignments</Heading>
        </div>
      </div>

      {/* Attendance Average for each subject */}
      <AverageAttendance />
    </div>
  );
}

export default Student;
