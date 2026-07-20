import React from 'react';

export function Select({ 
    label, 
    error, 
    id, 
    options = [], 
    className = '', 
    fullWidth = true,
    placeholder = "Seleccionar opción...",
    ...props 
}) {
    const selectId = id || Math.random().toString(36).substring(7);
    
    return (
        <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
            {label && (
                <label htmlFor={selectId} className="block text-sm font-medium text-gray-700 mb-1.5">
                    {label}
                </label>
            )}
            <div className="relative">
                <select
                    id={selectId}
                    className={`block w-full pl-3 pr-10 py-2 border rounded-lg text-sm transition duration-150 ease-in-out appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:bg-gray-50 disabled:text-gray-500
                        ${error 
                            ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500' 
                            : 'border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500'
                        }
                    `}
                    {...props}
                >
                    {placeholder && (
                        <option value="" disabled hidden>{placeholder}</option>
                    )}
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className={`h-4 w-4 ${error ? 'text-red-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
            {error && (
                <p className="mt-1.5 text-sm text-red-600 animate-slideDown">
                    {error}
                </p>
            )}
        </div>
    );
}
