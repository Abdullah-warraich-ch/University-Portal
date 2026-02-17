"use client";
import Image from "next/image";
import { Book, LayoutDashboard, ChevronUp, ChevronDown, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { auth } from "@/app/Firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { FirebaseContext } from "@/app/Context";
import React, { useState } from "react";

interface SidebarProps {
  onClose?: () => void;
}

function Sidebar({ onClose }: SidebarProps) {
  const router = useRouter();
  const { currentUserRecord } = React.useContext(FirebaseContext)!;
  const [courseIsOpen, setCourseIsOpen] = useState(false);
  const [attendanceIsOpen, setAttendanceIsOpen] = useState(false);

  function handleCourseOpen() {
    setCourseIsOpen((prev) => {
      setAttendanceIsOpen(false);
      return !prev;
    });
  }
  function handleAttendanceOpen() {
    setAttendanceIsOpen((prev) => {
      setCourseIsOpen(false);
      return !prev;
    });
  }

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
  const sactive =
    "text-primary font-semibold bg-primary/10 border border-primary/20 shadow-sm";
  const pathname = usePathname();
  return (
    <div className="flex flex-col h-full p-4 lg:p-6 bg-background/70 backdrop-blur-sm overflow-y-auto custom-scrollbar">
      <div className="flex items-center justify-between mb-8 border-b border-b-border/30 pb-4">
        <div className="flex items-center">
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
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-2 text-text-muted hover:text-text-primary rounded-lg"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <div className="flex-1 flex flex-col font-medium space-y-1">
        <Link
          href="/student"
          onClick={onClose}
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200 ${pathname === "/student"
              ? sactive
              : "text-text-muted hover:text-text-primary hover:bg-primary/5"
            }`}
        >
          <LayoutDashboard size={20} /> Dashboard
        </Link>
        <button
          onClick={handleCourseOpen}
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200 text-text-muted hover:text-text-primary hover:bg-primary/5`}
        >
          <Book size={20} />
          <div className="flex justify-between w-full">
            <span>Grades</span>
            {courseIsOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </button>
        <div className={`space-y-1 overflow-hidden transition-all duration-300 ${courseIsOpen ? "max-h-96 opacity-100 mb-2" : "max-h-0 opacity-0"}`}>
          {currentUserRecord?.registeredCourses?.map((code, index) => (
            <Link
              key={index}
              href={`/student/grades/${code}`}
              onClick={onClose}
              className={`flex items-center gap-3 rounded-lg px-3 py-1.5 ml-8 text-xs transition-all duration-200 border-l border-border/50 ${pathname === `/student/grades/${code}`
                  ? "text-primary font-bold border-primary/50 bg-primary/5"
                  : "text-text-muted hover:text-text-primary hover:bg-primary/5"
                }`}
            >
              {code}
            </Link>
          ))}
        </div>

        <button
          onClick={handleAttendanceOpen}
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200 text-text-muted hover:text-text-primary hover:bg-primary/5`}
        >
          <Book size={20} />
          <div className="flex justify-between w-full">
            <span>Attendance</span>
            {attendanceIsOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </button>
        <div className={`space-y-1 overflow-hidden transition-all duration-300 ${attendanceIsOpen ? "max-h-96 opacity-100 mb-2" : "max-h-0 opacity-0"}`}>
          {currentUserRecord?.registeredCourses?.map((code, index) => (
            <Link
              key={index}
              href={`/student/attendance/${code}`}
              onClick={onClose}
              className={`flex items-center gap-3 rounded-lg px-3 py-1.5 ml-8 text-xs transition-all duration-200 border-l border-border/50 ${pathname === `/student/attendance/${code}`
                  ? "text-primary font-bold border-primary/50 bg-primary/5"
                  : "text-text-muted hover:text-text-primary hover:bg-primary/5"
                }`}
            >
              {code}
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-auto pt-6 border-t border-border/30">
        <div className="rounded-xl border border-border/30 bg-background-secondary/30 p-4 flex flex-col items-center gap-2">
          <div className="relative group">
            <Image
              src="/man.png"
              alt="Profile"
              width={40}
              height={40}
              className="object-contain rounded-full transition-transform group-hover:scale-110"
            />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-background" />
          </div>
          <div className="text-center">
            <h4 className="text-text-primary font-semibold text-sm">
              {currentUserRecord?.name || "Student"}
            </h4>
            <p className="text-text-muted text-[10px] font-medium uppercase tracking-wider">
              {currentUserRecord?.role || "Learner"}
            </p>
          </div>
          <button
            onClick={Logout}
            className="w-full inline-flex items-center justify-center rounded-lg bg-danger/10 text-danger px-4 py-2 text-xs font-bold transition hover:bg-danger hover:text-white active:scale-[0.98]"
          >
            Logout
          </button>
          <div className="text-[10px] text-text-muted bg-background/50 border border-border/40 px-2 py-1 rounded-full mt-1">
            {new Date().toLocaleString("en-PK", {
              day: "2-digit",
              month: "short",
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
