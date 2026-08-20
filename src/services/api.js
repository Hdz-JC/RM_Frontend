import axios from "axios";
import keycloak from "../keycloak";

const api = axios.create({
    baseURL: "https://routines-manager.vercel.app/api"
});

api.interceptors.request.use(
    async (config) => {

        if (keycloak.authenticated) {

            await keycloak.updateToken(30);

            config.headers.Authorization =
                `Bearer ${keycloak.token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,

    async (error) => {

        if (error.response?.status === 401) {
            await keycloak.logout();
        }

        return Promise.reject(error);
    }
);

export default api;