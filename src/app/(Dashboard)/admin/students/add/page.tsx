"use client";
import React from "react";
import { auth, db } from "@/app/Firebase";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { getDocs, doc, collection, addDoc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";

function StudentDetail() {
  const [loading, setLoading] = React.useState(false);
  const [studentEmail, setStudentEmail] = React.useState("");
  const [studentPassword, setStudentPassword] = React.useState("");
  const [studentId, setStudentId] = React.useState("");
  const [studentName, setStudentName] = React.useState("");
  const [studentDepartment, setStudentDepartment] = React.useState("");
  const [studentSemester, setStudentSemester] = React.useState("");
  const [studentPhone, setStudentPhone] = React.useState("");

  const router = useRouter();
  async function CreateStudentCredentials(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        studentEmail,
        studentPassword,
      );

      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: studentEmail,
        name: studentName,
        id: studentId,
        department: studentDepartment,
        semester: studentSemester,
        phone: studentPhone,
        role: "student",
      });
      console.log("Student account created:", user);

      router.push("/admin/students");
      setLoading(false);
    } catch (error) {
      console.error("Error creating student account:", error);
      alert("Error creating student account. Please try again.");
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-medium mb-4">Add Student</h1>
      <form onSubmit={CreateStudentCredentials} className="space-y-4 ">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-text-muted mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={studentEmail}
              onChange={(e) => setStudentEmail(e.target.value)}
              className="w-full p-2 border border-border rounded-lg focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-text-muted mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={studentPassword}
              onChange={(e) => setStudentPassword(e.target.value)}
              className="w-full p-2 border border-border rounded-lg focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-text-muted mb-1"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="w-full p-2 border border-border rounded-lg focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label
              htmlFor="id"
              className="block text-sm font-medium text-text-muted mb-1"
            >
              Student ID
            </label>
            <input
              type="text"
              id="id"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full p-2 border border-border rounded-lg focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label
              htmlFor="department"
              className="block text-sm font-medium text-text-muted mb-1"
            >
              Department
            </label>
            <select
              value={studentDepartment}
              onChange={(e) => setStudentDepartment(e.target.value)}
              name="department"
              id="department"
              className="w-full p-2.5 border border-border rounded-lg focus:ring-primary focus:border-primary"
            >
              <option value="" className="bg-background">
                Select Department
              </option>
              <option value="Computer Science" className="bg-background">
                Computer Science
              </option>
              <option value="Mathematics" className="bg-background">
                Mathematics
              </option>
              <option value="Physics" className="bg-background">
                Physics
              </option>
            </select>
          </div>
          <div>
            <label
              htmlFor="semester"
              className="block text-sm font-medium text-text-muted mb-1"
            >
              Semester
            </label>
            <select
              value={studentSemester}
              onChange={(e) => setStudentSemester(e.target.value)}
              name="semester"
              id="semester"
              className="w-full p-2.5 border border-border rounded-lg focus:ring-primary focus:border-primary"
            >
              <option value="" className="bg-background">
                Select Semester
              </option>
              <option value="1st" className="bg-background">
                1st Semester
              </option>
              <option value="2nd" className="bg-background">
                2nd Semester
              </option>
              <option value="3rd" className="bg-background">
                3rd Semester
              </option>
              <option value="4th" className="bg-background">
                4th Semester
              </option>
              <option value="5th" className="bg-background">
                5th Semester
              </option>
              <option value="6th" className="bg-background">
                6th Semester
              </option>
              <option value="7th" className="bg-background">
                7th Semester
              </option>
              <option value="8th" className="bg-background">
                8th Semester
              </option>
            </select>
          </div>
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-text-muted mb-1"
            >
              Phone Number
            </label>
            <input
              type="text"
              id="phone"
              value={studentPhone}
              onChange={(e) => setStudentPhone(e.target.value)}
              className="w-full p-2 border border-border rounded-lg focus:ring-primary focus:border-primary"
            />
          </div>
        </div>
        <button
          type="submit"
          className="p-2 px-4 rounded-lg bg-primary text-white hover:bg-primary/90 transition cursor-pointer"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Spinner className="w-5 h-5" /> Creating Account
            </span>
          ) : (
            "Create Student Account"
          )}
        </button>
      </form>
    </div>
  );
}

export default StudentDetail;
