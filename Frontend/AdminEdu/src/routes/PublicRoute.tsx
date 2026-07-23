import {
    Navigate,
    Outlet,
} from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import { getDefaultRoute } from "../utils/auth";


export default function PublicRoute() {

    const {
        usuario,
        isAuthenticated,
        isLoading,
    } = useAuth();


    if (isLoading) {
        return <p>Cargando...</p>;
    }


    if (isAuthenticated && usuario) {

        return (
            <Navigate
                to={getDefaultRoute(usuario)}
                replace
            />
        );

    }


    return <Outlet />;

}