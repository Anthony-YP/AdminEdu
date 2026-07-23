import { useState, useEffect } from "react";
import AspiranteService, { SolicitudMatricula } from "../../services/AspiranteService";

export default function Pagos() {
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

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Mis Pagos</h1>
                <p className="text-slate-500 mt-1">Estado de tus comprobantes de pago</p>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-16">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500" />
                </div>
            ) : solicitudes.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                    <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <p className="text-slate-500 text-lg font-medium">No hay pagos registrados</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {solicitudes.map((sol) => (
                        <div key={sol.id} className="bg-white rounded-xl border border-slate-200 p-5">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-semibold text-slate-800">{sol.curso_nombre}</h3>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                    sol.estado === "APROBADA" ? "bg-emerald-100 text-emerald-700" :
                                    sol.estado === "RECHAZADA" ? "bg-red-100 text-red-700" :
                                    "bg-amber-100 text-amber-700"
                                }`}>
                                    {sol.estado === "APROBADA" ? "Aprobado" : sol.estado === "RECHAZADA" ? "Rechazado" : "Pendiente"}
                                </span>
                            </div>
                            <p className="text-sm text-slate-500">Fecha: {formatFecha(sol.fecha_solicitud)}</p>
                            {sol.comprobante_url && (
                                <a
                                    href={sol.comprobante_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium mt-2"
                                >
                                    Ver comprobante →
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
