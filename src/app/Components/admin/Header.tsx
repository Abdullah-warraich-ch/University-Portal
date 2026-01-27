import React from "react";
import { Bell, MessageCircle, Search } from "lucide-react";
import Image from "next/image";

function Header() {
  return (
    <div className="flex items-center  p-4 border-b justify-between border-b-border px-10">
      <div className="text-3xl font-black">
        VU<span className="text-danger">.</span>
      </div>
      <div className="text-xl text-primary font-medium"></div>
      <div className="flex">
        <div className="flex justify-center items-center gap-5">
          <div className="">
            <Search className="absolute ml-2 mt-2 text-text-muted" size={16} />
            <input
              type="text"
              placeholder="Search"
              className="outline-border  border py-1 px-4 pl-8 border-border rounded-full"
            />
          </div>
          <div className="flex gap-5 justify-center items-center">
            <Bell className="text-text-muted" size={18} />
            <MessageCircle className="text-text-muted" size={18} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
