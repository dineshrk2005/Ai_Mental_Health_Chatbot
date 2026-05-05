import axios from 'axios';

const getBaseUrl = () => {
    // 1. If we have a hardcoded Environment Variable (like in Vercel), use it
    if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
    
    // 2. Otherwise, use relative path so Vite proxy can handle it seamlessly!
    return '/api';
};

const api = axios.create({
    baseURL: getBaseUrl(),
});

// Add a request interceptor to add the auth token
api.interceptors.request.use(
    (config) => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            const { token } = JSON.parse(userInfo);
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
