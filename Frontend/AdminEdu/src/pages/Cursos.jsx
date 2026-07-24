import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import api from "../api/api";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { Alert } from "../components/ui/Alert";
import { Badge } from "../components/ui/Badge";
import { Lock } from "lucide-react";

const FORM_VACIO = {
    id: null,
    academia: "",
    nombre: "",
    descripcion: "",
    precio: "",
    fecha_inicio: "",
    fecha_fin: "",
};

export default function Cursos() {
    const { hasGroup } = useAuth();
    const esDirector = hasGroup(["Director"]);

    // Estado principal
    const [cursos, setCursos] = useState([]);
    const [academias, setAcademias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Filtros del listado
    const [busqueda, setBusqueda] = useState("");
    const [filtroEstado, setFiltroEstado] = useState("");
    const [fechaDesde, setFechaDesde] = useState("");
    const [fechaHasta, setFechaHasta] = useState("");
    const [cursoExpandido, setCursoExpandido] = useState(null);

    // Estado del formulario (crear/editar)
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formData, setFormData] = useState(FORM_VACIO);
    const [imagenFile, setImagenFile] = useState(null);
    const [imagenPreview, setImagenPreview] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState("");

    // Cambio de estado (baja lógica: Activo/Desactivado/Cerrado)
    const [cambiandoEstado, setCambiandoEstado] = useState(null);
    const [confirmCierre, setConfirmCierre] = useState(null);

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

    // ─── Listado filtrado ───────────────────────────────────────────────

    const cursosFiltrados = useMemo(() => {
        const q = busqueda.trim().toLowerCase();
        return cursos.filter((curso) => {
            if (filtroEstado && curso.estado !== filtroEstado) return false;
            if (q && !curso.nombre.toLowerCase().includes(q) && !(curso.academia_nombre || "").toLowerCase().includes(q)) return false;
            // Rango de fechas: se muestra el curso si su periodo (fecha_inicio -
            // fecha_fin) se solapa con el rango seleccionado.
            if (fechaDesde && curso.fecha_fin < fechaDesde) return false;
            if (fechaHasta && curso.fecha_inicio > fechaHasta) return false;
            return true;
        });
    }, [cursos, busqueda, filtroEstado, fechaDesde, fechaHasta]);

    // ─── Formulario ────────────────────────────────────────────────────

    const handleOpenForm = (curso = null) => {
        setFormError("");
        setImagenFile(null);
        if (curso) {
            setFormData({
                id: curso.id,
                academia: curso.academia?.id ?? curso.academia ?? "",
                nombre: curso.nombre || "",
                descripcion: curso.descripcion || "",
                precio: curso.precio ?? "",
                fecha_inicio: curso.fecha_inicio || "",
                fecha_fin: curso.fecha_fin || "",
            });
            setImagenPreview(curso.imagen || null);
        } else {
            setFormData(FORM_VACIO);
            setImagenPreview(null);
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

    const handleImagenChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImagenFile(file);
        setImagenPreview(URL.createObjectURL(file));
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
        if (!formData.descripcion.trim()) {
            setFormError("La descripción del curso es requerida.");
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
            const payload = new FormData();
            payload.append("academia", Number(formData.academia));
            payload.append("nombre", formData.nombre.trim());
            payload.append("descripcion", formData.descripcion.trim());
            payload.append("precio", parseFloat(formData.precio));
            payload.append("fecha_inicio", formData.fecha_inicio);
            payload.append("fecha_fin", formData.fecha_fin);
            if (imagenFile) payload.append("imagen", imagenFile);

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

    // ─── Cambio de estado (baja lógica) ────────────────────────────────

    const handleCambiarEstado = async (curso, nuevoEstado) => {
        try {
            setCambiandoEstado(curso.id);
            const response = await api.post(`/cursos/${curso.id}/estado/`, { estado: nuevoEstado });
            setCursos(cursos.map((c) => (c.id === curso.id ? response.data : c)));
            setSuccess(`Curso "${curso.nombre}" actualizado a estado ${nuevoEstado}.`);
        } catch (err) {
            setError(extraerMensajeError(err));
        } finally {
            setCambiandoEstado(null);
        }
    };

    // Seleccionar "Cerrado" no aplica el cambio de inmediato: primero se pide
    // confirmación explicando que la acción es permanente. Como el <select>
    // es un elemento nativo, el navegador ya movió su valor visible al elegir
    // la opción; si el usuario cancela, React no lo revierte solo porque la
    // prop `value` no cambió entre renders, así que se fuerza aquí.
    const handleSeleccionarEstado = (curso, e) => {
        const nuevoEstado = e.target.value;
        if (nuevoEstado === "CERRADO") {
            e.target.value = curso.estado;
            setConfirmCierre(curso);
            return;
        }
        handleCambiarEstado(curso, nuevoEstado);
    };

    const handleConfirmarCierre = async () => {
        if (!confirmCierre) return;
        await handleCambiarEstado(confirmCierre, "CERRADO");
        setConfirmCierre(null);
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
                            {cursosFiltrados.length} de {cursos.length} {cursos.length === 1 ? "curso" : "cursos"}
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

            {/* Barra de filtros */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Buscar por nombre o academia..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <select
                    className="border border-gray-300 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={filtroEstado}
                    onChange={(e) => setFiltroEstado(e.target.value)}
                >
                    <option value="">Todos los estados</option>
                    <option value="ACTIVO">Activo</option>
                    <option value="DESACTIVADO">Desactivado</option>
                    <option value="CERRADO">Cerrado</option>
                </select>
                <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-500 whitespace-nowrap">Desde</label>
                    <input
                        type="date"
                        value={fechaDesde}
                        onChange={(e) => setFechaDesde(e.target.value)}
                        className="border border-gray-300 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <label className="text-sm text-gray-500 whitespace-nowrap">Hasta</label>
                    <input
                        type="date"
                        value={fechaHasta}
                        onChange={(e) => setFechaHasta(e.target.value)}
                        min={fechaDesde || undefined}
                        className="border border-gray-300 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {(fechaDesde || fechaHasta) && (
                        <button
                            type="button"
                            onClick={() => { setFechaDesde(""); setFechaHasta(""); }}
                            className="text-xs text-gray-400 hover:text-gray-600"
                        >
                            Limpiar
                        </button>
                    )}
                </div>
            </div>

            {/* Grid de tarjetas */}
            {cursosFiltrados.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm py-16 flex flex-col items-center text-gray-500">
                    <svg className="w-12 h-12 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span className="font-medium">
                        {cursos.length === 0 ? "No hay cursos registrados" : "Ningún curso coincide con los filtros"}
                    </span>
                    {esDirector && cursos.length === 0 && (
                        <Button variant="link" onClick={() => handleOpenForm()} className="mt-2 text-blue-600">
                            Crear el primer curso
                        </Button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {cursosFiltrados.map((curso) => {
                        const variant = curso.estado === "ACTIVO" ? "green" : "red";
                        const cerrado = curso.estado === "CERRADO";
                        const paralelos = curso.paralelos || [];
                        const expandido = cursoExpandido === curso.id;

                        return (
                            <div key={curso.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                                <div className="h-36 bg-gray-100 flex items-center justify-center overflow-hidden">
                                    {curso.imagen ? (
                                        <img src={curso.imagen} alt={curso.nombre} className="w-full h-full object-cover" />
                                    ) : (
                                        <svg className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M4 8h16M4 4h16a1 1 0 011 1v14a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1z" />
                                        </svg>
                                    )}
                                </div>

                                <div className="p-4 flex-1 flex flex-col gap-2">
                                    <div className="flex items-start justify-between gap-2">
                                        <h3 className="font-semibold text-gray-900 leading-tight">{curso.nombre}</h3>
                                        <Badge variant={variant} className="flex items-center gap-1">
                                            {cerrado && <Lock className="w-3 h-3" />}
                                            {curso.estado}
                                        </Badge>
                                    </div>
                                    <Badge variant="blue" className="self-start">{curso.academia_nombre}</Badge>
                                    {curso.descripcion && (
                                        <p className="text-sm text-gray-500 line-clamp-2">{curso.descripcion}</p>
                                    )}
                                    <div className="flex items-center justify-between text-sm mt-1">
                                        <span className="font-semibold text-gray-900">${parseFloat(curso.precio).toFixed(2)}</span>
                                        <span className="text-gray-500">
                                            {new Date(curso.fecha_inicio).toLocaleDateString()} - {new Date(curso.fecha_fin).toLocaleDateString()}
                                        </span>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => setCursoExpandido(expandido ? null : curso.id)}
                                        className="mt-1 text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 self-start"
                                    >
                                        {paralelos.length} {paralelos.length === 1 ? "paralelo" : "paralelos"}
                                        <svg className={`w-3 h-3 transition-transform ${expandido ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    {expandido && (
                                        <div className="border-t border-gray-100 pt-2 mt-1 space-y-1.5">
                                            {paralelos.length === 0 ? (
                                                <p className="text-xs text-gray-400">Sin paralelos creados todavía.</p>
                                            ) : (
                                                paralelos.map((p) => (
                                                    <div key={p.id} className="flex items-center justify-between text-xs">
                                                        <span className="text-gray-700 font-medium">{p.nombre}</span>
                                                        <span className="text-gray-400">{p.docente_nombre || "Sin docente"}</span>
                                                        <Badge variant={p.estado === "ACTIVO" ? "green" : "red"} className="text-[10px] py-0">{p.estado}</Badge>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    )}
                                </div>

                                {esDirector && (
                                    <div className="border-t border-gray-100 px-4 py-3 flex items-center justify-between gap-2 bg-gray-50/50">
                                        {cerrado ? (
                                            <p className="text-xs text-red-600 flex items-center gap-1.5">
                                                <Lock className="w-3.5 h-3.5" />
                                                Cerrado: ya no puede editarse ni reabrirse.
                                            </p>
                                        ) : (
                                            <>
                                                <Button variant="ghost" size="sm" onClick={() => handleOpenForm(curso)} className="text-blue-600 hover:bg-blue-50">
                                                    Editar
                                                </Button>
                                                <select
                                                    className="text-xs border rounded px-1.5 py-1"
                                                    value={curso.estado}
                                                    disabled={cambiandoEstado === curso.id}
                                                    onChange={(e) => handleSeleccionarEstado(curso, e)}
                                                >
                                                    <option value="ACTIVO">Activo</option>
                                                    <option value="DESACTIVADO">Desactivado</option>
                                                    <option value="CERRADO">Cerrado</option>
                                                </select>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

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
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Descripción</label>
                                    <textarea
                                        name="descripcion"
                                        value={formData.descripcion}
                                        onChange={handleChange}
                                        rows={3}
                                        required
                                        placeholder="Breve descripción del contenido y objetivos del curso"
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Imagen del curso (opcional)</label>
                                    <div className="flex items-center gap-3">
                                        {imagenPreview && (
                                            <img src={imagenPreview} alt="Vista previa" className="w-16 h-16 rounded-lg object-cover border border-gray-200" />
                                        )}
                                        <input type="file" accept="image/*" onChange={handleImagenChange} className="text-sm" />
                                    </div>
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

            {/* ─── MODAL DE CONFIRMACIÓN: CERRAR CURSO ───────────────── */}
            {confirmCierre && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
                    <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                                <Lock className="w-5 h-5 text-red-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">Cerrar Curso</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                            Está a punto de cerrar el curso "<strong>{confirmCierre.nombre}</strong>". Esta acción es <strong>permanente</strong>:
                        </p>
                        <ul className="text-sm text-gray-600 mb-4 space-y-1.5 list-disc list-inside bg-red-50 border border-red-100 rounded-lg p-3">
                            <li>El curso ya no podrá reabrirse ni volver a "Activo" o "Desactivado".</li>
                            <li>No se podrá editar ningún dato del curso (nombre, precio, fechas, imagen, etc.).</li>
                            <li>Ocurre lo mismo automáticamente cuando la fecha de fin del curso ya pasó.</li>
                        </ul>
                        <div className="flex justify-end gap-3">
                            <Button variant="secondary" onClick={() => setConfirmCierre(null)} disabled={cambiandoEstado === confirmCierre.id}>
                                Cancelar
                            </Button>
                            <Button variant="danger" onClick={handleConfirmarCierre} isLoading={cambiandoEstado === confirmCierre.id}>
                                Sí, cerrar curso
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
