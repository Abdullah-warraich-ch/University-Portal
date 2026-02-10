"use client";
import React, { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { FirebaseContext } from "@/app/Context";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/app/Firebase";
import { useRouter } from "next/navigation";
import type { UserRecord } from "@/app/Context";

function AddAssignment() {
  const [type, setType] = useState("ass1");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [totalMarks, setTotalMarks] = useState(100);
  const [error, setError] = useState("");
  const router = useRouter();
  const { id } = useParams();

  async function AddAssignment(e: React.FormEvent) {
    e.preventDefault();
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
      DueDate,
    });
    router.push(`/teacher/courses/${id}`);

    console.log({
      type,
      title,
      description,
      totalMarks,
      DueDate,
      graded: false,
    });
  }

  const dueDate = useMemo(() => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return nextWeek.toISOString().split("T")[0];
  }, []);
  const [DueDate, setDueDate] = useState(dueDate);
  return (
    <div className="p-8">
      <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-text-primary mb-4">
        Add Assignment
      </h1>
      <form className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Type</label>
          <select
            value={type}
            required
            defaultValue={"ass1"}
            onChange={(e) => setType(e.target.value)}
            className="w-full border border-border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
          >
            <option
              value="ass1"
              className="text-text-primary px-3 py-2 bg-background"
            >
              Assignment 1
            </option>
            <option
              value="ass2"
              className="text-text-primary px-3 py-2 bg-background"
            >
              Assignment 2
            </option>
            <option
              value="ass3"
              className="text-text-primary px-3 py-2 bg-background"
            >
              Assignment 3
            </option>
            <option
              value="ass4"
              className="text-text-primary px-3 py-2 bg-background"
            >
              Assignment 4
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
        <div>
          <label className="block mb-1 font-medium">Due Date</label>
          <input
            value={DueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
            type="date"
            className="w-full border border-border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <button
          onClick={AddAssignment}
          type="submit"
          className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/80 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          Add Assignment
        </button>
        <p className="text-red-500">{error}</p>
      </form>
    </div>
  );
}

export default AddAssignment;
