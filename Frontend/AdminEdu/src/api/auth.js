import axios from "axios";


const authApi = axios.create({
    baseURL: "http://127.0.0.1:8000/api"
});


export const login = (username, password) => {
    return authApi.post(
        "/login",
        { username, password }
    );
};
