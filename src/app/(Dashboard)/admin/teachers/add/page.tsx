"use client";
import React from "react";
import { auth, db } from "@/app/Firebase";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { getDocs, doc, collection, addDoc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import {Spinner} from "@/components/ui/spinner";
function TeacherDetail() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [teacherEmail, setTeacherEmail] = React.useState("");
  const [teacherPassword, setTeacherPassword] = React.useState("");
  const [teacherId, setTeacherId] = React.useState("");
  const [teacherName, setTeacherName] = React.useState("");
  const [teacherDepartment, setTeacherDepartment] = React.useState("");
  const [teacherPost, setTeacherPost] = React.useState("");
  const [teacherPhone, setTeacherPhone] = React.useState("");
  async function CreateTeacherCredentials(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        teacherEmail,
        teacherPassword,
      );

      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: teacherEmail,
        name: teacherName,
        id: teacherId,
        department: teacherDepartment,
        post: teacherPost,
        phone: teacherPhone,
        role: "teacher",
      });
      console.log("Teacher account created:", user);
      router.push("/admin/teachers");
      setLoading(false);
    } catch (error) {
      console.error("Error creating teacher account:", error);
      alert("Error creating teacher account. Please try again.");
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-medium mb-4">Add Teacher</h1>
      <form onSubmit={CreateTeacherCredentials} className="space-y-4 ">
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
              value={teacherEmail}
              onChange={(e) => setTeacherEmail(e.target.value)}
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
              value={teacherPassword}
              onChange={(e) => setTeacherPassword(e.target.value)}
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
              value={teacherName}
              onChange={(e) => setTeacherName(e.target.value)}
              className="w-full p-2 border border-border rounded-lg focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label
              htmlFor="id"
              className="block text-sm font-medium text-text-muted mb-1"
            >
              Employe ID
            </label>
            <input
              type="text"
              id="id"
              value={teacherId}
              onChange={(e) => setTeacherId(e.target.value)}
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
              value={teacherDepartment}
              onChange={(e) => setTeacherDepartment(e.target.value)}
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
              value={teacherPost}
              onChange={(e) => setTeacherPost(e.target.value)}
              name="post"
              id="post"
              className="w-full p-2.5 border border-border rounded-lg focus:ring-primary focus:border-primary"
            >
              <option value="" className="bg-background">
                Select Post
              </option>
              <option value="professor" className="bg-background">
                Professor
              </option>
              <option value="lecture" className="bg-background">
                Lecture
              </option>
              <option value="temporary" className="bg-background">
                Temporary
              </option>
              <option value="assistant" className="bg-background">
                Assistant Professor
              </option>
              <option value="associate" className="bg-background">
                Associate Professor
              </option>
              <option value="lab" className="bg-background">
                Lab Attendent
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
              value={teacherPhone}
              onChange={(e) => setTeacherPhone(e.target.value)}
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
              "Create Teacher Account"
            )}
        </button>
      </form>
    </div>
  );
}

export default TeacherDetail;
