import { useEffect, useState } from "react";
import api from "../../api/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/Table";
import { Button } from "../../components/ui/Button";
import { Alert } from "../../components/ui/Alert";
import { Badge } from "../../components/ui/Badge";

export default function MatriculasPendientes() {
    const [matriculas, setMatriculas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [accionando, setAccionando] = useState(null);
    const [modal, setModal] = useState(null); // { tipo: "rechazar"|"cancelar", matricula }
    const [comentario, setComentario] = useState("");
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
            const { data } = await api.get("/matriculas/pendientes/");
            setMatriculas(data || []);
        } catch (err) {
            setError("No se pudieron cargar las matrículas pendientes.");
        } finally {
            setLoading(false);
        }
    };

    const extraerMensajeError = (err) =>
        err.response?.data?.detail ||
        (typeof err.response?.data === "object" ? JSON.stringify(err.response.data) : "Ocurrió un error inesperado.");

    const handleAprobar = async (matricula) => {
        try {
            setAccionando(matricula.id);
            await api.post(`/matriculas/${matricula.id}/aprobar/`);
            setMatriculas((prev) => prev.filter((m) => m.id !== matricula.id));
            setSuccess(`Matrícula de ${matricula.estudiante_nombre} aprobada.`);
        } catch (err) {
            setError(extraerMensajeError(err));
        } finally {
            setAccionando(null);
        }
    };

    const abrirModal = (tipo, matricula) => {
        setModal({ tipo, matricula });
        setComentario("");
    };

    const handleConfirmarModal = async (e) => {
        e.preventDefault();
        if (!comentario.trim()) return;
        try {
            setSubmitting(true);
            const accion = modal.tipo; // "rechazar" | "cancelar"
            await api.post(`/matriculas/${modal.matricula.id}/${accion}/`, { comentario });
            setMatriculas((prev) => prev.filter((m) => m.id !== modal.matricula.id));
            setSuccess(`Matrícula de ${modal.matricula.estudiante_nombre} ${accion === "rechazar" ? "rechazada" : "cancelada"}.`);
            setModal(null);
        } catch (err) {
            setError(extraerMensajeError(err));
        } finally {
            setSubmitting(false);
        }
    };

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
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    Matrículas Pendientes
                    <span className="text-sm font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        {matriculas.length}
                    </span>
                </h1>
                <p className="text-sm text-gray-500 mt-1">Revisa y aprueba/rechaza las solicitudes de matrícula.</p>
            </div>

            {success && <Alert variant="success">{success}</Alert>}
            {error && <Alert variant="error">{error}</Alert>}

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <Table>
                    <TableHead className="bg-gray-50/50">
                        <TableRow>
                            <TableHeader>Estudiante</TableHeader>
                            <TableHeader>Curso / Paralelo</TableHeader>
                            <TableHeader>Fecha solicitud</TableHeader>
                            <TableHeader>Comprobante</TableHeader>
                            <TableHeader className="text-right">Acciones</TableHeader>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {matriculas.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                                    No hay solicitudes pendientes.
                                </TableCell>
                            </TableRow>
                        ) : (
                            matriculas.map((m) => (
                                <TableRow key={m.id} className="hover:bg-gray-50/50">
                                    <TableCell>
                                        <p className="font-medium text-gray-900">{m.estudiante_nombre}</p>
                                        <p className="text-xs text-gray-400">{m.estudiante_identificacion}</p>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="blue">{m.curso_nombre}</Badge>
                                        <span className="ml-2 text-sm text-gray-600">{m.paralelo_nombre}</span>
                                    </TableCell>
                                    <TableCell className="text-sm text-gray-600">{m.fecha_solicitud}</TableCell>
                                    <TableCell>
                                        {m.comprobante_url ? (
                                            <a href={m.comprobante_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-sm">
                                                Ver comprobante
                                            </a>
                                        ) : (
                                            <span className="text-gray-400 text-sm">—</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                onClick={() => handleAprobar(m)}
                                                isLoading={accionando === m.id}
                                            >
                                                Aprobar
                                            </Button>
                                            <Button variant="ghostDanger" size="sm" onClick={() => abrirModal("rechazar", m)}>
                                                Rechazar
                                            </Button>
                                            <Button variant="ghostDanger" size="sm" onClick={() => abrirModal("cancelar", m)}>
                                                Cancelar
                                            </Button>
                                        </div>
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
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                            {modal.tipo === "rechazar" ? "Rechazar" : "Cancelar"} matrícula
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Estudiante: <strong>{modal.matricula.estudiante_nombre}</strong>
                        </p>
                        <form onSubmit={handleConfirmarModal} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Motivo (obligatorio)</label>
                                <textarea
                                    className="w-full rounded border px-3 py-2 text-sm"
                                    rows={3}
                                    value={comentario}
                                    onChange={(e) => setComentario(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-3">
                                <Button type="button" variant="secondary" onClick={() => setModal(null)} disabled={submitting}>
                                    Cancelar
                                </Button>
                                <Button type="submit" variant="danger" isLoading={submitting}>
                                    Confirmar
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
