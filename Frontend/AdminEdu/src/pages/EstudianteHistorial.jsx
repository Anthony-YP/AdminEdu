import { useEffect, useState } from "react";
import api from "../api/api";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";

const ESTADO_VARIANT = {
  Pendiente: "yellow",
  Aprobada: "blue",
  Rechazada: "red",
  Cancelada: "gray",
  Finalizada: "green",
};

export default function EstudianteHistorial() {
  const [matriculas, setMatriculas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargar = async () => {
      try {
        const { data } = await api.get("/estudiante/historial/");
        setMatriculas(data || []);
      } catch {
        setError("No se pudo cargar el historial académico.");
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Historial Académico</h1>
        <p className="text-sm text-gray-500">Revisa tus cursos, horarios, asistencia y resultados académicos.</p>
      </div>

      {error && <div className="text-red-600 text-sm">{error}</div>}

      <div className="grid gap-4">
        {loading ? (
          <div className="text-gray-500">Cargando historial...</div>
        ) : matriculas.length === 0 ? (
          <div className="text-gray-500">Aún no tienes matrículas registradas.</div>
        ) : matriculas.map((m) => (
          <Card key={m.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{m.curso_nombre} — Paralelo {m.paralelo}</CardTitle>
                <Badge variant={ESTADO_VARIANT[m.estado] || "gray"}>{m.estado}</Badge>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-xs text-gray-400 uppercase font-medium">Horario</p>
                <p className="text-gray-700">
                  {Array.isArray(m.dias_clase) ? m.dias_clase.join(", ") : m.dias_clase || "—"}
                </p>
                <p className="text-gray-500">{m.hora_inicio?.slice(0, 5)} - {m.hora_fin?.slice(0, 5)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase font-medium">% Asistencia</p>
                <p className="text-gray-700 font-semibold">
                  {m.porcentaje_asistencia !== null && m.porcentaje_asistencia !== undefined
                    ? `${m.porcentaje_asistencia}%`
                    : "Sin registros"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase font-medium">Nota Final</p>
                <p className="text-gray-700 font-semibold">
                  {m.nota_final ?? "Pendiente"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase font-medium">Resultado</p>
                <p className="text-gray-700 font-semibold">
                  {m.aprobado === null || m.aprobado === undefined ? "—" : m.aprobado ? "Aprobado" : "No aprobado"}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
