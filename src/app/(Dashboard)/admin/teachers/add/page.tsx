"use client";
import React from "react";
import { auth, db } from "@/app/Firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Spinner } from "@/app/Components/ui/spinner";
import { ChevronLeft, UserPlus, Mail, Lock, User, Hash, Building, Briefcase, Phone, BadgeCheck, ShieldAlert } from "lucide-react";
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

function TeacherDetail() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [teacherEmail, setTeacherEmail] = React.useState("");
  const [teacherPassword, setTeacherPassword] = React.useState("");
  const [teacherId, setTeacherId] = React.useState("");
  const [teacherName, setTeacherName] = React.useState("");
  const [teacherDepartment, setTeacherDepartment] = React.useState("");
  const [teacherPost, setTeacherPost] = React.useState("");
  const [teacherPhone, setTeacherPhone] = React.useState("");

  async function CreateTeacherCredentials(e: React.FormEvent) {
    e.preventDefault();
    if (!teacherEmail || !teacherPassword || !teacherName || !teacherId) {
      alert("Email, password, and name are required.");
      return;
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        teacherEmail,
        teacherPassword,
      );

      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: teacherEmail,
        name: teacherName,
        id: teacherId,
        department: teacherDepartment,
        post: teacherPost,
        phone: teacherPhone,
        role: "teacher",
      });

      router.push("/admin/teachers");
    } catch (error) {
      console.error("Error creating teacher account:", error);
      alert("Error creating teacher account. Please try again.");
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
            href="/admin/teachers"
            className="inline-flex items-center gap-2 text-text-muted hover:text-primary transition-colors text-xs font-black uppercase tracking-widest mb-4 group"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Teacher List
          </Link>
          <div className="flex items-center gap-3 text-left">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-lg shadow-primary/5 transition-transform hover:rotate-6">
              <UserPlus size={24} />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-text-primary">
              Add New Teacher <span className="text-primary">.</span>
            </h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card/40 backdrop-blur-xl border border-border/40 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
              <BadgeCheck size={140} />
            </div>

            <form onSubmit={CreateTeacherCredentials} className="space-y-8 relative z-10">
              <div className="space-y-6">
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] border-b border-primary/10 pb-2">Account Details</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    label="Email Address"
                    icon={Mail}
                    value={teacherEmail}
                    onChange={(e: any) => setTeacherEmail(e.target.value)}
                    placeholder="teacher@university.edu"
                    type="email"
                  />
                  <FormInput
                    label="Password"
                    icon={Lock}
                    value={teacherPassword}
                    onChange={(e: any) => setTeacherPassword(e.target.value)}
                    placeholder="Enter password"
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
                    value={teacherName}
                    onChange={(e: any) => setTeacherName(e.target.value)}
                    placeholder="e.g. Abdullah Khan"
                  />
                  <FormInput
                    label="Teacher ID"
                    icon={Hash}
                    value={teacherId}
                    onChange={(e: any) => setTeacherId(e.target.value)}
                    placeholder="T-12345"
                  />
                  <FormInput
                    label="Phone Number"
                    icon={Phone}
                    value={teacherPhone}
                    onChange={(e: any) => setTeacherPhone(e.target.value)}
                    placeholder="0312 3478587"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] border-b border-primary/10 pb-2">Work Info</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormSelect
                    label="Department"
                    icon={Building}
                    value={teacherDepartment}
                    onChange={(e: any) => setTeacherDepartment(e.target.value)}
                    options={[
                      { value: "Computer Science", label: "Computer Science" },
                      { value: "Mathematics", label: "Mathematics" },
                      { value: "Physics", label: "Physics" }
                    ]}
                    placeholder="Select Department"
                  />
                  <FormSelect
                    label="Position"
                    icon={Briefcase}
                    value={teacherPost}
                    onChange={(e: any) => setTeacherPost(e.target.value)}
                    options={[
                      { value: "professor", label: "Professor" },
                      { value: "assistant", label: "Assistant Professor" },
                      { value: "associate", label: "Associate Professor" },
                      { value: "lecture", label: "Lecturer" },
                      { value: "temporary", label: "Temporary Staff" },
                      { value: "lab", label: "Lab Attendant" }
                    ]}
                    placeholder="Select Position"
                  />
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full md:w-auto flex items-center justify-center gap-3 bg-primary text-white px-12 py-4 rounded-2xl font-black text-sm transition-all shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 active:scale-95 disabled:opacity-50"
                >
                  {loading ? <Spinner className="w-5 h-5 border-white" /> : <ShieldAlert size={18} />}
                  {loading ? "Creating..." : "Add Teacher"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Support Sidebar */}
        <div className="space-y-6">
          <div className="bg-primary/5 border border-primary/20 rounded-[2rem] p-6 space-y-4">
            <h3 className="text-primary font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
              <ShieldAlert size={14} /> Quick Note
            </h3>
            <p className="text-text-primary/70 text-sm leading-relaxed font-medium">
              Teacher accounts can manage grades and attendance. It's recommended to change the password after first login.
            </p>
          </div>

          <div className="bg-card/40 border border-border/20 rounded-[2rem] p-6 relative group overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
            <h3 className="text-text-muted font-black text-[10px] uppercase tracking-widest mb-4">Teacher Preview</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <User size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-black text-text-primary">{teacherName || "Name Pending"}</span>
                  <span className="text-[10px] font-black text-primary/60 uppercase tracking-tighter">{teacherPost || "Position not set"}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 pt-2 border-t border-border/10">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-tighter">
                  <span className="text-text-muted">Teacher ID</span>
                  <span className="text-text-primary">{teacherId || "---"}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-tighter">
                  <span className="text-text-muted">Dept</span>
                  <span className="text-text-primary">{teacherDepartment || "---"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherDetail;
