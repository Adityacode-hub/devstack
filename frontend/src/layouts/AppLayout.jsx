import { useState } from "react";

import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import MobileNav from "../components/layout/MobileNav";

function AppLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar onMenuClick={() => setMobileOpen(true)} />

      <div className="flex min-h-[calc(100vh-4rem)]">
        <Sidebar
          mobileOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
        />

        <main className="min-w-0 flex-1 bg-slate-950 pb-20 lg:pb-0">
          {children}
        </main>
      </div>

      <MobileNav />
    </div>
  );
}

export default AppLayout;