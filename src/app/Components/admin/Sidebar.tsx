"use client";
import Image from "next/image";
import { Book, LayoutDashboard } from "lucide-react";
import { PiStudent } from "react-icons/pi";
import { GiTeacher } from "react-icons/gi";
import { RiBuilding2Fill } from "react-icons/ri";
import { MdSettings } from "react-icons/md";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { auth } from "@/app/Firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

function Sidebar() {
  const router = useRouter();
  async function Logout() {
    try {
      await signOut(auth);
      console.log("User signed out");
      router.push("/login");
      document.cookie = "role=null; path=/; max-age=0";
      document.cookie = "token=null; path=/; max-age=0";
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }
  const sactive: string =
    "text-primary font-semibold bg-primary/10 border border-primary/20 shadow-sm";
  const pathname = usePathname();
  return (
    <div className="w-[20%] h-screen p-6 border-r border-r-border/30 bg-background/70 backdrop-blur-sm">
      <div className="flex items-center mb-8 border-b border-b-border/30 pb-4">
        <Image
          src="/admin.png"
          alt="Logo"
          width={35}
          height={35}
          className="object-contain"
        />
        <h2 className="text-text-primary text-wrap font-extrabold tracking-tight text-lg ml-2">
          University LMS
        </h2>
      </div>
      <div className="flex flex-col font-medium space-y-1">
        <Link
          href="/admin"
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors duration-200 ease-in-out ${
            pathname === "/admin"
              ? sactive
              : "text-text-muted hover:text-text-primary hover:bg-primary/5"
          }`}
        >
          <LayoutDashboard className="" size={20} /> Dashboard
        </Link>
        <Link
          href="/admin/courses"
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors duration-200 ease-in-out ${
            pathname === "/admin/courses"
              ? sactive
              : "text-text-muted hover:text-text-primary hover:bg-primary/5"
          }`}
        >
          <Book className="" size={20} /> Courses
        </Link>
        <Link
          href="/admin/students"
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors duration-200 ease-in-out ${
            pathname === "/admin/students"
              ? sactive
              : "text-text-muted hover:text-text-primary hover:bg-primary/5"
          }`}
        >
          <PiStudent className="" size={20} /> Students
        </Link>
        <Link
          href="/admin/teachers"
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors duration-200 ease-in-out ${
            pathname === "/admin/teachers"
              ? sactive
              : "text-text-muted hover:text-text-primary hover:bg-primary/5"
          }`}
        >
          <GiTeacher className="" size={20} /> Teachers
        </Link>
        <Link
          href="/admin/departments"
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors duration-200 ease-in-out ${
            pathname === "/admin/departments"
              ? sactive
              : "text-text-muted hover:text-text-primary hover:bg-primary/5"
          }`}
        >
          <RiBuilding2Fill className="" size={20} /> Departments
        </Link>
        <Link
          href="/admin/settings"
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors duration-200 ease-in-out ${
            pathname === "/admin/settings"
              ? sactive
              : "text-text-muted hover:text-text-primary hover:bg-primary/5"
          }`}
        >
          <MdSettings className="" size={20} /> Settings
        </Link>
      </div>

      <div className="mt-10 rounded-xl border border-border/30 bg-background-secondary/30 p-4 flex flex-col justify-center gap-1 items-center">
        <Image
          src="/man.png"
          alt="Profile"
          width={40}
          height={40}
          className="object-contain"
        />
        <h4 className="text-text-primary font-semibold text-center">
          Muhammad Abdullah
        </h4>
        <p className="text-text-muted text-xs font-medium">Admin</p>
        <button
          onClick={Logout}
          className="w-full inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/80 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          Logout
        </button>
        <p className="text-xs text-text-muted border border-border/40 px-3 py-1 rounded-full mt-2">
          {" "}
          {new Date().toLocaleString("en-PK", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
            timeZone: "Asia/Karachi",
          })}
        </p>
      </div>
    </div>
  );
}

export default Sidebar;
