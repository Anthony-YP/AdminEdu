import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";

// Pages
import Home from "./pages/Home";
import CursosDisponibles from "./pages/CursosDisponibles";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Cursos from "./pages/Cursos";
import CursosForm from "./components/CursosForm";
import Usuarios from "./pages/Usuarios";
import Academias from "./pages/Academias";
import Paralelos from "./pages/Paralelos";
import Personas from "./pages/Personas";
import EstudianteDashboard from "./pages/EstudianteDashboard";
import EstudiantePerfil from "./pages/EstudiantePerfil";
import EstudianteMatriculas from "./pages/EstudianteMatriculas";
import EstudianteHistorial from "./pages/EstudianteHistorial";
import EstudianteNotificaciones from "./pages/EstudianteNotificaciones";

import OAuthCallback from './pages/OAuthCallback';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/cursos-disponibles" element={<CursosDisponibles />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    
                    {/* Protected Routes Wrapper */}
                    <Route 
                        path="/*" 
                        element={
                            <ProtectedRoute>
                                <div className="flex h-screen bg-gray-50 overflow-hidden">
                                    <Header />
                                    <main className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden">
                                        <div className="p-6 lg:p-8 max-w-7xl mx-auto w-full">
                                            <Routes>
                                                <Route path="/dashboard" element={<Dashboard />} />
                                                
                                                {/* Academias (Solo Director) */}
                                                <Route path="/academias" element={<ProtectedRoute allowedGroups={['Director']}><Academias /></ProtectedRoute>} />
                                                
                                                {/* Cursos */}
                                                <Route path="/cursos" element={<ProtectedRoute allowedGroups={['Director', 'Secretaria', 'Docente']}><Cursos /></ProtectedRoute>} />
                                                <Route path="/cursos/nuevo" element={<ProtectedRoute allowedGroups={['Director']}><CursosForm /></ProtectedRoute>} />
                                                <Route path="/cursos/:id/editar" element={<ProtectedRoute allowedGroups={['Director']}><CursosForm /></ProtectedRoute>} />
                                                
                                                {/* Paralelos */}
                                                <Route path="/paralelos" element={<ProtectedRoute allowedGroups={['Director', 'Secretaria']}><Paralelos /></ProtectedRoute>} />
                                                
                                                {/* Usuarios */}
                                                <Route path="/usuarios" element={<ProtectedRoute allowedGroups={['Director']}><Usuarios /></ProtectedRoute>} />
                                                <Route path="/personas" element={<ProtectedRoute allowedGroups={['Director', 'Secretaria', 'Docente', 'Representante']}><Personas /></ProtectedRoute>} />
                                                <Route path="/estudiante-dashboard" element={<ProtectedRoute allowedGroups={['Estudiante']}><EstudianteDashboard /></ProtectedRoute>} />
                                                <Route path="/estudiante-perfil" element={<ProtectedRoute allowedGroups={['Estudiante']}><EstudiantePerfil /></ProtectedRoute>} />
                                                <Route path="/estudiante-matriculas" element={<ProtectedRoute allowedGroups={['Estudiante']}><EstudianteMatriculas /></ProtectedRoute>} />
                                                <Route path="/estudiante-historial" element={<ProtectedRoute allowedGroups={['Estudiante']}><EstudianteHistorial /></ProtectedRoute>} />
                                                <Route path="/estudiante-notificaciones" element={<ProtectedRoute allowedGroups={['Estudiante']}><EstudianteNotificaciones /></ProtectedRoute>} />

                                                <Route path="/oauth-callback" element={<OAuthCallback />} />




                                            </Routes>
                                        </div>
                                    </main>
                                </div>
                            </ProtectedRoute>
                        } 
                    />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
