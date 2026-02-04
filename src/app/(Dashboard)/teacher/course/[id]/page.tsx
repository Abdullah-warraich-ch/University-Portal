"use client";
import React, { useState, useEffect, useContext } from "react";
import { useParams } from "next/navigation";
import { FirebaseContext } from "@/app/Context";
import { db } from "@/app/Firebase";
import { doc, DocumentData, getDoc } from "firebase/firestore";

function Course() {
  const { currentUser, currentUserRecord, courses } =
    useContext(FirebaseContext)!;

  const [course, setCourse] = useState<DocumentData | null>(null);
  const { id } = useParams();

  if (typeof id !== "string") {
    throw new Error("Invalid document id");
  }

  useEffect(() => {
    async function getCourse(code: string) {
      const CourseRef = doc(db, "courses", code);
      const docSnap = await getDoc(CourseRef);

      if (docSnap.exists()) {
        setCourse(docSnap.data());
      } else {
        console.log("Not Found");
      }
    }

    getCourse(id);
  }, [id]);

  console.log("course", course);

  return <div>
    <h1>{}</h1>
  </div>;
}

export default Course;
