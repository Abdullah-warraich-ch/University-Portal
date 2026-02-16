"use client";
import Image from "next/image";
import { auth, db } from "@/../src/app/Firebase";
import React, { useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Spinner } from "@/app/Components/ui/spinner";
import { toast } from "sonner";

export default function Login() {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
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
      // Redirect logged-in users immediately
      router.replace(`/${role}`);
      return; // ✅ Important: stop further execution
    }

    // Visitors see the toast
  }, [router]);

  async function handleLogin(e: React.FormEvent) {
    setLoading(true);
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );

      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
      const role = userDoc.data()?.role;
      document.cookie = `role=${role}; path=/ `;
      const token = await userCredential.user.getIdToken();
      console.log("User token:", token);
      document.cookie = `token=${token}; path=/`;
      if (role === "student") {
        router.push("/student");
      } else if (role === "teacher") {
        router.push("/teacher");
      } else if (role === "admin") {
        router.push("/admin");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error logging in:", error);
      setLoading(false);
      toast.error("Invalid email or password");
      setError("Invalid email or password");
    }
  }
  return (
    <div className="w-full h-screen p-0 m-0 flex items-center justify-center">
      <div className="w-1/2  ">
        <form
          onSubmit={handleLogin}
          className="flex flex-col w-1/2 mx-auto gap-8"
        >
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-text-primary mb-4">
            Login
          </h1>
          <div className="">
            <input
              value={email}
              type="text"
              placeholder="Username"
              autoComplete="off"
              className="border-b border-b-border outline-0 p-2 w-full"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
              autoComplete="new-password"
              className="border-b border-b-border outline-0 p-2 w-full"
            />
          </div>
          <button
            type="submit"
            className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/80 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Spinner className="w-5 h-5" /> Logging In
              </span>
            ) : (
              "Login"
            )}
          </button>
        </form>
        <div className="w-1/2 mx-auto mt-10">
          <h1 className="tracking-tight text-xl font-extrabold">
            Test Credentials
          </h1>
          <div className="flex justify-between gap-4 ">
            <button
              onClick={() =>
                toast("Student Credentials", {
                  description: "student@vu.edu.pk | student123",
                })
              }
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/80 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              Student
            </button>
            <button
              onClick={() =>
                toast("Teacher Credentials", {
                  description: "teacher@vu.edu.pk | teacher123",
                })
              }
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/80 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              Teacher
            </button>
            <button
              onClick={() =>
                toast("Admin Credentials", {
                  description: "admin@vu.edu.pk | admin123",
                })
              }
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/80 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              Admin
            </button>
          </div>
        </div>
      </div>
      <div className="w-1/2 bg-primary h-full flex flex-col justify-between items-center text-center text-white ">
        <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight mt-7">
          Welcome to
          <br />
          VU<span className="text-danger">.</span>
          <span className="font-medium"> Portal</span>
        </h1>
        <Image
          src="/login.png"
          alt="Logo"
          width={537.33}
          height={328}
          className="object-contain"
        />
      </div>
    </div>
  );
}
