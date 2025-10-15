import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:8080/api',
});

// Add request interceptor to include userId in all requests
API.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (user && user.userId) {
        config.params = {
            ...config.params,
            userId: user.userId
        };
    }
    return config;
});

export default API;
