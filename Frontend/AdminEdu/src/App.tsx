import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import CursosForm from "./components/CursosForm";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";
import CursosList from "./components/CursosList";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Cursos from "./pages/Cursos";
import Usuarios from "./pages/Usuarios";


function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Header />
                <Routes>

                    <Route
                        path="/"
                        element={<CursosList />}
                    />

                    <Route
                        path="/login"
                        element={<Login />}
                    />

                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute allowedGroups={['Director', 'Secretaria', 'Docente', 'Estudiante']}>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/cursos"
                        element={
                            <ProtectedRoute allowedGroups={['Director']}>
                                <Cursos />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/usuarios"
                        element={
                            <ProtectedRoute allowedGroups={['Director']}>
                                <Usuarios />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/cursos/nuevo"
                        element={
                            <ProtectedRoute
                                allowedGroups={[
                                    "Director"
                                ]}
                            >
                                <CursosForm />
                            </ProtectedRoute>
                        }
                    />

                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
