import axios from 'axios';

const api = axios.create({
    baseURL: '/api', // The proxy in package.json will handle this
});

api.interceptors.request.use((config) => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    if (userInfo && userInfo.token) {
        config.headers.Authorization = `Bearer ${userInfo.token}`;
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;