import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

const api = axios.create({
    baseURL: API_BASE_URL
});


// Interceptor para agregar el token JWT a todas las peticiones
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);


// Interceptor para manejar errores 401 (token expirado) e intentar refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem("refresh");
                if (!refreshToken) throw new Error("No refresh token");

                const response = await axios.post(
                    `${API_BASE_URL}/token/refresh/`,
                    { refresh: refreshToken }
                );

                localStorage.setItem("access", response.data.access);
                if (response.data.refresh) {
                    // El backend rota el refresh token en cada uso (ROTATE_REFRESH_TOKENS)
                    localStorage.setItem("refresh", response.data.refresh);
                }
                originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
                return api(originalRequest);
            } catch (refreshError) {
                // Si falla el refresh, redirigir al login
                localStorage.removeItem("access");
                localStorage.removeItem("refresh");
                localStorage.removeItem("usuario");
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);


export default api;