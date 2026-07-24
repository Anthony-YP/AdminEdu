import { useEffect, useMemo, useState } from "react";
import api from "../api/api";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Award } from "lucide-react";

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

  // Solo se listan los cursos con un resultado final ya registrado
  // (aprobado o reprobado); una matrícula sin calificación aún no cuenta.
  const finalizadas = useMemo(
    () => matriculas.filter((m) => m.aprobado !== null && m.aprobado !== undefined),
    [matriculas]
  );

  const totalAprobados = finalizadas.filter((m) => m.aprobado).length;
  const totalReprobados = finalizadas.length - totalAprobados;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
          <Award className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Historial Académico</h1>
          <p className="text-sm text-gray-500">Cursos completados.</p>
        </div>
      </div>

      {error && <div className="text-red-600 text-sm">{error}</div>}

      {!loading && finalizadas.length > 0 && (
        <div className="flex gap-3">
          <Badge variant="green" className="text-sm px-4 py-1.5">{totalAprobados} aprobado{totalAprobados === 1 ? "" : "s"}</Badge>
          <Badge variant="red" className="text-sm px-4 py-1.5">{totalReprobados} reprobado{totalReprobados === 1 ? "" : "s"}</Badge>
        </div>
      )}

      <div className="grid gap-4">
        {loading ? (
          <div className="text-gray-500">Cargando historial...</div>
        ) : finalizadas.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm py-12 text-center text-gray-500">
            Aún no tienes cursos con un resultado final registrado.
          </div>
        ) : finalizadas.map((m) => (
          <Card key={m.id} className={`border-l-4 ${m.aprobado ? "border-l-emerald-500" : "border-l-red-500"}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{m.curso_nombre} — Paralelo {m.paralelo}</CardTitle>
                <Badge variant={m.aprobado ? "green" : "red"}>{m.aprobado ? "Aprobado" : "Reprobado"}</Badge>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
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
                  {m.nota_final ?? "—"}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
