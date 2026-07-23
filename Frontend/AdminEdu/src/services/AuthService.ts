import api from "../api/api";
import { LoginResponse, Usuario } from "../types/Auth";

class AuthService {
    async login(username: string, password: string): Promise<LoginResponse> {
        const response = await api.post<LoginResponse>("/login", { username, password });
        return response.data;
    }

    async me(): Promise<Usuario> {
        const response = await api.get<Usuario>("/me/");
        return response.data;
    }

    loginGoogle() {
        const base = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";
        window.location.href = `${base.replace(/\/api\/?$/, "")}/api/auth/google/login/`;
    }
}

export default new AuthService();
