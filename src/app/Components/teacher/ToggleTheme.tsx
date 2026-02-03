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
    <button onClick={toggleTheme}>
      {theme === "dark" ? (
        <Sun size={18} className="text-text-muted" />
      ) : (
        <Moon size={18} className="text-text-muted" />
      )}
    </button>
  );
}

export default ToggleTheme;
