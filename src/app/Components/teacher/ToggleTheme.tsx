"use client";
import { Moon, Sun } from "lucide-react";
import { useState } from "react";
function ToggleTheme() {
  const [theme, setTheme] = useState("dark");


  function toggleTheme() {
    if (theme === "dark") {
      setTheme("light");
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    } else {
      setTheme("dark");
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
    }
  }
  return (
    <button
      onClick={toggleTheme}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border/40 bg-background-secondary/30 text-text-muted transition hover:bg-primary/5 hover:text-text-primary focus-visible:ring-2 focus-visible:ring-primary/40"
    >
      {theme === "dark" ? (
        <Sun size={18} className="text-text-muted" />
      ) : (
        <Moon size={18} className="text-text-muted" />
      )}
    </button>
  );
}

export default ToggleTheme;
