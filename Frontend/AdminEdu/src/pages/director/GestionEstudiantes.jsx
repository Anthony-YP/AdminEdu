import { useEffect, useMemo, useState } from "react";
import api from "../../api/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/Table";
import { Button } from "../../components/ui/Button";
import { Alert } from "../../components/ui/Alert";
import { Badge } from "../../components/ui/Badge";

export default function GestionEstudiantes() {
    const [estudiantes, setEstudiantes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [busqueda, setBusqueda] = useState("");

    const [modal, setModal] = useState(null);
    const [motivo, setMotivo] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        cargar();
    }, []);

    useEffect(() => {
        if (success || error) {
            const t = setTimeout(() => { setSuccess(""); setError(""); }, 4000);
            return () => clearTimeout(t);
        }
    }, [success, error]);

    const cargar = async () => {
        try {
            setLoading(true);
            setError("");
            const { data } = await api.get("/estudiantes/");
            setEstudiantes(data || []);
        } catch {
            setError("No se pudieron cargar los estudiantes.");
        } finally {
            setLoading(false);
        }
    };

    const estudiantesFiltrados = useMemo(() => {
        const q = busqueda.trim().toLowerCase();
        if (!q) return estudiantes;
        return estudiantes.filter((est) => {
            const nombreCompleto = `${est.nombres} ${est.apellidos}`.toLowerCase();
            return nombreCompleto.includes(q) || (est.numero_identificacion || "").toLowerCase().includes(q);
        });
    }, [estudiantes, busqueda]);

    const abrirModal = (estudiante) => {
        setModal(estudiante);
        setMotivo("");
    };

    const handleConfirmar = async (e) => {
        e.preventDefault();
        if (!motivo.trim()) return;
        try {
            setSubmitting(true);
            await api.post(`/estudiantes/${modal.id}/dar-baja/`, { motivo });
            setSuccess(`${modal.nombres} ${modal.apellidos} fue dado de baja.`);
            setModal(null);
            cargar();
        } catch (err) {
            setError(err.response?.data?.detail || "No se pudo dar de baja al estudiante.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    Estudiantes
                    <span className="text-sm font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        {estudiantesFiltrados.length} de {estudiantes.length}
                    </span>
                </h1>
                <p className="text-sm text-gray-500 mt-1">Gestión de estudiantes registrados.</p>
            </div>

            {success && <Alert variant="success">{success}</Alert>}
            {error && <Alert variant="error">{error}</Alert>}

            <div className="relative max-w-sm">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                    type="text"
                    placeholder="Buscar por nombre o identificación..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <Table>
                    <TableHead className="bg-gray-50/50">
                        <TableRow>
                            <TableHeader>Nombre</TableHeader>
                            <TableHeader>Identificación</TableHeader>
                            <TableHeader>Correo</TableHeader>
                            <TableHeader>Estado</TableHeader>
                            <TableHeader className="text-right">Acciones</TableHeader>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow><TableCell colSpan={5} className="text-center text-gray-500 py-8">Cargando...</TableCell></TableRow>
                        ) : estudiantesFiltrados.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                                    {estudiantes.length === 0 ? "No hay estudiantes registrados." : "Ningún estudiante coincide con la búsqueda."}
                                </TableCell>
                            </TableRow>
                        ) : (
                            estudiantesFiltrados.map((est) => (
                                <TableRow key={est.id} className="hover:bg-gray-50/50">
                                    <TableCell className="font-medium text-gray-900">{est.nombres} {est.apellidos}</TableCell>
                                    <TableCell>{est.numero_identificacion}</TableCell>
                                    <TableCell>{est.correo}</TableCell>
                                    <TableCell>
                                        {est.fecha_baja ? (
                                            <Badge variant="red">Dado de baja ({est.fecha_baja})</Badge>
                                        ) : (
                                            <Badge variant="green">Activo</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {!est.fecha_baja && (
                                            <Button variant="ghostDanger" size="sm" onClick={() => abrirModal(est)} className="text-red-600 hover:bg-red-50">
                                                Dar de baja
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {modal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
                    <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Dar de baja</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Estudiante: <strong>{modal.nombres} {modal.apellidos}</strong>. Esto desactivará su cuenta y no podrá iniciar sesión.
                        </p>
                        <form onSubmit={handleConfirmar} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Motivo (obligatorio)</label>
                                <textarea
                                    className="w-full rounded border px-3 py-2 text-sm"
                                    rows={3}
                                    value={motivo}
                                    onChange={(e) => setMotivo(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-3">
                                <Button type="button" variant="secondary" onClick={() => setModal(null)} disabled={submitting}>Cancelar</Button>
                                <Button type="submit" variant="danger" isLoading={submitting}>Confirmar baja</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
