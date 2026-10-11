import {
  Bookmark,
  Hash,
  Home,
  Plus,
  UserRound,
  Trophy,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";

const navigation = [
  {
    label: "Overview",
    items: [
      {
        name: "Questions",
        path: "/questions",
        icon: Home,
      },
      {
        name: "Tags",
        path: "/tags",
        icon: Hash,
      },
    ],
  },
  {
    label: "Your activity",
    items: [
      {
        name: "Profile",
        path: "/profile",
        icon: UserRound,
      },
    ],
  },
];

function Sidebar({ mobileOpen, onClose }) {
  const navigate = useNavigate();

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed bottom-0 left-0 top-16 z-50
          w-64 border-r border-white/10
          bg-slate-950 px-4 py-6
          transition-transform duration-300
          lg:sticky lg:top-16 lg:z-30
          lg:block lg:h-[calc(100vh-4rem)]
          lg:translate-x-0
          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        <div className="flex h-full flex-col">

          {/* Ask Question */}
          <button
            type="button"
            onClick={() => {
              navigate("/questions/ask");
              onClose?.();
            }}
            className="
              flex w-full items-center justify-center gap-2
              rounded-xl
              bg-gradient-to-r from-violet-500 to-blue-500
              px-4 py-3
              text-sm font-semibold text-white
              shadow-lg shadow-violet-500/10
              transition
              hover:-translate-y-0.5
              hover:shadow-violet-500/20
            "
          >
            <Plus size={17} />
            Ask Question
          </button>

          {/* Navigation */}
          <nav className="mt-8 space-y-7">

            {navigation.map((section) => (
              <div key={section.label}>

                <p className="
                  mb-2 px-3
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.16em]
                  text-slate-600
                ">
                  {section.label}
                </p>

                <div className="space-y-1">

                  {section.items.map((item) => {
                    const Icon = item.icon;

                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={onClose}
                        className={({ isActive }) =>
                          `
                          group flex items-center gap-3
                          rounded-xl px-3 py-2.5
                          text-sm transition
                          ${
                            isActive
                              ? "bg-violet-500/10 text-violet-300"
                              : "text-slate-500 hover:bg-white/[0.04] hover:text-slate-200"
                          }
                          `
                        }
                      >
                        {({ isActive }) => (
                          <>
                            <Icon
                              size={17}
                              className={
                                isActive
                                  ? "text-violet-400"
                                  : "text-slate-600 group-hover:text-slate-400"
                              }
                            />

                            <span>{item.name}</span>

                            {isActive && (
                              <span className="
                                ml-auto
                                h-1.5 w-1.5
                                rounded-full
                                bg-violet-400
                              " />
                            )}
                          </>
                        )}
                      </NavLink>
                    );
                  })}

                </div>
              </div>
            ))}

          </nav>

          {/* Saved - UI only for now */}
          <div className="mt-6">
            <button
              type="button"
              className="
                group flex w-full items-center gap-3
                rounded-xl px-3 py-2.5
                text-sm text-slate-600
                transition
                hover:bg-white/[0.04]
                hover:text-slate-300
              "
            >
              <Bookmark
                size={17}
                className="text-slate-600"
              />

              <span>Saved</span>
            </button>
          </div>

          {/* Reputation */}
          <div className="mt-auto rounded-2xl border border-white/10 bg-white/[0.03] p-4">

            <div className="
              flex h-9 w-9
              items-center justify-center
              rounded-xl
              bg-amber-500/10
              text-amber-400
            ">
              <Trophy size={17} />
            </div>

            <p className="mt-3 text-sm font-semibold text-white">
              Build your reputation
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-600">
              Ask questions, share answers, and help other developers.
            </p>

          </div>

        </div>
      </aside>
    </>
  );
}

export default Sidebar;