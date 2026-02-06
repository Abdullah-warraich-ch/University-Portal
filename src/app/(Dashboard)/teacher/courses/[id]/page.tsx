"use client";
import React from "react";
import { FirebaseContext } from "@/app/Context";
import { useParams } from "next/navigation";
import Link from "next/link";

function CourseContent() {
  const { courses } = React.useContext(FirebaseContext)!;
  const { id } = useParams();
  const course = courses.find((course) => course.code === id);
  console.log("Course in CourseContent:", course);
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold  border-b-2 border-b-primary mb-7 inline-block">
        {course ? course.title : "Course Not Found"}
      </h1>
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold mb-2">Grades</h1>
        <div className="flex gap-4">
          <button className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/80">
            Add Grade
          </button>
          <Link
            href={`/teacher/courses/${id}/add`}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/80"
          >
            Add Task
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CourseContent;
