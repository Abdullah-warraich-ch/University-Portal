"use client";
import Image from "next/image";
import { auth, db } from "@/app/Firebase";
import React, { useEffect, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Spinner } from "@/app/Components/ui/spinner";
import { toast } from "sonner";
import { Mail, Lock, LogIn, ShieldCheck, User, GraduationCap, Briefcase, Sparkles, Eye, EyeOff, CheckCircle2 } from "lucide-react";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("student@vu.edu.pk");
  const [password, setPassword] = useState("student123");
  const [showPassword, setShowPassword] = useState(false);
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
        toast.info(`Using ${label} account`, {
          icon: <CheckCircle2 size={14} className="text-primary" />,
        });
      }}
      className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl bg-white/[0.03] backdrop-blur-md border border-white/10 hover:bg-primary/10 hover:border-primary/40 transition-all group shadow-sm active:scale-95 w-full"
    >
      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
        <Icon size={14} />
      </div>
      <span className="text-[8px] lg:text-[9px] font-black uppercase tracking-widest text-text-muted">{label}</span>
      <div className="text-[7px] font-bold text-text-muted opacity-30 lowercase tracking-tighter hidden xl:block">{email.split('@')[0]}</div>
    </button>
  );

  return (
    <div className="h-screen w-full flex flex-col lg:flex-row bg-background overflow-hidden relative font-poppins">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <div className="w-full lg:w-[50%] xl:w-[50%] h-full flex flex-col items-center justify-center p-4 lg:p-8 relative z-10 overflow-y-auto premium-scrollbar">
        <div className="w-full max-w-sm space-y-5 lg:space-y-6">
          <div className="lg:hidden flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <ShieldCheck size={20} />
            </div>
            <h2 className="text-lg font-black tracking-tight text-text-primary uppercase">VU<span className="text-primary">.</span>PORTAL</h2>
          </div>

          <div className="space-y-1 lg:space-y-1.5">
            <div className="flex items-center gap-2 text-primary font-black text-[10px] lg:text-[11px] uppercase tracking-[0.4em]">
              <div className="w-4 h-px bg-primary/30" />
              <ShieldCheck size={12} /> Secure Entry
            </div>
            <h1 className="text-2xl lg:text-3xl xl:text-4xl font-black text-text-primary tracking-tight leading-none">
              Welcome back <span className="text-primary">.</span>
            </h1>
            <p className="text-text-muted text-[11px] lg:text-xs font-medium opacity-40 leading-relaxed max-w-[240px]">
              Sign in to manage your university records.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 lg:space-y-5">
            <div className="space-y-3 lg:space-y-4">
              <div className="group space-y-1">
                <label className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-text-primary/30 px-2 group-focus-within:text-primary transition-colors">Email</label>
                <div className="relative">
                  <div className="absolute left-0 top-0 bottom-0 w-11 flex items-center justify-center pointer-events-none">
                    <Mail className="z-10 text-text-muted/40 group-focus-within:text-primary transition-colors" size={16} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email"
                    className="w-full h-12 pl-11 pr-4 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/40 transition-all font-semibold text-xs shadow-sm placeholder:text-text-muted/10"
                  />
                </div>
              </div>

              <div className="group space-y-1">
                <label className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-text-primary/30 px-2 group-focus-within:text-primary transition-colors">Password</label>
                <div className="relative">
                  <div className="absolute left-0 top-0 bottom-0 w-11 flex items-center justify-center pointer-events-none">
                    <Lock className="z-10 text-text-muted/40 group-focus-within:text-primary transition-colors" size={16} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-12 pl-11 pr-11 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-xl outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/40 transition-all font-semibold text-xs shadow-sm placeholder:text-text-muted/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-0 bottom-0 w-11 flex items-center justify-center text-text-muted/30 hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-1.5 cursor-pointer group">
                <div className="w-3.5 h-3.5 rounded border border-white/10 bg-white/[0.03] flex items-center justify-center group-hover:border-primary/40 transition-colors">
                  <div className="w-1.5 h-1.5 rounded-sm bg-primary opacity-0 group-has-[:checked]:opacity-100 transition-opacity" />
                </div>
                <input type="checkbox" className="hidden" />
                <span className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-text-muted/60 select-none">Remember Me</span>
              </label>
              <button type="button" className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/70 transition-colors">Forgot Password?</button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-primary text-white rounded-xl font-black text-[10px] lg:text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-2.5 shadow-xl shadow-primary/20 hover:shadow-primary/40 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {loading ? <Spinner className="w-4 h-4 border-white" /> : <LogIn size={16} />}
              {loading ? "Authenticating..." : "Sign In"}
            </button>
          </form>

          <div className="space-y-3 pt-4 lg:pt-6">
            <div className="flex items-center gap-3">
              <div className="h-px w-full bg-white/5" />
              <span className="text-[9px] lg:text-[10px] font-black uppercase tracking-[0.3em] text-text-muted/30 whitespace-nowrap">Testing Labs</span>
              <div className="h-px w-full bg-white/5" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <CredentialChip icon={GraduationCap} label="Student" email="student@vu.edu.pk" pass="student123" />
              <CredentialChip icon={Briefcase} label="Teacher" email="teacher@vu.edu.pk" pass="teacher123" />
              <CredentialChip icon={User} label="Admin" email="admin@vu.edu.pk" pass="admin123" />
            </div>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 bg-primary relative items-center justify-center overflow-hidden h-full">
        <div className="absolute top-[-10%] right-[-5%] w-[60%] h-[60%] bg-white/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[40%] h-[40%] bg-black/10 rounded-full blur-[100px]" />

        <div className="relative z-10 text-center space-y-4 lg:space-y-6 p-12">
          <div className="space-y-2 lg:space-y-4">
            <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full text-white text-[7px] font-black uppercase tracking-[0.4em] shadow-xl">
              <Sparkles size={8} className="text-white animate-spin-slow" /> University Platform
            </div>
            <h2 className="text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-black text-white tracking-tighter leading-[0.8] select-none">
              V<span className="text-white/20">.</span>U<span className="text-white/40">.</span><br />
              <span className="opacity-80">EDU</span>
            </h2>
            <p className="text-white/40 text-[10px] lg:text-xs font-medium max-w-[180px] lg:max-w-[240px] mx-auto leading-relaxed">
              Experience the next generation of academic management.
            </p>
          </div>

          <div className="relative group perspective-1000">
            <div className="absolute inset-0 bg-white/20 blur-[60px] rounded-full scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <div className="relative z-10 transform-gpu group-hover:rotate-1 group-hover:scale-105 transition-all duration-1000 ease-out">
              <Image
                src="/login.png"
                alt="Interface Preview"
                width={400}
                height={280}
                className="lg:max-w-[320px] xl:max-w-[420px] object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)] select-none pointer-events-none"
              />
            </div>
          </div>
        </div>

        <div className="absolute bottom-4 left-8 right-8 flex items-center justify-between text-white/20 text-[6px] font-black uppercase tracking-[0.5em] select-none">
          <span className="flex items-center gap-1"><div className="w-1 h-1 rounded-full bg-white/20" /> Virtual University</span>
          <span>Core v2.0</span>
        </div>
      </div>
    </div>

  );
}
