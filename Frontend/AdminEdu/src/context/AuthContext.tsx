import {
    createContext,
    useEffect,
    useState,
    ReactNode,
} from "react";

import AuthService from "../services/AuthService";

import {
    AuthContextType,
    Usuario,
} from "../types/Auth";

export const AuthContext = createContext<AuthContextType | undefined>(
    undefined
);

interface Props {
    children: ReactNode;
}

export function AuthProvider({ children }: Props) {
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [isLoading, setLoading] = useState(true);
    const isAuthenticated = usuario !== null;

    useEffect(() => {
        restoreSession();
    }, []);

    async function restoreSession() {
        const token = localStorage.getItem("access");
        if (!token) {
            setLoading(false);
            return;
        }
        try {
            const user = await AuthService.me();
            setUsuario(user);
        } catch {
            logout();
        } finally {
            setLoading(false);
        }
    }

    async function login(username: string, password: string) {
        const response = await AuthService.login(username, password);
        localStorage.setItem("access", response.access);
        localStorage.setItem("refresh", response.refresh);
        const usuario = await AuthService.me();
        setUsuario(usuario);
    }

    async function completeOAuthLogin(access: string, refresh: string) {
        localStorage.setItem("access", access);
        localStorage.setItem("refresh", refresh);
        try {
            const usuario = await AuthService.me();
            setUsuario(usuario);
            return usuario;
        } catch (error) {
            logout();
            throw error;
        }
    }

    function loginGoogle() {
        AuthService.loginGoogle();
    }

    async function logout() {
        const access = localStorage.getItem("access");
        const refresh = localStorage.getItem("refresh");
        // Limpiamos la sesión local primero para que la UI reaccione al
        // instante; el access token ya capturado se envía explícitamente
        // porque el interceptor de axios ya no lo encontraría en localStorage.
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        setUsuario(null);
        await AuthService.logout(refresh, access);
    }

    function updateUser(usuario: Usuario | null) {
        setUsuario(usuario);
    }

    function hasRole(role: string) {
        if (!usuario) return false;
        // Administrador: mismo bypass que en el backend (pertenece_a) — ve y
        // usa todo lo que ya está gateado por rol, sin tocar cada pantalla.
        if (usuario.groups.includes("Administrador")) return true;
        return usuario.groups.includes(role);
    }

    function hasGroup(roles: string[]) {
        if (!usuario) return false;
        if (usuario.groups.includes("Administrador")) return true;
        return roles.some((r) => usuario.groups.includes(r));
    }

    return (
        <AuthContext.Provider
            value={{
                usuario,
                user: usuario,
                isAuthenticated,
                isLoading,
                login,
                loginGoogle,
                completeOAuthLogin,
                logout,
                updateUser,
                hasRole,
                hasGroup,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
