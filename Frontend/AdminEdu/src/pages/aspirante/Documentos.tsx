import { useState, useEffect } from "react";
import AspiranteService, { SolicitudMatricula } from "../../services/AspiranteService";

export default function Documentos() {
    const [solicitudes, setSolicitudes] = useState<SolicitudMatricula[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const data = await AspiranteService.getSolicitudes();
                setSolicitudes(data.filter(s => s.comprobante_url));
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

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Mis Documentos</h1>
                <p className="text-slate-500 mt-1">Comprobantes y documentos enviados</p>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-16">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500" />
                </div>
            ) : solicitudes.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                    <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <p className="text-slate-500 text-lg font-medium">No hay documentos</p>
                    <p className="text-slate-400 text-sm mt-1">
                        Los comprobantes de pago aparecerán aquí
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {solicitudes.map((sol) => (
                        <div key={sol.id} className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-slate-800 truncate">Comprobante - {sol.curso_nombre}</p>
                                <p className="text-sm text-slate-500">Enviado: {formatFecha(sol.fecha_solicitud)}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    sol.estado === "APROBADA" ? "bg-emerald-100 text-emerald-700" :
                                    sol.estado === "RECHAZADA" ? "bg-red-100 text-red-700" :
                                    "bg-amber-100 text-amber-700"
                                }`}>
                                    {sol.estado}
                                </span>
                                <a
                                    href={sol.comprobante_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                                >
                                    Ver
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
