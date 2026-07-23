import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

interface Props {

    roles?: string[];

}

export default function ProtectedRoute({

    roles,

}: Props) {

    const {

        isAuthenticated,

        isLoading,

        hasRole,

    } = useAuth();

    if (isLoading) {

        return <p>Cargando...</p>;

    }

    if (!isAuthenticated) {

        return <Navigate to="/" replace />;

    }

    if (

        roles &&

        !roles.some(role => hasRole(role))

    ) {

        return <Navigate to="/403" replace />;

    }

    return <Outlet />;

}