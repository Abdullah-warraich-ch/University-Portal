"use client";
import Image from "next/image";
import { auth, db } from "@/app/Firebase";
import React, { useEffect, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Spinner } from "@/app/Components/ui/spinner";
import { toast } from "sonner";
import { Mail, Lock, LogIn, ShieldCheck, User, GraduationCap, Briefcase, Sparkles, AlertCircle } from "lucide-react";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("student@vu.edu.pk");
  const [password, setPassword] = useState("student123");
  const router = useRouter();

  useEffect(() => {
    const role = document.cookie
      .split(";")
      .find((row: string) => row.trim().startsWith("role="))
      ?.split("=")[1];

    const token = document.cookie
      .split(";")
      .find((row) => row.trim().startsWith("token="))
      ?.split("=")[1];

    if (token && role) {
      router.replace(`/${role}`);
      return;
    }
  }, [router]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter both email and password.");
      return;
    }
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
      const role = userDoc.data()?.role;

      document.cookie = `role=${role}; path=/; samesite=strict`;
      const token = await userCredential.user.getIdToken();
      document.cookie = `token=${token}; path=/; samesite=strict`;

      router.push(`/${role}`);
    } catch (error) {
      console.error("Error logging in:", error);
      toast.error("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  const CredentialChip = ({ icon: Icon, label, email, pass }: any) => (
    <button
      onClick={() => {
        setEmail(email);
        setPassword(pass);
        toast.info(`Using ${label} account`);
      }}
      className="flex flex-col items-center gap-2 p-4 rounded-[2rem] bg-card/20 backdrop-blur-xl border border-border/40 hover:bg-primary/5 hover:border-primary/30 transition-all group shadow-sm active:scale-95"
    >
      <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
        <Icon size={18} />
      </div>
      <span className="text-[10px] font-black uppercase tracking-widest text-text-muted/60">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-background overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[160px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[160px]" />
        <div className="absolute top-[30%] right-[10%] w-[30%] h-[30%] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      {/* Left Form Section */}
      <div className="w-full lg:w-[45%] flex flex-col items-center justify-center p-6 md:p-12 relative z-10 animate-in fade-in slide-in-from-left-4 duration-700">
        <div className="w-full max-w-md space-y-12">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.4em]">
              <ShieldCheck size={14} className="animate-pulse" /> Secure Entry
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-text-primary tracking-tight leading-none">
              Welcome back <span className="text-primary">.</span>
            </h1>
            <p className="text-text-muted text-sm font-bold opacity-60 flex items-center gap-2">
              <Sparkles size={14} className="text-primary/40" />
              Sign in to manage your university portal.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-5">
              <div className="group space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-2 group-focus-within:text-primary transition-colors">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted/30 group-focus-within:text-primary transition-colors" size={18} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@university.edu"
                    className="w-full h-14 pl-14 pr-4 bg-card/20 backdrop-blur-xl border border-border/40 rounded-[1.5rem] outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/50 transition-all font-semibold text-sm shadow-sm"
                  />
                </div>
              </div>

              <div className="group space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-2 group-focus-within:text-primary transition-colors">Password</label>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted/30 group-focus-within:text-primary transition-colors" size={18} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-14 pl-14 pr-4 bg-card/20 backdrop-blur-xl border border-border/40 rounded-[1.5rem] outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/50 transition-all font-semibold text-sm shadow-sm"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-primary text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? <Spinner className="w-5 h-5 border-white" /> : <LogIn size={16} />}
              {loading ? "Signing In..." : "Login"}
            </button>
          </form>

          <div className="space-y-6 pt-10">
            <div className="flex items-center gap-4">
              <div className="h-px w-full bg-border/40" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted/40 whitespace-nowrap">Trial Accounts</span>
              <div className="h-px w-full bg-border/40" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <CredentialChip icon={GraduationCap} label="Student" email="student@vu.edu.pk" pass="student123" />
              <CredentialChip icon={Briefcase} label="Teacher" email="teacher@vu.edu.pk" pass="teacher123" />
              <CredentialChip icon={User} label="Admin" email="admin@vu.edu.pk" pass="admin123" />
            </div>
          </div>
        </div>
      </div>

      {/* Right Brand Section */}
      <div className="hidden lg:flex w-[55%] bg-primary relative items-center justify-center overflow-hidden animate-in fade-in slide-in-from-right-4 duration-700">
        {/* Animated Background Items */}
        <div className="absolute top-[-20%] right-[-10%] w-[70%] h-[70%] bg-white/10 rounded-full blur-[160px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-black/10 rounded-full blur-[120px]" />

        <div className="relative z-10 text-center space-y-12 p-12">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-5 py-2.5 rounded-full text-white text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl">
              <Sparkles size={14} className="text-white animate-spin-slow" /> University Portal v2.0
            </div>
            <h2 className="text-7xl xl:text-8xl font-black text-white tracking-tighter leading-[0.85]">
              V<span className="text-secondary/50">.</span>U<span className="text-danger/60">.</span><br />
              <span className="opacity-80">EDU</span>
            </h2>
            <p className="text-white/60 text-lg font-medium max-w-sm mx-auto leading-relaxed">
              Experience the next generation of academic management.
            </p>
          </div>

          <div className="relative group perspective-1000 mt-10">
            <div className="absolute inset-0 bg-white/20 blur-[100px] rounded-full scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <div className="relative z-10 transform-gpu group-hover:rotate-1 group-hover:scale-105 transition-all duration-1000 ease-out">
              <Image
                src="/login.png"
                alt="Interface Preview"
                width={700}
                height={500}
                className="object-contain drop-shadow-[0_20px_80px_rgba(0,0,0,0.4)]"
              />
            </div>
          </div>
        </div>

        {/* Bottom Labels */}
        <div className="absolute bottom-10 left-10 right-10 flex items-center justify-between text-white/30 text-[9px] font-black uppercase tracking-[0.4em]">
          <span className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-white/40" /> Virtual University Inc.</span>
          <span>Terms & Privacy</span>
        </div>
      </div>

      {/* Mobile Branding (Visible only on small screens) */}
      <div className="lg:hidden w-full bg-primary p-12 text-center text-white space-y-8 animate-in slide-in-from-bottom-4 duration-500">
        <h2 className="text-4xl font-black tracking-tight uppercase">VU<span className="text-danger">.</span>EDU</h2>
        <div className="relative">
          <div className="absolute inset-0 bg-white/10 blur-3xl rounded-full" />
          <Image
            src="/login.png"
            alt="Logo"
            width={350}
            height={250}
            className="mx-auto object-contain relative z-10 drop-shadow-2xl"
          />
        </div>
      </div>
    </div>
  );
}
