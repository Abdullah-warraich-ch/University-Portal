"use client";
import Image from "next/image";
import { auth, db } from "@/../src/app/Firebase";
import React, { useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";

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
      router.push(`/${role}`);
    }

    console.log(document.cookie);
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
      document.cookie = `role=${role}; path=/; max-age=900`;
      const token = await userCredential.user.getIdToken();
      console.log("User token:", token);
      document.cookie = `token=${token}; path=/; max-age=900`;
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
          <h1 className="text-3xl font-bold mb-4">Login</h1>
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
            className="bg-primary text-white p-2 rounded mt-4 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Spinner className="w-5 h-5" /> Logging In
              </span>
            ) : (
              "Login"
            )}
          </button>
          <p>
            {error ? (
              <span className="text-red-500">{error}</span>
            ) : (
              <span className="opacity-0">Errooooooooooooooooooor</span>
            )}
          </p>
        </form>
      </div>
      <div className="w-1/2 bg-primary h-full flex flex-col justify-between items-center text-center text-white ">
        <h1 className="text-7xl font-bold mt-7 ">
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
