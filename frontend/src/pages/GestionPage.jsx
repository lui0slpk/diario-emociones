import { useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import { motion } from "framer-motion";
import { UserPlus, Edit3, Eye, EyeOff } from "lucide-react";
import api from "../services/api";

function GestionPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    rol: "",
    doc_type: "",
    document: "",
    names: "",
    last_names: "",
    birth_date: "",
    email: "",
    password: "",
  });

  const validaciones = {
    document: { longitud: form.document.length >= 6 && form.document.length <= 12 },
    password: {
      minCaracteres: form.password.length >= 8,
      tieneMayuscula: /[A-Z]/.test(form.password),
      tieneMinuscula: /[a-z]/.test(form.password),
      tieneNumero: /[0-9]/.test(form.password),
      tieneEspecial: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(form.password),
    },
  };

  const documentValido = Object.values(validaciones.document).every(Boolean);
  const passwordValida = Object.values(validaciones.password).every(Boolean);

  const Regla = ({ ok, texto }) => (
    <span className={`block text-xs ${ok ? "text-green-600" : "text-red-500"}`}>
      {ok ? "✅" : "❌"} {texto}
    </span>
  );

  const handleChange = (e) => {
    let value = e.target.value;
    if (e.target.name === "document") value = value.replace(/\D/g, "");
    setForm({ ...form, [e.target.name]: value });
    setTouched({ ...touched, [e.target.name]: true });
    setError(""); setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ document: true, password: true });
    if (!passwordValida || !documentValido || !form.rol) {
      setError("Corregí los errores antes de continuar.");
      return;
    }
    setLoading(true); setError(""); setSuccess("");
    try {
      // Mapear nombre del rol a ID
      const roleMap = { aprendiz: 3, psicologo: 2, administrador: 1 };
      await api.post("/api/auth/users/", {
        ...form,
        rol: roleMap[form.rol],
        email: form.email.toLowerCase().trim(),
      });
      setSuccess("Usuario creado correctamente.");
      setForm({ rol: "", doc_type: "", document: "", names: "", last_names: "", birth_date: "", email: "", password: "" });
      setTouched({});
    } catch (err) {
      const data = err.response?.data;
      if (data) setError(Object.values(data).flat().join(". "));
      else setError("Error al crear usuario.");
    } finally { setLoading(false); }
  };

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } },
  };
  const itemVariants = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } };

  return (
    <AppLayout pageTitle="Gestión de Usuarios" pageSubtitle="Creá, modificá y eliminá usuarios" currentPage="gestion">
      <motion.div initial="hidden" animate="visible" variants={variants}>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Formulario de creación */}
          <motion.div variants={itemVariants} className="lg:w-2/3">
            <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
              <h3 className="text-lg font-bold flex items-center gap-2 mb-1" style={{ color: "#4B0082" }}>
                <UserPlus size={20} /> Crear una Cuenta
              </h3>
              <p className="text-gray-500 text-sm mb-6">Registrá un nuevo usuario en el sistema</p>

              {error && (
                <div className="flex items-center gap-2 bg-red-100 text-red-700 rounded-lg px-4 py-2 mb-4 text-sm">
                  <span>{error}</span>
                  <button onClick={() => setError("")} className="ml-auto text-red-500 font-bold cursor-pointer">&times;</button>
                </div>
              )}
              {success && (
                <div className="flex items-center gap-2 bg-green-100 text-green-700 rounded-lg px-4 py-2 mb-4 text-sm">
                  <span>{success}</span>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Rol del Usuario <span className="text-red-500">*</span></label>
                  <select name="rol" value={form.rol} onChange={handleChange} required
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-300">
                    <option value="">Seleccioná</option>
                    <option value="aprendiz">Aprendiz</option>
                    <option value="psicologo">Psicólogo</option>
                    <option value="administrador">Administrador</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Documento <span className="text-red-500">*</span></label>
                  <input type="text" name="document" placeholder="123456789" value={form.document}
                    onChange={handleChange} maxLength={12} required
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-300" />
                  {touched.document && <Regla ok={validaciones.document.longitud} texto="Entre 6 y 12 números" />}
                </div>

                <div className="mb-4">
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Tipo de documento <span className="text-red-500">*</span></label>
                  <select name="doc_type" value={form.doc_type} onChange={handleChange} required
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-300">
                    <option value="">Seleccioná</option>
                    <option value="TI">Tarjeta de Identidad</option>
                    <option value="CC">Cédula de Ciudadanía</option>
                    <option value="CE">Cédula de Extranjería</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Nombres <span className="text-red-500">*</span></label>
                    <input type="text" name="names" placeholder="Kevin" value={form.names}
                      onChange={handleChange} required
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-300" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Apellidos <span className="text-red-500">*</span></label>
                    <input type="text" name="last_names" placeholder="Chaverra" value={form.last_names}
                      onChange={handleChange} required
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-300" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Fecha de nacimiento <span className="text-red-500">*</span></label>
                    <input type="date" name="birth_date" value={form.birth_date} onChange={handleChange} required
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-300" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Correo <span className="text-red-500">*</span></label>
                    <input type="email" name="email" placeholder="correo@ejemplo.com" value={form.email}
                      onChange={handleChange} required
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-300" />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Contraseña <span className="text-red-500">*</span></label>
                  <div className="flex">
                    <input type={showPassword ? "text" : "password"} name="password" placeholder="********"
                      value={form.password} onChange={handleChange} required
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-l-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-300" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="flex items-center px-3 bg-white border-2 border-l-0 border-gray-200 rounded-r-xl cursor-pointer">
                      {showPassword ? <EyeOff size={16} className="text-gray-400" /> : <Eye size={16} className="text-gray-400" />}
                    </button>
                  </div>
                  {touched.password && (
                    <div className="mt-1">
                      <p className="text-xs text-gray-500 mb-1">La contraseña debe contener:</p>
                      <Regla ok={validaciones.password.minCaracteres} texto="Mínimo 8 caracteres" />
                      <Regla ok={validaciones.password.tieneMayuscula} texto="Al menos 1 mayúscula" />
                      <Regla ok={validaciones.password.tieneMinuscula} texto="Al menos 1 minúscula" />
                      <Regla ok={validaciones.password.tieneNumero} texto="Al menos 1 número" />
                      <Regla ok={validaciones.password.tieneEspecial} texto="Al menos 1 carácter especial" />
                    </div>
                  )}
                </div>

                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  type="submit" disabled={loading}
                  className="w-full py-2 px-5 rounded-full text-white font-medium text-sm cursor-pointer disabled:opacity-60"
                  style={{ background: "linear-gradient(135deg, #4B0082 0%, #6a0dad 100%)" }}>
                  <UserPlus size={16} className="inline mr-2" /> {loading ? "Creando..." : "Crear Cuenta"}
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* Sidebar de navegación */}
          <motion.div variants={itemVariants} className="lg:w-1/3">
            <div className="bg-white rounded-2xl shadow-sm p-4 sticky top-24">
              <div className="flex flex-col gap-2">
                <span className="flex items-center gap-2 p-3 rounded-xl font-semibold text-white"
                  style={{ background: "linear-gradient(135deg, #4B0082 0%, #6a0dad 100%)" }}>
                  <UserPlus size={16} /> Crear usuario
                </span>
                <Link to="/gestion-mod"
                  className="flex items-center gap-2 p-3 rounded-xl font-semibold text-gray-700 no-underline hover:bg-gray-50 transition-colors">
                  <Edit3 size={16} className="text-gray-400" /> Modificar usuario
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AppLayout>
  );
}

export default GestionPage;
