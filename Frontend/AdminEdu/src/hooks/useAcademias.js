import { useState, useEffect, useCallback } from 'react';
import api from '../api/api';

/**
 * Hook personalizado para gestionar academias (CRUD)
 */
export const useAcademias = () => {
    const [academias, setAcademias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Extraer mensaje de error desde la respuesta del backend
    const extraerMensajeError = (err) => {
        if (err.response?.data) {
            const data = err.response.data;
            if (typeof data === 'object' && !data.detail) {
                const fieldErrors = Object.keys(data).map((key) => {
                    const msgs = Array.isArray(data[key]) ? data[key].join(', ') : data[key];
                    return `${key}: ${msgs}`;
                });
                return fieldErrors.join(' | ');
            }
            return data.detail || 'Error en la operación.';
        }
        return 'Ocurrió un error inesperado.';
    };

    // Cargar academias
    const cargarAcademias = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get('/academias/');
            setAcademias(response.data);
        } catch (err) {
            console.error('Error al cargar academias:', err);
            setError('No se pudieron cargar las academias. Intente nuevamente.');
        } finally {
            setLoading(false);
        }
    }, []);

    // Crear academia
    const crearAcademia = useCallback(async (data) => {
        try {
            const response = await api.post('/academias/', data);
            setAcademias((prev) => [...prev, response.data]);
            setSuccess(`Academia "${response.data.nombre}" creada exitosamente.`);
            return { success: true, data: response.data };
        } catch (err) {
            console.error('Error al crear academia:', err);
            const errorMsg = extraerMensajeError(err);
            setError(errorMsg);
            return { success: false, error: errorMsg };
        }
    }, []);

    // Actualizar academia
    const actualizarAcademia = useCallback(async (id, data) => {
        try {
            const response = await api.put(`/academias/${id}/`, data);
            setAcademias((prev) => prev.map((a) => (a.id === id ? response.data : a)));
            setSuccess(`Academia "${response.data.nombre}" actualizada exitosamente.`);
            return { success: true, data: response.data };
        } catch (err) {
            console.error('Error al actualizar academia:', err);
            const errorMsg = extraerMensajeError(err);
            setError(errorMsg);
            return { success: false, error: errorMsg };
        }
    }, []);

    // Eliminar academia
    const eliminarAcademia = useCallback(async (id) => {
        try {
            await api.delete(`/academias/${id}/`);
            setAcademias((prev) => prev.filter((a) => a.id !== id));
            setSuccess('Academia eliminada exitosamente.');
            return { success: true };
        } catch (err) {
            console.error('Error al eliminar academia:', err);
            let errorMsg = 'No se pudo eliminar la academia.';
            // Si el backend devuelve un error de integridad (por cursos asociados)
            if (err.response?.status === 409 || err.response?.data?.detail?.includes('asociados')) {
                errorMsg = 'No se puede eliminar la academia porque tiene cursos o paralelos asociados.';
            } else {
                errorMsg = extraerMensajeError(err);
            }
            setError(errorMsg);
            return { success: false, error: errorMsg };
        }
    }, []);

    // Auto‑limpiar mensajes después de 4 segundos
    useEffect(() => {
        if (success || error) {
            const timer = setTimeout(() => {
                setSuccess(null);
                setError(null);
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [success, error]);

    // Cargar al montar el componente
    useEffect(() => {
        cargarAcademias();
    }, [cargarAcademias]);

    return {
        academias,
        loading,
        error,
        success,
        cargarAcademias,
        crearAcademia,
        actualizarAcademia,
        eliminarAcademia,
        setError,
        setSuccess,
    };
};