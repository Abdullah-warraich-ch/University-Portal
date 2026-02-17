"use client";
import React from "react";
import Kpicard from "@/app/Components/admin/Kpi-card";
import { FirebaseContext } from "@/app/Context";
import Heading from "@/app/Components/universal/Heading";
import Link from "next/link";
import { Users, GraduationCap, BookOpen, Building2, Plus, ArrowRight } from "lucide-react";

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
    <div className="p-4 md:p-8 space-y-10 max-w-7xl mx-auto">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <Heading>Admin Dashboard</Heading>
          <p className="text-sm text-text-muted mt-2">
            System overview and quick management access.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-8 w-8 rounded-full border-2 border-background bg-primary/10 flex items-center justify-center">
                <Users size={12} className="text-primary" />
              </div>
            ))}
          </div>
          <span className="text-xs font-bold text-text-muted ml-2">Active now</span>
        </div>
      </section>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Kpicard
          title="Total Students"
          value={students.length}
          to="/admin/students"
          icon={<PiStudent size={24} />}
          color="primary"
          trend="+12% this month"
        />
        <Kpicard
          title="Total Teachers"
          value={teachers.length}
          to="/admin/teachers"
          icon={<GiTeacher size={24} />}
          color="success"
          trend="Stable"
        />
        <Kpicard
          title="Total Courses"
          value={courses.length}
          to="/admin/courses"
          icon={<Book size={24} />}
          color="warning"
          trend="+5 new"
        />
        <Kpicard
          title="Departments"
          value={departments.size}
          to="/admin/departments"
          icon={<RiBuilding2Fill size={24} />}
          color="danger"
          trend="All active"
        />
      </div>

      {/* Quick Actions */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 border-b border-border/40 pb-4">
          <Plus size={20} className="text-primary" />
          <h2 className="text-xl font-black tracking-tight text-text-primary uppercase">Management Shortcuts</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/admin/students/add"
            className="group relative overflow-hidden rounded-3xl border border-border/40 bg-card p-6 shadow-sm transition-all hover:shadow-xl hover:border-primary/20"
          >
            <div className="relative z-10">
              <div className="p-3 bg-primary/10 text-primary rounded-2xl w-fit mb-4 group-hover:scale-110 transition-transform">
                <GraduationCap size={24} />
              </div>
              <h3 className="text-lg font-bold text-text-primary">Add Student</h3>
              <p className="text-sm text-text-muted mt-1 leading-relaxed">
                Register a new student profile and assign credentials.
              </p>
              <div className="mt-4 flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                Proceed <ArrowRight size={14} />
              </div>
            </div>
            <div className="absolute top-0 right-0 -m-6 h-32 w-32 bg-primary/5 rounded-full blur-3xl" />
          </Link>

          <Link
            href="/admin/teachers/add"
            className="group relative overflow-hidden rounded-3xl border border-border/40 bg-card p-6 shadow-sm transition-all hover:shadow-xl hover:border-success/20"
          >
            <div className="relative z-10">
              <div className="p-3 bg-success/10 text-success rounded-2xl w-fit mb-4 group-hover:scale-110 transition-transform">
                <Users size={24} />
              </div>
              <h3 className="text-lg font-bold text-text-primary">Add Teacher</h3>
              <p className="text-sm text-text-muted mt-1 leading-relaxed">
                Onboard new faculty members and set department roles.
              </p>
              <div className="mt-4 flex items-center gap-2 text-success font-bold text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                Proceed <ArrowRight size={14} />
              </div>
            </div>
            <div className="absolute top-0 right-0 -m-6 h-32 w-32 bg-success/5 rounded-full blur-3xl" />
          </Link>

          <Link
            href="/admin/courses/add"
            className="group relative overflow-hidden rounded-3xl border border-border/40 bg-card p-6 shadow-sm transition-all hover:shadow-xl hover:border-warning/20"
          >
            <div className="relative z-10">
              <div className="p-3 bg-warning/10 text-warning rounded-2xl w-fit mb-4 group-hover:scale-110 transition-transform">
                <BookOpen size={24} />
              </div>
              <h3 className="text-lg font-bold text-text-primary">Add Course</h3>
              <p className="text-sm text-text-muted mt-1 leading-relaxed">
                Define new curriculum modules and assign instructors.
              </p>
              <div className="mt-4 flex items-center gap-2 text-warning font-bold text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                Proceed <ArrowRight size={14} />
              </div>
            </div>
            <div className="absolute top-0 right-0 -m-6 h-32 w-32 bg-warning/5 rounded-full blur-3xl" />
          </Link>
        </div>
      </section>

      {/* Recent Activity / Courses */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-border/40 pb-4">
          <div className="flex items-center gap-2">
            <Building2 size={20} className="text-primary" />
            <h2 className="text-xl font-black tracking-tight text-text-primary uppercase">Recent Course Registry</h2>
          </div>
          <Link
            href="/admin/courses"
            className="text-xs font-bold text-primary hover:underline uppercase tracking-widest"
          >
            Explore all
          </Link>
        </div>

        <div className="bg-card rounded-3xl border border-border/40 overflow-hidden shadow-sm">
          {recentCourses.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-sm text-text-muted italic">No recent course entries found.</p>
            </div>
          ) : (
            <div className="divide-y divide-border/40">
              {recentCourses.map((course) => (
                <div
                  key={course.id}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 transition-colors hover:bg-primary/5"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-background-secondary border border-border/40 flex items-center justify-center font-black text-xs text-text-muted group-hover:bg-primary group-hover:text-white transition-all">
                      {course.code?.substring(0, 2)}
                    </div>
                    <div>
                      <p className="text-base font-bold text-text-primary group-hover:text-primary transition-colors">
                        {course.title || "Untitled Course"}
                      </p>
                      <p className="text-xs text-text-muted">
                        {course.code || "N/A"} • <span className="font-medium text-text-primary/60">{course.department || "General"}</span>
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/admin/courses/edit/${course.id}`}
                    className="inline-flex items-center justify-center rounded-xl bg-background border border-border/60 px-5 py-2 text-xs font-bold text-text-primary transition-all hover:bg-primary hover:text-white hover:border-primary active:scale-[0.98]"
                  >
                    Manage Course
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

// Fixed imports for the specific icons used in KPI cards
import { PiStudent } from "react-icons/pi";
import { GiTeacher } from "react-icons/gi";
import { Book } from "lucide-react";
import { RiBuilding2Fill } from "react-icons/ri";

export default Admin;
