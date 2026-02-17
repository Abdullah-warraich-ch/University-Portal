"use client";
import React, { useEffect, useMemo, useState } from "react";
import { FirebaseContext } from "@/app/Context";
import Kpicard from "@/app/Components/teacher/Kpi-card";
import CourseStudentCount from "@/app/Components/teacher/StudentCount";
import Link from "next/link";
import Heading from "@/app/Components/universal/Heading";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/app/Firebase";
import { BookOpen, Users, ClipboardCheck, Layout, Sparkles, GraduationCap, ArrowRight, LayoutDashboard } from "lucide-react";

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
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest pl-1">
            <LayoutDashboard size={14} />
            Overview
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-text-primary">
            Teacher Dashboard <span className="text-primary">.</span>
          </h1>
          <p className="text-text-muted text-sm font-medium opacity-60">
            Welcome back! You have <span className="text-primary font-black uppercase tracking-tight">{userCourses.length} Courses</span> this semester.
          </p>
        </div>
        <div className="flex items-center bg-card/40 border border-border/40 px-4 py-2 rounded-2xl backdrop-blur-xl">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            System Online
          </span>
        </div>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="group relative overflow-hidden rounded-[2rem] border border-border/40 bg-card/30 backdrop-blur-xl p-8 shadow-2xl transition-all hover:-translate-y-2 hover:border-primary/20">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-primary/10 text-primary rounded-2xl group-hover:scale-110 transition-transform shadow-lg shadow-primary/5">
              <BookOpen size={26} />
            </div>
            <div>
              <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Courses</p>
              <p className="text-4xl font-black text-text-primary mt-1 tracking-tighter">{userCourses.length}</p>
            </div>
          </div>
          <div className="absolute -top-6 -right-6 h-24 w-24 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        <div className="group relative overflow-hidden rounded-[2rem] border border-border/40 bg-card/30 backdrop-blur-xl p-8 shadow-2xl transition-all hover:-translate-y-2 hover:border-success/20">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-success/10 text-success rounded-2xl group-hover:scale-110 transition-transform shadow-lg shadow-success/5">
              <Users size={26} />
            </div>
            <div>
              <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Total Students</p>
              <p className="text-4xl font-black text-text-primary mt-1 tracking-tighter">{totalStudents}</p>
            </div>
          </div>
          <div className="absolute -top-6 -right-6 h-24 w-24 bg-success/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        <div className="group relative overflow-hidden rounded-[2rem] border border-border/40 bg-card/30 backdrop-blur-xl p-8 shadow-2xl transition-all hover:-translate-y-2 hover:border-warning/20">
          <div className="space-y-4 relative z-10">
            <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Shortcuts</p>
            <div className="flex gap-3">
              <Link
                href="/teacher/courses"
                className="flex-1 inline-flex items-center justify-center rounded-2xl bg-background-secondary border border-border/60 h-12 text-[10px] font-black uppercase tracking-widest text-text-primary transition-all hover:bg-primary/5 hover:border-primary/40 active:scale-95 shadow-sm"
              >
                Grades
              </Link>
              <Link
                href="/teacher/attendance"
                className="flex-1 inline-flex items-center justify-center rounded-2xl bg-primary h-12 text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-primary/20 transition-all hover:shadow-primary/40 active:scale-95"
              >
                Attendance
              </Link>
            </div>
          </div>
          <div className="absolute -top-6 -right-6 h-24 w-24 bg-warning/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap size={16} className="text-primary" />
            <h2 className="text-lg font-black tracking-tight text-text-primary uppercase">My Courses</h2>
          </div>
          <p className="hidden sm:block text-[10px] text-text-muted font-black tracking-[0.2em] uppercase opacity-40">Choose a course.</p>
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
            <p className="text-sm text-text-muted">Contact the admin office to update your list</p>
          </div>
        )}
      </div>

      {userCourses.length > 0 && (
        <div className="space-y-8">
          <div className="flex items-center gap-2">
            <ClipboardCheck size={16} className="text-primary" />
            <h2 className="text-lg font-black tracking-tight text-text-primary uppercase">Attendance</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {userCourses.map((course) => (
              <div
                key={`${course.id}-actions`}
                className="group relative overflow-hidden rounded-3xl border border-border/40 bg-card p-6 shadow-sm transition-all hover:shadow-xl hover:border-primary/20"
              >
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-black px-2 py-0.5 rounded-lg bg-primary/10 text-primary uppercase tracking-widest shadow-sm">
                        {course.semester || "Semester 1"}
                      </span>
                      <span className="text-[9px] font-black text-text-muted/40 uppercase tracking-[0.2em]">{course.code}</span>
                    </div>
                    <h3 className="text-text-primary font-black text-xl leading-tight group-hover:text-primary transition-colors tracking-tight">
                      {course.title}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/teacher/attendance/course/${course.code}`}
                      className="inline-flex h-10 items-center justify-center rounded-xl border border-border/60 bg-background px-5 text-[10px] font-black uppercase tracking-widest text-text-primary transition-all hover:bg-primary/5 hover:border-primary/30 active:scale-95 shadow-sm"
                    >
                      Records
                    </Link>
                    <Link
                      href={`/teacher/attendance/add/${course.code}`}
                      className="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-5 text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-primary/20 transition-all hover:shadow-primary/40 active:scale-95"
                    >
                      Take Attendance
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
