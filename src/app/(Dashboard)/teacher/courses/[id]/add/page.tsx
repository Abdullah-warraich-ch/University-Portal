"use client";
import React, { useMemo } from "react";

function AddAssignment() {
  const dueDate = useMemo(() => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return nextWeek.toISOString().split("T")[0]; // "YYYY-MM-DD"
  }, []); // computed once on mount

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Add Assignment</h1>
      <form className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Type</label>
          <select className="w-full border border-border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-primary">
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
              MidTerm
            </option>
            <option
              value="final"
              className="text-text-primary px-3 py-2 bg-background hover:bg-secondary"
            >
              Final
            </option>
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input
            type="text"
            className="w-full border border-border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            className="w-full border border-border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
            rows={4}
          ></textarea>
        </div>
        <div>
          <label className="block mb-1 font-medium">Due Date</label>
          <input
            defaultValue={dueDate}
            type="date"
            className="w-full border border-border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded"
        >
          Add Assignment
        </button>
      </form>
    </div>
  );
}

export default AddAssignment;
