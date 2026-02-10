"use client";
import React, { use, useEffect } from "react";
import Kpicard from "@/app/Components/admin/Kpi-card";
import { getDocs, doc, collection } from "firebase/firestore";
import { db } from "@/app/Firebase";
function Admin() {
  const [students, setStudents] = React.useState(0);
  const [teachers, setTeachers] = React.useState(0);
  const [courses, setCourses] = React.useState(0);
  const [departments, setDepartments] = React.useState(0);
  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const studentCount = querySnapshot.docs.filter(
        (doc) => doc.data().role === "student",
      );
      setStudents(studentCount.length);

      const teacherCount = querySnapshot.docs.filter(
        (doc) => doc.data().role === "teacher",
      );
      setTeachers(teacherCount.length);
    };
    fetchData();

    return () => {};
  }, []);
  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-text-primary">
            Overview
          </h1>
          <p className="text-sm text-text-muted">
            University snapshot and totals
          </p>
        </div>
        <span className="text-xs text-text-muted">Updated just now</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Kpicard title="Total Students" value={students} to="/admin/students" />
        <Kpicard title="Total Teachers" value={teachers} to="/admin/teachers" />
        <Kpicard title="Total Courses" value={courses} to="/admin/courses" />
        <Kpicard
          title="Departments"
          value={departments}
          to="/admin/departments"
        />
      </div>
    </div>
  );
}
export default Admin;
