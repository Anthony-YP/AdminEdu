import {
    useEffect
} from "react";

import {
    useNavigate
} from "react-router-dom";

import {
    useAuth
} from "../../hooks/useAuth";

import { getDefaultRoute } from "../../utils/auth";

export default function OAuthCallback(){


    const navigate =
        useNavigate();


    const {
        completeOAuthLogin
    } = useAuth();



    useEffect(()=>{

        procesarOAuth();

    },[]);



    async function procesarOAuth(){


        const params =
            new URLSearchParams(
                window.location.search
            );


        const access =
            params.get("access");


        const refresh =
            params.get("refresh");



        if(
            !access ||
            !refresh
        ){

            navigate("/login");

            return;

        }



        try{


            const usuario =
                await completeOAuthLogin(
                    access,
                    refresh
                );

            navigate(
                getDefaultRoute(usuario)
            );


        }
        catch(error){

            console.error(error);

            navigate("/login");

        }


    }





    return(

        <div>

            <h2>
                Validando sesión...
            </h2>

        </div>

    );

}