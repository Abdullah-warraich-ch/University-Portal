"use client";
import React from "react";
import { useEffect } from "react";
import { auth, db } from "@/app/Firebase";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getDocs,
  getDoc,
  doc,
  collection,
  addDoc,
  setDoc,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Spinner } from "@/app/Components/ui/spinner";
import { useParams } from "next/navigation";

function EditStudentDetail() {
  const { uid } = useParams();
  const [loading, setLoading] = React.useState(false);
  const [studentEmail, setStudentEmail] = React.useState("");
  const [studentPassword, setStudentPassword] = React.useState("");
  const [studentId, setStudentId] = React.useState("");
  const [studentName, setStudentName] = React.useState("");
  const [studentDepartment, setStudentDepartment] = React.useState("");
  const [studentSemester, setStudentSemester] = React.useState("");
  const [studentPhone, setStudentPhone] = React.useState("");

  const router = useRouter();

  useEffect(() => {
    // Fetch student data by uid and populate the form fields
    const fetchStudentData = async () => {
      const studentDoc = await getDoc(doc(db, "users", uid as string));
      if (studentDoc.exists()) {
        const data = studentDoc.data();
        setStudentEmail(data.email);
        setStudentId(data.id);
        setStudentName(data.name);
        setStudentDepartment(data.department);
        setStudentSemester(data.semester);
        setStudentPhone(data.phone);
      }
    };
    fetchStudentData();
  }, [uid]);

  async function updateStudentDetails(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await setDoc(doc(db, "users", uid as string), {
        uid: uid,
        email: studentEmail,
        name: studentName,
        id: studentId,
        department: studentDepartment,
        semester: studentSemester,
        phone: studentPhone,
        role: "student",
      });
      console.log("Student account updated:", uid);

      router.push("/admin/students");
      setLoading(false);
    } catch (error) {
      console.error("Error updating student account:", error);
      alert("Error updating student account. Please try again.");
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-text-primary mb-4">
        Edit Student
      </h1>
      <form onSubmit={updateStudentDetails} className="space-y-4 ">
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
          className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Spinner className="w-5 h-5" /> Updating
            </span>
          ) : (
            "Update"
          )}
        </button>
      </form>
    </div>
  );
}

export default EditStudentDetail;
