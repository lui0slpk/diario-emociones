import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { resolveRoleName } from "../config/roles";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ documento: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showError, setShowError] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const mostrarError = (msg) => {
    setErrorMsg(msg);
    setShowError(true);
    setTimeout(() => setShowError(false), 5000);
  };

  const mostrarExito = (msg) => {
    setSuccessMsg(msg);
    setShowSuccess(true);
  };

  const handleChange = (e) => {
    if (showError) setShowError(false);
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.documento, form.password);
      const nombre = user.names || "usuario";
      mostrarExito(`¡Bienvenido/a, ${nombre}!`);
      const roleName = resolveRoleName(user.rol);
      const roleRoutes = {
        Aprendiz: "/diario",
        Psicologo: "/psi-seguimiento",
        Admin: "/gestion",
      };
      setTimeout(() => navigate(roleRoutes[roleName] || "/diario"), 1500);
    } catch (err) {
      mostrarError(
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Documento o contraseña incorrectos."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[#f5f0ff]">
      {/* Animaciones */}
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          15% { transform: translateX(-6px); }
          30% { transform: translateX(6px); }
          45% { transform: translateX(-4px); }
          60% { transform: translateX(4px); }
          75% { transform: translateX(-2px); }
          90% { transform: translateX(2px); }
        }
        .anim-error {
          animation: slideDown 0.35s ease-out, shake 0.5s ease-in-out 0.35s;
        }
        .anim-success {
          animation: slideDown 0.35s ease-out;
        }
      `}</style>

      {/* Card principal */}
      <div className="flex max-w-[960px] w-[95%] shadow-lg rounded-2xl overflow-hidden bg-white">
        
        {/* Lado izquierdo - decorativo (solo desktop) */}
        <div className="hidden md:flex w-1/2 bg-gray-50 items-center justify-center p-4">
          <div className="text-center">
            <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="#4B0082" strokeWidth="1" className="mb-3 mx-auto">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            <h3 className="font-bold text-2xl" style={{ color: "#4B0082" }}>PsychoWay</h3>
            <p className="text-gray-500">Tu diario emocional inteligente</p>
          </div>
        </div>

        {/* Lado derecho - formulario */}
        <div className="w-full md:w-1/2 bg-white p-5 flex flex-col justify-center">
          {/* Contenedor púrpura con el formulario */}
          <div className="rounded-[20px] pt-[50px] px-2" style={{ backgroundColor: "#4B0082" }}>
            <div className="px-4 pb-5">
              <h3 className="font-bold text-xl mb-2 text-white">
                Iniciar Sesión en <br />
                <span>PsychoWay</span>
              </h3>
              <p className="text-gray-200 text-sm mb-4">
                Inicia sesión con tu documento de <br />
                identidad y contraseña
              </p>

              <form onSubmit={handleSubmit}>
                {/* Error alert */}
                {showError && (
                  <div className="anim-error flex items-center gap-2 bg-red-100 text-red-700 rounded-lg px-3 py-2 mb-3 text-sm">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                      <line x1="12" y1="9" x2="12" y2="13" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                    <span className="flex-1">{errorMsg}</span>
                    <button type="button" onClick={() => setShowError(false)}
                      className="text-red-500 hover:text-red-700 text-lg leading-none">&times;</button>
                  </div>
                )}

                {/* Success alert */}
                {showSuccess && (
                  <div className="anim-success flex items-center gap-2 rounded-lg px-3 py-2 mb-3 text-sm font-medium"
                    style={{ backgroundColor: "#e8dff5", color: "#4B0082" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    <span>{successMsg}</span>
                  </div>
                )}

                {/* Documento */}
                <div className="mb-3">
                  <label htmlFor="documento" className="block text-white text-sm font-medium mb-1">
                    Documento de identidad
                  </label>
                  <div className="flex">
                    <span className="flex items-center px-3 bg-white border border-r-0 rounded-l-md">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4B0082" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </span>
                    <input
                      id="documento"
                      type="text"
                      placeholder="123456789"
                      value={form.documento}
                      onChange={handleChange}
                      required
                      className="bg-white w-full px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400 text-sm"
                    />
                  </div>
                </div>

                {/* Contraseña */}
                <div className="mb-3">
                  <label htmlFor="password" className="block text-white text-sm font-medium mb-1">
                    Contraseña
                  </label>
                  <div className="flex">
                    <span className="flex items-center px-3 bg-white border border-r-0 rounded-l-md">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4B0082" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </span>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="********"
                      value={form.password}
                      onChange={handleChange}
                      required
                      className="bg-white w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="flex items-center px-3 bg-white border border-l-0 rounded-r-md cursor-pointer"
                      onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = "#e8cdff")}
                      onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = "white")}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4B0082" strokeWidth="2">
                        {showPassword ? (
                          <>
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                            <line x1="1" y1="1" x2="23" y2="23" />
                          </>
                        ) : (
                          <>
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </>
                        )}
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Olvidó contraseña */}
                <div className="mb-3">
                  <Link to="/recuperar-password" className="text-white font-bold text-sm no-underline">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>

                {/* Botón */}
                <div className="mb-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 px-4 rounded-lg font-bold text-sm cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{ backgroundColor: loading ? "#8a5cb0" : "white", color: "#3a0068" }}
                    onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = "#e8cdff")}
                    onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = "white")}
                  >
                    {loading ? "Ingresando..." : "Iniciar sesión"}
                  </button>
                </div>

                <hr className="border-gray-400 my-3" />

                <div className="text-center text-sm">
                  <span className="text-gray-200">¿No tienes una cuenta? </span>
                  <Link to="/registro" className="text-white font-bold no-underline">
                    Crea una cuenta
                  </Link>
                </div>

                <div className="text-center mt-4 text-xs text-gray-300">
                  PsychoWay &copy; 2026
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
