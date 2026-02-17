"use client";
import React from "react";
import Kpicard from "@/app/Components/admin/Kpi-card";
import { FirebaseContext } from "@/app/Context";
import Heading from "@/app/Components/universal/Heading";
import Link from "next/link";

function Admin() {
  const { students, teachers, courses } = React.useContext(FirebaseContext)!;

  const departments = new Set(
    [...students, ...teachers, ...courses]
      .map((record) =>
        typeof record.department === "string"
          ? record.department.trim()
          : "",
      )
      .filter((department) => department.length > 0),
  );

  const recentCourses = courses.slice(0, 5);

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Heading>Admin Dashboard</Heading>
          <p className="text-sm text-text-muted">
            University snapshot and management shortcuts.
          </p>
        </div>
        <span className="text-xs text-text-muted">Live data from Firebase</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Kpicard
          title="Total Students"
          value={students.length}
          to="/admin/students"
        />
        <Kpicard
          title="Total Teachers"
          value={teachers.length}
          to="/admin/teachers"
        />
        <Kpicard title="Total Courses" value={courses.length} to="/admin/courses" />
        <Kpicard
          title="Departments"
          value={departments.size}
          to="/admin/departments"
        />
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold tracking-tight text-text-primary">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/students/add"
            className="rounded-2xl border border-border/40 bg-background-secondary/20 p-5 hover:bg-primary/5 transition"
          >
            <p className="text-sm font-semibold text-text-primary">Add Student</p>
            <p className="text-xs text-text-muted mt-1">
              Register a new student profile.
            </p>
          </Link>
          <Link
            href="/admin/teachers/add"
            className="rounded-2xl border border-border/40 bg-background-secondary/20 p-5 hover:bg-primary/5 transition"
          >
            <p className="text-sm font-semibold text-text-primary">Add Teacher</p>
            <p className="text-xs text-text-muted mt-1">
              Onboard a faculty member.
            </p>
          </Link>
          <Link
            href="/admin/courses/add"
            className="rounded-2xl border border-border/40 bg-background-secondary/20 p-5 hover:bg-primary/5 transition"
          >
            <p className="text-sm font-semibold text-text-primary">Add Course</p>
            <p className="text-xs text-text-muted mt-1">
              Create and assign a new course.
            </p>
          </Link>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight text-text-primary">
            Recent Courses
          </h2>
          <Link
            href="/admin/courses"
            className="text-xs text-primary hover:underline"
          >
            View all courses
          </Link>
        </div>
        <div className="rounded-2xl border border-border/40 bg-background-secondary/20 p-4">
          {recentCourses.length === 0 ? (
            <p className="text-sm text-text-muted">No courses available yet.</p>
          ) : (
            <div className="space-y-3">
              {recentCourses.map((course) => (
                <div
                  key={course.id}
                  className="flex items-center justify-between rounded-lg border border-border/30 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-text-primary">
                      {course.title || "Untitled Course"}
                    </p>
                    <p className="text-xs text-text-muted">
                      {course.code || "N/A"} • {course.department || "No department"}
                    </p>
                  </div>
                  <Link
                    href={`/admin/courses/edit/${course.id}`}
                    className="inline-flex items-center justify-center rounded-lg border border-border/60 bg-background px-3 py-1.5 text-xs font-semibold text-text-primary transition hover:bg-primary/5"
                  >
                    Edit
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default Admin;
