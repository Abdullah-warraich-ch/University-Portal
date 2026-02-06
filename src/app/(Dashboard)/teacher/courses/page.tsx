"use client";
import React from "react";
import { FirebaseContext } from "@/app/Context";
import { useContext } from "react";
import Kpicard from "@/app/Components/teacher/Kpi-card";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/app/Firebase";
import CourseStudentCount from "@/app/Components/teacher/StudentCount";

function Courses() {
  const { courses, currentUser, currentUserRecord } =
    React.useContext(FirebaseContext)!;
  const userCourses = courses.filter(
    (course) => course.teacherUid === currentUser?.uid,
  );
  return (
    <div className="p-8 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {userCourses.map((course, index) => (
          <Kpicard
            key={index}
            title={course.title}
            value={<CourseStudentCount courseCode={course.code} />}
            to={`/teacher/courses/${course.code}`}
          />
        ))}
      </div>
    </div>
  );
}

export default Courses;
