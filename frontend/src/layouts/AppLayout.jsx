import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, X, LogOut, BookHeart, ChartLine, Calendar, Bot, User } from "lucide-react";

const navByRole = {
  Aprendiz: [
    { id: "diario", label: "Diario de\nEmociones", icon: BookHeart, path: "/diario" },
    { id: "seguimiento", label: "Seguimiento\ndel Diario", icon: ChartLine, path: "/seguimiento" },
    { id: "agenda", label: "Agenda", icon: Calendar, path: "/agenda" },
    { id: "psychobot", label: "Psychobot", icon: Bot, path: "/psychobot" },
  ],
  Psicologo: [
    { id: "psi-seguimiento", label: "Seguimiento\ndel Diario", icon: ChartLine, path: "/psi-seguimiento" },
    { id: "psi-agenda", label: "Agenda", icon: Calendar, path: "/psi-agenda" },
  ],
  Admin: [
    { id: "gestion", label: "Gestión de\nUsuarios", icon: User, path: "/gestion" },
  ],
};

export default function AppLayout({ children, pageTitle, pageSubtitle, currentPage }) {
  const { user, logout, roleName } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems = navByRole[roleName] || navByRole["Aprendiz"];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f0ff]">
      {/* Navbar superior */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-white shadow-sm z-30 flex items-center px-4">
        <button onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-gray-100 cursor-pointer mr-3">
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Brand */}
        <div className="hidden md:block pr-4 mr-4" style={{ borderRight: "1px solid #e5e7eb" }}>
          <span className="text-xl font-bold" style={{ color: "#4B0082" }}>PsychoWay</span>
        </div>

        {/* Page title */}
        <div className="flex-1">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 m-0 leading-tight">{pageTitle}</h2>
          <p className="text-xs md:text-sm text-gray-500 m-0">{pageSubtitle}</p>
        </div>

        {/* User menu */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-700 font-medium hidden sm:inline">{user?.names || "Usuario"}</span>
          <button onClick={handleLogout}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-white cursor-pointer"
            style={{ backgroundColor: "#4B0082" }}>
            <LogOut size={16} />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
      </nav>

      {/* Espacio para navbar fijo */}
      <div className="h-16" />

      {/* Cuerpo: sidebar + contenido */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? "w-56" : "w-0"} transition-all duration-200 bg-white shadow-sm overflow-hidden flex-shrink-0`}
          style={{ borderRight: "1px solid #e5e7eb" }}>
          <nav className="pt-8 px-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.id}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-3 rounded-lg mb-2 text-sm font-medium transition-colors no-underline ${
                      isActive || currentPage === item.id
                        ? "text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`
                  }
                  style={({ isActive }) =>
                    isActive || currentPage === item.id
                      ? { backgroundColor: "#4B0082" }
                      : {}
                  }
                >
                  <Icon size={20} />
                  <span className="whitespace-pre-line">{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </aside>

        {/* Contenido principal */}
        <main className="flex-1 bg-[#f5f0ff] min-h-[calc(100vh-4rem)]">
          <div className="max-w-5xl mx-auto px-4 py-6">
            {children}
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between text-xs text-gray-500">
          <span>Copyright &copy; PsychoWay 2026</span>
          <div className="flex gap-3">
            <a href="#!" className="text-gray-500 no-underline hover:text-gray-700">Política de Privacidad</a>
            <a href="#!" className="text-gray-500 no-underline hover:text-gray-700">Marco Legal</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
