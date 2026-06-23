import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import AppLayout from "../layouts/AppLayout";
import { motion } from "framer-motion";
import { modalSuccess, modalError } from "../services/sweetalert";
import {
  Heart,
  BookOpen,
  Target,
  PlusCircle,
  RefreshCw,
  Trash2,
  Edit3,
  X,
  CheckCircle,
} from "lucide-react";

const nameEmoji = {
  "Feliz": "😊",
  "Muy Triste": "😔",
  "Neutral": "😐",
  "Muy Feliz": "😄",
  "Triste": "😞",
};

function DiaryPage() {
  const { user } = useAuth();

  const [emotions, setEmotions] = useState([]);
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [diaryText, setDiaryText] = useState("");
  const [entries, setEntries] = useState([]);
  const [objectives, setObjectives] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [diaryId, setDiaryId] = useState(null);

  const [newObjective, setNewObjective] = useState({
    name: "",
    description: "",
    state: "En progreso",
  });

  const [updateObjective, setUpdateObjective] = useState({
    id: "",
    name: "",
    description: "",
    state: "En progreso",
  });

  const fetchDiary = useCallback(async () => {
    try {
      const res = await api.get("/api/diary/my-diary/");
      if (res.data.length > 0) setDiaryId(res.data[0].id);
    } catch { /* silent */ }
  }, []);

  const fetchEmotions = useCallback(async () => {
    try { const res = await api.get("/api/diary/emotions/"); setEmotions(res.data); } catch { /* silent */ }
  }, []);

  const fetchEntries = useCallback(async () => {
    try { const res = await api.get("/api/diary/my-entries/"); setEntries(res.data); } catch { /* silent */ }
  }, []);

  const fetchObjectives = useCallback(async () => {
    try { const res = await api.get("/api/diary/my-objectives/"); setObjectives(res.data); } catch { /* silent */ }
  }, []);

  useEffect(() => {
    fetchDiary();
    fetchEmotions();
    fetchEntries();
    fetchObjectives();
  }, [fetchDiary, fetchEmotions, fetchEntries, fetchObjectives]);

  const handleRegisterEntry = async () => {
    if (selectedEmotion === null) { modalError("Seleccioná una emoción"); return; }
    if (!diaryId) { modalError("No se encontró tu diario. ¿Tenés un diario asignado?"); return; }
    setLoading(true);
    try {
      await api.post("/api/diary/my-entries/", { emotion: selectedEmotion, description: diaryText.trim(), diary: diaryId });
      setSelectedEmotion(null); setDiaryText(""); fetchEntries();
      modalSuccess("Entrada registrada");
    } catch (err) { modalError(err.response?.data?.detail || "Error al registrar entrada"); }
    finally { setLoading(false); }
  };

  const handleCreateObjective = async () => {
    if (!newObjective.name.trim()) { modalError("El nombre del objetivo es obligatorio"); return; }
    setLoading(true);
    try {
      await api.post("/api/diary/my-objectives/", newObjective);
      setNewObjective({ name: "", description: "", state: "En progreso" }); fetchObjectives();
      modalSuccess("Objetivo creado");
    } catch (err) { modalError(err.response?.data?.detail || "Error al crear objetivo"); }
    finally { setLoading(false); }
  };

  const handleUpdateObjective = async () => {
    if (!updateObjective.id) { modalError("Seleccioná un objetivo"); return; }
    setLoading(true);
    try {
      await api.put(`/api/diary/my-objectives/${updateObjective.id}/`, updateObjective);
      setShowUpdateForm(false);
      setUpdateObjective({ id: "", name: "", description: "", state: "En progreso" }); fetchObjectives();
      modalSuccess("Objetivo actualizado");
    } catch (err) { modalError(err.response?.data?.detail || "Error al actualizar"); }
    finally { setLoading(false); }
  };

  const handleDeleteObjective = async () => {
    if (!updateObjective.id) { modalError("Seleccioná un objetivo"); return; }
    setLoading(true);
    try {
      await api.delete(`/api/diary/my-objectives/${updateObjective.id}/`);
      setShowUpdateForm(false);
      setUpdateObjective({ id: "", name: "", description: "", state: "En progreso" }); fetchObjectives();
      modalSuccess("Objetivo eliminado");
    } catch (err) { modalError(err.response?.data?.detail || "Error al eliminar"); }
    finally { setLoading(false); }
  };

  const selectObjectiveForUpdate = (id) => {
    const obj = objectives.find((o) => o.id === Number(id));
    if (obj) setUpdateObjective({ id: obj.id, name: obj.name, description: obj.description || "", state: obj.state });
  };

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } },
  };
  const itemVariants = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } };

  return (
    <AppLayout pageTitle="Diario de Emociones" pageSubtitle="Registrá cómo te sentís" currentPage="diario">
      <motion.div initial="hidden" animate="visible" variants={variants} className="space-y-6">

        {/* SECCIÓN 1: EMOCIONES */}
        <motion.div variants={itemVariants}>
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-1" style={{ color: "#4B0082" }}>
              <Heart size={22} /> ¿Cómo te sentís ahora?
            </h3>
            <p className="text-gray-500 text-sm mb-4">Elegí la emoción con la que te identificás</p>

            {emotions.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">Cargando emociones...</p>
            ) : (
              <div className="flex flex-wrap gap-3 justify-center my-4">
                {emotions.map((emotion) => {
                  const emoji = nameEmoji[emotion.name] || "💭";
                  const isSelected = selectedEmotion === emotion.id;
                  return (
                    <motion.button key={emotion.id} whileHover={{ scale: 1.1, y: -5 }} whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedEmotion(emotion.id)}
                      className="flex flex-col items-center p-4 rounded-xl cursor-pointer border-0 min-w-[80px]"
                      style={{
                        background: isSelected ? "linear-gradient(135deg, #4B0082 0%, #6a0dad 100%)" : "#f8f9fa",
                        transition: "all 0.2s",
                      }}>
                      <span className="text-3xl">{emoji}</span>
                      <span className={`text-sm font-medium mt-1 ${isSelected ? "text-white" : "text-gray-700"}`}>
                        {emotion.name}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>

        {/* SECCIÓN 2: DESCRIPCIÓN */}
        <motion.div variants={itemVariants}>
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-1" style={{ color: "#4B0082" }}>
              <BookOpen size={22} /> ¿Qué está pasando?
            </h3>
            <p className="text-gray-500 text-sm mb-3">Describí cómo te sentís (opcional)</p>
            <textarea value={diaryText} onChange={(e) => setDiaryText(e.target.value)}
              placeholder="Escribí acá lo que está ocurriendo..." rows={4}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400" />
            <div className="flex items-center justify-between mt-3">
              <span className="text-gray-400 text-xs">Esto es opcional</span>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={handleRegisterEntry} disabled={loading}
                className="flex items-center gap-2 px-6 py-2 rounded-full text-white font-medium text-sm cursor-pointer disabled:opacity-60"
                style={{ background: "linear-gradient(135deg, #4B0082 0%, #6a0dad 100%)" }}>
                {loading ? <><span className="spinner-border spinner-border-sm" /> Registrando...</>
                  : <><Heart size={16} /> Registrar</>}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* ÚLTIMAS ENTRADAS */}
        {entries.length > 0 && (
          <motion.div variants={itemVariants}>
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-bold mb-4" style={{ color: "#4B0082" }}>Tus últimas entradas</h3>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {entries.slice().reverse().slice(0, 10).map((entry) => {
                  const emoji = nameEmoji[entry.emotion_detail?.name] || "💭";
                  return (
                    <div key={entry.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                      <span className="text-2xl">{emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-800">{entry.description || "Sin descripción"}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(entry.date).toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })}
                          {" — "}{entry.emotion_detail?.name}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* SECCIÓN 3: OBJETIVOS */}
        <motion.div variants={itemVariants}>
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-1" style={{ color: "#4B0082" }}>
              <Target size={22} /> Agregar Objetivo
            </h3>
            <p className="text-gray-500 text-sm mb-4">
              Escribí un objetivo y proponete una meta. <span className="text-gray-400">(Opcional)</span>
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Nombre</label>
                <input type="text" placeholder="Nombre del objetivo" value={newObjective.name}
                  onChange={(e) => setNewObjective({ ...newObjective, name: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-300" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Estado</label>
                <select value={newObjective.state}
                  onChange={(e) => setNewObjective({ ...newObjective, state: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-300">
                  <option value="En progreso">En progreso</option>
                  <option value="Completado">Completado</option>
                  <option value="Pendiente">Pendiente</option>
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-500 mb-1">Descripción</label>
              <textarea placeholder="Describí tu objetivo..." value={newObjective.description} rows={2}
                onChange={(e) => setNewObjective({ ...newObjective, description: e.target.value })}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-300" />
            </div>
            <div className="flex flex-wrap gap-2">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={handleCreateObjective} disabled={loading}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-white font-medium text-sm cursor-pointer disabled:opacity-60"
                style={{ background: "linear-gradient(135deg, #4B0082 0%, #6a0dad 100%)" }}>
                <PlusCircle size={16} /> {loading ? "Creando..." : "Crear Objetivo"}
              </motion.button>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => setShowUpdateForm(!showUpdateForm)}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium cursor-pointer border-2"
                style={{ borderColor: "#4B0082", color: "#4B0082" }}>
                <Edit3 size={16} /> Actualizar Objetivo
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* FORM ACTUALIZAR */}
        {showUpdateForm && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: "#4B0082" }}>
                  <RefreshCw size={20} /> Actualizar Objetivo
                </h3>
                <button onClick={() => setShowUpdateForm(false)}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer">
                  <X size={18} />
                </button>
              </div>
              <p className="text-gray-500 text-sm mb-4">Actualizá o eliminá un objetivo existente.</p>
              <div className="mb-3">
                <label className="block text-xs font-semibold text-gray-500 mb-1">Seleccioná</label>
                <select value={updateObjective.id} onChange={(e) => selectObjectiveForUpdate(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-300">
                  <option value="">Seleccioná...</option>
                  {objectives.map((obj) => <option key={obj.id} value={obj.id}>{obj.name}</option>)}
                </select>
              </div>
              {updateObjective.id && (
                <>
                  <div className="mb-3">
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Nombre</label>
                    <input type="text" value={updateObjective.name}
                      onChange={(e) => setUpdateObjective({ ...updateObjective, name: e.target.value })}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-300" />
                  </div>
                  <div className="mb-3">
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Descripción</label>
                    <textarea value={updateObjective.description} rows={2}
                      onChange={(e) => setUpdateObjective({ ...updateObjective, description: e.target.value })}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-300" />
                  </div>
                  <div className="mb-3">
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Estado</label>
                    <select value={updateObjective.state}
                      onChange={(e) => setUpdateObjective({ ...updateObjective, state: e.target.value })}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-300">
                      <option value="En progreso">En progreso</option>
                      <option value="Completado">Completado</option>
                      <option value="Pendiente">Pendiente</option>
                    </select>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => setShowUpdateForm(false)}
                      className="px-4 py-2 rounded-full text-sm font-medium border-2 border-gray-300 text-gray-600 cursor-pointer">
                      Cancelar
                    </button>
                    <button onClick={handleDeleteObjective} disabled={loading}
                      className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white cursor-pointer disabled:opacity-60"
                      style={{ backgroundColor: "#dc3545" }}>
                      <Trash2 size={16} /> {loading ? "Eliminando..." : "Eliminar"}
                    </button>
                    <button onClick={handleUpdateObjective} disabled={loading}
                      className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white cursor-pointer disabled:opacity-60"
                      style={{ background: "linear-gradient(135deg, #4B0082 0%, #6a0dad 100%)" }}>
                      <CheckCircle size={16} /> {loading ? "Actualizando..." : "Actualizar"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}

        {/* LISTA DE OBJETIVOS */}
        {objectives.length > 0 && (
          <motion.div variants={itemVariants}>
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-bold mb-4" style={{ color: "#4B0082" }}>Tus objetivos</h3>
              <div className="space-y-2">
                {objectives.map((obj) => (
                  <div key={obj.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-800">{obj.name}</p>
                      {obj.description && <p className="text-xs text-gray-500 truncate">{obj.description}</p>}
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ml-2 shrink-0 ${
                      obj.state === "Completado" ? "bg-green-100 text-green-700" :
                      obj.state === "En progreso" ? "bg-purple-100 text-purple-700" :
                      "bg-gray-100 text-gray-600"
                    }`}>
                      {obj.state}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </AppLayout>
  );
}

export default DiaryPage;
