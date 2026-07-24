import { useEffect, useState } from "react";
import api from "../api/api";
import { Card, CardContent } from "../components/ui/Card";
import { Alert } from "../components/ui/Alert";

function formatearFecha(fecha) {
  if (!fecha) return "";
  return new Date(fecha).toLocaleDateString("es-EC", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function EstudianteNotificaciones() {
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargar = async () => {
      try {
        const response = await api.get("/notificaciones/");
        setNotificaciones(response.data || []);
      } catch {
        setError("No se pudieron cargar tus notificaciones. Intenta nuevamente.");
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Notificaciones</h1>
      {error && <Alert variant="error">{error}</Alert>}
      {loading ? (
        <div className="text-gray-500">Cargando notificaciones...</div>
      ) : notificaciones.length === 0 ? (
        !error && <div className="text-gray-500">No tienes notificaciones por el momento. Te avisaremos cuando haya novedades importantes.</div>
      ) : (
        <div className="space-y-3">
          {notificaciones.map((n) => (
            <Card key={n.id}>
              <CardContent>
                <p className="text-sm text-gray-700">{n.mensaje}</p>
                <p className="text-xs text-gray-400 mt-1">{formatearFecha(n.fecha)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}