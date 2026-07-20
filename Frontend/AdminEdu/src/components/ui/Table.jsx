import React from 'react';

export function Table({ children, className = '' }) {
    return (
        <div className={`overflow-x-auto rounded-xl border border-gray-200 bg-white ${className}`}>
            <table className="min-w-full divide-y divide-gray-200">
                {children}
            </table>
        </div>
    );
}

export function TableHead({ children }) {
    return (
        <thead className="bg-gray-50/75">
            {children}
        </thead>
    );
}

export function TableHeader({ children, className = '' }) {
    return (
        <th className={`px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider ${className}`}>
            {children}
        </th>
    );
}

export function TableBody({ children }) {
    return (
        <tbody className="bg-white divide-y divide-gray-100">
            {children}
        </tbody>
    );
}

export function TableRow({ children, className = '', onClick }) {
    return (
        <tr 
            onClick={onClick}
            className={`transition-colors hover:bg-gray-50/80 ${onClick ? 'cursor-pointer' : ''} ${className}`}
        >
            {children}
        </tr>
    );
}

export function TableCell({ children, className = '', colSpan }) {
    return (
        <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-700 ${className}`} colSpan={colSpan}>
            {children}
        </td>
    );
}
