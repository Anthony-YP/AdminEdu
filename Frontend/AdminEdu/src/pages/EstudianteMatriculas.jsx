import { useEffect, useState } from "react";
import api from "../api/api";
import { Alert } from "../components/ui/Alert";
import { Badge } from "../components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";

export default function EstudianteMatriculas() {
  const [matriculas, setMatriculas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargar = async () => {
      try {
        setLoading(true);
        const response = await api.get("/matriculas/");
        setMatriculas(response.data || []);
      } catch (err) {
        setError("No se pudieron cargar las matrículas.");
      } finally {
        setLoading(false);
      }
    };

    cargar();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Mis Matrículas</h1>
        <p className="text-sm text-gray-500">Consulta el estado de tus solicitudes y los comentarios de revisión.</p>
      </div>
      {error && <Alert variant="error">{error}</Alert>}
      <Card>
        <CardHeader>
          <CardTitle>Listado</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-gray-500">Cargando matrículas...</div>
          ) : matriculas.length === 0 ? (
            <div className="text-gray-500">Aún no tienes matrículas registradas. Cuando una sea aprobada o pendiente aparecerá aquí.</div>
          ) : (
            <div className="space-y-3">
              {matriculas.map((m) => (
                <div key={m.id} className="rounded-lg border p-4">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-semibold">{m.curso || "Curso"}</p>
                      <p className="text-sm text-gray-500">Paralelo: {m.paralelo_matricula || "—"}</p>
                    </div>
                    <Badge variant="blue">{m.estado || "Pendiente"}</Badge>
                  </div>
                  {m.comentario && <p className="mt-2 text-sm text-red-600">Comentario: {m.comentario}</p>}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
