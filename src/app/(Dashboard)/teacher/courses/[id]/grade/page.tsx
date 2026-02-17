"use client";
import React, { useEffect, useState } from "react";
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
import { ChevronLeft, GraduationCap, Save, FileText, Layout, Hash, User, AlertCircle, Sparkles, Wand2 } from "lucide-react";
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

function AddGrade() {
  interface GradeMap {
    [key: string]: number | string | undefined;
  }

  const router = useRouter();
  const { id } = useParams();

  const [students, setStudents] = React.useState<DocumentData[]>([]);
  const [marks, setMarks] = React.useState<GradeMap>({});
  const [totalMarks, setTotalMarks] = useState<number>(10);
  const [type, setType] = useState("quiz1");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const setMarksForStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !type) {
      setError("Task type and title are required.");
      return;
    }
    setIsLoading(true);
    try {
      const gradesRef = doc(db, "courses", id as string, "grades", type as string);
      const gradeDoc = doc(db, "courses", id as string, "grades", type);
      const gradeSnap = await getDoc(gradeDoc);

      if (gradeSnap.exists()) {
        setError("Error: This task already exists.");
        setIsLoading(false);
        return;
      }

      await setDoc(gradeDoc, {
        type,
        title,
        description,
        totalMarks,
        graded: true,
        marks: marks,
        timestamp: new Date()
      });

      router.push(`/teacher/courses/${id}`);
    } catch (err) {
      console.error(err);
      setError("Error: Could not save grades. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchGrades = async () => {
      const currentCourseStudentsRef = collection(db, "courses", id as string, "students");
      const studentsSnap = await getDocs(currentCourseStudentsRef);
      const studentsData = studentsSnap.docs.map((doc) => doc.data());
      setStudents(studentsData);

      const initialMarks: GradeMap = {};
      studentsData.forEach(student => {
        initialMarks[student.uid] = 0;
      });
      setMarks(initialMarks);
    };
    fetchGrades();
  }, [id]);

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
              <GraduationCap size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-text-primary uppercase leading-tight">
                Add Grades <span className="text-primary">.</span>
              </h1>
              <p className="text-text-muted text-sm font-bold uppercase tracking-widest flex items-center gap-2 mt-1 opacity-70">
                <FileText size={14} className="text-primary" /> Student Marks
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={setMarksForStudent}
          disabled={isLoading}
          className="group flex items-center justify-center gap-3 bg-primary text-white px-10 py-4 rounded-2xl font-black text-sm transition-all shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 active:scale-95 disabled:opacity-50"
        >
          {isLoading ? <Spinner className="w-5 h-5 border-white" /> : <Save size={18} />}
          {isLoading ? "Saving Grades..." : "Save Grades"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
        {/* Module Configuration */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-card/40 backdrop-blur-xl border border-border/40 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
              <Wand2 size={140} />
            </div>

            <div className="space-y-8 relative z-10">
              <div className="space-y-6">
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] border-b border-primary/10 pb-2">Task Details</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormSelect
                    label="Task Type"
                    icon={Layout}
                    value={type}
                    onChange={(e: any) => setType(e.target.value)}
                    options={[
                      { value: "quiz1", label: "Quiz 1" },
                      { value: "quiz2", label: "Quiz 2" },
                      { value: "quiz3", label: "Quiz 3" },
                      { value: "quiz4", label: "Quiz 4" },
                      { value: "midterm", label: "Midterm Exam" },
                      { value: "final", label: "Final Exam" }
                    ]}
                  />
                  <FormInput
                    label="Title"
                    icon={FileText}
                    value={title}
                    onChange={(e: any) => setTitle(e.target.value)}
                    placeholder="e.g. Data Structures Mid-Term"
                  />
                </div>
                <div className="space-y-2 group">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted flex items-center gap-2 px-1 group-focus-within:text-primary transition-colors">
                    <Layout size={12} />
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Short note about this task..."
                    className="w-full bg-background-secondary/30 border border-border/50 rounded-2xl py-3.5 px-5 outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/50 transition-all font-semibold text-sm h-32 resize-none placeholder:text-text-muted/20"
                  />
                </div>
                <FormInput
                  label="Total Marks"
                  icon={Hash}
                  type="number"
                  value={totalMarks}
                  onChange={(e: any) => setTotalMarks(Number(e.target.value))}
                  placeholder="100"
                />
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-primary/10 pb-2">
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Student Marks</p>
                  <span className="text-[9px] font-black text-text-muted opacity-50 uppercase tracking-widest">{students.length} Students</span>
                </div>

                <div className="relative overflow-hidden rounded-3xl border border-border/40 bg-background/30">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-background-secondary/50 border-b border-border/20 text-[9px] font-black uppercase tracking-widest text-text-muted/60">
                        <th className="py-4 px-6 italic">Name</th>
                        <th className="py-4 px-6 text-right italic">Marks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/10">
                      {students.map((student) => (
                        <tr key={student.uid} className="group hover:bg-primary/[0.03] transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-background-secondary border border-border/50 flex items-center justify-center text-text-muted group-hover:text-primary group-hover:bg-primary/5 transition-all">
                                <User size={14} />
                              </div>
                              <span className="text-sm font-bold text-text-primary group-hover:translate-x-1 transition-transform">{student.name}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-3 text-sm font-black">
                              <input
                                type="number"
                                value={marks[student.uid] || 0}
                                onChange={(e) => {
                                  const val = Math.min(totalMarks, Math.max(0, Number(e.target.value)));
                                  setMarks({ ...marks, [student.uid]: val });
                                }}
                                className="w-16 bg-primary/5 border border-primary/20 rounded-xl px-3 py-2 text-center text-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              />
                              <span className="text-text-muted opacity-30">/</span>
                              <span className="text-text-muted opacity-50">{totalMarks}</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Insights */}
        <div className="space-y-6">
          <div className="bg-primary border border-primary shadow-xl shadow-primary/20 rounded-[2rem] p-7 text-white relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mb-4 flex items-center gap-2">
              <Sparkles size={14} /> Quick Note
            </h3>
            <p className="text-sm font-bold leading-relaxed opacity-90">
              Students will see these grades instantly. Please double-check before saving.
            </p>
          </div>

          <div className="bg-card/40 border border-border/20 rounded-[2rem] p-6 space-y-4">
            <h3 className="text-[10px] font-black text-text-muted uppercase tracking-widest flex items-center gap-2">
              <AlertCircle size={14} className="text-warning" /> Help
            </h3>
            <div className="space-y-3">
              {[
                "Marks cannot exceed the total",
                "Verify student names",
                "Total marks are required",
                "Class average updates automatically"
              ].map((note, i) => (
                <div key={i} className="flex items-center gap-3 text-xs font-bold text-text-primary/70">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/30" />
                  {note}
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-danger/5 border border-danger/20 rounded-[2rem] p-6 flex items-start gap-4 animate-in fade-in slide-in-from-top-2">
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

export default AddGrade;
