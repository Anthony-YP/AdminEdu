import { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';

/**
 * Modal de doble verificación para acciones destructivas.
 * El usuario debe marcar un checkbox de confirmación antes de poder ejecutar la acción.
 */
export function DoubleConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirmar Eliminación",
    message,
    confirmText = "Eliminar",
    cancelText = "Cancelar",
    checkboxLabel = "Entiendo que esta acción es irreversible y no se puede deshacer",
    isLoading = false,
}) {
    const [isChecked, setIsChecked] = useState(false);

    // Reset checkbox cada vez que se abre/cierra el modal
    useEffect(() => {
        if (!isOpen) {
            setIsChecked(false);
        }
    }, [isOpen]);

    const handleConfirm = () => {
        if (isChecked) {
            onConfirm();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <div className="space-y-5">
                {/* Icono de advertencia */}
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                        <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <p className="text-sm text-gray-600 leading-relaxed">{message}</p>
                    </div>
                </div>

                {/* Checkbox de confirmación */}
                <div className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    isChecked 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                }`}>
                    <label className="flex items-start gap-3 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => setIsChecked(e.target.checked)}
                            className="mt-0.5 h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500 cursor-pointer"
                            disabled={isLoading}
                        />
                        <span className={`text-sm font-medium transition-colors ${
                            isChecked ? 'text-red-700' : 'text-gray-600'
                        }`}>
                            {checkboxLabel}
                        </span>
                    </label>
                </div>
            </div>

            {/* Botones de acción */}
            <div className="mt-6 flex justify-end gap-3 border-t pt-4">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={onClose}
                    disabled={isLoading}
                >
                    {cancelText}
                </Button>
                <Button
                    type="button"
                    variant="danger"
                    onClick={handleConfirm}
                    disabled={!isChecked || isLoading}
                    isLoading={isLoading}
                >
                    {confirmText}
                </Button>
            </div>
        </Modal>
    );
}
