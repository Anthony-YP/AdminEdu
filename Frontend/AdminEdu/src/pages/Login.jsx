import { useState, useContext } from "react";

import { login } from "../api/auth";

import { AuthContext } from "../context/AuthContext";


export default function Login() {


    const [username, setUsername] = useState("");

    const [password, setPassword] = useState("");


    const { login: loginUser } = useContext(AuthContext);



    const handleSubmit = async (e) => {

        e.preventDefault();


        try {

            const response = await login(
                username,
                password
            );


            loginUser(response.data);


            alert("Login correcto");


        } catch(error) {

            console.log(error);

            alert(
                "Usuario o contraseña incorrectos"
            );

        }

    };



    return (

        <div className="flex justify-center mt-20">


            <form

                onSubmit={handleSubmit}

                className="bg-sky-900 p-8 rounded-lg text-white"

            >

                <h1 className="text-3xl font-bold mb-5">
                    Iniciar Sesión
                </h1>


                <input

                    className="block text-black p-2 mb-3 rounded"

                    type="text"

                    placeholder="Usuario"

                    value={username}

                    onChange={
                        e => setUsername(e.target.value)
                    }

                />


                <input

                    className="block text-black p-2 mb-3 rounded"

                    type="password"

                    placeholder="Contraseña"

                    value={password}

                    onChange={
                        e => setPassword(e.target.value)
                    }

                />


                <button

                    className="bg-green-500 p-2 rounded w-full"

                    type="submit"

                >

                    Ingresar

                </button>


            </form>


        </div>

    );

}