import React from "react";
import Image from "next/image";
import { Book, LayoutDashboard } from "lucide-react";
import { PiStudent } from "react-icons/pi";
import { GiTeacher } from "react-icons/gi";
import { RiBuilding2Fill } from "react-icons/ri";
import { MdSettings } from "react-icons/md";

function Sidebar() {
  const date = new Intl.DateTimeFormat("en-PK", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Karachi",
  }).format(new Date());

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
      <div className="flex flex-col gap-4 font-medium">
        <div className="flex  items-center gap-2">
          {" "}
          {<LayoutDashboard className="text-text-muted" size={20} />} Dashboard
        </div>
        <div className="flex items-center gap-2">
          {<Book className="text-text-muted" size={20} />} Courses
        </div>
        <div className="flex items-center gap-2">
          {<PiStudent className="text-text-muted" size={20} />} Students
        </div>
        <div className="flex items-center gap-2">
          {<GiTeacher className="text-text-muted" size={20} />} Teachers
        </div>
        <div className="flex items-center gap-2">
          {<RiBuilding2Fill className="text-text-muted" size={20} />}{" "}
          Departments
        </div>
        <div className="flex items-center gap-2">
          {<MdSettings className="text-text-muted" size={20} />} Settings
        </div>
      </div>

      <div className="flex flex-col mt-20 justify-center gap-1 items-center">
        <Image
          src="/man.png"
          alt="Profile"
          width={40}
          height={40}
          className=" object-contain"
        />
        <h4 className="text-text-primary font-black">Muhammad Abdullah</h4>
        <p className="text-text-muted text-xs font-medium">Admin</p>
        <button className="w-full border border-border font-bold rounded-lg p-1">
          Logout
        </button>
        <p className="text-sm text-text-muted">
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
