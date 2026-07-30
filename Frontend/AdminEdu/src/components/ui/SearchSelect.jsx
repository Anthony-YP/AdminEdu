import React, { useEffect, useMemo, useRef, useState } from 'react';

/**
 * Combobox con búsqueda incremental. Pensado para listas largas
 * (estudiantes, docentes) donde un <select> plano es incómodo de usar:
 * filtra por label + sublabel (ej. nombre + cédula) a medida que se escribe.
 */
export function SearchSelect({
    label,
    value,
    onChange,
    options = [],
    placeholder = 'Buscar...',
    emptyText = 'Sin resultados.',
    required = false,
    disabled = false,
    error,
    onCreateNew,
    createNewLabel = '+ Registrar nuevo',
    className = '',
}) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const containerRef = useRef(null);

    const selected = useMemo(
        () => options.find((opt) => String(opt.value) === String(value)) || null,
        [options, value]
    );

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setOpen(false);
                setQuery('');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return options;
        return options.filter((opt) => {
            const haystack = `${opt.label} ${opt.sublabel || ''}`.toLowerCase();
            return haystack.includes(q);
        });
    }, [options, query]);

    const handleSelect = (opt) => {
        onChange(opt.value);
        setOpen(false);
        setQuery('');
    };

    return (
        <div className={`w-full ${className}`} ref={containerRef}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {label}
                    {required && <span className="text-red-500 ml-0.5">*</span>}
                </label>
            )}
            <div className="relative">
                <input
                    type="text"
                    disabled={disabled}
                    required={required}
                    className={`block w-full pl-3 pr-9 py-2 border rounded-lg text-sm transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:bg-gray-50 disabled:text-gray-500
                        ${error
                            ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500'
                        }
                    `}
                    placeholder={selected ? selected.label : placeholder}
                    value={open ? query : (selected ? selected.label : '')}
                    onFocus={() => { setOpen(true); setQuery(''); }}
                    onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
                />
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>

                {open && (
                    <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                        {filtered.length === 0 ? (
                            <p className="px-3 py-3 text-sm text-gray-500">{emptyText}</p>
                        ) : (
                            filtered.map((opt) => (
                                <button
                                    type="button"
                                    key={opt.value}
                                    onMouseDown={(e) => { e.preventDefault(); handleSelect(opt); }}
                                    className={`w-full text-left px-3 py-2 text-sm hover:bg-blue-50 ${
                                        String(opt.value) === String(value) ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                                    }`}
                                >
                                    <div>{opt.label}</div>
                                    {opt.sublabel && <div className="text-xs text-gray-400">{opt.sublabel}</div>}
                                </button>
                            ))
                        )}
                        {onCreateNew && (
                            <button
                                type="button"
                                onMouseDown={(e) => { e.preventDefault(); setOpen(false); setQuery(''); onCreateNew(); }}
                                className="w-full text-left px-3 py-2 text-sm text-blue-600 font-medium border-t border-gray-100 hover:bg-blue-50"
                            >
                                {createNewLabel}
                            </button>
                        )}
                    </div>
                )}
            </div>
            {error && <p className="mt-1.5 text-sm text-red-600 animate-slideDown">{error}</p>}
        </div>
    );
}
