import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";


const ProtectedRoute = ({ children, allowedGroups = [] }) => {
    const { user, isAuthenticated, hasGroup } = useAuth();

    // Si no está autenticado, redirigir al login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Si se especificaron grupos permitidos y el usuario no pertenece a ninguno
    if (allowedGroups.length > 0 && !hasGroup(allowedGroups)) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
