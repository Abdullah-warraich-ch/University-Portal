"use client";
import React, { useEffect } from "react";
import { db, auth } from "@/app/Firebase";
import {
  getDoc,
  doc,
  onSnapshot,
  collection,
  DocumentData,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

type FirebaseContextType = {
  data: DocumentData[];
  students: DocumentData[];
  teachers: DocumentData[];
  courses: DocumentData[];
  currentUser: DocumentData | null;
  currentUserRecord: DocumentData | null;
};

export const FirebaseContext = React.createContext<FirebaseContextType | null>(
  null
);

function FirebaseContextProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = React.useState<DocumentData[]>([]);
  const [students, setStudents] = React.useState<DocumentData[]>([]);
  const [teachers, setTeachers] = React.useState<DocumentData[]>([]);
  const [courses, setCourses] = React.useState<DocumentData[]>([]);
  const [currentUser, setCurrentUser] = React.useState<DocumentData | null>(
    null
  );
  const [currentUserRecord, setCurrentUserRecord] =
    React.useState<DocumentData | null>(null);

  useEffect(() => {
    const usersCollection = collection(db, "users");
    const coursesCollection = collection(db, "courses");

    // 🔹 Users listener
    const unsubscribeUsers = onSnapshot(usersCollection, (snapshot) => {
      const res = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setData(res);
      setStudents(res.filter((u) => u.role === "student"));
      setTeachers(res.filter((u) => u.role === "teacher"));
    });

    // 🔹 Courses listener
    const unsubscribeCourses = onSnapshot(coursesCollection, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCourses(list);
    });

    // 🔹 Auth listener (ONLY ONCE)
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setCurrentUser(null);
        setCurrentUserRecord(null);
        return;
      }

      setCurrentUser(user as any);

      const userDocRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        setCurrentUserRecord({ id: docSnap.id, ...docSnap.data() });
      } else {
        setCurrentUserRecord(null);
      }
    });

    // ✅ Proper cleanup
    return () => {
      unsubscribeUsers();
      unsubscribeCourses();
      unsubscribeAuth();
    };
  }, []);

  return (
    <FirebaseContext.Provider
      value={{
        data,
        students,
        teachers,
        courses,
        currentUser,
        currentUserRecord,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
}

export default FirebaseContextProvider;
