import { createContext, useContext, useState, useEffect, useMemo } from "react";
import api from "../services/api";
import { resolveRoleName } from "../config/roles";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Al iniciar, restaurar sesión si hay token guardado
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem("auth_token");
      const savedUser = localStorage.getItem("auth_user");

      if (token && savedUser) {
        try {
          // Verificar que el token sigue siendo válido
          // Obtenemos los datos actualizados del usuario
          const userData = JSON.parse(savedUser);
          const response = await api.get(`/api/auth/users/${userData.id}/`);
          setUser(response.data);
          localStorage.setItem("auth_user", JSON.stringify(response.data));
        } catch {
          // Token inválido o servidor caído, usar datos guardados temporalmente
          try {
            setUser(JSON.parse(savedUser));
          } catch {
            localStorage.removeItem("auth_token");
            localStorage.removeItem("auth_user");
          }
        }
      }
      setLoading(false);
    };

    restoreSession();
  }, []);

  const login = async (document, password) => {
    // 1. Obtener token JWT
    const tokenRes = await api.post("/api/auth/token/", {
      document,
      password,
    });

    const { access, refresh } = tokenRes.data;

    // Guardar token
    localStorage.setItem("auth_token", access);
    localStorage.setItem("auth_refresh", refresh);

    // 2. Decodificar el payload del token para obtener user_id
    const payload = JSON.parse(atob(access.split(".")[1]));
    const userId = payload.user_id;

    // 3. Obtener datos del usuario
    const userRes = await api.get(`/api/auth/users/${userId}/`);
    const userData = userRes.data;

    localStorage.setItem("auth_user", JSON.stringify(userData));
    setUser(userData);

    return userData;
  };

  const register = async (userData) => {
    const res = await api.post("/api/auth/users/", userData);
    return res.data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_refresh");
    localStorage.removeItem("auth_user");
  };

  const roleName = useMemo(() => (user ? resolveRoleName(user.rol) : null), [user]);

  const hasRole = (roles) => {
    if (!roleName) return false;
    if (typeof roles === "string") return roleName === roles;
    return roles.includes(roleName);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    hasRole,
    roleName,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
}

export default AuthContext;
