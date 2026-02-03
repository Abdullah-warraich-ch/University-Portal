"use client";
import React, { useEffect, useContext } from "react";
import { FirebaseContext } from "@/app/Context";
import { DocumentData } from "firebase/firestore";
function Student() {
  const { currentUserRecord, courses } = React.useContext(FirebaseContext)!;
  const [availableCourses, setAvailableCourses] = React.useState<
    DocumentData[]
  >([]);

  useEffect(() => {
    const fetchAvailableCourses = () => {
      const unregisteredCourses = courses.filter((course) => {
        return course?.semester === currentUserRecord?.semester;
      });
      setAvailableCourses(unregisteredCourses);

      console.log("Available Courses:", unregisteredCourses);
    };
    fetchAvailableCourses();
  }, [courses, currentUserRecord]);

  if (!currentUserRecord) {
    return <div>Loading...</div>;
  }
  return (
    <div className="p-8">
      <div>Available Courses</div>
    </div>
  );
}

export default Student;
