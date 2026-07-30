import { useState } from "react";
import { Link } from "react-router-dom";
import AuthService from "../../services/AuthService";

export default function RecuperarContrasena() {
    const [numeroIdentificacion, setNumeroIdentificacion] = useState("");
    const [correo, setCorreo] = useState("");
    const [loading, setLoading] = useState(false);
    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMensaje("");

        if (!numeroIdentificacion.trim() || !correo.trim()) {
            setError("Complete su número de identificación y correo electrónico.");
            return;
        }

        try {
            setLoading(true);
            const data = await AuthService.requestPasswordReset(numeroIdentificacion.trim(), correo.trim());
            setMensaje(data.detail || "Si los datos corresponden a una cuenta registrada, recibirá instrucciones por correo.");
        } catch {
            // El backend siempre responde 200 con mensaje genérico; solo llegamos
            // aquí ante un error de red o del servidor.
            setError("Ocurrió un error al procesar la solicitud. Intente nuevamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-6">
            <div className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-8">
                <h1 className="text-2xl font-bold text-white mb-1">Recuperar contraseña</h1>
                <p className="text-white/50 text-sm mb-6">
                    Ingrese su número de identificación y correo electrónico registrados. Le enviaremos instrucciones para restablecer su contraseña.
                </p>

                {mensaje ? (
                    <div className="bg-emerald-500/10 border border-emerald-400/30 text-emerald-200 text-sm rounded-xl p-4">
                        {mensaje}
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-1.5">Número de identificación<span className="text-red-500 ml-0.5">*</span></label>
                            <input
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-white placeholder-white/30"
                                value={numeroIdentificacion}
                                onChange={(e) => setNumeroIdentificacion(e.target.value)}
                                placeholder="Cédula o pasaporte"
                                disabled={loading}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-1.5">Correo electrónico<span className="text-red-500 ml-0.5">*</span></label>
                            <input
                                type="email"
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-white placeholder-white/30"
                                value={correo}
                                onChange={(e) => setCorreo(e.target.value)}
                                placeholder="correo@ejemplo.com"
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
                            {loading ? "Enviando..." : "Enviar instrucciones"}
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
