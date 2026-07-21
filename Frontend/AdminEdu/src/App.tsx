import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Cursos from "./pages/Cursos";
import CursosForm from "./components/CursosForm";
import Usuarios from "./pages/Usuarios";
import Academias from "./pages/Academias";
import Paralelos from "./pages/Paralelos";

import OAuthCallback from './pages/OAuthCallback';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Public Route */}
                    <Route path="/login" element={<Login />} />
                    
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
                                                <Route path="/" element={<Navigate to="/dashboard" replace />} />
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
