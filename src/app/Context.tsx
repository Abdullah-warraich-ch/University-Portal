"use client";
import React, { Context, useEffect } from "react";
import { db } from "@/app/Firebase";
import {
  getDocs,
  doc,
  onSnapshot,
  collection,
  DocumentData,
} from "firebase/firestore";

type FirebaseContextType = {
  data: DocumentData[];
  students: DocumentData[];
  teachers: DocumentData[];
  courses: DocumentData[];
};

export const FirebaseContext = React.createContext<FirebaseContextType | null>(
  null,
);

function FirebaseContextProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = React.useState<DocumentData[]>([]);
  const [students, setStudents] = React.useState<DocumentData[]>([]);
  const [teachers, setTeachers] = React.useState<DocumentData[]>([]);
  const [courses, setCourses] = React.useState<DocumentData[]>([]);
  useEffect(() => {
    // 1. Create a reference to the collection
    const usersCollection = collection(db, "users");
    const coursesCollection = collection(db, "courses");
    const fetchCourses = async () => {
      const coursesSnapshot = onSnapshot(coursesCollection, (snapshot) => {
        const coursesList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCourses(coursesList);
        console.log("Courses fetched:", coursesList);
      });
      return () => coursesSnapshot(); // Cleanup listener on unmount
    };
    fetchCourses();
    // 2. Set up the "Snapshot" listener
    const unsubscribe = onSnapshot(
      usersCollection,
      (snapshot) => {
        // This block runs immediately on load AND every time data changes
        const res = snapshot.docs.map((doc) => ({
          id: doc.id, // Good practice: include the document ID
          ...doc.data(),
        }));

        setData(res);

        // Filter the real-time data into your specific states
        setStudents(res.filter((user) => user.role === "student"));
        setTeachers(res.filter((user) => user.role === "teacher"));

        console.log("Data updated in real-time!");
      },
      (error) => {
        console.error("Error fetching real-time data:", error);
      },
    );

    // 3. Cleanup: Tell the listener to stop when the user leaves the page
    return () => unsubscribe();
  }, []); // Empty dependency array is correct here
  return (
    <FirebaseContext.Provider value={{ data, students, teachers, courses }}>
      {children}
    </FirebaseContext.Provider>
  );
}

export default FirebaseContextProvider;
