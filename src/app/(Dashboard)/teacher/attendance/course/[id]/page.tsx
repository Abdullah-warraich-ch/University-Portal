"use client";
import React from "react";
import { useParams } from "next/navigation";
import { FirebaseContext } from "@/app/Context";
import Link from "next/link";

function Course() {
  const { id } = useParams();
  const { currentUser, currentUserRecord, courses } =
    React.useContext(FirebaseContext)!;
  const currentCourse = courses.find((course) => course.code === id);

  return (
    <div className="p-8">
      <div className="text-xl font-semibold mb-7">{currentCourse?.title}</div>
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Attendance</h1>
        <Link
          href={`/teacher/attendance/add/${id}`}
          className="bg-primary font-medium hover:bg-primary/80 cursor-pointer text-white px-4 py-2 rounded"
        >
          Mark Attendance
        </Link>
      </div>
      <div className="border border-border rounded-lg p-4 mt-5">
        {/* Attendance content goes here */}
        <table className="w-full border-collapse border-spacing-0">
          <thead>
            <tr className="bg-background-secondary border-b border-b-border text-left text-text-muted">
              <th className="p-2 ">Date</th>
              <th className=" p-2">Total Students</th>
              <th className=" p-2 ">Present Students</th>
              <th className=" p-2 ">Absent Students</th>
              <th className=" p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {/* Example rows - in a real app, this would be dynamically generated */}
            <tr className="border-b border-b-border">
              <td className=" p-2">John Doe</td>
              <td className=" p-2">25</td>
              <td className=" p-2">20</td>
              <td className=" p-2">5</td>
              <td className=" p-2">
                <button className="bg-primary font-medium hover:bg-primary/80 cursor-pointer text-white px-4 py-1 rounded">
                  View Details
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Course;
