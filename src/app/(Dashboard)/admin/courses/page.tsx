"use client";
import { getDocs, doc, collection, deleteDoc } from "firebase/firestore";
import { db } from "@/app/Firebase";
import React, { useEffect } from "react";
import { FirebaseContext } from "@/app/Context";
import Link from "next/link";

function Courses() {
  const deleteRecord = async (id: string) => {
    try {
      await deleteDoc(doc(db, "courses", id));
      // Optionally, you can refresh the page or update the state to reflect the deletion
    } catch (error) {
      console.error("Error deleting course record:", error);
      alert("Error deleting course record. Please try again.");
    }
  };
  const { courses } = React.useContext(FirebaseContext)!;
  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-medium">Courses List</h1>
          <p className="text-text-muted text-sm">
            Home / <span className="text-text-primary">Courses</span>
          </p>
        </div>
        <div>
          <Link
            href="/admin/courses/add"
            className="p-2 px-4 rounded-lg border  border-border hover:bg-primary hover:text-white transition cursor-pointer"
          >
            Add Course
          </Link>
        </div>
      </div>
      <div className="border border-border rounded-lg p-4">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/20 text-sm text-text-muted">
              <th className="text-left py-2 px-4  font-medium">Course Code</th>
              <th className="text-left py-2 px-4 font-medium">Course Name</th>
              <th className="text-left py-2 px-4 font-medium">
                Assigned Teacher
              </th>
              <th className="text-left py-2 px-4 font-medium">
                Enrolled Student
              </th>
              <th className="text-left py-2 px-4 font-medium">Semester</th>
              <th className="text-left py-2 px-4 font-medium">Department</th>

              <th className="text-left py-2 px-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course, index) => (
              <tr key={index} className="border-b border-border/20 text-sm">
                <td className="py-2 px-4">{course.code}</td>
                <td className="py-2 px-4">{course.title}</td>
                <td className="py-2 px-4">{course.teacher}</td>
                <td className="py-2 px-4">{course.students?.length || 0}</td>
                <td className="py-2 px-4">{course.semester}</td>
                <td className="py-2 px-4">{course.department}</td>

                <td className="py-2 px-4 flex">
                  <Link
                    href={`/admin/courses/edit/${course.id}`}
                    className="p-1 px-3 rounded-lg border border-border hover:bg-primary hover:text-white transition cursor-pointer text-sm"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteRecord(course.id)}
                    className="p-1 px-3 rounded-lg border border-border hover:bg-danger hover:text-white transition cursor-pointer text-sm ml-2"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Courses;
