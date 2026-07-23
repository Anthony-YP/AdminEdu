import { useEffect, useState } from "react";
import api from "../api/api";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";

export default function EstudianteHistorial() {
  const [matriculas, setMatriculas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const response = await api.get("/matriculas/");
        setMatriculas(response.data || []);
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
        <p className="text-sm text-gray-500">Revisa tus cursos, avances y resultados académicos.</p>
      </div>
      <div className="grid gap-4">
        {loading ? (
          <div className="text-gray-500">Cargando historial...</div>
        ) : matriculas.map((m) => (
          <Card key={m.id}>
            <CardHeader>
              <CardTitle>{m.curso || "Curso"}</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Paralelo: {m.paralelo_matricula || "—"}</p>
                <p className="text-sm text-gray-600">Estado: {m.estado || "—"}</p>
              </div>
              <Badge variant="blue">{m.estado === "Aprobada" ? "Aprobado" : "En proceso"}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}