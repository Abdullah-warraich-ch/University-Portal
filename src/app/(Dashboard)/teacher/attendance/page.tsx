"use client";
import React from "react";
import { FirebaseContext } from "@/app/Context";
import { useContext } from "react";
import Kpicard from "@/app/Components/teacher/Kpi-card";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/app/Firebase";
import CourseStudentCount from "@/app/Components/teacher/StudentCount";

function Attendance() {
  const { courses, currentUser } =
    React.useContext(FirebaseContext)!;
  const userCourses = courses.filter(
    (course) => course.teacherUid === currentUser?.uid,
  );
  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-text-primary">
            Attendance Overview
          </h1>
          <p className="text-sm text-text-muted">
            Select a course to review attendance
          </p>
        </div>
        <span className="text-xs text-text-muted">Current week</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {userCourses.map((course, index) => (
          <Kpicard
            key={index}
            title={course.title}
            value={<CourseStudentCount courseCode={course.code} />}
            to={`/teacher/attendance/course/${course.code}`}
          />
        ))}
      </div>
    </div>
  );
}

export default Attendance;
