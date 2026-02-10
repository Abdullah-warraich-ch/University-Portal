"use client";
import React from "react";
import { useParams } from "next/navigation";

function Course() {
  const { id } = useParams();
  console.log(id);
  return <div>Course Page: {id}</div>;
}

export default Course;
