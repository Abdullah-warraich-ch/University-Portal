"use client";
import React, { useEffect, useState } from "react";
import { FirebaseContext } from "@/app/Context";
import { db } from "@/app/Firebase";
import {
  collection,
  DocumentData,
  getDocs,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import { useParams, useRouter } from "next/navigation";

function AddGrade() {
  // Define the type: key is a string (UID), value is a number or string
  interface GradeMap {
    [key: string]: number | string | undefined;
  }

  const router = useRouter();

  const { id } = useParams();
  // const [assignments, setAssignments] = React.useState<DocumentData>([]);
  const [students, setStudents] = React.useState<DocumentData>([]);
  const [marks, setMarks] = React.useState<GradeMap>({});
  const [totalMarks, setTotalMarks] = useState<number>(10);
  const [type, setType] = useState("quiz1");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");

  console.log(id);

  const setMarksForStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    const gradesRef = doc(
      db,
      "courses",
      id as string,
      "grades",
      type as string,
    );
    const gradeRef = collection(db, "courses", id as string, "grades");
    const gradeDoc = doc(gradeRef, type);
    const gradeSnap = await getDoc(gradeDoc);
    //if type already exists, set error state to "Grade type already exists"
    if (gradeSnap.exists()) {
      setError("Grade type already exists");
      return;
    }
    await setDoc(gradeDoc, {
      type,
      title,
      description,
      totalMarks,
    });
    router.push(`/teacher/courses/${id}`);

    console.log({
      type,
      title,
      description,
      totalMarks,
      graded: false,
    });
    await updateDoc(gradesRef, {
      graded: true,
      marks: marks,
    });
    router.push(`/teacher/courses/${id}`);
  };

  //skeleton for Marks input and submission

  useEffect(() => {
    const fetchGrades = async () => {
      const currentCourseStudentsRef = collection(
        db,
        "courses",
        id as string,
        "students",
      );

      const studentsSnap = await getDocs(currentCourseStudentsRef);
      const studentsData = studentsSnap.docs.map((doc) => doc.data());
      console.log("Enrolled students:", studentsData);
      setStudents(studentsData);
    };

    fetchGrades();
  }, [id, title]);

  console.log("Marks state:", marks);

  return (
    <div className="p-8">
      <div className="p-0">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-text-primary mb-4">
          Add Task
        </h1>
        <form className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Type</label>
            <select
              value={type}
              required
              defaultValue={"quiz1"}
              onChange={(e) => setType(e.target.value)}
              className="w-full border border-border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
            >
              <option
                value="quiz1"
                className="text-text-primary px-3 py-2 bg-background"
              >
                Quiz 1
              </option>
              <option
                value="quiz2"
                className="text-text-primary px-3 py-2 bg-background"
              >
                Quiz 2
              </option>
              <option
                value="quiz3"
                className="text-text-primary px-3 py-2 bg-background"
              >
                Quiz 3
              </option>
              <option
                value="quiz4"
                className="text-text-primary px-3 py-2 bg-background"
              >
                Quiz 4
              </option>
              <option
                value="midterm"
                className="text-text-primary px-3 py-2 bg-background"
              >
                Midterm
              </option>
              <option
                value="final"
                className="text-text-primary px-3 py-2 bg-background"
              >
                Final
              </option>
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Title</label>
            <input
              value={title}
              required
              onChange={(e) => setTitle(e.target.value)}
              type="text"
              className="w-full border border-border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Description</label>
            <textarea
              value={description}
              required
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
              rows={4}
            ></textarea>
          </div>
          <div>
            <label className="block mb-1 font-medium">Total Marks</label>
            <input
              value={totalMarks}
              required
              onChange={(e) => {
                const value = Number(e.target.value);
                if (value < 0) {
                  setTotalMarks(0);
                } else if (value > 100) {
                  setTotalMarks(100);
                } else {
                  setTotalMarks(value);
                }
              }}
              type="number"
              className="w-full border border-border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <p className="text-red-500">{error}</p>
        </form>
      </div>
      <div className="border border-border/40 rounded-2xl bg-background-secondary/20 p-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-background-secondary/40 text-left text-text-muted">
              <th className="py-3 px-4 font-semibold">Student Name</th>
              <th className="py-3 px-4 font-semibold">Grade</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {students?.map((student: DocumentData) => (
              <tr
                key={student.uid}
                className="hover:bg-primary/5 transition-colors"
              >
                <td className="py-3 px-4">{student.name}</td>
                <td className="py-3 px-4">
                  <input
                    type="number"
                    value={marks[student.uid] || ""}
                    onChange={(e) => {
                      if (e.target.value === "") {
                        setMarks({
                          ...marks,
                          [student.uid]: totalMarks, // or you can choose to set it to a default value
                        });
                      } else if (Number(e.target.value) > totalMarks) {
                        setMarks({
                          ...marks,
                          [student.uid]: totalMarks,
                        });
                      } else if (Number(e.target.value) < 0) {
                        setMarks({
                          ...marks,
                          [student.uid]: 0,
                        });
                      } else {
                        setMarks({
                          ...marks,
                          [student.uid]: e.target.value,
                        });
                      }
                    }}
                    required
                    className="outline-1 bg-secondary/20 outline-primary rounded w-12 mr-2 px-2 py-1 text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  /
                  <input
                    type="number"
                    value={totalMarks}
                    onChange={(e) => {
                      if (e.target.value === "") {
                        setTotalMarks(10); // or you can choose to set it to a default value
                      } else if (Number(e.target.value) > 100) {
                        setTotalMarks(100);
                      } else {
                        setTotalMarks(Number(e.target.value));
                      }
                    }}
                    className="outline-1 ml-2 pl-1 bg-secondary/20 outline-primary rounded w-12 mr-2 px-2 py-1 text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex w-full justify-center items-center">
        <button
          onClick={setMarksForStudent}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/80 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          Save Grades
        </button>
      </div>
    </div>
  );
}

export default AddGrade;
