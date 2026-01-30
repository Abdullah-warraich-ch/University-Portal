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
import { Spinner } from "@/components/ui/spinner";
import { useParams } from "next/navigation";

function EditTeacherDetail() {
  const { uid } = useParams();
  const [loading, setLoading] = React.useState(false);
  const [teacherEmail, setTeacherEmail] = React.useState("");

  const [teacherId, setTeacherId] = React.useState("");
  const [teacherName, setTeacherName] = React.useState("");
  const [teacherDepartment, setTeacherDepartment] = React.useState("");
  const [teacherPost, setTeacherPost] = React.useState("");
  const [teacherPhone, setTeacherPhone] = React.useState("");

  const router = useRouter();

  useEffect(() => {
    // Fetch teacher data by uid and populate the form fields
    const fetchTeacherData = async () => {
      const teacherDoc = await getDoc(doc(db, "users", uid));
      if (teacherDoc.exists()) {
        const data = teacherDoc.data();
        setTeacherEmail(data.email);
        setTeacherId(data.id);
        setTeacherName(data.name);
        setTeacherDepartment(data.department);
        setTeacherPost(data.post);
        setTeacherPhone(data.phone);
      }
    };
    fetchTeacherData();
  }, [uid]);

  async function updateTeacherDetails(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await setDoc(doc(db, "users", uid), {
        uid: uid,
        email: teacherEmail,
        name: teacherName,
        id: teacherId,
        department: teacherDepartment,
        post: teacherPost,
        phone: teacherPhone,
        role: "teacher",
      });
      console.log("Teacher account updated:", uid);

      router.push("/admin/teachers");
      setLoading(false);
    } catch (error) {
      console.error("Error updating teacher account:", error);
      alert("Error updating teacher account. Please try again.");
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-medium mb-4">Edit Teacher</h1>
      <form onSubmit={updateTeacherDetails} className="space-y-4 ">
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
              htmlFor="post"
              className="block text-sm font-medium text-text-muted mb-1"
            >
              Post
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

export default EditTeacherDetail;
