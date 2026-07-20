import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Select } from "./ui/Select";
import { Alert } from "./ui/Alert";

export default function CursosForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = !!id;

    const [academias, setAcademias] = useState([]);
    const [loadingInit, setLoadingInit] = useState(true);
    
    const [formData, setFormData] = useState({
        academia: "",
        nombre: "",
        precio: "",
        fecha_inicio: "",
        fecha_fin: ""
    });

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const initialize = async () => {
            try {
                // Cargar Academias (requerido para el Select)
                const resAcademias = await api.get("/academias/");
                setAcademias(resAcademias.data);

                // Si estamos en modo edición, cargar el curso
                if (isEditing) {
                    const resCurso = await api.get(`/cursos/${id}/`);
                    setFormData({
                        academia: resCurso.data.academia,
                        nombre: resCurso.data.nombre,
                        precio: resCurso.data.precio,
                        fecha_inicio: resCurso.data.fecha_inicio,
                        fecha_fin: resCurso.data.fecha_fin
                    });
                }
            } catch (err) {
                console.error("Error al inicializar formulario:", err);
                setError("Error al cargar los datos necesarios.");
            } finally {
                setLoadingInit(false);
            }
        };

        initialize();
    }, [id, isEditing]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (formData.fecha_inicio >= formData.fecha_fin) {
            setError("La fecha de finalización debe ser posterior a la fecha de inicio.");
            return;
        }

        try {
            setSubmitting(true);
            const payload = {
                academia: Number(formData.academia),
                nombre: formData.nombre.trim(),
                precio: formData.precio,
                fecha_inicio: formData.fecha_inicio,
                fecha_fin: formData.fecha_fin
            };

            if (isEditing) {
                await api.put(`/cursos/${id}/`, payload);
            } else {
                await api.post("/cursos/", payload);
            }
            navigate("/cursos");
        } catch (err) {
            console.error("Error al guardar el curso:", err);
            
            // Extraer mensaje de error de validación de Django REST Framework
            if (err.response?.data) {
                const data = err.response.data;
                const fieldErrors = Object.keys(data).map(key => {
                    const msgs = Array.isArray(data[key]) ? data[key].join(", ") : data[key];
                    return `${key}: ${msgs}`;
                });
                setError(fieldErrors.join(" | "));
            } else {
                setError("Ocurrió un error inesperado al guardar el curso.");
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (loadingInit) {
        return (
            <div className="flex justify-center items-center h-64">
                <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto animate-slideDown">
            <Card>
                <CardHeader>
                    <CardTitle>{isEditing ? "Editar Curso" : "Nuevo Curso"}</CardTitle>
                </CardHeader>
                <CardContent>
                    {error && <Alert variant="error" className="mb-6">{error}</Alert>}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <Select
                            label="Academia"
                            name="academia"
                            value={formData.academia}
                            onChange={handleChange}
                            required
                            options={academias.map(a => ({ value: a.id, label: a.nombre }))}
                        />

                        <Input
                            label="Nombre del curso"
                            name="nombre"
                            type="text"
                            value={formData.nombre}
                            onChange={handleChange}
                            required
                            placeholder="Ej: Programación Web"
                        />

                        <Input
                            label="Precio"
                            name="precio"
                            type="number"
                            min="0"
                            step="0.01"
                            value={formData.precio}
                            onChange={handleChange}
                            required
                            placeholder="0.00"
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <Input
                                label="Fecha de inicio"
                                name="fecha_inicio"
                                type="date"
                                value={formData.fecha_inicio}
                                onChange={handleChange}
                                required
                            />

                            <Input
                                label="Fecha de finalización"
                                name="fecha_fin"
                                type="date"
                                value={formData.fecha_fin}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-6 border-t mt-8">
                            <Button type="button" variant="secondary" onClick={() => navigate("/cursos")} disabled={submitting}>
                                Cancelar
                            </Button>
                            <Button type="submit" variant="primary" isLoading={submitting}>
                                {isEditing ? "Guardar Cambios" : "Crear Curso"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}