"use client";
import React, { Context, useEffect } from "react";
import { db } from "@/app/Firebase";
import { getDocs, doc, collection, DocumentData } from "firebase/firestore";

  type FirebaseContextType = {
    data: DocumentData[];
    students: DocumentData[];
    teachers: DocumentData[];
  };
  
export const FirebaseContext = React.createContext<FirebaseContextType | null>(null);

function FirebaseContextProvider({ children }: { children: React.ReactNode }) {


  const [data, setData] = React.useState<DocumentData[]>([]);
  const [students, setStudents] = React.useState<DocumentData[]>([]);
  const [teachers, setTeachers] = React.useState<DocumentData[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const res = querySnapshot.docs.map((doc) => doc.data());
      setData(res);
      const studentsData = res.filter((user) => user.role === "student");
      setStudents(studentsData);
      const teachersData = res.filter((user) => user.role === "teacher");
      setTeachers(teachersData);
    };
    fetchData();
  }, []);
  return (
    <FirebaseContext.Provider value={{ data, students, teachers }}>
      {children}
    </FirebaseContext.Provider>
  );
}

export default FirebaseContextProvider;
