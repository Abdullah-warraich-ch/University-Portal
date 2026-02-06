"use client";
import React, { useEffect } from "react";
import { db, auth } from "@/app/Firebase";
import { doc, onSnapshot, collection, DocumentData } from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";

export type UserRecord = {
  id: string;
  uid: string;
  role: "student" | "teacher" | "admin";
  semester?: string;
  department?: string;
  registeredCourses?: string[];
  email?: string;
  name?: string;
  phone?: string;
  post?: string;
};

type FirebaseContextType = {
  data: UserRecord[];
  students: UserRecord[];
  teachers: UserRecord[];
  courses: DocumentData[];
  currentUser: User | null;
  currentUserRecord: UserRecord | null;
  totalCourses: DocumentData[];
  enrolledCourses: DocumentData[];
  availableCourses: DocumentData[];
};

export const FirebaseContext = React.createContext<FirebaseContextType | null>(
  null,
);

function FirebaseContextProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = React.useState<UserRecord[]>([]);
  const [students, setStudents] = React.useState<UserRecord[]>([]);
  const [teachers, setTeachers] = React.useState<UserRecord[]>([]);
  const [courses, setCourses] = React.useState<DocumentData[]>([]);
  const [currentUser, setCurrentUser] = React.useState<User | null>(null);
  const [currentUserRecord, setCurrentUserRecord] =
    React.useState<UserRecord | null>(null);

  useEffect(() => {
    const unsubscribeUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      const res: UserRecord[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<UserRecord, "id">),
      }));
      setData(res);
      setStudents(res.filter((u) => u.role === "student"));
      setTeachers(res.filter((u) => u.role === "teacher"));
    });

    const unsubscribeCourses = onSnapshot(
      collection(db, "courses"),
      (snapshot) => {
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCourses(list);
      },
    );

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setCurrentUser(null);
        setCurrentUserRecord(null);
        return;
      }

      setCurrentUser(user);

      const userRef = doc(db, "users", user.uid);
      const unsubscribeUserDoc = onSnapshot(userRef, (snap) => {
        if (snap.exists()) {
          setCurrentUserRecord({
            id: snap.id,
            ...(snap.data() as Omit<UserRecord, "id">),
          });
        } else {
          setCurrentUserRecord(null);
        }
      });

      return () => unsubscribeUserDoc();
    });

    return () => {
      unsubscribeUsers();
      unsubscribeCourses();
      unsubscribeAuth();
    };
  }, []);

  const totalCourses =
    courses?.filter(
      (course) =>
        course.semester === currentUserRecord?.semester &&
        course.department === currentUserRecord?.department,
    ) ?? [];

  const enrolledCourses = totalCourses.filter((course) =>
    currentUserRecord?.registeredCourses?.includes(course.id),
  );

  const availableCourses = totalCourses.filter(
    (course) => !currentUserRecord?.registeredCourses?.includes(course.id),
  );

  return (
    <FirebaseContext.Provider
      value={{
        data,
        students,
        teachers,
        courses,
        currentUser,
        currentUserRecord,
        totalCourses,
        enrolledCourses,
        availableCourses,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
}

export default FirebaseContextProvider;
