import { useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import { motion } from "framer-motion";
import { Edit3, UserPlus, Search, Trash2, Eye, EyeOff } from "lucide-react";
import api from "../services/api";

function GestionModPage() {
  const [docSearch, setDocSearch] = useState("");
  const [userFound, setUserFound] = useState(null);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
    document: !form.document || (form.document.length >= 6 && form.document.length <= 12),
    password: !form.password || (
      form.password.length >= 8 &&
      /[A-Z]/.test(form.password) &&
      /[a-z]/.test(form.password) &&
      /[0-9]/.test(form.password) &&
      /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(form.password)
    ),
  };
  const docValido = validaciones.document;
  const passValida = validaciones.password;

  const roleMap = { "3": "aprendiz", "2": "psicologo", "1": "administrador" };
  const roleIdMap = { aprendiz: 3, psicologo: 2, administrador: 1 };

  const searchUser = async () => {
    if (!docSearch.trim()) return;
    setSearching(true); setSearchError(""); setUserFound(null); setError(""); setSuccess("");
    try {
      const res = await api.get("/api/auth/users/");
      const users = res.data;
      const found = users.find(
        (u) => String(u.document) === docSearch.trim()
      );
      if (!found) {
        setSearchError("No se encontró ningún usuario con ese documento.");
        return;
      }
      setUserFound(found);
      setForm({
        rol: roleMap[String(found.rol)] || "",
        doc_type: found.doc_type || "",
        document: found.document ? String(found.document) : "",
        names: found.names || "",
        last_names: found.last_names || "",
        birth_date: found.birth_date || "",
        email: found.email || "",
        password: "",
      });
    } catch (err) {
      setSearchError("Error al buscar usuarios. ¿Tenés permisos de administrador?");
    } finally { setSearching(false); }
  };

  const handleChange = (e) => {
    let value = e.target.value;
    if (e.target.name === "document") value = value.replace(/\D/g, "");
    setForm({ ...form, [e.target.name]: value });
    setError(""); setSuccess("");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!form.document || !form.names || !form.last_names || !form.email) {
      setError("Completá los campos obligatorios.");
      return;
    }
    if (form.password && !passValida) {
      setError("La contraseña no cumple con los requisitos de seguridad.");
      return;
    }
    setSaving(true); setError(""); setSuccess("");
    try {
      const payload = {
        doc_type: form.doc_type,
        document: form.document,
        names: form.names,
        last_names: form.last_names,
        birth_date: form.birth_date,
        email: form.email.toLowerCase().trim(),
        rol: roleIdMap[form.rol],
      };
      if (form.password) payload.password = form.password;

      await api.patch(`/api/auth/users/${userFound.id}/`, payload);
      setSuccess("Usuario actualizado correctamente.");
      setUserFound({ ...userFound, ...payload });
    } catch (err) {
      const data = err.response?.data;
      if (data) setError(Object.values(data).flat().join(". "));
      else setError("Error al actualizar usuario.");
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!window.confirm("¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer.")) return;
    setSaving(true); setError(""); setSuccess("");
    try {
      await api.delete(`/api/auth/users/${userFound.id}/`);
      setSuccess("Usuario eliminado correctamente.");
      setUserFound(null);
      setForm({ rol: "", doc_type: "", document: "", names: "", last_names: "", birth_date: "", email: "", password: "" });
      setDocSearch("");
    } catch (err) {
      setError("Error al eliminar usuario.");
    } finally { setSaving(false); }
  };

  const itemVariants = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } };

  return (
    <AppLayout pageTitle="Modificar Usuario" pageSubtitle="Buscá, editá y eliminá usuarios" currentPage="gestion">
      <motion.div initial="hidden" animate="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Panel principal */}
          <motion.div variants={itemVariants} className="lg:w-2/3">
            <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
              {/* Buscador */}
              <div className="mb-6">
                <label className="block text-xs font-semibold text-gray-500 mb-1">Buscar por documento</label>
                <div className="flex gap-2">
                  <input type="text" placeholder="123456789" value={docSearch}
                    onChange={(e) => setDocSearch(e.target.value.replace(/\D/g, ""))}
                    onKeyDown={(e) => e.key === "Enter" && searchUser()}
                    maxLength={12}
                    className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-300" />
                  <motion.button whileTap={{ scale: 0.95 }}
                    onClick={searchUser} disabled={searching}
                    className="px-4 py-2 rounded-xl text-white font-medium text-sm cursor-pointer disabled:opacity-60 flex items-center gap-1"
                    style={{ background: "linear-gradient(135deg, #4B0082 0%, #6a0dad 100%)" }}>
                    <Search size={16} /> {searching ? "Buscando..." : "Buscar"}
                  </motion.button>
                </div>
                {searchError && <p className="text-red-500 text-xs mt-1">{searchError}</p>}
              </div>

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

              {userFound && (
                <form onSubmit={handleUpdate}>
                  <h4 className="text-base font-semibold mb-4" style={{ color: "#4B0082" }}>
                    Editando: {form.names} {form.last_names}
                  </h4>

                  <div className="mb-4">
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Rol del Usuario</label>
                    <select name="rol" value={form.rol} onChange={handleChange}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-300">
                      <option value="aprendiz">Aprendiz</option>
                      <option value="psicologo">Psicólogo</option>
                      <option value="administrador">Administrador</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Documento</label>
                    <input type="text" name="document" value={form.document}
                      onChange={handleChange} maxLength={12} required
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-300" />
                  </div>

                  <div className="mb-4">
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Tipo de documento</label>
                    <select name="doc_type" value={form.doc_type} onChange={handleChange}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-300">
                      <option value="TI">Tarjeta de Identidad</option>
                      <option value="CC">Cédula de Ciudadanía</option>
                      <option value="CE">Cédula de Extranjería</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Nombres</label>
                      <input type="text" name="names" value={form.names} onChange={handleChange} required
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-300" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Apellidos</label>
                      <input type="text" name="last_names" value={form.last_names} onChange={handleChange} required
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-300" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Fecha de nacimiento</label>
                      <input type="date" name="birth_date" value={form.birth_date} onChange={handleChange}
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-300" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Correo</label>
                      <input type="email" name="email" value={form.email} onChange={handleChange} required
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-300" />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-xs font-semibold text-gray-500 mb-1">
                      Nueva contraseña <span className="text-gray-400 font-normal">(dejá vacío para no cambiar)</span>
                    </label>
                    <div className="flex">
                      <input type={showPassword ? "text" : "password"} name="password" placeholder="********"
                        value={form.password} onChange={handleChange}
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-l-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-300" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="flex items-center px-3 bg-white border-2 border-l-0 border-gray-200 rounded-r-xl cursor-pointer">
                        {showPassword ? <EyeOff size={16} className="text-gray-400" /> : <Eye size={16} className="text-gray-400" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      type="submit" disabled={saving}
                      className="flex-1 py-2 px-5 rounded-full text-white font-medium text-sm cursor-pointer disabled:opacity-60"
                      style={{ background: "linear-gradient(135deg, #4B0082 0%, #6a0dad 100%)" }}>
                      <Edit3 size={16} className="inline mr-2" /> {saving ? "Guardando..." : "Guardar Cambios"}
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      type="button" onClick={handleDelete} disabled={saving}
                      className="py-2 px-5 rounded-full text-white font-medium text-sm cursor-pointer disabled:opacity-60 flex items-center gap-1"
                      style={{ background: "linear-gradient(135deg, #dc2626 0%, #ef4444 100%)" }}>
                      <Trash2 size={16} /> Eliminar
                    </motion.button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div variants={itemVariants} className="lg:w-1/3">
            <div className="bg-white rounded-2xl shadow-sm p-4 sticky top-24">
              <div className="flex flex-col gap-2">
                <Link to="/gestion"
                  className="flex items-center gap-2 p-3 rounded-xl font-semibold text-gray-700 no-underline hover:bg-gray-50 transition-colors">
                  <UserPlus size={16} className="text-gray-400" /> Crear usuario
                </Link>
                <span className="flex items-center gap-2 p-3 rounded-xl font-semibold text-white"
                  style={{ background: "linear-gradient(135deg, #4B0082 0%, #6a0dad 100%)" }}>
                  <Edit3 size={16} /> Modificar usuario
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AppLayout>
  );
}

export default GestionModPage;
