import {
  Bell,
  Menu,
  Search,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

function Navbar({ onMenuClick }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center gap-4 px-4 sm:px-6">

        {/* Mobile menu */}
        <button
          type="button"
          onClick={onMenuClick}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-400 transition hover:bg-white/[0.08] hover:text-white lg:hidden"
        >
          <Menu size={20} />
        </button>

        {/* Logo */}
        <button
          type="button"
          onClick={() => navigate("/questions")}
          className="flex shrink-0 items-center gap-2"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 shadow-lg shadow-violet-500/20">
            <Sparkles size={18} className="text-white" />
          </div>

          <span className="hidden text-lg font-bold tracking-tight text-white sm:block">
            Dev<span className="text-violet-400">Stack</span>
          </span>
        </button>

        {/* Search */}
        <div className="relative mx-auto hidden w-full max-w-xl md:block">
          <Search
            size={17}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <input
            type="text"
            placeholder="Search questions, tags, or users..."
            className="h-10 w-full rounded-xl border border-white/10 bg-white/[0.04] pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-violet-400/40 focus:bg-white/[0.06]"
          />

          <div className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-md border border-white/10 bg-white/[0.05] px-2 py-1 text-[10px] text-slate-600 lg:block">
            /
          </div>
        </div>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-2">

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-400 transition hover:bg-white/[0.08] hover:text-white"
          >
            <Bell size={18} />
          </button>

          {/* User */}
          
      <button
  type="button"
  onClick={() => navigate("/profile")}
  className="hidden items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-2 py-1.5 transition hover:bg-white/[0.08] sm:flex"
>   
            <img
              src={
                user?.profilePic ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  user?.name || "Developer"
                )}&background=7c3aed&color=fff`
              }
              alt={user?.name || "User"}
              className="h-8 w-8 rounded-lg object-cover"
            />

            <div className="hidden text-left lg:block">
              <p className="max-w-28 truncate text-xs font-semibold text-white">
                {user?.name || "Developer"}
              </p>

              <p className="max-w-28 truncate text-[11px] text-slate-500">
                @{user?.username || "username"}
              </p>
            </div>
          </button>

          {user && (
            <button
              type="button"
              onClick={handleLogout}
              className="hidden rounded-lg px-2 py-2 text-xs text-slate-500 transition hover:text-red-400 xl:block"
            >
              Logout
            </button>
          )}

        </div>
      </div>
    </header>
  );
}

export default Navbar;