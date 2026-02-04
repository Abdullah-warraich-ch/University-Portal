"use client";
import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/app/Firebase";

const CourseStudentCount = ({ courseCode }: { courseCode: string }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // This is the correct place for a side effect!
    const subColRef = collection(db, "courses", courseCode, "students");

    // Subscribe to the count
    const unsubscribe = onSnapshot(subColRef, (snapshot) => {
      setCount(snapshot.size);
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, [courseCode]);

  return <>{count}</>;
};

export default CourseStudentCount;
