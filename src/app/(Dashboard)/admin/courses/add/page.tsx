"use client";
import React from "react";
import { auth, db } from "@/app/Firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { getDocs, doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { FirebaseContext } from "@/app/Context";

function CourseDetail() {
  const [loading, setLoading] = React.useState(false);
  const [courseCode, setCourseCode] = React.useState("");
  const [courseName, setCourseName] = React.useState("");
  const [courseTeacher, setCourseTeacher] = React.useState("");
  const [courseDepartment, setCourseDepartment] = React.useState("");
  const [courseSemester, setCourseSemester] = React.useState("");

  const { teachers } = React.useContext(FirebaseContext)!;

  const router = useRouter();
  async function CreateCourse(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      // Create course document in Firestore
      await setDoc(doc(db, "courses", courseCode), {
        code: courseCode,
        title: courseName,
        teacher: courseTeacher,
        department: courseDepartment,
        semester: courseSemester,
      });
      router.push("/admin/courses");
      setLoading(false);
    } catch (error) {
      console.error("Error creating course:", error);
      alert("Error creating course. Please try again.");
    }
  }
  return (
    <div className="p-8">
      <h1 className="text-2xl font-medium mb-4">Add Course</h1>
      <form onSubmit={CreateCourse} className="space-y-4 ">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-text-muted mb-1"
            >
              Course Code
            </label>
            <input
              type="text"
              id="courseCode"
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
              className="w-full p-2 border border-border rounded-lg focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-text-muted mb-1"
            >
              Course Name
            </label>
            <input
              type="text"
              id="courseName"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              className="w-full p-2 border border-border rounded-lg focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label
              htmlFor="teacher"
              className="block text-sm font-medium text-text-muted mb-1"
            >
              Course Teacher
            </label>

            <select
              value={courseTeacher}
              onChange={(e) => setCourseTeacher(e.target.value)}
              name="teacher"
              id="teacher"
              className="w-full p-2.5 border border-border rounded-lg focus:ring-primary focus:border-primary"
            >
              <option value="" className="bg-background">
                Select Teacher
              </option>
              {teachers.map((teacher) => (
                <option
                  key={teacher.id}
                  value={teacher.name}
                  className="bg-background"
                >
                  {teacher.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="department"
              className="block text-sm font-medium text-text-muted mb-1"
            >
              Department
            </label>
            <select
              value={courseDepartment}
              onChange={(e) => setCourseDepartment(e.target.value)}
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
              value={courseSemester}
              onChange={(e) => setCourseSemester(e.target.value)}
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
        </div>
        <button
          type="submit"
          className="p-2 px-4 rounded-lg bg-primary text-white hover:bg-primary/90 transition cursor-pointer"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Spinner className="w-5 h-5" /> Creating Course
            </span>
          ) : (
            "Create Course"
          )}
        </button>
      </form>
    </div>
  );
}

export default CourseDetail;
