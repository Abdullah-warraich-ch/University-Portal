"use client";
import React, { useContext } from "react";
import { FirebaseContext } from "@/app/Context";
import { DocumentData, updateDoc, doc, arrayUnion } from "firebase/firestore";
import { db } from "@/app/Firebase";
import Kpicard from "@/app/Components/student/Kpi-card";

function Student() {
  const { currentUserRecord, enrolledCourses, availableCourses } =
    useContext(FirebaseContext)!;

  async function RegisterCourse(code: string) {
    if (!currentUserRecord) return;

    const userRef = doc(db, "users", currentUserRecord.id);
    await updateDoc(userRef, {
      registeredCourses: arrayUnion(code),
    });
  }

  return (
    <div className="p-8">
      {availableCourses.length > 0 && (
        <div>
          <h1 className="text-2xl font-bold mb-5">Available Courses:</h1>
          {availableCourses.map((course, index) => (
            <div
              key={index}
              className="flex justify-between items-center border border-border mb-4 p-4 rounded-2xl"
            >
              <div>
                <h1 className="text-text-primary font-bold text-2xl">
                  {course.title}
                </h1>
                <p className="text-text-muted text-sm">{course.teacher}</p>
              </div>
              <button
                onClick={() => RegisterCourse(course.code)}
                className="bg-primary text-sm p-2 rounded-sm font-medium hover:bg-primary/80"
              >
                Register
              </button>
            </div>
          ))}
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold mb-5">Enrolled Courses:</h1>
        <div className="grid grid-cols-3 gap-4">
          {enrolledCourses.length > 0 ? (
            enrolledCourses.map((course, index) => (
              <Kpicard
                key={index}
                title={course.title}
                teacher={course.teacher}
                to={`/student/course/${course.code}`}
                code={course.code}
              />
            ))
          ) : (
            <h1 className="text-text-muted">No Courses Enrolled Yet.</h1>
          )}
        </div>
      </div>
    </div>
  );
}

export default Student;
