import { useEffect } from 'react';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';

/**
 * Modal para crear o editar una academia.
 * Recibe:
 * - isOpen: boolean
 * - onClose: function
 * - initialData: objeto con los datos de la academia (null para creación)
 * - onSubmit: function que recibe los datos del formulario y debe retornar una promesa
 * - submitting: boolean (estado de carga del botón)
 * - error: string (mensaje de error del formulario)
 */
export const AcademiaFormModal = ({
    isOpen,
    onClose,
    initialData,
    onSubmit,
    submitting,
    error,
}) => {
    const [formData, setFormData] = useState({
        id: null,
        nombre: '',
        telefono: '',
        ciudad: '',
        calle_principal: '',
        calle_secundaria: '',
        numero_casa: '',
        referencia: '',
    });

    // Sincronizar con initialData cuando se abre el modal
    useEffect(() => {
        if (initialData) {
            setFormData({
                id: initialData.id || null,
                nombre: initialData.nombre || '',
                telefono: initialData.telefono || '',
                ciudad: initialData.direccion?.ciudad || '',
                calle_principal: initialData.direccion?.calle_principal || '',
                calle_secundaria: initialData.direccion?.calle_secundaria || '',
                numero_casa: initialData.direccion?.numero_casa || '',
                referencia: initialData.direccion?.referencia || '',
            });
        } else {
            // Resetear a vacío
            setFormData({
                id: null,
                nombre: '',
                telefono: '',
                ciudad: '',
                calle_principal: '',
                calle_secundaria: '',
                numero_casa: '',
                referencia: '',
            });
        }
    }, [initialData, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Validaciones básicas (se pueden mejorar)
        if (!formData.nombre.trim()) {
            // Se podría mostrar un error local, pero se delega al padre
            // Para una mejor UX, se puede agregar un estado local de error
            // Pero dejamos que el padre maneje el error.
        }
        onSubmit(formData);
    };

    const isEditing = !!formData.id;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditing ? 'Editar Academia' : 'Nueva Academia'}
            maxWidth="xl"
        >
            <form id="academia-form" onSubmit={handleSubmit} className="space-y-5">
                {error && <Alert variant="error">{error}</Alert>}

                {/* Sección: Información General */}
                <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                        Información General
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                            label="Nombre de la Institución"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            placeholder="Ej. Academia Central Norte"
                            required
                            autoFocus
                        />
                        <Input
                            label="Teléfono"
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleChange}
                            placeholder="Ej. 0987654321"
                            required
                        />
                    </div>
                </div>

                {/* Sección: Dirección */}
                <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                        Dirección
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                            label="Ciudad"
                            name="ciudad"
                            value={formData.ciudad}
                            onChange={handleChange}
                            placeholder="Ej. Quito"
                            required
                        />
                        <Input
                            label="Número de Casa"
                            name="numero_casa"
                            value={formData.numero_casa}
                            onChange={handleChange}
                            placeholder="Ej. S/N"
                        />
                        <Input
                            label="Calle Principal"
                            name="calle_principal"
                            value={formData.calle_principal}
                            onChange={handleChange}
                            placeholder="Ej. Av. 10 de Agosto"
                            required
                        />
                        <Input
                            label="Calle Secundaria"
                            name="calle_secundaria"
                            value={formData.calle_secundaria}
                            onChange={handleChange}
                            placeholder="Ej. Colón"
                            required
                        />
                    </div>
                    <div className="mt-4">
                        <Input
                            label="Referencia"
                            name="referencia"
                            value={formData.referencia}
                            onChange={handleChange}
                            placeholder="Ej. Frente al parque central"
                        />
                    </div>
                </div>
            </form>

            <div className="mt-6 flex justify-end gap-3 border-t pt-4">
                <Button type="button" variant="secondary" onClick={onClose} disabled={submitting}>
                    Cancelar
                </Button>
                <Button type="submit" form="academia-form" variant="primary" isLoading={submitting}>
                    {isEditing ? 'Guardar Cambios' : 'Crear Academia'}
                </Button>
            </div>
        </Modal>
    );
};