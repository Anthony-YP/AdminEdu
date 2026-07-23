import { useEffect, useState } from "react";
import api from "../api/api";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";

export default function EstudianteNotificaciones() {
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const response = await api.get("/notificaciones/");
        setNotificaciones(response.data || []);
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Notificaciones</h1>
      {loading ? (
        <div className="text-gray-500">Cargando notificaciones...</div>
      ) : notificaciones.length === 0 ? (
        <div className="text-gray-500">No tienes notificaciones por el momento. Te avisaremos cuando haya novedades importantes.</div>
      ) : (
        <div className="space-y-3">
          {notificaciones.map((n) => (
            <Card key={n.id}>
              <CardHeader>
                <CardTitle>{n.titulo || "Notificación"}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700">{n.descripcion || n.mensaje || "Sin contenido"}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}