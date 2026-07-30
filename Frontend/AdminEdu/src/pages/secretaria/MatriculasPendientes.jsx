import { useEffect, useState } from "react";
import api from "../../api/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/Table";
import { Button } from "../../components/ui/Button";
import { Alert } from "../../components/ui/Alert";
import { Badge } from "../../components/ui/Badge";
import { X } from "lucide-react";

const TIPO_PAGO_LABEL = {
    EFECTIVO: "Efectivo",
    TRANSFERENCIA: "Transferencia",
};

export default function MatriculasPendientes() {
    const [matriculas, setMatriculas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [accionando, setAccionando] = useState(null);
    const [modal, setModal] = useState(null); // { tipo: "rechazar"|"cancelar", matricula }
    const [comentario, setComentario] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [detalle, setDetalle] = useState(null); // matrícula seleccionada para ver detalles

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
                                            <Button variant="secondary" size="sm" onClick={() => setDetalle(m)}>
                                                Ver detalles
                                            </Button>
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
                        {modal.tipo === "cancelar" && (
                            <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-lg p-3 mb-4">
                                <p className="font-semibold mb-1">Antes de continuar, ten en cuenta:</p>
                                <ul className="list-disc list-inside space-y-0.5">
                                    <li>Esta acción es <strong>permanente</strong>: a diferencia de rechazar, una matrícula cancelada no puede ser reenviada por el estudiante.</li>
                                    <li>El sistema <strong>no le notifica automáticamente</strong> al estudiante, si es necesario, avísale por otro medio.</li>
                                </ul>
                            </div>
                        )}
                        <form onSubmit={handleConfirmarModal} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Motivo<span className="text-red-500 ml-0.5">*</span></label>
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

            {detalle && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm overflow-y-auto">
                    <div className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 my-8">
                        <button
                            onClick={() => setDetalle(null)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <h3 className="text-lg font-bold text-gray-900 mb-4">Detalle de la solicitud</h3>

                        <div className="space-y-5 text-sm">
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Estudiante</p>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                                    <p className="text-gray-500">Nombre</p>
                                    <p className="text-gray-900 font-medium">{detalle.estudiante_nombre}</p>
                                    <p className="text-gray-500">Identificación</p>
                                    <p className="text-gray-900">{detalle.estudiante_identificacion}</p>
                                    <p className="text-gray-500">Correo</p>
                                    <p className="text-gray-900">{detalle.estudiante_correo || "—"}</p>
                                    <p className="text-gray-500">Teléfono</p>
                                    <p className="text-gray-900">{detalle.estudiante_telefono || "—"}</p>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-4">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Curso / Paralelo</p>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                                    <p className="text-gray-500">Curso</p>
                                    <p className="text-gray-900">{detalle.curso_nombre} (${detalle.curso_precio})</p>
                                    <p className="text-gray-500">Paralelo</p>
                                    <p className="text-gray-900">{detalle.paralelo_nombre}</p>
                                    <p className="text-gray-500">Docente</p>
                                    <p className="text-gray-900">{detalle.docente_nombre || "Sin asignar"}</p>
                                    <p className="text-gray-500">Días de clase</p>
                                    <p className="text-gray-900">{Array.isArray(detalle.dias_clase) ? detalle.dias_clase.join(", ") : "—"}</p>
                                    <p className="text-gray-500">Horario</p>
                                    <p className="text-gray-900">{detalle.hora_inicio} - {detalle.hora_fin}</p>
                                    <p className="text-gray-500">Cupo máximo</p>
                                    <p className="text-gray-900">{detalle.cupo_max}</p>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-4">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Pago</p>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                                    <p className="text-gray-500">Tipo de pago</p>
                                    <p className="text-gray-900">{TIPO_PAGO_LABEL[detalle.tipo_pago] || detalle.tipo_pago}</p>
                                    <p className="text-gray-500">Monto</p>
                                    <p className="text-gray-900">${detalle.monto}</p>
                                    {detalle.tipo_pago === "TRANSFERENCIA" && (
                                        <>
                                            <p className="text-gray-500">Número de referencia</p>
                                            <p className="text-gray-900">{detalle.numero_ref || "—"}</p>
                                        </>
                                    )}
                                    <p className="text-gray-500">Fecha de pago</p>
                                    <p className="text-gray-900">{detalle.fecha_pago}</p>
                                    <p className="text-gray-500">Comprobante</p>
                                    <p>
                                        {detalle.comprobante_url ? (
                                            <a href={detalle.comprobante_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                                                Ver comprobante
                                            </a>
                                        ) : (
                                            <span className="text-gray-400">Sin comprobante</span>
                                        )}
                                    </p>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-4">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Solicitud</p>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                                    <p className="text-gray-500">Fecha de solicitud</p>
                                    <p className="text-gray-900">{detalle.fecha_solicitud}</p>
                                    <p className="text-gray-500">Estado</p>
                                    <p><Badge variant="yellow">{detalle.estado}</Badge></p>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 border-t border-gray-100 pt-4 mt-5">
                            <Button variant="ghostDanger" size="sm" onClick={() => { setDetalle(null); abrirModal("rechazar", detalle); }}>
                                Rechazar
                            </Button>
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={() => { setDetalle(null); handleAprobar(detalle); }}
                                isLoading={accionando === detalle.id}
                            >
                                Aprobar
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
