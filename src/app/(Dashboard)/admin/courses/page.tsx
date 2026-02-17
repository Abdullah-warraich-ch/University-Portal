"use client";
import { getDocs, doc, collection, deleteDoc } from "firebase/firestore";
import { db } from "@/app/Firebase";
import React, { useEffect } from "react";
import { FirebaseContext } from "@/app/Context";
import Link from "next/link";
import { Plus, Edit2, Trash2, Search, Filter, BookOpen, User, Building2, Calendar } from "lucide-react";

function Courses() {
  const deleteRecord = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await deleteDoc(doc(db, "courses", id));
      window.location.reload();
    } catch (error) {
      console.error("Error deleting course record:", error);
      alert("Error deleting course record. Please try again.");
    }
  };
  const { courses } = React.useContext(FirebaseContext)!;

  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest pl-1">
            <BookOpen size={14} />
            Academic Management
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-text-primary">
            Courses Registry
          </h1>
          <p className="text-text-muted text-sm font-medium opacity-80 pl-1">
            Total active courses: <span className="text-primary font-bold">{courses.length}</span>
          </p>
        </div>

        <Link
          href="/admin/courses/add"
          className="group flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-black text-sm transition-all hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-0.5 active:scale-95"
        >
          <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
          Add New Course
        </Link>
      </div>

      {/* Stats & Search Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search by title, code, or department..."
            className="w-full h-14 pl-12 pr-4 bg-background-secondary/30 border border-border/50 rounded-2xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/50 transition-all font-semibold text-sm"
          />
        </div>
        <button className="h-14 flex items-center justify-center gap-2 bg-background-secondary/50 border border-border/50 rounded-2xl text-text-muted font-bold text-xs uppercase tracking-widest hover:text-text-primary hover:border-text-primary/30 transition-all">
          <Filter size={16} /> Advanced Filters
        </button>
      </div>

      {/* Table Container */}
      <div className="relative overflow-hidden rounded-[2rem] border border-border/40 bg-card/50 backdrop-blur-xl shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background-secondary/50 border-b border-border/20">
                <th className="py-5 px-6 font-black text-[10px] uppercase tracking-widest text-text-primary/40">Identity</th>
                <th className="py-5 px-6 font-black text-[10px] uppercase tracking-widest text-text-primary/40">Core Details</th>
                <th className="py-5 px-6 font-black text-[10px] uppercase tracking-widest text-text-primary/40">Faculty</th>
                <th className="py-5 px-6 font-black text-[10px] uppercase tracking-widest text-text-primary/40">Metrics</th>
                <th className="py-5 px-6 font-black text-[10px] uppercase tracking-widest text-text-primary/40">Department</th>
                <th className="py-5 px-6 font-black text-[10px] uppercase tracking-widest text-text-primary/40 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/10">
              {courses.map((course, index) => (
                <tr
                  key={index}
                  className="group hover:bg-primary/[0.02] transition-colors"
                >
                  <td className="py-6 px-6">
                    <div className="bg-background-secondary/50 border border-border/50 px-3 py-1.5 rounded-xl inline-block">
                      <span className="font-mono text-xs font-black text-primary tracking-tighter uppercase">{course.code}</span>
                    </div>
                  </td>
                  <td className="py-6 px-6">
                    <div className="flex flex-col">
                      <span className="font-bold text-text-primary leading-tight group-hover:text-primary transition-colors">{course.title}</span>
                      <div className="flex items-center gap-1.5 mt-1 text-text-muted text-[10px] font-bold uppercase tracking-wider">
                        <Calendar size={10} /> {course.semester} Semester
                      </div>
                    </div>
                  </td>
                  <td className="py-6 px-6">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                        <User size={14} />
                      </div>
                      <span className="font-semibold text-sm text-text-primary/80">{course.teacher}</span>
                    </div>
                  </td>
                  <td className="py-6 px-6">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 bg-background-secondary rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: '45%' }} />
                        </div>
                        <span className="text-[10px] font-black text-text-primary">{course.students?.length || 0}</span>
                      </div>
                      <span className="text-[9px] font-bold text-text-muted uppercase tracking-tighter">Enrolled Seats</span>
                    </div>
                  </td>
                  <td className="py-6 px-6 text-sm">
                    <div className="flex items-center gap-2 text-text-muted font-bold">
                      <Building2 size={12} className="opacity-50" />
                      {course.department}
                    </div>
                  </td>
                  <td className="py-6 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/courses/edit/${course.id}`}
                        className="p-2.5 rounded-xl border border-border/50 bg-background-secondary/30 text-text-muted hover:text-primary hover:bg-primary/5 hover:border-primary/20 transition-all active:scale-90"
                        title="Edit Course"
                      >
                        <Edit2 size={14} />
                      </Link>
                      <button
                        onClick={() => deleteRecord(course.id)}
                        className="p-2.5 rounded-xl border border-border/50 bg-background-secondary/30 text-text-muted hover:text-danger hover:bg-danger/5 hover:border-danger/20 transition-all active:scale-90"
                        title="Remove Course"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Courses;
