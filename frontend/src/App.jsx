import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DiaryPage from "./pages/DiaryPage";
import GestionPage from "./pages/GestionPage";
import GestionModPage from "./pages/GestionModPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/diario" element={
            <ProtectedRoute>
              <DiaryPage />
            </ProtectedRoute>
          } />
          <Route path="/gestion" element={
            <ProtectedRoute roles="Admin" fallback="/diario">
              <GestionPage />
            </ProtectedRoute>
          } />
          <Route path="/gestion-mod" element={
            <ProtectedRoute roles="Admin" fallback="/diario">
              <GestionModPage />
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

