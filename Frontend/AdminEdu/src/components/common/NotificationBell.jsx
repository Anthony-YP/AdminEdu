import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

const POLL_MS = 30000;

export default function NotificationBell({ verTodasRuta, variant = "dark", align = "right" }) {
    const [notificaciones, setNotificaciones] = useState([]);
    const [open, setOpen] = useState(false);
    // Cantidad de notificaciones que ya se le mostraron al usuario al abrir
    // la campana; el punto rojo solo cuenta las que llegaron después de eso.
    const [ultimoVisto, setUltimoVisto] = useState(0);
    const containerRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        let activo = true;

        const cargar = async () => {
            try {
                const { data } = await api.get("/notificaciones/");
                if (activo) setNotificaciones(Array.isArray(data) ? data : []);
            } catch {
                // Silencioso: la campana no debe romper el layout si falla.
            }
        };

        cargar();
        const interval = setInterval(cargar, POLL_MS);

        return () => {
            activo = false;
            clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const recientes = notificaciones.slice(0, 8);
    const total = notificaciones.length;
    const sinVer = Math.max(0, total - ultimoVisto);

    const handleToggle = () => {
        setOpen((prev) => {
            const next = !prev;
            // Al abrir la campana se da por "visto" todo lo que hay hasta
            // ahora, así que el punto rojo desaparece de inmediato.
            if (next) setUltimoVisto(total);
            return next;
        });
    };

    return (
        <div className="relative" ref={containerRef}>
            <button
                onClick={handleToggle}
                className={`relative p-2 rounded-lg transition-colors ${
                    variant === "light"
                        ? "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                        : "text-slate-300 hover:text-white hover:bg-white/10"
                }`}
                aria-label="Notificaciones"
            >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {sinVer > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                        {sinVer > 9 ? "9+" : sinVer}
                    </span>
                )}
            </button>

            {open && (
                <div
                    className={`absolute ${align === "left" ? "left-0" : "right-0"} mt-2 w-[26rem] max-w-[90vw] max-h-[32rem] overflow-y-auto bg-white rounded-xl shadow-2xl border border-gray-200 z-50`}
                >
                    <div className="px-5 py-3.5 border-b border-gray-100 font-semibold text-gray-800 text-base sticky top-0 bg-white">
                        Notificaciones
                    </div>
                    {recientes.length === 0 ? (
                        <div className="px-5 py-10 text-sm text-gray-400 text-center">Sin notificaciones</div>
                    ) : (
                        <ul className="divide-y divide-gray-100">
                            {recientes.map((n) => (
                                <li key={n.id} className="px-5 py-4 text-sm text-gray-700 hover:bg-gray-50">
                                    <p className="leading-relaxed">{n.mensaje}</p>
                                    <p className="text-xs text-gray-400 mt-1.5">
                                        {n.fecha ? new Date(n.fecha).toLocaleString("es-EC") : ""}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    )}
                    {verTodasRuta && (
                        <button
                            onClick={() => {
                                setOpen(false);
                                navigate(verTodasRuta);
                            }}
                            className="w-full px-4 py-3 text-center text-sm font-medium text-blue-600 hover:bg-blue-50 border-t border-gray-100"
                        >
                            Ver todas
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
