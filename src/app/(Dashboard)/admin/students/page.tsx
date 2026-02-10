"use client";
import { getDocs, doc, collection, deleteDoc } from "firebase/firestore";
import { db } from "@/app/Firebase";
import React, { useEffect } from "react";
import { FirebaseContext } from "@/app/Context";
import Link from "next/link";

function Students() {
  const deleteRecord = async (uid: string) => {
    try {
      await deleteDoc(doc(db, "users", uid));
      // Optionally, you can refresh the page or update the state to reflect the deletion
    } catch (error) {
      console.error("Error deleting student record:", error);
      alert("Error deleting student record. Please try again.");
    }
  };
  const { students } = React.useContext(FirebaseContext)!;
  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-text-primary">
            Students List
          </h1>
          <p className="text-text-muted text-sm">
            Home / <span className="text-text-primary">Students</span>
          </p>
        </div>
        <div>
          <Link
            href="/admin/students/add"
            className="p-2 px-4 rounded-lg border  border-border hover:bg-primary hover:text-white transition cursor-pointer"
          >
            Add Student
          </Link>
        </div>
      </div>
      <div className="border border-border/40 rounded-2xl p-4 bg-background-secondary/20">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-background-secondary/40 text-text-muted">
              <th className="text-left py-3 px-4 font-semibold">Name</th>
              <th className="text-left py-3 px-4 font-semibold">ID</th>
              <th className="text-left py-3 px-4 font-semibold">Email</th>
              <th className="text-left py-3 px-4 font-semibold">Phone</th>
              <th className="text-left py-3 px-4 font-semibold">Semester</th>
              <th className="text-left py-3 px-4 font-semibold">Department</th>
              <th className="text-left py-3 px-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {students.map((student, index) => (
              <tr
                key={index}
                className="text-sm hover:bg-primary/5 transition-colors"
              >
                <td className="py-3 px-4">{student.name}</td>
                <td className="py-3 px-4">{student.id}</td>
                <td className="py-3 px-4">{student.email}</td>
                <td className="py-3 px-4">{student.phone}</td>
                <td className="py-3 px-4">{student.semester}</td>
                <td className="py-3 px-4">{student.department}</td>

                <td className="py-3 px-4">
                  <div className="flex">
                    <Link
                      href={`/admin/students/edit/${student.uid}`}
                      className="p-1 px-3 rounded-lg border border-border/60 hover:bg-primary hover:text-white transition cursor-pointer text-xs"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => {
                        if (!student.uid) return;
                        deleteRecord(student.uid);
                      }}
                      className="p-1 px-3 rounded-lg border border-border/60 hover:bg-danger hover:text-white transition cursor-pointer text-xs ml-2"
                    >
                      Delete
                    </button>
                  </div>
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
