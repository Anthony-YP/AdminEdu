import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import api from "../api/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/Table";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { Alert } from "../components/ui/Alert";
import { Badge } from "../components/ui/Badge";

export default function Paralelos() {
    const { hasGroup } = useAuth();
    const esAdmin = hasGroup(["Director", "Secretaria"]);

    // Estado principal
    const [paralelos, setParalelos] = useState([]);
    const [cursos, setCursos] = useState([]);
    const [docentes, setDocentes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Formulario (crear/editar)
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formData, setFormData] = useState({
        id: null,
        curso: "",
        docente: "",
        nombre: "",
        dias_clase: "",
        hora_inicio: "",
        hora_fin: "",
        cupo_max: ""
    });
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState("");

    // Eliminación (doble confirmación)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [paraleloToDelete, setParaleloToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    // Cargar datos (paralelos y cursos)
    useEffect(() => {
        cargarDatos();
    }, []);

    // Auto‑limpiar mensajes de éxito/error
    useEffect(() => {
        if (success || error) {
            const timer = setTimeout(() => {
                setSuccess("");
                setError("");
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [success, error]);

    // ─── Funciones de API ──────────────────────────────────────────────

    const cargarDatos = async () => {
        try {
            setLoading(true);
            setError("");
            const [resParalelos, resCursos, resDocentes] = await Promise.all([
                api.get("/paralelos/"),
                api.get("/cursos/"),
                api.get("/docentes/")
            ]);
            setParalelos(resParalelos.data);
            setCursos(resCursos.data);
            setDocentes(resDocentes.data || []);
        } catch (err) {
            console.error("Error al cargar datos:", err);
            setError("No se pudieron cargar los paralelos o cursos.");
        } finally {
            setLoading(false);
        }
    };

    const extraerMensajeError = (err) => {
        if (err.response?.data) {
            const data = err.response.data;
            if (typeof data === 'object' && !data.detail) {
                return Object.keys(data)
                    .map((key) => {
                        const msgs = Array.isArray(data[key]) ? data[key].join(", ") : data[key];
                        return `${key}: ${msgs}`;
                    })
                    .join(" | ");
            }
            return data.detail || "Error en la operación.";
        }
        return "Ocurrió un error inesperado.";
    };

    // ─── Formulario ────────────────────────────────────────────────────

    const handleOpenForm = (paralelo = null) => {
        setFormError("");
        if (paralelo) {
            setFormData({
                id: paralelo.id,
                curso: paralelo.curso.toString(),
                docente: paralelo.docente.toString(),
                nombre: paralelo.nombre || "",
                dias_clase: paralelo.dias_clase || "",
                hora_inicio: paralelo.hora_inicio || "",
                hora_fin: paralelo.hora_fin || "",
                cupo_max: paralelo.cupo_max?.toString() || ""
            });
        } else {
            setFormData({
                id: null,
                curso: "",
                docente: "",
                nombre: "",
                dias_clase: "",
                hora_inicio: "",
                hora_fin: "",
                cupo_max: ""
            });
        }
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setFormError("");
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError("");

        // Validaciones
        if (!formData.curso) {
            setFormError("Debe seleccionar un curso.");
            return;
        }
        if (!formData.docente) {
            setFormError("Debe seleccionar un docente.");
            return;
        }
        if (!formData.nombre.trim()) {
            setFormError("El nombre del paralelo es requerido.");
            return;
        }
        if (!formData.dias_clase.trim()) {
            setFormError("Los días de clase son requeridos.");
            return;
        }
        if (!formData.hora_inicio || !formData.hora_fin) {
            setFormError("Las horas de inicio y fin son requeridas.");
            return;
        }
        if (formData.hora_inicio >= formData.hora_fin) {
            setFormError("La hora de inicio debe ser anterior a la hora de fin.");
            return;
        }
        if (!formData.cupo_max || isNaN(Number(formData.cupo_max)) || Number(formData.cupo_max) <= 0) {
            setFormError("El cupo máximo debe ser un número mayor a 0.");
            return;
        }

        try {
            setSubmitting(true);
            const payload = {
                curso: Number(formData.curso),
                docente: Number(formData.docente),
                nombre: formData.nombre.trim(),
                dias_clase: formData.dias_clase.trim(),
                hora_inicio: formData.hora_inicio,
                hora_fin: formData.hora_fin,
                cupo_max: Number(formData.cupo_max)
            };

            let response;
            if (formData.id) {
                response = await api.put(`/paralelos/${formData.id}/`, payload);
                setParalelos(paralelos.map(p => p.id === formData.id ? response.data : p));
                setSuccess(`Paralelo "${response.data.nombre}" actualizado exitosamente.`);
            } else {
                response = await api.post("/paralelos/", payload);
                setParalelos([...paralelos, response.data]);
                setSuccess(`Paralelo "${response.data.nombre}" creado exitosamente.`);
            }
            handleCloseForm();
        } catch (err) {
            console.error("Error al guardar paralelo:", err);
            setFormError(extraerMensajeError(err));
        } finally {
            setSubmitting(false);
        }
    };

    // ─── Eliminación ────────────────────────────────────────────────────

    const confirmDelete = (paralelo) => {
        setParaleloToDelete(paralelo);
        setIsDeleteOpen(true);
    };

    const handleDelete = async () => {
        if (!paraleloToDelete) return;
        try {
            setDeleting(true);
            await api.delete(`/paralelos/${paraleloToDelete.id}/`);
            setParalelos(paralelos.filter(p => p.id !== paraleloToDelete.id));
            setSuccess(`Paralelo "${paraleloToDelete.nombre}" eliminado exitosamente.`);
            setIsDeleteOpen(false);
            setParaleloToDelete(null);
        } catch (err) {
            console.error("Error al eliminar paralelo:", err);
            let msg = "No se pudo eliminar el paralelo.";
            if (err.response?.status === 409 || err.response?.data?.detail?.includes("asociados")) {
                msg = "No se puede eliminar el paralelo porque tiene matrículas u otros registros asociados.";
            } else {
                msg = extraerMensajeError(err);
            }
            setError(msg);
            setIsDeleteOpen(false);
        } finally {
            setDeleting(false);
        }
    };

    // ─── Renderizado condicional ──────────────────────────────────────

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
            </div>
        );
    }

    // ─── JSX principal ─────────────────────────────────────────────────

    return (
        <div className="space-y-6 animate-slideDown">
            {/* Header con contador */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                        Paralelos
                        <span className="ml-2 text-sm font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                            {paralelos.length} {paralelos.length === 1 ? "sección" : "secciones"}
                        </span>
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">Gestión de secciones, horarios y cupos</p>
                </div>
                {esAdmin && (
                    <Button onClick={() => handleOpenForm()} variant="primary">
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Nuevo Paralelo
                    </Button>
                )}
            </div>

            {/* Alertas */}
            {success && <Alert variant="success">{success}</Alert>}
            {error && <Alert variant="error">{error}</Alert>}

            {/* Tabla estilizada */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <Table>
                    <TableHead className="bg-gray-50/50">
                        <TableRow>
                            <TableHeader className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Curso</TableHeader>
                            <TableHeader className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Paralelo</TableHeader>
                            <TableHeader className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Docente</TableHeader>
                            <TableHeader className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Horario</TableHeader>
                            <TableHeader className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Cupo</TableHeader>
                            {esAdmin && <TableHeader className="text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Acciones</TableHeader>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paralelos.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={esAdmin ? 6 : 5} className="text-center text-gray-500 py-8">
                                    <div className="flex flex-col items-center">
                                        <svg className="w-12 h-12 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        <span className="font-medium">No hay paralelos registrados</span>
                                        {esAdmin && (
                                            <Button variant="link" onClick={() => handleOpenForm()} className="mt-2 text-blue-600">
                                                Crear el primer paralelo
                                            </Button>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            paralelos.map((paralelo) => {
                                // Buscar el nombre del curso para mostrarlo (opcional)
                                const curso = cursos.find(c => c.id === paralelo.curso);
                                const cursoNombre = curso ? curso.nombre : `ID ${paralelo.curso}`;
                                const docente = docentes.find(d => d.id === paralelo.docente);
                                const docenteNombre = docente
                                    ? `${docente.nombres} ${docente.apellidos}`
                                    : `ID ${paralelo.docente}`;

                                return (
                                    <TableRow key={paralelo.id} className="hover:bg-gray-50/50 transition-colors">
                                        <TableCell className="font-medium text-gray-900">
                                            <Badge variant="blue">{cursoNombre}</Badge>
                                        </TableCell>
                                        <TableCell className="font-semibold text-gray-800">{paralelo.nombre}</TableCell>
                                        <TableCell className="text-gray-600">
                                            <Badge variant="gray">{docenteNombre}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm text-gray-900">{paralelo.dias_clase}</div>
                                            <div className="text-xs text-gray-500">{paralelo.hora_inicio} - {paralelo.hora_fin}</div>
                                        </TableCell>
                                        <TableCell className="text-gray-600 font-medium">{paralelo.cupo_max}</TableCell>
                                        {esAdmin && (
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="sm" onClick={() => handleOpenForm(paralelo)} className="text-blue-600 hover:bg-blue-50">
                                                        Editar
                                                    </Button>
                                                    <Button variant="ghostDanger" size="sm" onClick={() => confirmDelete(paralelo)} className="text-red-600 hover:bg-red-50">
                                                        Eliminar
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* ─── MODAL DE FORMULARIO (personalizado) ───────────────── */}
            {isFormOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
                    <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
                        <button
                            onClick={handleCloseForm}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            {formData.id ? "Editar Paralelo" : "Nuevo Paralelo"}
                        </h2>

                        <form id="paralelo-form" onSubmit={handleSubmit} className="space-y-5">
                            {formError && <Alert variant="error">{formError}</Alert>}

                            <Select
                                label="Curso Asociado"
                                name="curso"
                                value={formData.curso}
                                onChange={handleChange}
                                required
                                options={cursos.map(c => ({ value: c.id.toString(), label: `${c.nombre} ($${c.precio})` }))}
                            />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Input
                                    label="Nombre del Paralelo"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    required
                                    placeholder="Ej. A, B, Nocturno..."
                                />
                                <Select
                                    label="Docente"
                                    name="docente"
                                    value={formData.docente}
                                    onChange={handleChange}
                                    required
                                    options={docentes.map((docente) => ({
                                        value: docente.id.toString(),
                                        label: `${docente.nombres} ${docente.apellidos} (${docente.numero_identificacion || "Sin identificación"})`
                                    }))}
                                    placeholder="Selecciona un docente"
                                />
                                <p className="col-span-1 sm:col-span-2 text-xs text-gray-500 -mt-2 mb-2">
                                    * Selecciona el docente que impartirá el paralelo desde la lista registrada.
                                </p>
                            </div>

                            <Input
                                label="Días de Clase"
                                name="dias_clase"
                                value={formData.dias_clase}
                                onChange={handleChange}
                                required
                                placeholder="Ej. Lunes y Miércoles"
                            />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Input
                                    label="Hora de Inicio"
                                    name="hora_inicio"
                                    type="time"
                                    value={formData.hora_inicio}
                                    onChange={handleChange}
                                    required
                                />
                                <Input
                                    label="Hora de Fin"
                                    name="hora_fin"
                                    type="time"
                                    value={formData.hora_fin}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <Input
                                label="Cupo Máximo"
                                name="cupo_max"
                                type="number"
                                min="1"
                                value={formData.cupo_max}
                                onChange={handleChange}
                                required
                                placeholder="Ej. 30"
                            />

                            <div className="flex justify-end gap-3 border-t pt-4">
                                <Button type="button" variant="secondary" onClick={handleCloseForm} disabled={submitting}>
                                    Cancelar
                                </Button>
                                <Button type="submit" variant="primary" isLoading={submitting}>
                                    {formData.id ? "Guardar Cambios" : "Crear Paralelo"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ─── MODAL DE CONFIRMACIÓN PARA ELIMINAR (personalizado) ─ */}
            {isDeleteOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
                    <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Eliminar Paralelo</h3>
                        <p className="text-gray-600 mb-6">
                            ¿Está seguro de que desea eliminar el paralelo "<strong>{paraleloToDelete?.nombre}</strong>"?
                            Esta acción eliminará permanentemente el paralelo y todos sus datos asociados, incluyendo matrículas vinculadas.
                        </p>
                        <div className="flex justify-end gap-3">
                            <Button variant="secondary" onClick={() => setIsDeleteOpen(false)} disabled={deleting}>
                                Cancelar
                            </Button>
                            <Button variant="danger" onClick={handleDelete} isLoading={deleting}>
                                Eliminar Paralelo
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}