import api from "../api/api";
import { LoginResponse, Usuario } from "../types/Auth";

class AuthService {
    async login(username: string, password: string): Promise<LoginResponse> {
        const response = await api.post<LoginResponse>("/login", { username, password });
        return response.data;
    }

    async logout(refresh: string | null, access: string | null): Promise<void> {
        if (!refresh) return;
        try {
            
            await api.post(
                "/logout",
                { refresh },
                access ? { headers: { Authorization: `Bearer ${access}` } } : undefined
            );
        } catch {
        
        }
    }

    async me(): Promise<Usuario> {
        const response = await api.get<Usuario>("/me/");
        return response.data;
    }

    async requestPasswordReset(numeroIdentificacion: string, correo: string): Promise<{ detail: string }> {
        const response = await api.post("/password-reset/request/", {
            numero_identificacion: numeroIdentificacion,
            correo,
        });
        return response.data;
    }

    async confirmPasswordReset(uid: string, token: string, nuevaPassword: string): Promise<{ detail: string }> {
        const response = await api.post("/password-reset/confirm/", {
            uid,
            token,
            nueva_password: nuevaPassword,
        });
        return response.data;
    }

    loginGoogle() {
        const base = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";
        window.location.href = `${base.replace(/\/api\/?$/, "")}/api/auth/google/login/`;
    }
}

export default new AuthService();
