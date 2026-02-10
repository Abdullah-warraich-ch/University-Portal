"use client";
import React, { useContext, useEffect } from "react";
import { FirebaseContext } from "@/app/Context";
import {
  DocumentData,
  updateDoc,
  doc,
  arrayUnion,
  setDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import { db } from "@/app/Firebase";
import Kpicard from "@/app/Components/student/Kpi-card";

function Student() {
  const { currentUserRecord, enrolledCourses, availableCourses } =
    useContext(FirebaseContext)!;
  const [attendanceData, setAttendanceData] = React.useState<
    AttendanceRecord[]
  >([]);
  const [currentUserAttendance, setCurrentUserAttendance] = React.useState<
    AttendanceRecord[]
  >([]);

  type StudentAttendance = {
    [studentName: string]: {
      present: boolean;
      remarks: string;
    };
  };

  type AttendanceRecord = {
    id: string;
    code: string;
    data: StudentAttendance;
  };

  async function RegisterCourse(code: string) {
    if (!currentUserRecord) return;

    const userRef = doc(db, "users", currentUserRecord.uid);
    const courseRef = doc(
      db,
      "courses",
      code,
      "students",
      currentUserRecord.uid,
    );
    await updateDoc(userRef, {
      registeredCourses: arrayUnion(code),
    });
    await setDoc(
      courseRef,
      {
        name: currentUserRecord.name,
        email: currentUserRecord.email,
        uid: currentUserRecord.uid,
        timestamp: new Date(),
      },
      { merge: true },
    );
  }

  useEffect(() => {
    currentUserRecord?.registeredCourses?.forEach((code: string) => {
      const AttendanceRef = collection(db, "courses", code, "attendance");
      getDocs(AttendanceRef).then((snapshot) => {
        snapshot.forEach((doc) => {
          setAttendanceData((prev) => [
            ...prev,
            { id: doc.id, code: code, data: doc.data() },
          ]);
        });
        console.log(`Attendance for course ${code}:`, attendanceData);
      });
    });
    // const AccessCurrentUserAttendance = () => {
    //   const userAttendance = attendanceData.filter((record) =>
    //     Object.keys(record.data).includes(currentUserRecord?.uid || ""),
    //   );
    //   setCurrentUserAttendance(userAttendance);
    // };
    // AccessCurrentUserAttendance();
  }, [currentUserRecord]);

  if (attendanceData.length > 0) {
    console.log("Final Attendance Data:", attendanceData);
  }
  if (currentUserAttendance.length > 0) {
    console.log("Current Student Attendance:", currentUserAttendance);
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
      {/* Attendance */}
      <div>
        
      </div>
    </div>
  );
}

export default Student;
