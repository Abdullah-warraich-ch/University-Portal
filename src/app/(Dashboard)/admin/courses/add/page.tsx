"use client";
import React from "react";
import { db } from "@/app/Firebase";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Spinner } from "@/app/Components/ui/spinner";
import { FirebaseContext } from "@/app/Context";
import { ChevronLeft, Plus, Book, User, Building, Layers, Sparkles } from "lucide-react";
import Link from "next/link";

const FormInput = ({ label, icon: Icon, value, onChange, placeholder, type = "text" }: any) => (
  <div className="space-y-2 group">
    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted flex items-center gap-2 px-1 group-focus-within:text-primary transition-colors">
      <Icon size={12} />
      {label}
    </label>
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-background-secondary/30 border border-border/50 rounded-2xl py-3.5 px-5 outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/50 transition-all font-semibold text-sm placeholder:text-text-muted/40"
      />
    </div>
  </div>
);

const FormSelect = ({ label, icon: Icon, value, onChange, options, placeholder }: any) => (
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
        <option value="" className="bg-background">{placeholder}</option>
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

function CreateCourse() {
  const [loading, setLoading] = React.useState(false);
  const [courseCode, setCourseCode] = React.useState("");
  const [courseName, setCourseName] = React.useState("");
  const [courseTeacher, setCourseTeacher] = React.useState("");
  const [courseDepartment, setCourseDepartment] = React.useState("");
  const [courseSemester, setCourseSemester] = React.useState("");
  const [teacherUid, setTeacherUid] = React.useState("");

  const { teachers } = React.useContext(FirebaseContext)!;
  const router = useRouter();

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!courseCode || !courseName || !teacherUid) {
      alert("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    try {
      await setDoc(doc(db, "courses", courseCode), {
        code: courseCode,
        title: courseName,
        teacher: courseTeacher,
        teacherUid: teacherUid,
        department: courseDepartment,
        semester: courseSemester,
        students: []
      });
      router.push("/admin/courses");
    } catch (error) {
      console.error("Error creating course:", error);
      alert("Error creating course. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link
            href="/admin/courses"
            className="inline-flex items-center gap-2 text-text-muted hover:text-primary transition-colors text-xs font-black uppercase tracking-widest mb-4 group"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Registry
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-lg shadow-primary/5">
              <Plus size={24} />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-text-primary uppercase leading-tight">
              Add New Course <span className="text-primary">.</span>
            </h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card/40 backdrop-blur-xl border border-border/40 rounded-[2.5rem] p-8 shadow-2xl">
            <form onSubmit={handleCreate} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label="Course Code"
                  icon={Layers}
                  value={courseCode}
                  onChange={(e: any) => setCourseCode(e.target.value)}
                  placeholder="e.g. CS-101"
                />
                <FormInput
                  label="Course Name"
                  icon={Book}
                  value={courseName}
                  onChange={(e: any) => setCourseName(e.target.value)}
                  placeholder="Intro to Architecture"
                />

                <FormSelect
                  label="Select Teacher"
                  icon={User}
                  value={teacherUid}
                  onChange={(e: any) => {
                    const uid = e.target.value;
                    const teacher = teachers.find((t: any) => t.uid === uid);
                    setTeacherUid(uid);
                    setCourseTeacher(teacher?.name || "");
                  }}
                  options={teachers.map((t: any) => ({ value: t.uid, label: t.name }))}
                  placeholder="Select Teacher"
                />

                <FormSelect
                  label="Department"
                  icon={Building}
                  value={courseDepartment}
                  onChange={(e: any) => setCourseDepartment(e.target.value)}
                  options={[
                    { value: "Computer Science", label: "Computer Science" },
                    { value: "Mathematics", label: "Mathematics" },
                    { value: "Physics", label: "Physics" }
                  ]}
                  placeholder="Select Department"
                />

                <FormSelect
                  label="Semester"
                  icon={Sparkles}
                  value={courseSemester}
                  onChange={(e: any) => setCourseSemester(e.target.value)}
                  options={[
                    { value: "1st", label: "1st Semester" },
                    { value: "2nd", label: "2nd Semester" },
                    { value: "3rd", label: "3rd Semester" },
                    { value: "4th", label: "4th Semester" },
                    { value: "5th", label: "5th Semester" },
                    { value: "6th", label: "6th Semester" },
                    { value: "7th", label: "7th Semester" },
                    { value: "8th", label: "8th Semester" }
                  ]}
                  placeholder="Select Semester"
                />
              </div>

              <div className="pt-4 flex items-center gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 md:flex-none flex items-center justify-center gap-3 bg-primary text-white px-10 py-4 rounded-2xl font-black text-sm transition-all shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? <Spinner className="w-5 h-5 border-white" /> : <Plus size={18} />}
                  {loading ? "Creating..." : "Add Course"}
                </button>
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="hidden md:block px-10 py-4 rounded-2xl border border-border/50 text-text-muted font-bold text-sm tracking-widest hover:text-text-primary hover:bg-background-secondary/50 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Info Sidebar */}
        <div className="space-y-6">
          <div className="bg-primary/5 border border-primary/20 rounded-[2rem] p-6 space-y-4">
            <h3 className="text-primary font-black text-xs uppercase tracking-widest flex items-center gap-2">
              <Sparkles size={14} /> Quick Note
            </h3>
            <p className="text-text-primary/70 text-sm leading-relaxed font-medium">
              Ensure the course code is unique and matches the university format. This code is the main identifier for the course.
            </p>
            <div className="pt-2">
              <div className="flex items-center gap-3 text-[10px] font-black text-text-muted uppercase tracking-tighter">
                <div className="w-1.5 h-1.5 rounded-full bg-warning" /> Requires Validation
              </div>
            </div>
          </div>

          <div className="bg-card/40 border border-border/20 rounded-[2rem] p-6 overflow-hidden relative group">
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
            <h3 className="text-text-muted font-black text-[10px] uppercase tracking-widest mb-4">Course Preview</h3>
            <div className="space-y-3">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-text-muted uppercase">Code</span>
                <span className="text-sm font-black text-text-primary">{courseCode || "Not set"}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-text-muted uppercase">Name</span>
                <span className="text-sm font-black text-text-primary">{courseName || "Untitled"}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-text-muted uppercase">Department</span>
                <span className="text-sm font-black text-text-primary">{courseDepartment || "Not selected"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateCourse;
