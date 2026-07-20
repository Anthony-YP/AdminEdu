// types/module.ts
export interface Module {
    id: string;
    title: string;
    description: string;
    path: string;
    icon: React.ComponentType<{ className?: string }>;
    roles: string[];
    requiresAdmin: boolean;
}

export interface User {
    username: string;
    email: string;
    grupos: string[];
    permisos: string[];
}