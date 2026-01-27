import React from "react";
import Header from "@/app/Components/admin/Header";
import Sidebar from "@/app/Components/admin/Sidebar";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen max-w-full mx-auto bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        {children}
      </div>
    </div>
  );
}

export default layout;
