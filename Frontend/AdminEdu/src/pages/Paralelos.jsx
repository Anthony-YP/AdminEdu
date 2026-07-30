import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import api from "../api/api";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { SearchSelect } from "../components/ui/SearchSelect";
import { Alert } from "../components/ui/Alert";
import { Badge } from "../components/ui/Badge";

const DIAS_SEMANA = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

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

    // Filtros del listado
    const [busqueda, setBusqueda] = useState("");
    const [filtroCurso, setFiltroCurso] = useState("");
    const [filtroEstado, setFiltroEstado] = useState("");
    const [cursosColapsados, setCursosColapsados] = useState({});

    // Formulario (crear/editar)
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formData, setFormData] = useState({
        id: null,
        curso: "",
        docente: "",
        nombre: "",
        dias_clase: [],
        hora_inicio: "",
        hora_fin: "",
        cupo_max: ""
    });
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState("");

    // Cambio de estado (baja lógica)
    const [cambiandoEstado, setCambiandoEstado] = useState(null);

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

    // ─── Listado filtrado y agrupado por curso ─────────────────────────

    const gruposPorCurso = useMemo(() => {
        const q = busqueda.trim().toLowerCase();

        const filtrados = paralelos.filter((p) => {
            if (filtroCurso && String(p.curso) !== String(filtroCurso)) return false;
            if (filtroEstado && p.estado !== filtroEstado) return false;
            if (q) {
                const cursoNombre = p.curso_nombre || "";
                const docenteNombre = p.docente_nombre || "";
                const haystack = `${cursoNombre} ${p.nombre} ${docenteNombre}`.toLowerCase();
                if (!haystack.includes(q)) return false;
            }
            return true;
        });

        const grupos = new Map();
        for (const p of filtrados) {
            const key = p.curso;
            if (!grupos.has(key)) {
                grupos.set(key, {
                    cursoId: key,
                    cursoNombre: p.curso_nombre || cursos.find((c) => c.id === key)?.nombre || `ID ${key}`,
                    paralelos: [],
                });
            }
            grupos.get(key).paralelos.push(p);
        }
        return Array.from(grupos.values()).sort((a, b) => a.cursoNombre.localeCompare(b.cursoNombre));
    }, [paralelos, cursos, busqueda, filtroCurso, filtroEstado]);

    const toggleColapso = (cursoId) => {
        setCursosColapsados((prev) => ({ ...prev, [cursoId]: !prev[cursoId] }));
    };

    // ─── Formulario ────────────────────────────────────────────────────

    const handleOpenForm = (paralelo = null) => {
        setFormError("");
        if (paralelo) {
            setFormData({
                id: paralelo.id,
                curso: paralelo.curso.toString(),
                docente: paralelo.docente ? paralelo.docente.toString() : "",
                nombre: paralelo.nombre || "",
                dias_clase: Array.isArray(paralelo.dias_clase) ? paralelo.dias_clase : [],
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
                dias_clase: [],
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

    const toggleDia = (dia) => {
        setFormData((prev) => ({
            ...prev,
            dias_clase: prev.dias_clase.includes(dia)
                ? prev.dias_clase.filter((d) => d !== dia)
                : [...prev.dias_clase, dia],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError("");

        // Validaciones
        if (!formData.curso) {
            setFormError("Debe seleccionar un curso.");
            return;
        }
        if (!formData.nombre.trim()) {
            setFormError("El nombre del paralelo es requerido.");
            return;
        }
        if (formData.dias_clase.length === 0) {
            setFormError("Debe seleccionar al menos un día de clase.");
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
                docente: formData.docente ? Number(formData.docente) : null,
                nombre: formData.nombre.trim(),
                dias_clase: formData.dias_clase,
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

    // ─── Cambio de estado (baja lógica) ────────────────────────────────

    const handleCambiarEstado = async (paralelo, nuevoEstado) => {
        try {
            setCambiandoEstado(paralelo.id);
            const response = await api.post(`/paralelos/${paralelo.id}/estado/`, { estado: nuevoEstado });
            setParalelos(paralelos.map(p => p.id === paralelo.id ? response.data : p));
            setSuccess(`Paralelo "${paralelo.nombre}" actualizado a estado ${nuevoEstado}.`);
        } catch (err) {
            setError(extraerMensajeError(err));
        } finally {
            setCambiandoEstado(null);
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

    const totalFiltrados = gruposPorCurso.reduce((acc, g) => acc + g.paralelos.length, 0);

    return (
        <div className="space-y-6 animate-slideDown">
            {/* Header con contador */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                        Paralelos
                        <span className="ml-2 text-sm font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                            {totalFiltrados} de {paralelos.length} {paralelos.length === 1 ? "sección" : "secciones"}
                        </span>
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">Gestión de secciones, horarios y cupos, agrupadas por curso</p>
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

            {/* Barra de filtros */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Buscar por curso, paralelo o docente..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <select
                    className="border border-gray-300 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={filtroCurso}
                    onChange={(e) => setFiltroCurso(e.target.value)}
                >
                    <option value="">Todos los cursos</option>
                    {cursos.map((c) => (
                        <option key={c.id} value={c.id}>{c.nombre}</option>
                    ))}
                </select>
                <select
                    className="border border-gray-300 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={filtroEstado}
                    onChange={(e) => setFiltroEstado(e.target.value)}
                >
                    <option value="">Todos los estados</option>
                    <option value="ACTIVO">Activo</option>
                    <option value="DESACTIVADO">Desactivado</option>
                </select>
            </div>

            {/* Grupos por curso */}
            {gruposPorCurso.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm py-16 flex flex-col items-center text-gray-500">
                    <svg className="w-12 h-12 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="font-medium">
                        {paralelos.length === 0 ? "No hay paralelos registrados" : "Ningún paralelo coincide con los filtros"}
                    </span>
                    {esAdmin && paralelos.length === 0 && (
                        <Button variant="link" onClick={() => handleOpenForm()} className="mt-2 text-blue-600">
                            Crear el primer paralelo
                        </Button>
                    )}
                </div>
            ) : (
                <div className="space-y-4">
                    {gruposPorCurso.map((grupo) => {
                        const colapsado = !!cursosColapsados[grupo.cursoId];
                        return (
                            <div key={grupo.cursoId} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                <button
                                    type="button"
                                    onClick={() => toggleColapso(grupo.cursoId)}
                                    className="w-full flex items-center justify-between px-5 py-3.5 bg-gray-50/70 hover:bg-gray-100/70 transition-colors"
                                >
                                    <div className="flex items-center gap-2">
                                        <svg className={`w-4 h-4 text-gray-400 transition-transform ${colapsado ? "-rotate-90" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                        <span className="font-semibold text-gray-900">{grupo.cursoNombre}</span>
                                        <Badge variant="blue">{grupo.paralelos.length} {grupo.paralelos.length === 1 ? "paralelo" : "paralelos"}</Badge>
                                    </div>
                                </button>

                                {!colapsado && (
                                    <div className="divide-y divide-gray-100">
                                        {grupo.paralelos.map((paralelo) => (
                                            <div key={paralelo.id} className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-3.5 hover:bg-gray-50/50 transition-colors">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className="font-semibold text-gray-800">{paralelo.nombre}</span>
                                                        <Badge variant={paralelo.estado === "ACTIVO" ? "green" : "red"}>{paralelo.estado}</Badge>
                                                    </div>
                                                    <div className="text-sm text-gray-500 mt-0.5">
                                                        {Array.isArray(paralelo.dias_clase) ? paralelo.dias_clase.join(", ") : paralelo.dias_clase}
                                                        {" · "}{paralelo.hora_inicio} - {paralelo.hora_fin}
                                                    </div>
                                                </div>
                                                <div className="text-sm text-gray-600 sm:w-48">
                                                    {paralelo.docente_nombre || <span className="text-gray-400">Sin asignar</span>}
                                                </div>
                                                <div className="text-sm text-gray-600 sm:w-20">Cupo: {paralelo.cupo_max}</div>
                                                {esAdmin && (
                                                    <div className="flex items-center gap-2">
                                                        <Button variant="ghost" size="sm" onClick={() => handleOpenForm(paralelo)} className="text-blue-600 hover:bg-blue-50">
                                                            Editar
                                                        </Button>
                                                        <select
                                                            className="text-xs border rounded px-1.5 py-1"
                                                            value={paralelo.estado}
                                                            disabled={cambiandoEstado === paralelo.id}
                                                            onChange={(e) => handleCambiarEstado(paralelo, e.target.value)}
                                                        >
                                                            <option value="ACTIVO">Activo</option>
                                                            <option value="DESACTIVADO">Desactivado</option>
                                                        </select>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
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
                                <SearchSelect
                                    label="Docente (opcional)"
                                    value={formData.docente}
                                    onChange={(value) => setFormData((f) => ({ ...f, docente: value }))}
                                    options={docentes.map((docente) => ({
                                        value: docente.id.toString(),
                                        label: `${docente.nombres} ${docente.apellidos}`,
                                        sublabel: docente.numero_identificacion || "Sin identificación",
                                    }))}
                                    placeholder="Buscar docente por nombre o cédula..."
                                />
                                <p className="col-span-1 sm:col-span-2 text-xs text-gray-500 -mt-2 mb-2">
                                    * El paralelo puede crearse sin docente y asignarse más adelante.
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Días de Clase<span className="text-red-500 ml-0.5">*</span></label>
                                <div className="flex flex-wrap gap-2">
                                    {DIAS_SEMANA.map((dia) => (
                                        <button
                                            key={dia}
                                            type="button"
                                            onClick={() => toggleDia(dia)}
                                            className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                                                formData.dias_clase.includes(dia)
                                                    ? "bg-blue-600 text-white border-blue-600"
                                                    : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                                            }`}
                                        >
                                            {dia}
                                        </button>
                                    ))}
                                </div>
                            </div>

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
        </div>
    );
}
