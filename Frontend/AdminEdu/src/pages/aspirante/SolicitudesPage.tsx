import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AspiranteService, { SolicitudMatricula } from "../../services/AspiranteService";

const estadoConfig: Record<string, { bg: string; text: string; label: string; icon: string }> = {
    Pendiente: { bg: "bg-amber-100", text: "text-amber-800", label: "Pendiente", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
    Aprobada: { bg: "bg-emerald-100", text: "text-emerald-800", label: "Aprobada", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
    Rechazada: { bg: "bg-red-100", text: "text-red-800", label: "Rechazada", icon: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" },
    Finalizada: { bg: "bg-blue-100", text: "text-blue-800", label: "Finalizada", icon: "M5 13l4 4L19 7" },
};

export default function SolicitudesPage() {
    const [solicitudes, setSolicitudes] = useState<SolicitudMatricula[]>([]);
    const [loading, setLoading] = useState(true);
    const [filtro, setFiltro] = useState("TODAS");

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

    const solicitudesFiltradas = filtro === "TODAS"
        ? solicitudes
        : solicitudes.filter((s) => s.estado === filtro);

    const formatFecha = (fecha: string) => {
        if (!fecha) return "";
        return new Date(fecha).toLocaleDateString("es-EC", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Seguimiento de Solicitudes</h1>
                <p className="text-slate-500 mt-1">Estado de tus solicitudes de matrícula</p>
            </div>

            {/* Filtros */}
            <div className="flex flex-wrap gap-2">
                {["TODAS", "Pendiente", "Aprobada", "Rechazada", "Finalizada"].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFiltro(f)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                            filtro === f
                                ? "bg-emerald-600 text-white"
                                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                    >
                        {f === "TODAS" ? "Todas" : estadoConfig[f]?.label || f}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-16">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500" />
                </div>
            ) : solicitudesFiltradas.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                    <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-slate-500 text-lg font-medium">No tienes solicitudes</p>
                    <p className="text-slate-400 text-sm mt-1 mb-4">
                        {filtro !== "TODAS" ? "No hay solicitudes con este estado" : "Explora los cursos disponibles y solicita tu matrícula"}
                    </p>
                    {filtro === "TODAS" && (
                        <Link to="/aspirante/cursos" className="text-emerald-600 hover:text-emerald-700 font-medium text-sm">
                            Explorar cursos →
                        </Link>
                    )}
                </div>
            ) : (
                <div className="space-y-4">
                    {solicitudesFiltradas.map((sol) => {
                        const config = estadoConfig[sol.estado] || estadoConfig.PENDIENTE;
                        return (
                            <div
                                key={sol.id}
                                className="bg-white rounded-xl border border-slate-200 p-6"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="font-bold text-slate-800 text-lg">
                                                {sol.curso_nombre || `Curso #${sol.curso}`}
                                            </h3>
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
                                                {config.label}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                                            <div>
                                                <p className="text-xs text-slate-400 font-medium">Paralelo</p>
                                                <p className="text-sm text-slate-700 font-medium">{sol.paralelo || "N/A"}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-400 font-medium">Fecha Solicitud</p>
                                                <p className="text-sm text-slate-700">{formatFecha(sol.fecha_solicitud)}</p>
                                            </div>
                                            {sol.fecha_aprobacion && (
                                                <div>
                                                    <p className="text-xs text-slate-400 font-medium">Fecha Respuesta</p>
                                                    <p className="text-sm text-slate-700">{formatFecha(sol.fecha_aprobacion)}</p>
                                                </div>
                                            )}
                                        </div>

                                        {sol.comentario && (
                                            <div className="mt-3 bg-slate-50 rounded-lg p-3">
                                                <p className="text-xs text-slate-400 font-medium mb-1">
                                                    {sol.estado === "RECHAZADA" ? "Motivo del rechazo:" : "Comentario:"}
                                                </p>
                                                <p className="text-sm text-slate-600 italic">"{sol.comentario}"</p>
                                            </div>
                                        )}

                                        {sol.comprobante_url && (
                                            <div className="mt-3">
                                                <a
                                                    href={sol.comprobante_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                    Ver comprobante de pago
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
