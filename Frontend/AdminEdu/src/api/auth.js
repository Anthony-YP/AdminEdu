import api from "./api";


export const login = (username, password) => {
    return api.post(
        "/login",
        {
            username,
            password
        }
    );
};