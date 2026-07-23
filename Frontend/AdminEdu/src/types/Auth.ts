export interface Usuario {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    groups: string[];
    photo?: string | null;
}

export interface LoginResponse {
    access: string;
    refresh: string;
}

export interface AuthContextType {
    usuario: Usuario | null;
    user: Usuario | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (username: string, password: string) => Promise<void>;
    loginGoogle: () => void;
    completeOAuthLogin: (access: string, refresh: string) => Promise<Usuario>;
    logout: () => void;
    updateUser: (usuario: Usuario | null) => void;
    hasRole: (role: string) => boolean;
    hasGroup: (roles: string[]) => boolean;
}
