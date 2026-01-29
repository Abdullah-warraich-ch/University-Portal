"use client";
import { getDocs, doc, collection } from "firebase/firestore";
import { db } from "@/app/Firebase";
import React, { useEffect } from "react";
import { FirebaseContext } from "@/app/Context";

function Students() {
  const { students } = React.useContext(FirebaseContext)!;
  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-medium">Students List</h1>
          <p className="text-text-muted text-sm">
            Home / <span className="text-text-primary">Students</span>
          </p>
        </div>
        <div>
          <button className="p-2 px-4 rounded-lg border  border-border hover:bg-primary hover:text-white transition cursor-pointer">
            Add Student
          </button>
        </div>
      </div>
      <div className="border border-border rounded-lg p-4">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/20 text-sm text-text-muted">
              <th className="text-left py-2 px-4  font-medium">Name</th>
              <th className="text-left py-2 px-4 font-medium">ID</th>
              <th className="text-left py-2 px-4 font-medium">Email</th>
              <th className="text-left py-2 px-4 font-medium">Phone</th>
              <th className="text-left py-2 px-4 font-medium">Semester</th>
              <th className="text-left py-2 px-4 font-medium">Department</th>
              <th className="text-left py-2 px-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={index} className="border-b border-border/20 text-sm">
                <td className="py-2 px-4">{student.name}</td>
                <td className="py-2 px-4">{student.studentId}</td>
                <td className="py-2 px-4">{student.email}</td>
                <td className="py-2 px-4">{student.phone}</td>
                <td className="py-2 px-4">{student.semester}</td>
                <td className="py-2 px-4">{student.department}</td>

                <td className="py-2 px-4">
                  <button className="p-1 px-3 rounded-lg border border-border hover:bg-primary hover:text-white transition cursor-pointer text-sm">
                    Edit
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

export default Students;
