import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const nav = [
  { to: "/", label: "Dashboard" },
  { to: "/tasks", label: "Tasks" },
  { to: "/goals", label: "Goals" },
  { to: "/analytics", label: "Analytics" },
  { to: "/assistant", label: "Assistant" }
];

export function Layout() {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen lg:flex">
      <aside className="border-b border-slate-200 bg-white lg:w-60 lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between p-5">
          <span className="text-lg font-bold text-brand-600">Vibe2Ship</span>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:px-3">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium ${
                  isActive ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-100"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <h1 className="text-sm text-slate-500">Your AI productivity companion</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">{user?.name}</span>
            <button onClick={logout} className="text-sm text-slate-500 hover:text-red-600">
              Sign out
            </button>
          </div>
        </header>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
