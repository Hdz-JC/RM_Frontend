import axios from "axios";
import keycloak from "../keycloak";

console.log("🔥 API.JS CARGADO");
console.log("🔥 API BASE:", "https://453jp20r-3000.devtunnels.ms/api");

const api = axios.create({
    baseURL: "https://453jp20r-3000.devtunnels.ms/api"
});

api.interceptors.request.use(
    async (config) => {

        console.log("🔥 INTERCEPTOR EJECUTADO");
        console.log("🔥 URL:", config.url);
        console.log("🔥 AUTH:", keycloak.authenticated);
        console.log("🔥 TOKEN:", keycloak.token ? "SI" : "NO");

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