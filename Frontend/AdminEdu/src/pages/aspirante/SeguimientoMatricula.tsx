import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AspiranteService, { SolicitudMatricula } from "../../services/AspiranteService";

export default function SeguimientoMatricula() {
    const [solicitudes, setSolicitudes] = useState<SolicitudMatricula[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const data = await AspiranteService.getSolicitudes();
                setSolicitudes(data);
            } catch {
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    const formatFecha = (fecha: string) => {
        if (!fecha) return "";
        return new Date(fecha).toLocaleDateString("es-EC", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const estadoColor = (estado: string) => {
        switch (estado) {
            case "Pendiente": return "bg-amber-100 text-amber-800 border-amber-300";
            case "Aprobada": return "bg-emerald-100 text-emerald-800 border-emerald-300";
            case "Rechazada": return "bg-red-100 text-red-800 border-red-300";
            case "Finalizada": return "bg-blue-100 text-blue-800 border-blue-300";
            default: return "bg-slate-100 text-slate-800 border-slate-300";
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Seguimiento de Matrícula</h1>
                <p className="text-slate-500 mt-1">Monitorea el progreso de tus solicitudes</p>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-16">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500" />
                </div>
            ) : solicitudes.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                    <p className="text-slate-500 text-lg font-medium">No tienes solicitudes activas</p>
                    <Link to="/aspirante/cursos" className="text-emerald-600 hover:text-emerald-700 font-medium text-sm mt-2 inline-block">
                        Explorar cursos →
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {solicitudes.map((sol) => (
                        <div key={sol.id} className="bg-white rounded-xl border border-slate-200 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-slate-800">{sol.curso_nombre}</h3>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${estadoColor(sol.estado)}`}>
                                    {sol.estado}
                                </span>
                            </div>

                            {/* Progress bar */}
                            <div className="mb-4">
                                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                                    <span>Enviada</span>
                                    <span>Revisión</span>
                                    <span>Resultado</span>
                                </div>
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-500 ${
                                            sol.estado === "Pendiente" ? "w-1/3 bg-amber-400" :
                                            sol.estado === "Aprobada" || sol.estado === "Finalizada" ? "w-full bg-emerald-400" :
                                            sol.estado === "Rechazada" ? "w-2/3 bg-red-400" : "w-0"
                                        }`}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                                <div>
                                    <p className="text-xs text-slate-400">Fecha solicitud</p>
                                    <p className="font-medium text-slate-700">{formatFecha(sol.fecha_solicitud)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400">Paralelo</p>
                                    <p className="font-medium text-slate-700">{sol.paralelo || "N/A"}</p>
                                </div>
                                {sol.fecha_aprobacion && (
                                    <div>
                                        <p className="text-xs text-slate-400">Fecha respuesta</p>
                                        <p className="font-medium text-slate-700">{formatFecha(sol.fecha_aprobacion)}</p>
                                    </div>
                                )}
                            </div>

                            {sol.comentario && (
                                <div className="mt-3 bg-slate-50 rounded-lg p-3">
                                    <p className="text-xs text-slate-400 font-medium mb-1">Comentario de Secretaría:</p>
                                    <p className="text-sm text-slate-600 italic">"{sol.comentario}"</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
