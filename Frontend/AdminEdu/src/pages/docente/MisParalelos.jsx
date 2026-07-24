import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/Table";
import { Alert } from "../../components/ui/Alert";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";

export default function MisParalelos() {
    const [paralelos, setParalelos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const cargar = async () => {
            try {
                const { data } = await api.get("/docentes/mis-paralelos/");
                setParalelos(data || []);
            } catch {
                setError("No se pudieron cargar tus paralelos.");
            } finally {
                setLoading(false);
            }
        };
        cargar();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Mis Paralelos</h1>
                <p className="text-sm text-gray-500 mt-1">Cursos y paralelos a tu cargo.</p>
            </div>

            {error && <Alert variant="error">{error}</Alert>}

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <Table>
                    <TableHead className="bg-gray-50/50">
                        <TableRow>
                            <TableHeader>Curso</TableHeader>
                            <TableHeader>Paralelo</TableHeader>
                            <TableHeader>Horario</TableHeader>
                            <TableHeader>Estado</TableHeader>
                            <TableHeader className="text-right">Acciones</TableHeader>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paralelos.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                                    No tienes paralelos asignados.
                                </TableCell>
                            </TableRow>
                        ) : (
                            paralelos.map((p) => (
                                <TableRow key={p.id} className="hover:bg-gray-50/50">
                                    <TableCell><Badge variant="blue">{p.curso_nombre}</Badge></TableCell>
                                    <TableCell className="font-semibold text-gray-800">{p.nombre}</TableCell>
                                    <TableCell>
                                        <div className="text-sm text-gray-900">{Array.isArray(p.dias_clase) ? p.dias_clase.join(", ") : p.dias_clase}</div>
                                        <div className="text-xs text-gray-500">{p.hora_inicio} - {p.hora_fin}</div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={p.estado === "ACTIVO" ? "green" : "gray"}>{p.estado}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link to={`/docente/asistencia?paralelo=${p.id}`}>
                                                <Button variant="ghost" size="sm">Asistencia</Button>
                                            </Link>
                                            <Link to={`/docente/calificaciones?paralelo=${p.id}`}>
                                                <Button variant="ghost" size="sm">Calificaciones</Button>
                                            </Link>
                                        </div>
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
