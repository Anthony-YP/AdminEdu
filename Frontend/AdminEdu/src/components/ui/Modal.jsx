import React, { useEffect } from 'react';
import { Button } from './Button';

export function Modal({ isOpen, onClose, title, children, footer, maxWidth = "md" }) {
    
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const maxWidthClasses = {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
        "2xl": "max-w-2xl",
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
                
                <div 
                    className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-50 backdrop-blur-sm" 
                    onClick={onClose}
                    aria-hidden="true"
                ></div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div 
                    className={`inline-block w-full align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle ${maxWidthClasses[maxWidth]}`}
                    role="dialog" 
                    aria-modal="true" 
                    aria-labelledby="modal-headline"
                >
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900" id="modal-headline">
                            {title}
                        </h3>
                        <button 
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1"
                        >
                            <span className="sr-only">Cerrar</span>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    
                    <div className="px-6 py-4">
                        {children}
                    </div>
                    
                    {footer && (
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                            {footer}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Helper para modales de confirmación rápida
export function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirmar", cancelText = "Cancelar", isDestructive = false, isLoading = false }) {
    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={title}
            footer={
                <>
                    <Button variant="secondary" onClick={onClose} disabled={isLoading}>
                        {cancelText}
                    </Button>
                    <Button 
                        variant={isDestructive ? "danger" : "primary"} 
                        onClick={onConfirm} 
                        isLoading={isLoading}
                    >
                        {confirmText}
                    </Button>
                </>
            }
        >
            <p className="text-sm text-gray-600">{message}</p>
        </Modal>
    );
}
