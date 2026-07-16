import { createContext, useState, useCallback } from "react";


export const AuthContext = createContext();


export function AuthProvider({children}){

    const [user, setUser] = useState(
        JSON.parse(localStorage.getItem("usuario")) || null
    );


    const login = (data)=>{

        localStorage.setItem(
            "access",
            data.access
        );

        localStorage.setItem(
            "refresh",
            data.refresh
        );

        localStorage.setItem(
            "usuario",
            JSON.stringify(data.usuario)
        );


        setUser(data.usuario);
    };


    const logout = ()=>{

        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("usuario");

        setUser(null);
    };

    const isAuthenticated = !!user;

    const hasGroup = useCallback((gruposPermitidos) => {
        if (!user || !user.grupos) return false;
        return user.grupos.some(g => gruposPermitidos.includes(g));
    }, [user]);

    const hasPermission = useCallback((permiso) => {
        if (!user || !user.permisos) return false;
        return user.permisos.includes(permiso);
    }, [user]);


    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                login,
                logout,
                hasGroup,
                hasPermission,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
