import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
    url: "https://453jp20r-8180.usw3.devtunnels.ms",
    realm: "Routines-Manager",
    clientId: "Routines-Test"
});

export default keycloak;