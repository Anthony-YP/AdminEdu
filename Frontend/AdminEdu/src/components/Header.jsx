
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";


export default function Header() {

    const { user, isAuthenticated, hasGroup, logout } = useAuth();
    const navigate = useNavigate();


    const handleLogout = () => {
        logout();
        navigate("/login");
    };


    return (
        <nav className="bg-slate-900 text-white shadow-md border-b border-slate-700">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo y links izquierda */}
                    <div className="flex items-center space-x-8">
                        <Link to="/" className="text-xl font-bold hover:text-gray-300 transition">
                            🏫 AdminEdu
                        </Link>

                        {isAuthenticated && (
                            <div className="flex space-x-4">
                                <Link
                                    to="/dashboard"
                                    className="hover:bg-gray-700 px-3 py-2 rounded-md text-sm transition"
                                >
                                    Dashboard
                                </Link>

                                {hasGroup(['Director', 'Secretaria', 'Docente']) && (
                                    <Link
                                        to="/cursos"
                                        className="hover:bg-gray-700 px-3 py-2 rounded-md text-sm transition"
                                    >
                                        Cursos
                                    </Link>
                                )}

                                {hasGroup(['Director']) && (
                                    <Link
                                        to="/usuarios"
                                        className="hover:bg-gray-700 px-3 py-2 rounded-md text-sm transition"
                                    >
                                        Usuarios
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Botones derecha */}
                    <div className="flex items-center space-x-4">
                        {isAuthenticated ? (
                            <>
                                <span className="text-sm text-gray-300">
                                    {user?.username}
                                    <span className="ml-2 bg-blue-600 text-xs px-2 py-1 rounded-full">
                                        {user?.grupos?.[0] || "Sin rol"}
                                    </span>
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm transition"
                                >
                                    Salir
                                </button>
                            </>
                        ) : (
                            <Link
                                to="/login"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm transition"
                            >
                                Iniciar Sesión
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
