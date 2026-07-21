// src/pages/OAuthCallback.jsx
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function OAuthCallback() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { login } = useAuth();

    useEffect(() => {
        const access = searchParams.get('access');
        const refresh = searchParams.get('refresh');
        const error = searchParams.get('oauth_error');

        if (error) {
            navigate(`/login?oauth_error=${error}`, { replace: true });
            return;
        }

        if (access && refresh) {
            // Guardar tokens en el contexto de autenticación
            login({ access, refresh, usuario: null }); // Ajusta según tu estructura
            navigate('/dashboard', { replace: true });
        } else {
            navigate('/login?oauth_error=missing_tokens', { replace: true });
        }
    }, [searchParams, navigate, login]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-white text-xl">Procesando autenticación con Google...</div>
        </div>
    );
}