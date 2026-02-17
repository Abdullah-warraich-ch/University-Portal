"use client";
import React from "react";
import { auth, db } from "@/app/Firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Spinner } from "@/app/Components/ui/spinner";
import { ChevronLeft, UserPlus, Mail, Lock, User, Hash, Building, Sparkles, Phone, ShieldCheck } from "lucide-react";
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

function StudentDetail() {
  const [loading, setLoading] = React.useState(false);
  const [studentEmail, setStudentEmail] = React.useState("");
  const [studentPassword, setStudentPassword] = React.useState("");
  const [studentId, setStudentId] = React.useState("");
  const [studentName, setStudentName] = React.useState("");
  const [studentDepartment, setStudentDepartment] = React.useState("");
  const [studentSemester, setStudentSemester] = React.useState("");
  const [studentPhone, setStudentPhone] = React.useState("");

  const router = useRouter();

  async function CreateStudentCredentials(e: React.FormEvent) {
    e.preventDefault();
    if (!studentEmail || !studentPassword || !studentName || !studentId) {
      alert("Email, password, and name are required.");
      return;
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        studentEmail,
        studentPassword,
      );

      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: studentEmail,
        name: studentName,
        id: studentId,
        department: studentDepartment,
        semester: studentSemester,
        phone: studentPhone,
        role: "student",
      });

      router.push("/admin/students");
    } catch (error) {
      console.error("Error creating student account:", error);
      alert("Error creating student account. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link
            href="/admin/students"
            className="inline-flex items-center gap-2 text-text-muted hover:text-primary transition-colors text-xs font-black uppercase tracking-widest mb-4 group"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Student List
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-lg shadow-primary/5">
              <UserPlus size={24} />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-text-primary uppercase leading-tight">
              Add New Student <span className="text-primary">.</span>
            </h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
        {/* Main Enrollment Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card/40 backdrop-blur-xl border border-border/40 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
              <ShieldCheck size={120} />
            </div>

            <form onSubmit={CreateStudentCredentials} className="space-y-8 relative z-10">
              <div className="space-y-6">
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] border-b border-primary/10 pb-2">Account Details</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    label="Email Address"
                    icon={Mail}
                    value={studentEmail}
                    onChange={(e: any) => setStudentEmail(e.target.value)}
                    placeholder="student@university.edu"
                    type="email"
                  />
                  <FormInput
                    label="Password"
                    icon={Lock}
                    value={studentPassword}
                    onChange={(e: any) => setStudentPassword(e.target.value)}
                    placeholder="••••••••"
                    type="password"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] border-b border-primary/10 pb-2">Personal Info</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    label="Full Name"
                    icon={User}
                    value={studentName}
                    onChange={(e: any) => setStudentName(e.target.value)}
                    placeholder="e.g. Abdullah Khan"
                  />
                  <FormInput
                    label="Student ID"
                    icon={Hash}
                    value={studentId}
                    onChange={(e: any) => setStudentId(e.target.value)}
                    placeholder="VU-2026-001"
                  />
                  <FormInput
                    label="Phone Number"
                    icon={Phone}
                    value={studentPhone}
                    onChange={(e: any) => setStudentPhone(e.target.value)}
                    placeholder="+91 XXXXXXXXXX"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] border-b border-primary/10 pb-2">University Info</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormSelect
                    label="Department"
                    icon={Building}
                    value={studentDepartment}
                    onChange={(e: any) => setStudentDepartment(e.target.value)}
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
                    value={studentSemester}
                    onChange={(e: any) => setStudentSemester(e.target.value)}
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
              </div>

              <div className="pt-6 flex items-center gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 md:flex-none flex items-center justify-center gap-3 bg-primary text-white px-12 py-4 rounded-2xl font-black text-sm transition-all shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? <Spinner className="w-5 h-5 border-white" /> : <UserPlus size={18} />}
                  {loading ? "Creating..." : "Add Student"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Requirements Sidebar */}
        <div className="space-y-6">
          <div className="bg-primary/5 border border-primary/20 rounded-[2rem] p-6 space-y-4">
            <h3 className="text-primary font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
              <ShieldCheck size={14} /> Quick Note
            </h3>
            <p className="text-text-primary/70 text-sm leading-relaxed font-medium">
              Student accounts are created with student roles. An email will be sent to the student with their details.
            </p>
            <ul className="space-y-2 pt-2">
              {['Unique University ID', 'Active Status', 'AES-256 Storage'].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-[9px] font-black text-text-muted uppercase tracking-tighter">
                  <div className="w-1 h-1 rounded-full bg-primary" /> {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-card/40 border border-border/20 rounded-[2rem] p-6 relative group overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
            <h3 className="text-text-muted font-black text-[10px] uppercase tracking-widest mb-4">Student Preview</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-background-secondary border border-border/50 flex items-center justify-center text-text-muted">
                  <User size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-black text-text-primary">{studentName || "Name not set"}</span>
                  <span className="text-[9px] font-bold text-text-muted uppercase tracking-tighter">{studentId || "ID not set"}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 pt-2 border-t border-border/10">
                <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-tighter">
                  <span className="text-text-muted">Department</span>
                  <span className="text-primary">{studentDepartment || "---"}</span>
                </div>
                <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-tighter">
                  <span className="text-text-muted">Semester</span>
                  <span className="text-primary">{studentSemester || "---"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDetail;
