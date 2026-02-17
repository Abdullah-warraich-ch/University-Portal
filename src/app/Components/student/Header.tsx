import { Bell, Menu, MessageCircle, Search } from "lucide-react";
import ToggleTheme from "@/app/Components/student/ToggleTheme";

interface HeaderProps {
  onMenuClick?: () => void;
}

function Header({ onMenuClick }: HeaderProps) {
  return (
    <div className="flex items-center p-4 border-b justify-between border-b-border lg:px-10 sticky top-0 bg-background/80 backdrop-blur-md z-30">
      <div className="flex items-center gap-4">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 text-text-muted hover:text-text-primary rounded-lg"
          >
            <Menu size={24} />
          </button>
        )}
        <div className="text-2xl md:text-3xl font-black">
          VU<span className="text-danger">.</span>
        </div>
      </div>

      <div className="hidden sm:flex flex-1 max-w-md mx-4 relative group">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors"
          size={16}
        />
        <input
          type="text"
          placeholder="Search courses, grades..."
          className="w-full bg-background-secondary/20 outline-none border border-border rounded-full py-2 px-4 pl-10 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all text-sm"
        />
      </div>

      <div className="flex items-center gap-2 md:gap-5">
        <div className="hidden xs:flex gap-2 md:gap-4">
          <ToggleTheme />
        </div>
        <div className="flex gap-1 md:gap-2">
          <button className="p-2 text-text-muted hover:text-text-primary hover:bg-primary/5 rounded-full transition relative">
            <Bell size={18} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full border-2 border-background" />
          </button>
          <button className="p-2 text-text-muted hover:text-text-primary hover:bg-primary/5 rounded-full transition">
            <MessageCircle size={18} />
          </button>
        </div>
        <div className="lg:hidden flex items-center">
          <ToggleTheme />
        </div>
      </div>
    </div>
  );
}

export default Header;
