import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GraduationCap, Eye, EyeOff } from "lucide-react";

export default function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({ mensaje: "", tipo: "" });
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validar = () => {
        if (!formData.username.trim() || !formData.email.trim() || !formData.password || !formData.confirmPassword) {
            setError({ mensaje: "Todos los campos son obligatorios.", tipo: "warning" });
            return false;
        }
        if (formData.username.trim().length < 3) {
            setError({ mensaje: "El usuario debe tener al menos 3 caracteres.", tipo: "warning" });
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            setError({ mensaje: "Ingrese un correo electrónico válido.", tipo: "warning" });
            return false;
        }
        if (formData.password.length < 6) {
            setError({ mensaje: "La contraseña debe tener al menos 6 caracteres.", tipo: "warning" });
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            setError({ mensaje: "Las contraseñas no coinciden.", tipo: "warning" });
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError({ mensaje: "", tipo: "" });
        setSuccess("");

        if (!validar()) return;

        setLoading(true);
        try {
            const response = await fetch("http://127.0.0.1:8000/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: formData.username.trim(),
                    email: formData.email.trim(),
                    password: formData.password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError({
                    mensaje: data.detail || "Error al registrar.",
                    tipo: "error",
                });
                return;
            }

            setSuccess("Registro exitoso. Redirigiendo al inicio de sesión...");
            setTimeout(() => navigate("/login"), 2000);
        } catch (err) {
            setError({
                mensaje: "Error de conexión. Verifique su internet.",
                tipo: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900">
            {/* Fondo decorativo */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.05) 0%, transparent 50%),
                                     radial-gradient(circle at 80% 20%, rgba(255,255,255,0.03) 0%, transparent 50%),
                                     radial-gradient(circle at 50% 80%, rgba(255,255,255,0.04) 0%, transparent 50%)`,
                }} />
            </div>
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-1000" />

            <div className="w-full max-w-md bg-white/5 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden relative z-10 p-8">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/20">
                        <GraduationCap className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Crear Cuenta</h2>
                    <p className="text-white/60 mt-1">Regístrate en AdminEdu</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-white/80 mb-1.5">Usuario</label>
                        <input
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-white placeholder-white/40 transition-all duration-200"
                            type="text"
                            name="username"
                            placeholder="Ingrese su usuario"
                            value={formData.username}
                            onChange={handleChange}
                            autoFocus
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white/80 mb-1.5">Correo Electrónico</label>
                        <input
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-white placeholder-white/40 transition-all duration-200"
                            type="email"
                            name="email"
                            placeholder="correo@ejemplo.com"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white/80 mb-1.5">Contraseña</label>
                        <div className="relative">
                            <input
                                className="w-full px-4 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-white placeholder-white/40 transition-all duration-200"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Mínimo 6 caracteres"
                                value={formData.password}
                                onChange={handleChange}
                                disabled={loading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/40 hover:text-white/80 transition"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white/80 mb-1.5">Confirmar Contraseña</label>
                        <div className="relative">
                            <input
                                className="w-full px-4 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-white placeholder-white/40 transition-all duration-200"
                                type={showConfirm ? "text" : "password"}
                                name="confirmPassword"
                                placeholder="Repita la contraseña"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                disabled={loading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/40 hover:text-white/80 transition"
                            >
                                {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {error.mensaje && (
                        <div className={`flex items-center gap-3 p-3 rounded-xl border ${
                            error.tipo === "warning"
                                ? "bg-amber-50/80 border-amber-200 text-amber-700"
                                : "bg-red-50/80 border-red-200 text-red-700"
                        } animate-slideDown`}>
                            <p className="text-sm font-medium flex-1">{error.mensaje}</p>
                        </div>
                    )}

                    {success && (
                        <div className="flex items-center gap-3 p-3 rounded-xl border bg-green-50/80 border-green-200 text-green-700 animate-slideDown">
                            <p className="text-sm font-medium flex-1">{success}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 ${
                            loading
                                ? "bg-blue-500/50 cursor-not-allowed"
                                : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg hover:shadow-blue-500/30 active:scale-[0.98]"
                        }`}
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                <span>Registrando...</span>
                            </>
                        ) : (
                            "Crear Cuenta"
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center space-y-3">
                    <p className="text-white/60 text-sm">
                        ¿Ya tienes una cuenta?{" "}
                        <Link to="/login" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                            Inicia Sesión
                        </Link>
                    </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 text-center">
                    <p className="text-xs text-white/30">
                        &copy; {new Date().getFullYear()} AdminEdu. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </div>
    );
}