import React from 'react';

export function Input({ 
    label, 
    error, 
    id, 
    className = '', 
    fullWidth = true,
    ...props 
}) {
    const inputId = id || Math.random().toString(36).substring(7);
    
    return (
        <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
            {label && (
                <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1.5">
                    {label}
                </label>
            )}
            <div className="relative">
                <input
                    id={inputId}
                    className={`block w-full px-3 py-2 border rounded-lg text-sm transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:bg-gray-50 disabled:text-gray-500
                        ${error 
                            ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500 placeholder-red-300' 
                            : 'border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500 placeholder-gray-400'
                        }
                    `}
                    {...props}
                />
            </div>
            {error && (
                <p className="mt-1.5 text-sm text-red-600 animate-slideDown">
                    {error}
                </p>
            )}
        </div>
    );
}
