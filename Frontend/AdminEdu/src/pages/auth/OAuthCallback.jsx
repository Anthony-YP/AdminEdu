import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { getDefaultRoute } from "../../utils/auth";

export default function OAuthCallback() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { completeOAuthLogin } = useAuth();

    useEffect(() => {
        procesarOAuth();
    }, []);

    async function procesarOAuth() {
        const access = searchParams.get("access");
        const refresh = searchParams.get("refresh");
        const error = searchParams.get("oauth_error");

        if (error) {
            navigate(`/login?oauth_error=${error}`, { replace: true });
            return;
        }

        if (!access || !refresh) {
            navigate("/login", { replace: true });
            return;
        }

        try {
            const usuario = await completeOAuthLogin(access, refresh);
            navigate(getDefaultRoute(usuario), { replace: true });
        } catch (error) {
            console.error("Error en OAuth:", error);
            navigate("/login?oauth_error=auth_failed", { replace: true });
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-white/70 text-lg">Validando sesión con Google...</p>
            </div>
        </div>
    );
}
