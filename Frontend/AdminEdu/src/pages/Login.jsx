import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
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

    // ===== NUEVO: Leer errores de OAuth2 desde la URL =====
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const oauthError = params.get("oauth_error");
        if (oauthError === "not_registered") {
            setError({
                mensaje: "Esta cuenta de Google no está registrada en el sistema. Contacte al administrador.",
                tipo: "warning"
            });
        } else if (oauthError === "access_denied") {
            setError({
                mensaje: "Acceso denegado por Google. Intente nuevamente.",
                tipo: "error"
            });
        }
        // Limpiar parámetros de la URL para no mostrarlos al recargar
        if (oauthError) {
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, []);
    // ===== FIN NUEVO =====

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

    // ===== NUEVO: Función para redirigir a OAuth2 =====
    const handleGoogleLogin = () => {
        // Ajusta la URL base según tu backend (ej. http://localhost:8080)
        window.location.href = "http://127.0.0.1:8000/api/auth/google/";
    };
    // ===== FIN NUEVO =====

    const errorStyles = {
        error: "bg-red-50/80 border-red-200 text-red-700 backdrop-blur-sm",
        warning: "bg-amber-50/80 border-amber-200 text-amber-700 backdrop-blur-sm",
        success: "bg-green-50/80 border-green-200 text-green-700 backdrop-blur-sm",
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
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900">
            {/* Fondo con partículas / patrón */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.05) 0%, transparent 50%),
                                     radial-gradient(circle at 80% 20%, rgba(255,255,255,0.03) 0%, transparent 50%),
                                     radial-gradient(circle at 50% 80%, rgba(255,255,255,0.04) 0%, transparent 50%)`,
                }} />
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`,
                }} />
            </div>

            {/* Círculos decorativos flotantes - Ahora en tonos azules */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-400/10 rounded-full blur-3xl" />

            <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-0 bg-white/5 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden relative z-10">
                {/* Panel izquierdo - Branding e ilustración - ahora azul */}
                <div className="hidden lg:flex flex-col justify-center items-center p-12 bg-gradient-to-br from-blue-800/30 to-indigo-800/30 backdrop-blur-sm relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-800/10 to-indigo-800/10" />

                    <div className="relative z-10 text-center">
                        <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-8 border border-white/20 shadow-2xl">
                            <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">AdminEdu</h1>
                        <p className="text-blue-200 text-lg max-w-sm mx-auto">Sistema de Gestión Académica</p>

                        <div className="mt-12 space-y-4 text-left max-w-xs mx-auto">
                            <div className="flex items-center gap-4 text-white/80">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <span className="text-sm">Control de acceso por roles</span>
                            </div>
                            <div className="flex items-center gap-4 text-white/80">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                                <span className="text-sm">Gestión de cursos y paralelos</span>
                            </div>
                            <div className="flex items-center gap-4 text-white/80">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <span className="text-sm">Reportes y estadísticas</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Panel derecho - Formulario */}
                <div className="flex items-center justify-center p-8 lg:p-12 bg-white/5 backdrop-blur-sm">
                    <div className="w-full max-w-md">
                        <div className="text-center lg:text-left mb-8">
                            <h2 className="text-3xl font-bold text-white">Bienvenido</h2>
                            <p className="text-white/60 mt-1">Ingresa tus credenciales para continuar</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-1.5">
                                    Usuario
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="w-5 h-5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <input
                                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-white placeholder-white/40 transition-all duration-200"
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

                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-1.5">
                                    Contraseña
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="w-5 h-5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <input
                                        className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-white placeholder-white/40 transition-all duration-200"
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
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/40 hover:text-white/80 transition"
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

                            {/* Enlaces de ayuda */}
                            <div className="flex items-center justify-between mt-2">
                                <Link
                                    to="/register"
                                    className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors"
                                >
                                    ¿No tienes cuenta? Regístrate
                                </Link>
                                <a
                                    href="http://127.0.0.1:8000/accounts/password/reset/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors"
                                >
                                    ¿Olvidaste tu contraseña?
                                </a>
                            </div>

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

                            <button
                                className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 ${loading
                                        ? "bg-blue-500/50 cursor-not-allowed"
                                        : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg hover:shadow-blue-500/30 active:scale-[0.98]"
                                    }`}
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        <span>Ingresando...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Iniciar Sesión</span>
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </form>

                        {/* ===== NUEVO: Separador y botón de Google ===== */}
                        <div className="flex items-center my-6">
                            <div className="flex-1 border-t border-white/10"></div>
                            <span className="px-4 text-white/40 text-sm">o</span>
                            <div className="flex-1 border-t border-white/10"></div>
                        </div>

                        <button
                            onClick={handleGoogleLogin}
                            className="w-full py-3 px-4 rounded-xl font-semibold text-white bg-white/10 border border-white/20 hover:bg-white/20 hover:border-blue-400 transition-all duration-200 flex items-center justify-center gap-3"
                            disabled={loading}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
                                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                            </svg>
                            <span>Continuar con Google</span>
                        </button>
                        {/* ===== FIN NUEVO ===== */}

                        <div className="mt-8 pt-6 border-t border-white/10 text-center">
                            <p className="text-xs text-white/30">
                                &copy; {new Date().getFullYear()} AdminEdu. Todos los derechos reservados.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}