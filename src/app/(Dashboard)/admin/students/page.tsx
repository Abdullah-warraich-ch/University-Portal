"use client";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "@/app/Firebase";
import React from "react";
import { FirebaseContext } from "@/app/Context";
import Link from "next/link";
import { Plus, Edit2, Trash2, Search, Filter, Users, User, Building2, Calendar, Mail, Phone, Hash } from "lucide-react";

function Students() {
  const deleteRecord = async (uid: string) => {
    if (!window.confirm("Are you sure you want to remove this student? This action is irreversible.")) return;
    try {
      await deleteDoc(doc(db, "users", uid));
      window.location.reload();
    } catch (error) {
      console.error("Error deleting student record:", error);
      alert("Error deleting student record. Please try again.");
    }
  };
  const { students } = React.useContext(FirebaseContext)!;

  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest pl-1">
            <Users size={14} />
            Students
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-text-primary">
            All Students
          </h1>
          <p className="text-text-muted text-sm font-medium opacity-80 pl-1">
            Total students: <span className="text-primary font-bold">{students.length}</span>
          </p>
        </div>

        <Link
          href="/admin/students/add"
          className="group flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-black text-sm transition-all hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-0.5 active:scale-95"
        >
          <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
          Add New Student
        </Link>
      </div>

      {/* Toolbar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search by name, ID, or email..."
            className="w-full h-14 pl-12 pr-4 bg-background-secondary/30 border border-border/50 rounded-2xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/50 transition-all font-semibold text-sm"
          />
        </div>
        <button className="h-14 flex items-center justify-center gap-2 bg-background-secondary/50 border border-border/50 rounded-2xl text-text-muted font-bold text-xs uppercase tracking-widest hover:text-text-primary hover:border-text-primary/30 transition-all">
          <Filter size={16} /> Filters
        </button>
      </div>

      {/* Directory Table */}
      <div className="relative overflow-hidden rounded-[2rem] border border-border/40 bg-card/50 backdrop-blur-xl shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background-secondary/50 border-b border-border/20">
                <th className="py-5 px-6 font-black text-[10px] uppercase tracking-widest text-text-primary/40">Name</th>
                <th className="py-5 px-6 font-black text-[10px] uppercase tracking-widest text-text-primary/40">Student ID</th>
                <th className="py-5 px-6 font-black text-[10px] uppercase tracking-widest text-text-primary/40">Department</th>
                <th className="py-5 px-6 font-black text-[10px] uppercase tracking-widest text-text-primary/40">Email & Phone</th>
                <th className="py-5 px-6 font-black text-[10px] uppercase tracking-widest text-text-primary/40 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/10">
              {students.map((student, index) => (
                <tr
                  key={index}
                  className="group hover:bg-primary/[0.02] transition-colors"
                >
                  <td className="py-6 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-background-secondary border border-border/50 flex items-center justify-center text-text-muted group-hover:bg-primary group-hover:text-white group-hover:border-primary/20 transition-all">
                        <User size={18} />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-text-primary leading-tight group-hover:text-primary transition-colors">{student.name}</span>
                        <span className="text-[10px] font-black text-text-muted uppercase tracking-tighter mt-0.5 group-hover:text-text-muted/60">Student</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-6 px-6">
                    <div className="flex items-center gap-2 font-mono text-xs font-black text-primary/80">
                      <Hash size={12} className="opacity-40" />
                      {student.id}
                    </div>
                  </td>
                  <td className="py-6 px-6">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-text-primary/80 text-sm font-semibold">
                        <Building2 size={12} className="text-primary/60" />
                        {student.department}
                      </div>
                      <div className="flex items-center gap-1.5 text-text-muted text-[10px] font-bold uppercase tracking-widest pl-0.5">
                        <Calendar size={10} />
                        {student.semester} Semester
                      </div>
                    </div>
                  </td>
                  <td className="py-6 px-6">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2 text-xs font-semibold text-text-muted">
                        <Mail size={12} className="text-primary/40" />
                        {student.email}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-text-muted/60">
                        <Phone size={11} className="text-primary/30" />
                        {student.phone || "Not set"}
                      </div>
                    </div>
                  </td>
                  <td className="py-6 px-6 text-right">
                    <div className="flex items-center justify-end gap-2 text-right">
                      <Link
                        href={`/admin/students/edit/${student.uid}`}
                        className="p-2.5 rounded-xl border border-border/50 bg-background-secondary/30 text-text-muted hover:text-primary hover:bg-primary/5 hover:border-primary/20 transition-all active:scale-90"
                        title="Edit Student"
                      >
                        <Edit2 size={14} />
                      </Link>
                      <button
                        onClick={() => student.uid && deleteRecord(student.uid)}
                        className="p-2.5 rounded-xl border border-border/50 bg-background-secondary/30 text-text-muted hover:text-danger hover:bg-danger/5 hover:border-danger/20 transition-all active:scale-90"
                        title="Delete Student"
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

export default Students;
