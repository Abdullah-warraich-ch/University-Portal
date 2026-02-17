"use client";
import Image from "next/image";
import { Book, LayoutDashboard, X, LogOut, ChevronRight } from "lucide-react";
import { PiStudent } from "react-icons/pi";
import { GiTeacher } from "react-icons/gi";
import { RiBuilding2Fill } from "react-icons/ri";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { auth } from "@/app/Firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import React from "react";

interface SidebarProps {
  onClose?: () => void;
}

const NavLink = ({
  href,
  icon: Icon,
  label,
  isActive,
  onClick
}: {
  href: string,
  icon: any,
  label: string,
  isActive: boolean,
  onClick?: () => void
}) => (
  <Link
    href={href}
    onClick={onClick}
    className={`group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all duration-300 ${isActive
        ? "text-primary bg-primary/10 shadow-[inset_0_0_20px_rgba(146,95,226,0.05)]"
        : "text-text-muted hover:text-text-primary hover:bg-white/5"
      }`}
  >
    {/* Active Indicator Bar */}
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

    {isActive && (
      <ChevronRight size={14} className="ml-auto opacity-50" />
    )}
  </Link>
);

function Sidebar({ onClose }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

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
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary rounded-full animate-pulse" />
            </div>
            <div>
              <h2 className="text-text-primary font-black tracking-tighter text-xl leading-none">
                VU<span className="text-primary">.</span>PORTAL
              </h2>
              <p className="text-[10px] text-text-muted font-bold tracking-[0.2em] uppercase mt-1 opacity-60">Admin Central</p>
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
          <p className="px-4 text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-4 opacity-50">Main Menu</p>
          <div className="space-y-1.5">
            <NavLink
              href="/admin"
              icon={LayoutDashboard}
              label="Dashboard"
              isActive={pathname === "/admin"}
              onClick={onClose}
            />
            <NavLink
              href="/admin/courses"
              icon={Book}
              label="Courses"
              isActive={pathname === "/admin/courses"}
              onClick={onClose}
            />
            <NavLink
              href="/admin/students"
              icon={PiStudent}
              label="Students"
              isActive={pathname === "/admin/students"}
              onClick={onClose}
            />
            <NavLink
              href="/admin/teachers"
              icon={GiTeacher}
              label="Teachers"
              isActive={pathname === "/admin/teachers"}
              onClick={onClose}
            />
            <NavLink
              href="/admin/departments"
              icon={RiBuilding2Fill}
              label="Departments"
              isActive={pathname === "/admin/departments"}
              onClick={onClose}
            />
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
                  className="rounded-xl grayscale group-hover:grayscale-0 transition-all duration-500"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-[3px] border-background shadow-sm" />
            </div>

            <div>
              <h4 className="text-text-primary font-bold text-sm leading-tight">M. Abdullah</h4>
              <p className="text-[10px] text-primary font-black tracking-widest uppercase mt-0.5">Super Admin</p>
            </div>

            <button
              onClick={Logout}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-danger/10 text-danger py-2.5 text-xs font-black transition-all hover:bg-danger hover:text-white hover:shadow-lg hover:shadow-danger/20 group/btn active:scale-95"
            >
              <LogOut size={14} className="group-hover/btn:-translate-x-1 transition-transform" />
              Sign Out
            </button>
            <p className="text-[10px] text-text-muted mt-1 opacity-60">Session: 2h 45m active</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
