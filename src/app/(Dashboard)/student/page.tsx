"use client";
import React, { useEffect, useContext, useState } from "react";
import { FirebaseContext } from "@/app/Context";
import { DocumentData, getDoc, updateDoc } from "firebase/firestore";
import { log } from "console";
import { db } from "@/app/Firebase";
import { doc, setDoc, Timestamp, arrayUnion } from "firebase/firestore";
import { divide } from "firebase/firestore/pipelines";
function Student() {
  const { currentUserRecord, courses } = React.useContext(FirebaseContext)!;
  const [availableCourses, setAvailableCourses] = useState<DocumentData[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<DocumentData[]>([]);
  const [totalCourses, setTotalCourses] = useState<DocumentData[]>([]);

  async function RegisterCourse(code) {
    const registerCode = doc(db, "users", currentUserRecord?.uid);
    await updateDoc(registerCode, {
      registeredCourses: arrayUnion(code),
    });
    
  }

  useEffect(() => {
    const getTotalCourses = courses?.filter((course) => {
      return (
        course.semester === currentUserRecord?.semester &&
        course.department === currentUserRecord?.department
      );
    });
    const getRegisteredCourses = getTotalCourses.filter((course) => {
      if (currentUserRecord?.registeredCourses?.includes(course.id)) {
        return true;
      } else return false;
    });
    const getAvailableCourses = getTotalCourses.filter((course) => {
      if (currentUserRecord?.registeredCourses?.includes(course.id)) {
        return false;
      } else return true;
    });
    setAvailableCourses(getAvailableCourses);
    setEnrolledCourses(getRegisteredCourses);
    setTotalCourses(getTotalCourses);
  }, [currentUserRecord, courses]);

  console.log("User", currentUserRecord?.registeredCourses);
  console.log("Courses", totalCourses);
  console.log("Enrolled Courses", enrolledCourses);
  console.log("Available Courses", availableCourses);

  return (
    <div className="p-8">
      <div className={availableCourses.length > 0 ? "block" : "hidden"}>
        <h1 className="text-2xl font-bold mb-5">Available Course:</h1>
        {availableCourses?.map((course, index) => (
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
      <div>
        <h1 className="text-2xl font-bold mb-5"> Enrolled Courses:</h1>
        {enrolledCourses.length > 0 ? (
          <div>
            {enrolledCourses.map((course, index) => (
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
              </div>
            ))}
          </div>
        ) : (
          <div>
            <h1>No Courses Enrolled Yet.</h1>
          </div>
        )}
      </div>
    </div>
  );
}
export default Student;
