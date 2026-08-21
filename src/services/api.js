import axios from "axios";
import keycloak from "../keycloak";

const api = axios.create({
    baseURL: "https://453jp20r-3000.devtunnels.ms/api"
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
    (error) => Promise.reject(error)
);

export default api;