import { useEffect, useState } from "react";
import api from "../api/api";
import { Alert } from "../components/ui/Alert";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/Table";

export default function Personas() {
  const [personas, setPersonas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargar = async () => {
      try {
        setLoading(true);
        const response = await api.get("/personas/");
        setPersonas(response.data);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar las personas.");
      } finally {
        setLoading(false);
      }
    };

    cargar();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Personas</h1>
          <p className="text-sm text-gray-500">Listado de personas registradas desde el backend.</p>
        </div>
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <Table>
          <TableHead className="bg-gray-50/50">
            <TableRow>
              <TableHeader>Nombre</TableHeader>
              <TableHeader>Identificación</TableHeader>
              <TableHeader>Correo</TableHeader>
              <TableHeader>Teléfono</TableHeader>
              <TableHeader>Tipo</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                  Cargando...
                </TableCell>
              </TableRow>
            ) : personas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                  No hay personas registradas.
                </TableCell>
              </TableRow>
            ) : (
              personas.map((persona) => (
                <TableRow key={persona.id}>
                  <TableCell>{persona.nombres} {persona.apellidos}</TableCell>
                  <TableCell>{persona.numero_identificacion}</TableCell>
                  <TableCell>{persona.correo}</TableCell>
                  <TableCell>{persona.telefono}</TableCell>
                  <TableCell>
                    <Badge variant="blue">{persona.tipo_documento || "Persona"}</Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}