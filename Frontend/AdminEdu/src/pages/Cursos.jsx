import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import api from "../api/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/Table";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { Alert } from "../components/ui/Alert";
import { Badge } from "../components/ui/Badge";

export default function Cursos() {
    const { hasGroup } = useAuth();
    const esDirector = hasGroup(["Director"]);

    // Estado principal
    const [cursos, setCursos] = useState([]);
    const [academias, setAcademias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Estado del formulario (crear/editar)
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formData, setFormData] = useState({
        id: null,
        academia: "",
        nombre: "",
        precio: "",
        fecha_inicio: "",
        fecha_fin: "",
    });
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState("");

    // Estado para eliminación (doble confirmación)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [cursoToDelete, setCursoToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    // Cargar cursos y academias al montar
    useEffect(() => {
        cargarCursos();
        cargarAcademias();
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

    const cargarCursos = async () => {
        try {
            setLoading(true);
            setError("");
            const response = await api.get("/cursos/");
            setCursos(response.data);
        } catch (err) {
            console.error("Error al cargar cursos:", err);
            setError("No se pudieron cargar los cursos. Intente nuevamente.");
        } finally {
            setLoading(false);
        }
    };

    const cargarAcademias = async () => {
        try {
            const response = await api.get("/academias/");
            setAcademias(response.data || []);
        } catch (err) {
            console.error("Error al cargar academias:", err);
            setError("No se pudieron cargar las academias. Intente nuevamente.");
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

    const handleOpenForm = (curso = null) => {
        setFormError("");
        if (curso) {
            setFormData({
                id: curso.id,
                academia: curso.academia?.id ?? curso.academia ?? "",
                nombre: curso.nombre || "",
                precio: curso.precio ?? "",
                fecha_inicio: curso.fecha_inicio || "",
                fecha_fin: curso.fecha_fin || "",
            });
        } else {
            setFormData({
                id: null,
                academia: "",
                nombre: "",
                precio: "",
                fecha_inicio: "",
                fecha_fin: "",
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
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError("");

        // Validaciones
        if (!formData.academia) {
            setFormError("Debe seleccionar una academia.");
            return;
        }
        if (!formData.nombre.trim()) {
            setFormError("El nombre del curso es requerido.");
            return;
        }
        if (!formData.precio || isNaN(formData.precio) || parseFloat(formData.precio) < 0) {
            setFormError("El precio debe ser un número válido mayor o igual a 0.");
            return;
        }
        if (!formData.fecha_inicio) {
            setFormError("La fecha de inicio es requerida.");
            return;
        }
        if (!formData.fecha_fin) {
            setFormError("La fecha de fin es requerida.");
            return;
        }
        if (new Date(formData.fecha_inicio) > new Date(formData.fecha_fin)) {
            setFormError("La fecha de inicio no puede ser posterior a la fecha de fin.");
            return;
        }

        try {
            setSubmitting(true);
            const payload = {
                academia: Number(formData.academia),
                nombre: formData.nombre.trim(),
                precio: parseFloat(formData.precio),
                fecha_inicio: formData.fecha_inicio,
                fecha_fin: formData.fecha_fin,
            };

            let response;
            if (formData.id) {
                response = await api.put(`/cursos/${formData.id}/`, payload);
                setCursos(cursos.map((c) => (c.id === formData.id ? response.data : c)));
                setSuccess(`Curso "${response.data.nombre}" actualizado exitosamente.`);
            } else {
                response = await api.post("/cursos/", payload);
                setCursos([...cursos, response.data]);
                setSuccess(`Curso "${response.data.nombre}" creado exitosamente.`);
            }
            handleCloseForm();
        } catch (err) {
            console.error("Error al guardar curso:", err);
            setFormError(extraerMensajeError(err));
        } finally {
            setSubmitting(false);
        }
    };

    // ─── Eliminación (doble confirmación) ─────────────────────────────

    const confirmDelete = (curso) => {
        setCursoToDelete(curso);
        setIsDeleteOpen(true);
    };

    const handleDelete = async () => {
        if (!cursoToDelete) return;
        try {
            setDeleting(true);
            await api.delete(`/cursos/${cursoToDelete.id}/`);
            setCursos(cursos.filter((c) => c.id !== cursoToDelete.id));
            setSuccess(`Curso "${cursoToDelete.nombre}" eliminado exitosamente.`);
            setIsDeleteOpen(false);
            setCursoToDelete(null);
        } catch (err) {
            console.error("Error al eliminar curso:", err);
            let msg = "No se pudo eliminar el curso.";
            if (err.response?.status === 409 || err.response?.data?.detail?.includes("asociados")) {
                msg = "No se puede eliminar el curso porque tiene paralelos asociados.";
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
                <svg
                    className="animate-spin h-8 w-8 text-blue-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
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
                        Cursos
                        <span className="ml-2 text-sm font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                            {cursos.length} {cursos.length === 1 ? "curso" : "cursos"}
                        </span>
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">Administre los cursos ofertados</p>
                </div>
                {esDirector && (
                    <Button onClick={() => handleOpenForm()} variant="primary">
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Nuevo Curso
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
                            <TableHeader className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Nombre
                            </TableHeader>
                            <TableHeader className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Precio
                            </TableHeader>
                            <TableHeader className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Inicio
                            </TableHeader>
                            <TableHeader className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Fin
                            </TableHeader>
                            <TableHeader className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Estado
                            </TableHeader>
                            {esDirector && (
                                <TableHeader className="text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                                    Acciones
                                </TableHeader>
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {cursos.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={esDirector ? 6 : 5}
                                    className="text-center text-gray-500 py-8"
                                >
                                    <div className="flex flex-col items-center">
                                        <svg
                                            className="w-12 h-12 text-gray-300 mb-2"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1.5}
                                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                            />
                                        </svg>
                                        <span className="font-medium">No hay cursos registrados</span>
                                        {esDirector && (
                                            <Button
                                                variant="link"
                                                onClick={() => handleOpenForm()}
                                                className="mt-2 text-blue-600"
                                            >
                                                Crear el primer curso
                                            </Button>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            cursos.map((curso) => {
                                // Determinar estado según fechas
                                const hoy = new Date();
                                const fechaInicio = new Date(curso.fecha_inicio);
                                const fechaFin = new Date(curso.fecha_fin);
                                let estado = "Activo";
                                let variant = "green";
                                if (hoy < fechaInicio) {
                                    estado = "Próximo";
                                    variant = "yellow";
                                } else if (hoy > fechaFin) {
                                    estado = "Finalizado";
                                    variant = "gray";
                                }

                                return (
                                    <TableRow
                                        key={curso.id}
                                        className="hover:bg-gray-50/50 transition-colors"
                                    >
                                        <TableCell className="font-semibold text-gray-800">
                                            {curso.nombre}
                                        </TableCell>
                                        <TableCell className="font-medium text-gray-900">
                                            ${parseFloat(curso.precio).toFixed(2)}
                                        </TableCell>
                                        <TableCell className="text-gray-600">
                                            {new Date(curso.fecha_inicio).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-gray-600">
                                            {new Date(curso.fecha_fin).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={variant}
                                                className={`${variant === "green"
                                                        ? "bg-green-100 text-green-800"
                                                        : variant === "yellow"
                                                            ? "bg-yellow-100 text-yellow-800"
                                                            : "bg-gray-100 text-gray-800"
                                                    }`}
                                            >
                                                {estado}
                                            </Badge>
                                        </TableCell>
                                        {esDirector && (
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleOpenForm(curso)}
                                                        className="text-blue-600 hover:bg-blue-50"
                                                    >
                                                        Editar
                                                    </Button>
                                                    <Button
                                                        variant="ghostDanger"
                                                        size="sm"
                                                        onClick={() => confirmDelete(curso)}
                                                        className="text-red-600 hover:bg-red-50"
                                                    >
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
                        {/* Botón cerrar */}
                        <button
                            onClick={handleCloseForm}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            {formData.id ? "Editar Curso" : "Nuevo Curso"}
                        </h2>

                        <form id="curso-form" onSubmit={handleSubmit} className="space-y-5">
                            {formError && <Alert variant="error">{formError}</Alert>}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="sm:col-span-2">
                                    <Select
                                        label="Academia"
                                        name="academia"
                                        value={formData.academia}
                                        onChange={handleChange}
                                        required
                                        options={academias.map((academia) => ({
                                            value: academia.id,
                                            label: academia.nombre,
                                        }))}
                                        placeholder="Selecciona una academia"
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <Input
                                        label="Nombre del Curso"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        placeholder="Ej. Matemáticas Avanzadas"
                                        required
                                        autoFocus
                                    />
                                </div>
                                <Input
                                    label="Precio (USD)"
                                    name="precio"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.precio}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    required
                                />
                                <Input
                                    label="Fecha de Inicio"
                                    name="fecha_inicio"
                                    type="date"
                                    value={formData.fecha_inicio}
                                    onChange={handleChange}
                                    required
                                />
                                <Input
                                    label="Fecha de Fin"
                                    name="fecha_fin"
                                    type="date"
                                    value={formData.fecha_fin}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="flex justify-end gap-3 border-t pt-4">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={handleCloseForm}
                                    disabled={submitting}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    isLoading={submitting}
                                >
                                    {formData.id ? "Guardar Cambios" : "Crear Curso"}
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
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Eliminar Curso</h3>
                        <p className="text-gray-600 mb-6">
                            ¿Está seguro de que desea eliminar el curso "<strong>{cursoToDelete?.nombre}</strong>"?
                            Esta acción eliminará permanentemente el curso y todos sus datos asociados, incluyendo paralelos y matrículas vinculadas.
                        </p>
                        <div className="flex justify-end gap-3">
                            <Button
                                variant="secondary"
                                onClick={() => setIsDeleteOpen(false)}
                                disabled={deleting}
                            >
                                Cancelar
                            </Button>
                            <Button
                                variant="danger"
                                onClick={handleDelete}
                                isLoading={deleting}
                            >
                                Eliminar Curso
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}