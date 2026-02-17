import { Bell, Menu, MessageCircle, Search, HelpCircle } from "lucide-react";
import ToggleTheme from "@/app/Components/teacher/ToggleTheme";

interface HeaderProps {
  onMenuClick?: () => void;
}

function Header({ onMenuClick }: HeaderProps) {
  return (
    <div className="flex items-center p-3 md:p-4 border-b justify-between border-b-border lg:px-10 sticky top-0 bg-background/80 backdrop-blur-xl z-30">
      <div className="flex items-center gap-4">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2.5 bg-background-secondary/50 text-text-muted hover:text-primary hover:bg-primary/5 rounded-xl transition-all border border-border/50"
          >
            <Menu size={20} />
          </button>
        )}
        <div className="hidden lg:flex flex-col">
          <h1 className="text-xs font-black uppercase tracking-[0.2em] text-text-primary">Instructional Dashboard</h1>
          <p className="text-[9px] font-bold text-text-muted uppercase tracking-wider opacity-60">Spring 2026 Semester</p>
        </div>
      </div>

      <div className="flex-1 max-w-md mx-6 relative group">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors"
          size={14}
        />
        <input
          type="text"
          placeholder="Search roster, grades..."
          className="w-full bg-background-secondary/30 outline-none border border-border/50 rounded-2xl py-2 px-4 pl-11 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all text-xs font-semibold tracking-wide"
        />
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <div className="hidden sm:flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 bg-background-secondary/50 border border-border/50 rounded-xl text-[10px] font-black uppercase tracking-wider text-text-muted hover:text-primary hover:border-primary/30 transition-all">
            <HelpCircle size={14} />
            <span className="hidden xl:inline">Support</span>
          </button>
        </div>

        <div className="flex items-center gap-1 md:gap-2">
          <ToggleTheme />
          <div className="flex items-center gap-1">
            <button className="p-2.5 text-text-muted hover:text-primary hover:bg-primary/5 rounded-xl transition-all relative">
              <MessageCircle size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-success rounded-full border-2 border-background" />
            </button>
            <button className="p-2.5 text-text-muted hover:text-primary hover:bg-primary/5 rounded-xl transition-all relative">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
