import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Protege una ruta según el rol del usuario.
 *
 * @param {object} props
 * @param {string|string[]} props.roles - Rol(es) permitido(s). Si no se pasa, solo requiere autenticación.
 * @param {React.ReactNode} props.children - Componente a renderizar si tiene permiso.
 * @param {string} [props.fallback="/"] - Ruta de redirección si no tiene permiso.
 */
export default function ProtectedRoute({ roles, children, fallback = "/" }) {
  const { isAuthenticated, loading, roleName } = useAuth();

  // Mientras restaura sesión, no mostrar nada (evita flicker)
  if (loading) return null;

  // No autenticado → login
  if (!isAuthenticated) return <Navigate to="/" replace />;

  // Si no se exige rol específico, pasa
  if (!roles) return children;

  // Verificar rol
  const allowed = Array.isArray(roles) ? roles : [roles];
  if (!allowed.includes(roleName)) {
    return <Navigate to={fallback} replace />;
  }

  return children;
}
