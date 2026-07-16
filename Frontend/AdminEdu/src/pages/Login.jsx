import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { login } from "../api/auth";


const TIPOS_ERROR = {
    CREDENCIALES: "Usuario o contraseña incorrectos",
    INACTIVO: "Esta cuenta está desactivada. Contacte al administrador.",
    SERVER: "Error del servidor. Intente nuevamente.",
    RED: "Error de conexión. Verifique su internet.",
    VALIDACION: "Complete todos los campos requeridos.",
};


export default function Login() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState({ mensaje: "", tipo: "" });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { user, isAuthenticated, login: loginUser } = useAuth();
    const navigate = useNavigate();

    // Redirigir si ya está autenticado
    useEffect(() => {
        if (isAuthenticated) {
            navigate("/dashboard", { replace: true });
        }
    }, [isAuthenticated, navigate]);


    const validarFormulario = () => {
        if (!username.trim() || !password.trim()) {
            setError({
                mensaje: TIPOS_ERROR.VALIDACION,
                tipo: "warning",
            });
            return false;
        }
        if (username.trim().length < 3) {
            setError({
                mensaje: "El usuario debe tener al menos 3 caracteres",
                tipo: "warning",
            });
            return false;
        }
        if (password.length < 4) {
            setError({
                mensaje: "La contraseña debe tener al menos 4 caracteres",
                tipo: "warning",
            });
            return false;
        }
        return true;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError({ mensaje: "", tipo: "" });

        if (!validarFormulario()) return;

        setLoading(true);

        try {
            const response = await login(username.trim(), password);
            loginUser(response.data);
            navigate("/dashboard", { replace: true });
        } catch (error) {
            console.error("Error de login:", error);

            if (error.code === "ERR_NETWORK" || error.message?.includes("Network")) {
                setError({
                    mensaje: TIPOS_ERROR.RED,
                    tipo: "error",
                });
            } else if (error.response?.status === 401) {
                setError({
                    mensaje: error.response.data?.detail || TIPOS_ERROR.CREDENCIALES,
                    tipo: "error",
                });
            } else if (error.response?.status >= 500) {
                setError({
                    mensaje: TIPOS_ERROR.SERVER,
                    tipo: "error",
                });
            } else if (error.response?.data?.detail?.toLowerCase().includes("inactive")) {
                setError({
                    mensaje: TIPOS_ERROR.INACTIVO,
                    tipo: "warning",
                });
            } else {
                setError({
                    mensaje: error.response?.data?.detail || TIPOS_ERROR.CREDENCIALES,
                    tipo: "error",
                });
            }
        } finally {
            setLoading(false);
        }
    };


    // Estilos del error según tipo
    const errorStyles = {
        error: "bg-red-50 border-red-200 text-red-700",
        warning: "bg-amber-50 border-amber-200 text-amber-700",
        success: "bg-green-50 border-green-200 text-green-700",
    };

    const errorIcons = {
        error: (
            <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        warning: (
            <svg className="w-5 h-5 text-amber-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
        ),
        success: (
            <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
    };


    return (
        <div className="min-h-screen flex bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            {/* Panel izquierdo - Decorativo */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 relative overflow-hidden">
                {/* Patrón de fondo */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 25% 25%, white 1px, transparent 1px),
                                         radial-gradient(circle at 75% 75%, white 1px, transparent 1px)`,
                        backgroundSize: '50px 50px'
                    }} />
                </div>

                {/* Círculos decorativos */}
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-white opacity-5 rounded-full" />
                <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-white opacity-5 rounded-full" />
                <div className="absolute top-1/3 -left-10 w-40 h-40 bg-white opacity-5 rounded-full" />

                <div className="relative z-10 flex flex-col justify-center px-16 text-white">
                    <div className="mb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                                <svg className="w-7 h-7 text-indigo-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold">AdminEdu</h1>
                                <p className="text-blue-200 text-sm">Sistema de Gestión Académica</p>
                            </div>
                        </div>
                    </div>

                    <h2 className="text-4xl font-bold mb-4 leading-tight">
                        Gestión académica
                        <br />
                        <span className="text-blue-200">simplificada</span>
                    </h2>

                    <p className="text-blue-100 text-lg mb-8 max-w-md leading-relaxed">
                        Administre cursos, matrículas, calificaciones y más desde un solo lugar.
                    </p>

                    {/* Características */}
                    <div className="space-y-4">
                        {[
                            { icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", text: "Control de acceso por roles" },
                            { icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4", text: "Gestión de cursos y paralelos" },
                            { icon: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", text: "Reportes y estadísticas" },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                                    </svg>
                                </div>
                                <span className="text-blue-100">{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Panel derecho - Formulario */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    {/* Logo en móvil */}
                    <div className="lg:hidden text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <svg className="w-9 h-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800">AdminEdu</h1>
                        <p className="text-gray-500">Sistema de Gestión Académica</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-gray-800">Iniciar Sesión</h2>
                            <p className="text-gray-500 text-sm mt-1">
                                Ingrese sus credenciales para acceder al sistema
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                            {/* Campo Usuario */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Usuario
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <input
                                        className={`w-full pl-10 pr-4 py-2.5 border ${error.tipo === "warning" ? "border-amber-300 focus:ring-amber-500" : "border-gray-300 focus:ring-blue-500"} rounded-xl focus:ring-2 focus:border-transparent outline-none text-gray-800 placeholder-gray-400 transition duration-200`}
                                        type="text"
                                        placeholder="Ingrese su usuario"
                                        value={username}
                                        onChange={e => setUsername(e.target.value)}
                                        autoFocus
                                        autoComplete="username"
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            {/* Campo Contraseña */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Contraseña
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <input
                                        className={`w-full pl-10 pr-12 py-2.5 border ${error.tipo === "warning" ? "border-amber-300 focus:ring-amber-500" : "border-gray-300 focus:ring-blue-500"} rounded-xl focus:ring-2 focus:border-transparent outline-none text-gray-800 placeholder-gray-400 transition duration-200`}
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Ingrese su contraseña"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        autoComplete="current-password"
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition duration-200"
                                        tabIndex={-1}
                                    >
                                        {showPassword ? (
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Mensaje de error */}
                            {error.mensaje && (
                                <div className={`flex items-center gap-3 p-3 rounded-xl border ${errorStyles[error.tipo] || errorStyles.error} animate-slideDown`}>
                                    {errorIcons[error.tipo] || errorIcons.error}
                                    <p className="text-sm font-medium flex-1">{error.mensaje}</p>
                                    <button
                                        type="button"
                                        onClick={() => setError({ mensaje: "", tipo: "" })}
                                        className="text-current opacity-50 hover:opacity-100 transition"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            )}

                            {/* Botón de envío */}
                            <button
                                className={`w-full py-2.5 px-4 rounded-xl font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 ${
                                    loading
                                        ? "bg-blue-400 cursor-not-allowed"
                                        : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.98]"
                                }`}
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        <span>Ingresando...</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                        </svg>
                                        <span>Iniciar Sesión</span>
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Footer */}
                        <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                            <p className="text-xs text-gray-400">
                                &copy; {new Date().getFullYear()} AdminEdu. Todos los derechos reservados.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}