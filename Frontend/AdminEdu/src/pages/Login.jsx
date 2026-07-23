import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

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

    const { usuario, isAuthenticated, login: loginUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const oauthError = params.get("oauth_error");
        if (oauthError === "not_registered") {
            setError({
                mensaje: "Esta cuenta de Google no está registrada. Intenta iniciar sesión con Google para registrarte.",
                tipo: "warning"
            });
        } else if (oauthError === "access_denied") {
            setError({
                mensaje: "Acceso denegado por Google. Intente nuevamente.",
                tipo: "error"
            });
        }
        if (oauthError) {
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, []);

    useEffect(() => {
        if (isAuthenticated && usuario) {
            const grupos = usuario.groups || [];
            if (grupos.includes("Aspirante")) {
                navigate("/aspirante", { replace: true });
            } else if (grupos.includes("Director")) {
                navigate("/dashboard", { replace: true });
            } else {
                navigate("/dashboard", { replace: true });
            }
        }
    }, [isAuthenticated, usuario, navigate]);

    const validarFormulario = () => {
        if (!username.trim() || !password.trim()) {
            setError({ mensaje: TIPOS_ERROR.VALIDACION, tipo: "warning" });
            return false;
        }
        if (username.trim().length < 3) {
            setError({ mensaje: "El usuario debe tener al menos 3 caracteres", tipo: "warning" });
            return false;
        }
        if (password.length < 4) {
            setError({ mensaje: "La contraseña debe tener al menos 4 caracteres", tipo: "warning" });
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
            await loginUser(username.trim(), password);
        } catch (error) {
            if (error.code === "ERR_NETWORK" || error.message?.includes("Network")) {
                setError({ mensaje: TIPOS_ERROR.RED, tipo: "error" });
            } else if (error.response?.status >= 500) {
                setError({ mensaje: TIPOS_ERROR.SERVER, tipo: "error" });
            } else if (error.response?.data?.detail?.toLowerCase().includes("inactive")) {
                setError({ mensaje: TIPOS_ERROR.INACTIVO, tipo: "warning" });
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

    const handleGoogleLogin = () => {
        const base = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";
        window.location.href = `${base.replace(/\/api\/?$/, "")}/api/auth/google/login/`;
    };

    const errorStyles = {
        error: "bg-red-50/80 border-red-200 text-red-700",
        warning: "bg-amber-50/80 border-amber-200 text-amber-700",
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
            <div className="w-full max-w-lg">
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-8 lg:p-10">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-white">AdminEdu</h1>
                        <p className="text-white/50 text-sm mt-1">Sistema de Gestión Académica</p>
                    </div>

                    {/* Separador: Usuarios del Sistema */}
                    <div className="mb-2">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex-1 h-px bg-white/10"></div>
                            <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">Usuarios del Sistema</span>
                            <div className="flex-1 h-px bg-white/10"></div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-1.5">
                                Usuario
                            </label>
                            <input
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-white placeholder-white/30 transition-all"
                                type="text"
                                placeholder="Ingrese su usuario"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                autoFocus
                                autoComplete="username"
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-1.5">
                                Contraseña
                            </label>
                            <div className="relative">
                                <input
                                    className="w-full px-4 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-white placeholder-white/30 transition-all"
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
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/40 hover:text-white/70 transition"
                                    tabIndex={-1}
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        {showPassword ? (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        ) : (
                                            <>
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </>
                                        )}
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {error.mensaje && (
                            <div className={`flex items-center gap-3 p-3 rounded-xl border animate-slideDown ${errorStyles[error.tipo] || errorStyles.error}`}>
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
                            className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 ${
                                loading
                                    ? "bg-blue-500/50 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.98]"
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
                                <span>Iniciar Sesión</span>
                            )}
                        </button>
                    </form>

                    {/* Separador: Aspirantes */}
                    <div className="flex items-center my-6">
                        <div className="flex-1 border-t border-white/10"></div>
                        <span className="px-4 text-xs font-semibold text-white/40 uppercase tracking-wider">Aspirantes</span>
                        <div className="flex-1 border-t border-white/10"></div>
                    </div>

                    <p className="text-white/40 text-xs text-center mb-4">
                        ¿Eres aspirante? Ingresa con tu cuenta de Google para solicitar matrícula.
                    </p>

                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="w-full py-3 px-4 rounded-xl font-semibold text-white bg-white/10 border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-200 flex items-center justify-center gap-3"
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

                    <div className="mt-8 pt-4 border-t border-white/10 text-center">
                        <p className="text-xs text-white/20">
                            &copy; {new Date().getFullYear()} AdminEdu. Todos los derechos reservados.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
