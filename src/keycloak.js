import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
    url: "http://localhost:8180",
    realm: "Routines-Manager",
    clientId: "Routines-Test"
});

export default keycloak;