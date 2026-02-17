"use client";
import React, { useEffect, useMemo, useState } from "react";
import { FirebaseContext } from "@/app/Context";
import Kpicard from "@/app/Components/teacher/Kpi-card";
import CourseStudentCount from "@/app/Components/teacher/StudentCount";
import Link from "next/link";
import Heading from "@/app/Components/universal/Heading";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/app/Firebase";
import { BookOpen, Users, ClipboardCheck, Layout } from "lucide-react";

function Teacher() {
  const { courses, currentUser } = React.useContext(FirebaseContext)!;
  const userCourses = courses.filter(
    (course) => course.teacherUid === currentUser?.uid,
  );

  const [courseStudentCounts, setCourseStudentCounts] = useState<
    Record<string, number>
  >({});

  const courseCodes = useMemo(
    () =>
      userCourses
        .map((course) => String(course.code))
        .filter((code) => code.length > 0),
    [userCourses],
  );

  useEffect(() => {
    const unsubscribers = courseCodes.map((code) => {
      const studentsRef = collection(db, "courses", code, "students");
      return onSnapshot(studentsRef, (snapshot) => {
        setCourseStudentCounts((prev) => ({
          ...prev,
          [code]: snapshot.size,
        }));
      });
    });

    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, [courseCodes]);

  const totalStudents = courseCodes.reduce(
    (sum, code) => sum + (courseStudentCounts[code] ?? 0),
    0,
  );

  return (
    <div className="p-4 md:p-8 space-y-10 max-w-7xl mx-auto">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <Heading>Teacher Dashboard</Heading>
          <p className="text-sm text-text-muted mt-2">
            Welcome back! You have <span className="text-primary font-bold">{userCourses.length} active courses</span> this semester.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden md:inline text-xs text-text-muted bg-background-secondary px-3 py-1.5 rounded-full border border-border/40">
            LMS v4.2.0 • Online
          </span>
        </div>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="group relative overflow-hidden rounded-3xl border border-border/40 bg-card p-6 shadow-sm transition-all hover:shadow-lg">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-2xl group-hover:scale-110 transition-transform">
              <BookOpen size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-text-muted uppercase tracking-wider">Assigned Courses</p>
              <p className="text-4xl font-black text-text-primary mt-1 tracking-tight">{userCourses.length}</p>
            </div>
          </div>
          <div className="absolute top-0 right-0 -m-4 h-20 w-20 bg-primary/5 rounded-full blur-2xl" />
        </div>

        <div className="group relative overflow-hidden rounded-3xl border border-border/40 bg-card p-6 shadow-sm transition-all hover:shadow-lg">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-success/10 text-success rounded-2xl group-hover:scale-110 transition-transform">
              <Users size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-text-muted uppercase tracking-wider">Total Students</p>
              <p className="text-4xl font-black text-text-primary mt-1 tracking-tight">{totalStudents}</p>
            </div>
          </div>
          <div className="absolute top-0 right-0 -m-4 h-20 w-20 bg-success/5 rounded-full blur-2xl" />
        </div>

        <div className="group relative overflow-hidden rounded-3xl border border-border/40 bg-card p-6 shadow-sm transition-all hover:shadow-lg">
          <div className="space-y-4">
            <p className="text-xs font-bold text-text-muted uppercase tracking-wider">Quick Actions</p>
            <div className="flex gap-2">
              <Link
                href="/teacher/courses"
                className="flex-1 inline-flex items-center justify-center rounded-xl bg-background-secondary border border-border/60 px-4 py-2.5 text-xs font-bold text-text-primary transition-all hover:bg-primary/5 hover:border-primary/30"
              >
                Gradebook
              </Link>
              <Link
                href="/teacher/attendance"
                className="flex-1 inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:scale-[1.02]"
              >
                Attendance
              </Link>
            </div>
          </div>
          <div className="absolute bottom-0 right-0 -m-4 h-20 w-20 bg-warning/5 rounded-full blur-2xl" />
        </div>
      </div>

      <div className="space-y-8">
        <div className="flex items-center justify-between border-b border-border/40 pb-4">
          <div className="flex items-center gap-2">
            <Layout size={20} className="text-primary" />
            <h2 className="text-xl font-black tracking-tight text-text-primary uppercase">Your Course Roster</h2>
          </div>
          <p className="hidden sm:block text-[10px] text-text-muted font-bold tracking-widest uppercase">Click a course to manage grades</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
          <div className="flex flex-col items-center justify-center py-20 rounded-3xl border-2 border-dashed border-border/40 bg-background-secondary/20">
            <BookOpen size={48} className="text-text-muted mb-4 opacity-20" />
            <p className="text-text-primary font-bold">No courses assigned yet</p>
            <p className="text-sm text-text-muted">Contact administration to update your roster</p>
          </div>
        )}
      </div>

      {userCourses.length > 0 && (
        <div className="space-y-8">
          <div className="flex items-center gap-2 border-b border-border/40 pb-4">
            <ClipboardCheck size={20} className="text-primary" />
            <h2 className="text-xl font-black tracking-tight text-text-primary uppercase">Advanced Controls</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {userCourses.map((course) => (
              <div
                key={`${course.id}-actions`}
                className="group relative overflow-hidden rounded-3xl border border-border/40 bg-card p-6 shadow-sm transition-all hover:shadow-xl hover:border-primary/20"
              >
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-primary/10 text-primary uppercase tracking-tighter">
                        {course.semester || "Semester 1"}
                      </span>
                      <span className="text-[10px] font-bold text-text-muted font-mono">{course.code}</span>
                    </div>
                    <h3 className="text-text-primary font-black text-xl leading-snug group-hover:text-primary transition-colors">
                      {course.title}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/teacher/attendance/course/${course.code}`}
                      className="inline-flex items-center justify-center rounded-xl border border-border/60 bg-background px-4 py-2 text-xs font-bold text-text-primary transition-all hover:bg-primary/5"
                    >
                      History
                    </Link>
                    <Link
                      href={`/teacher/attendance/add/${course.code}`}
                      className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-lg shadow-primary/10 transition-all hover:bg-primary/90 hover:scale-[1.02]"
                    >
                      Mark Present
                    </Link>
                  </div>
                </div>
                <div className="absolute top-0 right-0 -m-6 h-32 w-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Teacher;
