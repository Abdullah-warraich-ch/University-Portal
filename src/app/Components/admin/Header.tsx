import { Bell, Menu, MessageCircle, Search, Settings } from "lucide-react";
import ToggleTheme from "@/app/Components/admin/ToggleTheme";

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
        <div className="hidden lg:flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted opacity-60">System Operational</span>
        </div>
      </div>

      <div className="flex-1 max-w-lg mx-4 relative group">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors"
          size={14}
        />
        <input
          type="text"
          placeholder="Global Search Control..."
          className="w-full bg-background-secondary/30 outline-none border border-border/50 rounded-2xl py-2 px-4 pl-11 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all text-xs font-semibold tracking-wide"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1">
          <kbd className="bg-background-secondary border border-border/50 px-1.5 py-0.5 rounded text-[10px] text-text-muted font-mono">⌘</kbd>
          <kbd className="bg-background-secondary border border-border/50 px-1.5 py-0.5 rounded text-[10px] text-text-muted font-mono">K</kbd>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <div className="hidden sm:flex items-center gap-1 md:gap-2">
          <button className="p-2 text-text-muted hover:text-primary hover:bg-primary/5 rounded-xl transition-all">
            <Settings size={18} />
          </button>
          <div className="h-4 w-[1px] bg-border mx-1" />
        </div>

        <div className="flex items-center gap-1 md:gap-2">
          <ToggleTheme />
          <div className="relative group">
            <button className="p-2.5 text-text-muted hover:text-primary hover:bg-primary/5 rounded-xl transition-all border border-transparent hover:border-border/50">
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
