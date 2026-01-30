"use client";
import { getDocs, doc, collection } from "firebase/firestore";
import { db } from "@/app/Firebase";
import React, { useEffect } from "react";
import { FirebaseContext } from "@/app/Context";
import Link from "next/link";

function Teachers() {
  const { teachers } = React.useContext(FirebaseContext)!;
  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-medium">Teachers List</h1>
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
      <div className="border border-border rounded-lg p-4">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/20 text-sm text-text-muted">
              <th className="text-left py-2 px-4  font-medium">Name</th>
              <th className="text-left py-2 px-4 font-medium">Employe ID</th>
              <th className="text-left py-2 px-4 font-medium">Email</th>
              <th className="text-left py-2 px-4 font-medium">Phone</th>
              <th className="text-left py-2 px-4 font-medium">Post</th>
              <th className="text-left py-2 px-4 font-medium">Department</th>
              <th className="text-left py-2 px-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher, index) => (
              <tr key={index} className="border-b border-border/20 text-sm">
                <td className="py-2 px-4">{teacher.name}</td>
                <td className="py-2 px-4">{teacher.id}</td>
                <td className="py-2 px-4">{teacher.email}</td>
                <td className="py-2 px-4">{teacher.phone}</td>
                <td className="py-2 px-4">{teacher.post}</td>
                <td className="py-2 px-4">{teacher.department}</td>

                <td className="py-2 px-4">
                  <Link
                    href={`/admin/teachers/edit/${teacher.email}`}
                    className="p-1 px-3 rounded-lg border border-border hover:bg-primary hover:text-white transition cursor-pointer text-sm"
                  >
                    Edit
                  </Link>
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
