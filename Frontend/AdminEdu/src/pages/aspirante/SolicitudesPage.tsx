import { useState, useEffect } from "react";
import AspiranteService, { SolicitudMatricula } from "../../services/AspiranteService";

const estadoBadge: Record<string, { bg: string; text: string; label: string }> = {
    PENDIENTE: { bg: "bg-amber-100", text: "text-amber-800", label: "Pendiente" },
    APROBADA: { bg: "bg-emerald-100", text: "text-emerald-800", label: "Aprobada" },
    RECHAZADA: { bg: "bg-red-100", text: "text-red-800", label: "Rechazada" },
    FINALIZADA: { bg: "bg-blue-100", text: "text-blue-800", label: "Finalizada" },
};

export default function SolicitudesPage() {
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

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Mis Solicitudes</h1>
                <p className="text-slate-500 mt-1">Estado de tus solicitudes de matrícula</p>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-16">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500" />
                </div>
            ) : solicitudes.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                    <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-slate-500 text-lg font-medium">No tienes solicitudes</p>
                    <p className="text-slate-400 text-sm mt-1">
                        Explora los cursos disponibles y solicita tu matrícula
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {solicitudes.map((sol) => {
                        const badge = estadoBadge[sol.estado] || estadoBadge.PENDIENTE;
                        return (
                            <div
                                key={sol.id}
                                className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center gap-4"
                            >
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-slate-800">
                                        {sol.curso_nombre || `Curso #${sol.curso}`}
                                    </h3>
                                    <p className="text-sm text-slate-500 mt-1">
                                        Solicitado: {new Date(sol.fecha_solicitud).toLocaleDateString("es-EC")}
                                    </p>
                                    {sol.comentario && (
                                        <p className="text-sm text-slate-400 mt-1 italic">"{sol.comentario}"</p>
                                    )}
                                </div>
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold self-start ${badge.bg} ${badge.text}`}>
                                    {badge.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
