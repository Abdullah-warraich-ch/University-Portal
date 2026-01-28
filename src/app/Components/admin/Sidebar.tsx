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
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }
  const sactive: string = "text-primary font-bold bg-primary/10 rounded-lg";
  const pathname = usePathname();
  return (
    <div className="w-[20%]   h-screen p-10 border-r border-r-border/20">
      <div className="flex items-center mb-10 border-b border-b-border/20  pb-4">
        <Image
          src="/admin.png"
          alt="Logo"
          width={35}
          height={35}
          className="object-contain"
        />
        <h2 className="text-text-primary  text-wrap font-black text-xl ml-2">
          University LMS
        </h2>
      </div>
      <div className="flex flex-col  font-medium">
        <Link
          href="/admin"
          className={`flex items-center p-2 gap-2 transition-colors duration-200 ease-in-out ${pathname === "/admin" ? sactive : "text-text-muted"}`}
        >
          <LayoutDashboard className="" size={20} /> Dashboard
        </Link>
        <Link
          href="/admin/courses"
          className={`flex items-center p-2 gap-2 transition-colors duration-200 ease-in-out ${pathname === "/admin/courses" ? sactive : "text-text-muted"}`}
        >
          <Book className="" size={20} /> Courses
        </Link>
        <Link
          href="/admin/students"
          className={`flex items-center p-2 gap-2 transition-colors duration-200 ease-in-out ${pathname === "/admin/students" ? sactive : "text-text-muted"}`}
        >
          <PiStudent className="" size={20} /> Students
        </Link>
        <Link
          href="/admin/teachers"
          className={`flex items-center p-2 gap-2 transition-colors duration-200 ease-in-out ${pathname === "/admin/teachers" ? sactive : "text-text-muted"}`}
        >
          <GiTeacher className="" size={20} /> Teachers
        </Link>
        <Link
          href="/admin/departments"
          className={`flex items-center p-2 gap-2 transition-colors duration-10 ease-in-out   ${pathname === "/admin/departments" ? sactive : "text-text-muted"}`}
        >
          <RiBuilding2Fill className="" size={20} /> Departments
        </Link>
        <Link
          href="/admin/settings"
          className={`flex items-center p-2 gap-2 ${pathname === "/admin/settings" ? sactive : "text-text-muted"}`}
        >
          <MdSettings className="" size={20} /> Settings
        </Link>
      </div>

      <div className="flex flex-col mt-15 justify-center gap-1 items-center">
        <Image
          src="/man.png"
          alt="Profile"
          width={40}
          height={40}
          className=" object-contain"
        />
        <h4 className="text-text-primary font-black">Muhammad Abdullah</h4>
        <p className="text-text-muted text-xs font-medium">Admin</p>
        <button
          onClick={Logout}
          className="w-full bg-primary font-medium rounded-lg p-1"
        >
          Logout
        </button>
        <p className="text-sm text-text-muted border border-border p-1 px-2 rounded-full mt-1">
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
