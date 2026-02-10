"use client";
import { getDocs, doc, collection, deleteDoc } from "firebase/firestore";
import { db } from "@/app/Firebase";
import React, { useEffect } from "react";
import { FirebaseContext } from "@/app/Context";
import Link from "next/link";

function Teachers() {
  const { teachers } = React.useContext(FirebaseContext)!;

  async function deleteRecord(uid: string) {
    try {
      await deleteDoc(doc(db, "users", uid));
      // Optionally, you can refresh the page or update the state to reflect the deletion
    } catch (error) {
      console.error("Error deleting teacher record:", error);
      alert("Error deleting teacher record. Please try again.");
    }
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-text-primary">
            Teachers List
          </h1>
          <p className="text-text-muted text-sm">
            Home / <span className="text-text-primary">Teachers</span>
          </p>
        </div>
        <div>
          <Link
            href="/admin/teachers/add"
            className="p-2 px-4 rounded-lg border  border-border hover:bg-primary hover:text-white transition cursor-pointer"
          >
            Add Teacher
          </Link>
        </div>
      </div>
      <div className="border border-border/40 rounded-2xl p-4 bg-background-secondary/20">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-background-secondary/40 text-text-muted">
              <th className="text-left py-3 px-4 font-semibold">Name</th>
              <th className="text-left py-3 px-4 font-semibold">Employe ID</th>
              <th className="text-left py-3 px-4 font-semibold">Email</th>
              <th className="text-left py-3 px-4 font-semibold">Phone</th>
              <th className="text-left py-3 px-4 font-semibold">Post</th>
              <th className="text-left py-3 px-4 font-semibold">Department</th>
              <th className="text-left py-3 px-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {teachers.map((teacher, index) => (
              <tr
                key={index}
                className="text-sm hover:bg-primary/5 transition-colors"
              >
                <td className="py-3 px-4">{teacher.name}</td>
                <td className="py-3 px-4">{teacher.id}</td>
                <td className="py-3 px-4">{teacher.email}</td>
                <td className="py-3 px-4">{teacher.phone}</td>
                <td className="py-3 px-4">{teacher.post}</td>
                <td className="py-3 px-4">{teacher.department}</td>

                <td className="py-3 px-4">
                  <div className="flex">
                    <Link
                      href={`/admin/teachers/edit/${teacher.uid}`}
                      className="p-1 px-3 rounded-lg border border-border/60 hover:bg-primary hover:text-white transition cursor-pointer text-xs"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => {
                        if (!teacher.uid) return;
                        deleteRecord(teacher.uid);
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

export default Teachers;
