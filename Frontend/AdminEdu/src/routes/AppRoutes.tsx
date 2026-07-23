import {
    Routes,
    Route,
} from "react-router-dom";

import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";

import MainLayout from "../layouts/MainLayout";
import AspiranteLayout from "../components/aspirante/Layout/AspiranteLayout";

// Públicas
import LandingPage from "../pages/landing/LandingPage";
import Login from "../pages/Login";
import OAuthCallback from "../pages/auth/OAuthCallback";
import Forbidden from "../pages/Forbidden";

// Privadas — Dashboard (roles institucionales)
import Dashboard from "../pages/Dashboard";

// Privadas — Aspirante
import DashboardAspirante from "../pages/aspirante/DashboardAspirante";
import CursosDisponibles from "../pages/aspirante/CursosDisponibles";
import DetalleCurso from "../pages/aspirante/DetalleCurso";
import SolicitudesPage from "../pages/aspirante/SolicitudesPage";
import Credenciales from "../pages/aspirante/Credenciales";

export default function AppRoutes() {
    return (
        <Routes>
            {/* ========================= */}
            {/* RUTAS PÚBLICAS             */}
            {/* ========================= */}
            <Route element={<PublicRoute />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
            </Route>

            <Route path="/oauth-callback" element={<OAuthCallback />} />
            <Route path="/403" element={<Forbidden />} />

            {/* ========================= */}
            {/* RUTAS PRIVADAS — INSTITUCIONALES */}
            {/* ========================= */}
            <Route element={<ProtectedRoute roles={["Director", "Secretaria", "Docente", "Estudiante", "Representante"]} />}>
                <Route element={<MainLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                </Route>
            </Route>

            {/* ========================= */}
            {/* RUTAS PRIVADAS — ASPIRANTE */}
            {/* ========================= */}
            <Route element={<ProtectedRoute roles={["Aspirante"]} />}>
                <Route element={<AspiranteLayout />}>
                    <Route path="/aspirante" element={<DashboardAspirante />} />
                    <Route path="/aspirante/cursos" element={<CursosDisponibles />} />
                    <Route path="/aspirante/cursos/:id" element={<DetalleCurso />} />
                    <Route path="/aspirante/solicitudes" element={<SolicitudesPage />} />
                    <Route path="/aspirante/credenciales" element={<Credenciales />} />
                </Route>
            </Route>
        </Routes>
    );
}
