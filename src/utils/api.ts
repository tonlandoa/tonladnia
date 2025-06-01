import axios from "axios";

const api = axios.create({
    baseURL: 'https://api-backland.com/',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;