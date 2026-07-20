// config/modules.js
import {
    AcademicCapIcon,
    BookOpenIcon,
    UserGroupIcon,
    // ... más iconos de Heroicons o Lucide 
} from '@heroicons/react/24/outline';

export const MODULES = [
    {
        id: 'academies',
        title: 'Academias',
        description: 'Gestionar academias y sedes',
        path: '/academias',
        icon: AcademicCapIcon,
        roles: ['Director'],
        requiresAdmin: false,
    },
    {
        id: 'courses',
        title: 'Cursos',
        description: 'Crear, editar y eliminar cursos',
        path: '/cursos',
        icon: BookOpenIcon,
        roles: ['Director', 'Secretaria'],
        requiresAdmin: false,
    },
    // ... más módulos
];