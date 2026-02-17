"use client";
import Image from "next/image";
import { Book, LayoutDashboard, ChevronUp, ChevronDown, X, LogOut, ChevronRight, GraduationCap, ClipboardCheck, Sparkles } from "lucide-react";
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

const NavLink = ({
  href,
  icon: Icon,
  label,
  isActive,
  onClick,
  hasDropdown = false,
  isOpen = false
}: {
  href?: string,
  icon: any,
  label: string,
  isActive: boolean,
  onClick: () => void,
  hasDropdown?: boolean,
  isOpen?: boolean
}) => {
  const content = (
    <>
      {isActive && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full shadow-[0_0_10px_#925fe2]" />
      )}

      <div className={`p-2 rounded-lg transition-all duration-300 ${isActive ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-background-secondary/50 group-hover:bg-primary/10 group-hover:text-primary"
        }`}>
        <Icon size={18} className={isActive ? "scale-110" : "group-hover:scale-110 transition-transform"} />
      </div>

      <span className={`font-semibold tracking-wide ${isActive ? "translate-x-1" : "group-hover:translate-x-1"} transition-transform`}>
        {label}
      </span>

      {hasDropdown ? (
        <div className="ml-auto opacity-50">
          {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </div>
      ) : isActive && (
        <ChevronRight size={14} className="ml-auto opacity-50" />
      )}
    </>
  );

  if (hasDropdown) {
    return (
      <button
        onClick={onClick}
        className={`w-full group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all duration-300 ${isActive || isOpen
            ? "text-primary bg-primary/5 shadow-[inset_0_0_20px_rgba(146,95,226,0.02)]"
            : "text-text-muted hover:text-text-primary hover:bg-white/5"
          }`}
      >
        {content}
      </button>
    );
  }

  return (
    <Link
      href={href || "#"}
      onClick={onClick}
      className={`group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all duration-300 ${isActive
          ? "text-primary bg-primary/5 shadow-[inset_0_0_20px_rgba(146,95,226,0.02)]"
          : "text-text-muted hover:text-text-primary hover:bg-white/5"
        }`}
    >
      {content}
    </Link>
  );
};

function Sidebar({ onClose }: SidebarProps) {
  const router = useRouter();
  const { currentUserRecord } = React.useContext(FirebaseContext)!;
  const [courseIsOpen, setCourseIsOpen] = useState(false);
  const [attendanceIsOpen, setAttendanceIsOpen] = useState(false);
  const pathname = usePathname();

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
      router.push("/login");
      document.cookie = "role=null; path=/; max-age=0";
      document.cookie = "token=null; path=/; max-age=0";
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }

  return (
    <div className="flex flex-col h-full bg-background/95 backdrop-blur-xl border-r border-border/50">
      {/* Brand Header */}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative p-2 bg-primary/10 rounded-2xl border border-primary/20 group cursor-pointer hover:bg-primary/20 transition-all">
              <Image
                src="/admin.png"
                alt="Logo"
                width={32}
                height={32}
                className="object-contain group-hover:rotate-12 transition-transform"
              />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-warning rounded-full animate-pulse" />
            </div>
            <div>
              <h2 className="text-text-primary font-black tracking-tighter text-xl leading-none uppercase">
                VU<span className="text-primary">.</span>PORTAL
              </h2>
              <p className="text-[10px] text-text-muted font-bold tracking-[0.2em] uppercase mt-1 opacity-60">Learning Dashboard</p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-2 text-text-muted hover:text-text-primary hover:bg-white/5 rounded-xl transition-all"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 px-4 space-y-8 overflow-y-auto py-4">
        <div>
          <p className="px-4 text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-4 opacity-50">Academic Path</p>
          <div className="space-y-1.5">
            <NavLink
              href="/student"
              icon={LayoutDashboard}
              label="Home Feed"
              isActive={pathname === "/student"}
              onClick={() => onClose?.()}
            />

            {/* Grades Dropdown */}
            <div className="space-y-1">
              <NavLink
                icon={GraduationCap}
                label="My Grades"
                isActive={false}
                onClick={handleCourseOpen}
                hasDropdown
                isOpen={courseIsOpen}
              />
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${courseIsOpen ? "max-h-96 opacity-100 mb-2" : "max-h-0 opacity-0"}`}>
                <div className="ml-11 space-y-1 pb-1 border-l-2 border-border/30">
                  {currentUserRecord?.registeredCourses?.map((code, index) => (
                    <Link
                      key={index}
                      href={`/student/grades/${code}`}
                      onClick={onClose}
                      className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs transition-all duration-200 ${pathname === `/student/grades/${code}`
                          ? "text-primary font-bold bg-primary/5"
                          : "text-text-muted hover:text-text-primary hover:bg-white/5"
                        }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${pathname === `/student/grades/${code}` ? "bg-primary" : "bg-text-muted/30"}`} />
                      {code}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Attendance Dropdown */}
            <div className="space-y-1">
              <NavLink
                icon={ClipboardCheck}
                label="Attendance"
                isActive={false}
                onClick={handleAttendanceOpen}
                hasDropdown
                isOpen={attendanceIsOpen}
              />
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${attendanceIsOpen ? "max-h-96 opacity-100 mb-2" : "max-h-0 opacity-0"}`}>
                <div className="ml-11 space-y-1 pb-1 border-l-2 border-border/30">
                  {currentUserRecord?.registeredCourses?.map((code, index) => (
                    <Link
                      key={index}
                      href={`/student/attendance/${code}`}
                      onClick={onClose}
                      className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs transition-all duration-200 ${pathname === `/student/attendance/${code}`
                          ? "text-primary font-bold bg-primary/5"
                          : "text-text-muted hover:text-text-primary hover:bg-white/5"
                        }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${pathname === `/student/attendance/${code}` ? "bg-primary" : "bg-text-muted/30"}`} />
                      {code}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Profile Section */}
      <div className="p-4 mt-auto">
        <div className="relative p-5 rounded-3xl bg-gradient-to-br from-background-secondary/40 to-background border border-border/50 overflow-hidden group">
          <div className="absolute top-0 right-0 -m-6 h-24 w-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />

          <div className="relative z-10 flex flex-col items-center gap-3 text-center">
            <div className="relative">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 border border-primary/20 p-1 group-hover:scale-105 transition-transform duration-500">
                <Image
                  src="/man.png"
                  alt="Profile"
                  width={56}
                  height={56}
                  className="rounded-xl group-hover:grayscale-0 transition-all duration-500"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-[3px] border-background shadow-sm" />
            </div>

            <div className="space-y-1">
              <h4 className="text-text-primary font-bold text-sm leading-tight">
                {currentUserRecord?.name || "Student"}
              </h4>
              <div className="flex items-center justify-center gap-1 text-[9px] text-primary font-black tracking-widest uppercase">
                <Sparkles size={8} /> Scholar
              </div>
            </div>

            <button
              onClick={Logout}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-danger/10 text-danger py-2.5 text-xs font-black transition-all hover:bg-danger hover:text-white hover:shadow-lg hover:shadow-danger/20 group/btn active:scale-95"
            >
              <LogOut size={14} className="group-hover/btn:-translate-x-1 transition-transform" />
              Sign Out
            </button>
            <p className="text-[9px] text-text-muted mt-1 opacity-60">ID: {currentUserRecord?.uid?.substring(0, 8) || "********"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
