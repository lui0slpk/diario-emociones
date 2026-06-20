/**
 * Mapa de IDs de rol (del backend) a nombres simbólicos.
 *
 * El backend guarda los roles en la tabla `user_auth_rol` con IDs auto-generados.
 * - Admin se crea al ejecutar `createsuperuser` (get_or_create en UserManager)
 * - Aprendiz se crea al registrarse un usuario público (get_or_create en UserSerializer)
 * - Psicólogo se crea desde el panel de admin
 *
 * Si los IDs no coinciden, ajustá los valores. No hay endpoint de roles en el backend.
 */
export const ROLE_ID_MAP = {
  1: "Admin",
  2: "Psicologo",
  3: "Aprendiz",
};

export const ROLE_NAMES = Object.values(ROLE_ID_MAP);

/**
 * Resuelve el nombre del rol a partir del valor que devuelve el backend.
 * - Si ya es un string (ej: ya resuelto), lo devuelve
 * - Si es un número, lo mapea con ROLE_ID_MAP
 * - Si es un objeto con .name (caso improbable pero seguro), usa .name
 * - Si no se resuelve, default "Aprendiz"
 */
export function resolveRoleName(rol) {
  if (typeof rol === "string") return rol;
  if (typeof rol === "number") return ROLE_ID_MAP[rol] || "Aprendiz";
  if (rol && typeof rol === "object" && rol.name) return rol.name;
  return "Aprendiz";
}
