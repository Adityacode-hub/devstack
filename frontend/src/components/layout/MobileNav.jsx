import {
  Home,
  Plus,
  UserRound,
} from "lucide-react";
import { NavLink } from "react-router-dom";

function MobileNav() {
  const items = [
    {
      label: "Questions",
      path: "/questions",
      icon: Home,
    },
    {
      label: "Ask",
      path: "/questions/ask",
      icon: Plus,
    },
    {
      label: "Profile",
      path: "/profile",
      icon: UserRound,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-slate-950/95 px-4 py-2 backdrop-blur-xl lg:hidden">
      <div className="mx-auto flex max-w-md items-center justify-around">

        {items.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex min-w-16 flex-col items-center gap-1 rounded-xl px-3 py-2 text-[10px] transition ${
                  isActive
                    ? "text-violet-400"
                    : "text-slate-600 hover:text-slate-300"
                }`
              }
            >
              <Icon size={19} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}

      </div>
    </nav>
  );
}

export default MobileNav;