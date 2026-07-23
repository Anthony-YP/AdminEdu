import { useState, useEffect } from "react";
import api from "../../api/api";

interface Notificacion {
    id: number;
    mensaje: string;
    fecha: string;
}

export default function Notificaciones() {
    const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const { data } = await api.get("/notificaciones/");
                setNotificaciones(Array.isArray(data) ? data : data.results || []);
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
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Notificaciones</h1>
                <p className="text-slate-500 mt-1">Alertas y mensajes del sistema</p>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-16">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500" />
                </div>
            ) : notificaciones.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                    <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <p className="text-slate-500 text-lg font-medium">Sin notificaciones</p>
                    <p className="text-slate-400 text-sm mt-1">
                        Las notificaciones de tus solicitudes aparecerán aquí
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {notificaciones.map((noti) => (
                        <div key={noti.id} className="bg-white rounded-xl border border-slate-200 p-5 flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-slate-700">{noti.mensaje}</p>
                                <p className="text-xs text-slate-400 mt-1">{formatFecha(noti.fecha)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
