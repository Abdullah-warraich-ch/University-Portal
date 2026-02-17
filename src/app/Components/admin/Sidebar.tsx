"use client";
import Image from "next/image";
import { Book, LayoutDashboard, Menu, X } from "lucide-react";
import { PiStudent } from "react-icons/pi";
import { GiTeacher } from "react-icons/gi";
import { RiBuilding2Fill } from "react-icons/ri";
import { MdSettings } from "react-icons/md";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { auth } from "@/app/Firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

interface SidebarProps {
  onClose?: () => void;
}

function Sidebar({ onClose }: SidebarProps) {
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

  const sactive =
    "text-primary font-semibold bg-primary/10 border border-primary/20 shadow-sm";
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full p-4 lg:p-6 bg-background/70 backdrop-blur-sm">
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
          href="/admin"
          onClick={onClose}
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200 ${pathname === "/admin"
            ? sactive
            : "text-text-muted hover:text-text-primary hover:bg-primary/5"
            }`}
        >
          <LayoutDashboard size={20} /> Dashboard
        </Link>
        <Link
          href="/admin/courses"
          onClick={onClose}
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200 ${pathname === "/admin/courses"
            ? sactive
            : "text-text-muted hover:text-text-primary hover:bg-primary/5"
            }`}
        >
          <Book size={20} /> Courses
        </Link>
        <Link
          href="/admin/students"
          onClick={onClose}
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200 ${pathname === "/admin/students"
            ? sactive
            : "text-text-muted hover:text-text-primary hover:bg-primary/5"
            }`}
        >
          <PiStudent size={20} /> Students
        </Link>
        <Link
          href="/admin/teachers"
          onClick={onClose}
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200 ${pathname === "/admin/teachers"
            ? sactive
            : "text-text-muted hover:text-text-primary hover:bg-primary/5"
            }`}
        >
          <GiTeacher size={20} /> Teachers
        </Link>
        <Link
          href="/admin/departments"
          onClick={onClose}
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200 ${pathname === "/admin/departments"
            ? sactive
            : "text-text-muted hover:text-text-primary hover:bg-primary/5"
            }`}
        >
          <RiBuilding2Fill size={20} /> Departments
        </Link>
        <Link
          href="/admin/settings"
          onClick={onClose}
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200 ${pathname === "/admin/settings"
            ? sactive
            : "text-text-muted hover:text-text-primary hover:bg-primary/5"
            }`}
        >
          <MdSettings size={20} /> Settings
        </Link>
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
              Muhammad Abdullah
            </h4>
            <p className="text-text-muted text-[10px] font-medium uppercase tracking-wider">
              Admin
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
