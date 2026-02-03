// "use client";
// import React from "react";
// import { auth, db } from "@/app/Firebase";
// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { getDocs, doc, setDoc } from "firebase/firestore";
// import { useRouter } from "next/navigation";
// import { Spinner } from "@/components/ui/spinner";
// import { FirebaseContext } from "@/app/Context";

// function CourseDetail() {
//   const [loading, setLoading] = React.useState(false);
//   const [courseCode, setCourseCode] = React.useState("");
//   const [courseName, setCourseName] = React.useState("");
//   const [courseTeacher, setCourseTeacher] = React.useState("");
//   const [courseDepartment, setCourseDepartment] = React.useState("");
//   const [courseSemester, setCourseSemester] = React.useState("");
//   const [teacherUid, setTeacherUid] = React.useState("");

//   const { teachers } = React.useContext(FirebaseContext)!;

//   const router = useRouter();
//   async function CreateCourse(e: React.FormEvent) {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       // Create course document in Firestore
//       await setDoc(doc(db, "courses", courseCode), {
//         code: courseCode,
//         title: courseName,
//         teacher: courseTeacher,
//         teacherUid: teacherUid,
//         department: courseDepartment,
//         semester: courseSemester,
//       });
//       router.push("/admin/courses");
//       setLoading(false);
//     } catch (error) {
//       console.error("Error creating course:", error);
//       alert("Error creating course. Please try again.");
//     }
//   }
//   return (
//     <div className="p-8">
//       <h1 className="text-2xl font-medium mb-4">Add Course</h1>
//       <form onSubmit={CreateCourse} className="space-y-4 ">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
//           <div>
//             <label
//               htmlFor="email"
//               className="block text-sm font-medium text-text-muted mb-1"
//             >
//               Course Code
//             </label>
//             <input
//               type="text"
//               id="courseCode"
//               value={courseCode}
//               onChange={(e) => setCourseCode(e.target.value)}
//               className="w-full p-2 border border-border rounded-lg focus:ring-primary focus:border-primary"
//             />
//           </div>
//           <div>
//             <label
//               htmlFor="password"
//               className="block text-sm font-medium text-text-muted mb-1"
//             >
//               Course Name
//             </label>
//             <input
//               type="text"
//               id="courseName"
//               value={courseName}
//               onChange={(e) => setCourseName(e.target.value)}
//               className="w-full p-2 border border-border rounded-lg focus:ring-primary focus:border-primary"
//             />
//           </div>
//           <div>
//             <label
//               htmlFor="teacher"
//               className="block text-sm font-medium text-text-muted mb-1"
//             >
//               Course Teacher
//             </label>

//             <select
//               value={courseTeacher}
//               onChange={(e) => setCourseTeacher(e.target.value)}
//               name="teacher"
//               id="teacher"
//               className="w-full p-2.5 border border-border rounded-lg focus:ring-primary focus:border-primary"
//             >
//               <option value="" className="bg-background">
//                 Select Teacher
//               </option>
//               {teachers.map((teacher) => (
//                 <option
//                   key={teacher.id}
//                   value={teacher.name}
//                   className="bg-background"
//                 >
//                   {teacher.name}
//                   {setTeacherUid(teacher.uid)}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <label
//               htmlFor="department"
//               className="block text-sm font-medium text-text-muted mb-1"
//             >
//               Department
//             </label>
//             <select
//               value={courseDepartment}
//               onChange={(e) => setCourseDepartment(e.target.value)}
//               name="department"
//               id="department"
//               className="w-full p-2.5 border border-border rounded-lg focus:ring-primary focus:border-primary"
//             >
//               <option value="" className="bg-background">
//                 Select Department
//               </option>
//               <option value="Computer Science" className="bg-background">
//                 Computer Science
//               </option>
//               <option value="Mathematics" className="bg-background">
//                 Mathematics
//               </option>
//               <option value="Physics" className="bg-background">
//                 Physics
//               </option>
//             </select>
//           </div>
//           <div>
//             <label
//               htmlFor="semester"
//               className="block text-sm font-medium text-text-muted mb-1"
//             >
//               Semester
//             </label>
//             <select
//               value={courseSemester}
//               onChange={(e) => setCourseSemester(e.target.value)}
//               name="semester"
//               id="semester"
//               className="w-full p-2.5 border border-border rounded-lg focus:ring-primary focus:border-primary"
//             >
//               <option value="" className="bg-background">
//                 Select Semester
//               </option>
//               <option value="1st" className="bg-background">
//                 1st Semester
//               </option>
//               <option value="2nd" className="bg-background">
//                 2nd Semester
//               </option>
//               <option value="3rd" className="bg-background">
//                 3rd Semester
//               </option>
//               <option value="4th" className="bg-background">
//                 4th Semester
//               </option>
//               <option value="5th" className="bg-background">
//                 5th Semester
//               </option>
//               <option value="6th" className="bg-background">
//                 6th Semester
//               </option>
//               <option value="7th" className="bg-background">
//                 7th Semester
//               </option>
//               <option value="8th" className="bg-background">
//                 8th Semester
//               </option>
//             </select>
//           </div>
//         </div>
//         <button
//           type="submit"
//           className="p-2 px-4 rounded-lg bg-primary text-white hover:bg-primary/90 transition cursor-pointer"
//         >
//           {loading ? (
//             <span className="flex items-center gap-2">
//               <Spinner className="w-5 h-5" /> Creating Course
//             </span>
//           ) : (
//             "Create Course"
//           )}
//         </button>
//       </form>
//     </div>
//   );
// }

// export default CourseDetail;

"use client";
import React, { useEffect } from "react";
import { db } from "@/app/Firebase";
import { getDoc, doc, setDoc } from "firebase/firestore";
import { useRouter, useParams } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { FirebaseContext } from "@/app/Context";

function EditCourseDetail() {
  const { id } = useParams();
  const [loading, setLoading] = React.useState(false);
  const [courseCode, setCourseCode] = React.useState("");
  const [courseName, setCourseName] = React.useState("");
  const [courseTeacher, setCourseTeacher] = React.useState("");
  const [courseDepartment, setCourseDepartment] = React.useState("");
  const [courseSemester, setCourseSemester] = React.useState("");
  const [teacherUid, setTeacherUid] = React.useState("");

  const { teachers } = React.useContext(FirebaseContext)!;
  const router = useRouter();

  useEffect(() => {
    const fetchCourseData = async () => {
      const CourseDoc = await getDoc(doc(db, "courses", id as string));
      if (CourseDoc.exists()) {
        const data = CourseDoc.data();
        setCourseCode(data.code);
        setCourseName(data.title);
        setCourseTeacher(data.teacher);
        setCourseDepartment(data.department);
        setCourseSemester(data.semester);
        setTeacherUid(data.teacherUid);
      }
    };
    fetchCourseData();
  }, [id]);

  async function updateCourseDetails(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await setDoc(doc(db, "courses", id as string), {
        code: courseCode,
        title: courseName,
        teacher: courseTeacher,
        department: courseDepartment,
        semester: courseSemester,
        teacherUid: teacherUid,
      });
      router.push("/admin/courses");
    } catch (error) {
      console.error("Error updating course:", error);
      alert("Error updating course.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-medium mb-4">Edit Course</h1>

      <form onSubmit={updateCourseDetails} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <input
            value={courseCode}
            onChange={(e) => setCourseCode(e.target.value)}
            placeholder="Course Code"
            className="border p-2 rounded"
          />

          <input
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            placeholder="Course Name"
            className="border p-2 rounded"
          />

          <select
            value={teacherUid}
            onChange={(e) => {
              const uid = e.target.value;
              const teacher = teachers.find((t) => t.uid === uid);
              setTeacherUid(uid);
              setCourseTeacher(teacher?.name || "");
            }}
            className="border p-2 rounded"
          >
            <option value="">Select Teacher</option>
            {teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.uid}>
                {teacher.name}
              </option>
            ))}
          </select>

          <select
            value={courseDepartment}
            onChange={(e) => setCourseDepartment(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">Select Department</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Physics">Physics</option>
          </select>

          <select
            value={courseSemester}
            onChange={(e) => setCourseSemester(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">Select Semester</option>
            <option value="1st">1st</option>
            <option value="2nd">2nd</option>
            <option value="3rd">3rd</option>
            <option value="4th">4th</option>
            <option value="5th">5th</option>
            <option value="6th">6th</option>
            <option value="7th">7th</option>
            <option value="8th">8th</option>
          </select>
        </div>

        <button
          type="submit"
          className="p-2 px-4 bg-primary text-white rounded"
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

export default EditCourseDetail;
