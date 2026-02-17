"use client";
import React, { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { FirebaseContext } from "@/app/Context";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/app/Firebase";
import { useRouter } from "next/navigation";
import type { UserRecord } from "@/app/Context";

import { ChevronLeft, FileText, Plus, Save, Layout, Hash, Calendar, Sparkles, Wand2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Spinner } from "@/app/Components/ui/spinner";

const FormInput = ({ label, icon: Icon, value, onChange, placeholder, type = "text", required = false }: any) => (
  <div className="space-y-2 group">
    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted flex items-center gap-2 px-1 group-focus-within:text-primary transition-colors">
      <Icon size={12} />
      {label}
    </label>
    <div className="relative">
      <input
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-background-secondary/30 border border-border/50 rounded-2xl py-3.5 px-5 outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/50 transition-all font-semibold text-sm placeholder:text-text-muted/40"
      />
    </div>
  </div>
);

const FormSelect = ({ label, icon: Icon, value, onChange, options }: any) => (
  <div className="space-y-2 group">
    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted flex items-center gap-2 px-1 group-focus-within:text-primary transition-colors">
      <Icon size={12} />
      {label}
    </label>
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        className="w-full appearance-none bg-background-secondary/30 border border-border/50 rounded-2xl py-3.5 px-5 outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/50 transition-all font-semibold text-sm cursor-pointer"
      >
        {options.map((opt: any) => (
          <option key={opt.value} value={opt.value} className="bg-background">
            {opt.label}
          </option>
        ))}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
        <ChevronLeft className="-rotate-90" size={16} />
      </div>
    </div>
  </div>
);

function AddAssignment() {
  const [type, setType] = useState("ass1");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [totalMarks, setTotalMarks] = useState(100);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { id } = useParams();

  async function handleSubmission(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !description) {
      setError("Please fill in all required fields.");
      return;
    }
    setIsLoading(true);
    try {
      const gradeRef = collection(db, "courses", id as string, "grades");
      const gradeDoc = doc(gradeRef, type);
      const gradeSnap = await getDoc(gradeDoc);

      if (gradeSnap.exists()) {
        setError("This task category already exists.");
        setIsLoading(false);
        return;
      }

      await setDoc(gradeDoc, {
        type,
        title,
        description,
        totalMarks,
        DueDate,
        graded: false,
        timestamp: new Date()
      });
      router.push(`/teacher/courses/${id}`);
    } catch (err) {
      console.error(err);
      setError("Failed to save assignment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const dueDate = useMemo(() => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return nextWeek.toISOString().split("T")[0];
  }, []);
  const [DueDate, setDueDate] = useState(dueDate);

  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <Link
            href={`/teacher/courses/${id}`}
            className="inline-flex items-center gap-2 text-text-muted hover:text-primary transition-colors text-xs font-black uppercase tracking-widest mb-2 group"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Course
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-lg shadow-primary/5">
              <Plus size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-text-primary uppercase leading-tight">
                Create Assignment <span className="text-primary">.</span>
              </h1>
              <p className="text-text-muted text-sm font-bold uppercase tracking-widest flex items-center gap-2 mt-1 opacity-70">
                <FileText size={14} className="text-primary" /> Setup New Course Task
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleSubmission}
          disabled={isLoading}
          className="group flex items-center justify-center gap-3 bg-primary text-white px-10 py-4 rounded-2xl font-black text-sm transition-all shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 active:scale-95 disabled:opacity-50"
        >
          {isLoading ? <Spinner className="w-5 h-5 border-white" /> : <Save size={18} />}
          {isLoading ? "Saving..." : "Create Assignment"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-card/40 backdrop-blur-xl border border-border/40 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden text-left">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none text-left">
              <Wand2 size={140} />
            </div>

            <div className="space-y-8 relative z-10 text-left">
              <div className="space-y-6">
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] border-b border-primary/10 pb-2">Assignment Details</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormSelect
                    label="Select Category"
                    icon={Layout}
                    value={type}
                    onChange={(e: any) => setType(e.target.value)}
                    options={[
                      { value: "ass1", label: "Assignment 1" },
                      { value: "ass2", label: "Assignment 2" },
                      { value: "ass3", label: "Assignment 3" },
                      { value: "ass4", label: "Assignment 4" }
                    ]}
                  />
                  <FormInput
                    label="Task Name"
                    icon={FileText}
                    value={title}
                    onChange={(e: any) => setTitle(e.target.value)}
                    placeholder="e.g. Final Project Proposal"
                    required
                  />
                </div>
                <div className="space-y-2 group">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted flex items-center gap-2 px-1 group-focus-within:text-primary transition-colors">
                    <Layout size={12} />
                    Details
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide clear instructions and requirements for the students..."
                    className="w-full bg-background-secondary/30 border border-border/50 rounded-2xl py-3.5 px-5 outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/50 transition-all font-semibold text-sm h-32 resize-none placeholder:text-text-muted/20"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    label="Max Marks"
                    icon={Hash}
                    type="number"
                    value={totalMarks}
                    onChange={(e: any) => setTotalMarks(Number(e.target.value))}
                    placeholder="100"
                  />
                  <FormInput
                    label="Deadline"
                    icon={Calendar}
                    type="date"
                    value={DueDate}
                    onChange={(e: any) => setDueDate(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6 text-left">
          <div className="bg-primary border border-primary shadow-xl shadow-primary/20 rounded-[2rem] p-7 text-white relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl opacity-20" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mb-4 flex items-center gap-2">
              <Sparkles size={14} /> Quick Note
            </h3>
            <p className="text-sm font-bold leading-relaxed opacity-90">
              Assignments will appear in the students' "Upcoming Tasks" section immediately. Make sure to set a clear deadline and detailed instructions.
            </p>
          </div>

          {error && (
            <div className="bg-danger/5 border border-danger/20 rounded-[2.5rem] p-6 flex items-start gap-4 animate-in fade-in slide-in-from-top-2">
              <div className="w-8 h-8 rounded-xl bg-danger/10 flex items-center justify-center text-danger shrink-0">
                <AlertCircle size={18} />
              </div>
              <p className="text-[10px] font-black text-danger uppercase tracking-widest leading-relaxed mt-1">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AddAssignment;
