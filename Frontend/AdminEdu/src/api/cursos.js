import axios from 'axios'

const cursosApi = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/curso/'
})
export const getCursos = () => cursosApi.get()