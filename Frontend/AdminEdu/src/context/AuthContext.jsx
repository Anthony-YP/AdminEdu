import { createContext, useState } from "react";


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


    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}