import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AuthService from "../../services/AuthService";

export default function RestablecerContrasena() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const uid = searchParams.get("uid") || "";
    const token = searchParams.get("token") || "";

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [exito, setExito] = useState(false);

    const enlaceInvalido = !uid || !token;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (password.length < 8) {
            setError("La contraseña debe tener al menos 8 caracteres.");
            return;
        }
        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        try {
            setLoading(true);
            await AuthService.confirmPasswordReset(uid, token, password);
            setExito(true);
            setTimeout(() => navigate("/login"), 2500);
        } catch (err) {
            setError(err.response?.data?.detail || "No se pudo restablecer la contraseña. El enlace pudo haber expirado.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-6">
            <div className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-8">
                <h1 className="text-2xl font-bold text-white mb-1">Restablecer contraseña</h1>

                {enlaceInvalido ? (
                    <div className="bg-red-500/10 border border-red-400/30 text-red-200 text-sm rounded-xl p-4 mt-4">
                        Este enlace de recuperación no es válido. Solicite uno nuevo desde{" "}
                        <Link to="/recuperar-contrasena" className="underline">recuperar contraseña</Link>.
                    </div>
                ) : exito ? (
                    <div className="bg-emerald-500/10 border border-emerald-400/30 text-emerald-200 text-sm rounded-xl p-4 mt-4">
                        Contraseña actualizada correctamente. Redirigiendo al inicio de sesión...
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-1.5">Nueva contraseña<span className="text-red-500 ml-0.5">*</span></label>
                            <input
                                type="password"
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-white placeholder-white/30"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-1.5">Confirmar contraseña<span className="text-red-500 ml-0.5">*</span></label>
                            <input
                                type="password"
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-white placeholder-white/30"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                disabled={loading}
                                required
                            />
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-400/30 text-red-200 text-sm rounded-xl p-3">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all ${
                                loading ? "bg-blue-500/50 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                            }`}
                        >
                            {loading ? "Guardando..." : "Restablecer contraseña"}
                        </button>
                    </form>
                )}

                <div className="mt-6 text-center">
                    <Link to="/login" className="text-xs text-white/40 hover:text-white/70 transition-colors">
                        Volver al inicio de sesión
                    </Link>
                </div>
            </div>
        </div>
    );
}
