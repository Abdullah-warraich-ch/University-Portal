"use client";

import React, { useLayoutEffect, useRef, useState } from "react";
import Header from "@/app/Components/student/Header";
import Sidebar from "@/app/Components/student/Sidebar";

function layout({ children }: { children: React.ReactNode }) {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [sidebarWidth, setSidebarWidth] = useState<number | null>(null);

  useLayoutEffect(() => {
    if (!sidebarRef.current) return;

    const updateWidth = () => {
      setSidebarWidth(sidebarRef.current!.offsetWidth);
    };

    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(sidebarRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Fixed Sidebar */}
      <div ref={sidebarRef} className="fixed left-0 top-0 h-screen">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div
        className="min-h-screen max-w-full mx-auto "
        style={{
          marginLeft: sidebarWidth ?? 0,
          visibility: sidebarWidth === null ? "hidden" : "visible",
        }}
      >
        <div className="flex flex-col min-h-screen">
          <Header />
          {children}
        </div>
      </div>
    </>
  );
}

export default layout;
