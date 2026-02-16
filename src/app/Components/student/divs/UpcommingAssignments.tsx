import React from "react";
import { db } from "@/app/Firebase";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FirebaseContext } from "@/app/Context";
import { useContext } from "react";
import { UserRecord } from "@/app/Context";
import Kpicard from "../Kpi-card";

function UpcomingAssignments() {
  const { enrolledCourses } = useContext(FirebaseContext)!;
  const [assignments, setAssignments] = useState<
    { title: string; DueDate: string; courseCode: string }[] | null
  >(null);

  useEffect(() => {
    async function fetchAssignments() {
      const allAssignments: {
        title: string;
        DueDate: string;
        courseCode: string;
      }[] = [];

      for (const course of enrolledCourses) {
        if (!course.code) continue;

        const assignmentsRef = collection(db, "courses", course.code, "grades");
        const snapshot = await getDocs(assignmentsRef);
        snapshot.forEach((doc) => {
          const data = doc.data();

          const DueDate = new Date(data.DueDate);
          const now = new Date();

          // Strip the time so we are only comparing the calendar dates
          now.setHours(0, 0, 0, 0);

          if (DueDate >= now) {
            allAssignments.push({
              title: data.title,
              DueDate: data.DueDate,
              courseCode: course.code || "Unknown",
            });
          }
        });
      }
      console.log("Fetched Assignments:", allAssignments);
      setAssignments(allAssignments);
    }

    fetchAssignments();
  }, [enrolledCourses]);
  if (assignments === null) return <p>Loading...</p>;
  return (
    <>
      {assignments.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 mt-5 gap-6">
          {assignments.map((assignment, index) =>
            Kpicard({
              title: assignment.title,
              teacher: assignment.DueDate,
              to: `/student/grades/${assignment.courseCode}`,
              code: assignment.courseCode,
            }),
          )}
        </div>
      ) : (
        <p>No upcoming assignments found.</p>
      )}
    </>
  );
}

export default UpcomingAssignments;
