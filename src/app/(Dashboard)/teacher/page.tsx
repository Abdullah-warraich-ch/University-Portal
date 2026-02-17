"use client";
import React from "react";
import { FirebaseContext } from "@/app/Context";
import Kpicard from "@/app/Components/teacher/Kpi-card";
import CourseStudentCount from "@/app/Components/teacher/StudentCount";
import Link from "next/link";
import Heading from "@/app/Components/universal/Heading";

function Teacher() {
  const { courses, currentUser } = React.useContext(FirebaseContext)!;
  const userCourses = courses.filter(
    (course) => course.teacherUid === currentUser?.uid,
  );

  console.log("Teacher's Courses:", userCourses); // Debugging line to check courses

  const totalStudents = userCourses.reduce((sum, course) => {
    const students = Array.isArray(course.students)
      ? course.students.length
      : 0;
    return sum + students;
  }, 0);

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Heading>Teacher Dashboard</Heading>
          <p className="text-sm text-text-muted mt-2">
            Manage courses, grades, and attendance from one place.
          </p>
        </div>
        <span className="text-xs text-text-muted">Quick teaching overview</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border/40 bg-background-secondary/30 p-5">
          <p className="text-xs text-text-muted">Assigned Courses</p>
          <p className="text-3xl font-semibold text-text-primary mt-2">
            {userCourses.length}
          </p>
        </div>
        <div className="rounded-2xl border border-border/40 bg-background-secondary/30 p-5">
          <p className="text-xs text-text-muted">Total Enrolled Students</p>
          <p className="text-3xl font-semibold text-text-primary mt-2">
            {totalStudents}
          </p>
        </div>
        <div className="rounded-2xl border border-border/40 bg-background-secondary/30 p-5">
          <p className="text-xs text-text-muted">Actions</p>
          <div className="mt-3 flex gap-2">
            <Link
              href="/teacher/courses"
              className="inline-flex items-center justify-center rounded-lg border border-border/60 bg-background px-3 py-2 text-xs font-semibold text-text-primary transition hover:bg-primary/5"
            >
              View Grades
            </Link>
            <Link
              href="/teacher/attendance"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white transition hover:bg-primary/80"
            >
              Take Attendance
            </Link>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <h2 className="text-lg font-semibold tracking-tight text-text-primary">
          Your Courses
        </h2>
        <span className="text-xs text-text-muted">
          Open a course to manage grades
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {userCourses.map((course) => (
          <Kpicard
            key={course.id}
            title={course.title}
            value={<CourseStudentCount courseCode={course.code} />}
            to={`/teacher/courses/${course.code}`}
          />
        ))}
      </div>

      {userCourses.length === 0 && (
        <div className="rounded-2xl border border-border/40 bg-background-secondary/20 p-5 text-sm text-text-muted">
          No courses are assigned yet. Once courses are assigned, they will
          appear here with direct links to grading and attendance pages.
        </div>
      )}

      {userCourses.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold tracking-tight text-text-primary">
            Quick Course Actions
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {userCourses.map((course) => (
              <div
                key={`${course.id}-actions`}
                className="rounded-2xl border border-border/40 bg-background-secondary/20 p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-text-primary font-semibold text-base leading-snug">
                      {course.title}
                    </h3>
                    <p className="text-text-muted text-sm">{course.code}</p>
                  </div>
                  <span className="text-[11px] px-2 py-1 rounded-full border border-border/40 text-text-muted">
                    {course.semester || "N/A"}
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    href={`/teacher/courses/${course.code}`}
                    className="inline-flex items-center justify-center rounded-lg border border-border/60 bg-background px-3 py-2 text-xs font-semibold text-text-primary transition hover:bg-primary/5"
                  >
                    Open Gradebook
                  </Link>
                  <Link
                    href={`/teacher/attendance/course/${course.code}`}
                    className="inline-flex items-center justify-center rounded-lg border border-border/60 bg-background px-3 py-2 text-xs font-semibold text-text-primary transition hover:bg-primary/5"
                  >
                    View Attendance
                  </Link>
                  <Link
                    href={`/teacher/attendance/add/${course.code}`}
                    className="inline-flex items-center justify-center rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white transition hover:bg-primary/80"
                  >
                    Mark Attendance
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Teacher;
