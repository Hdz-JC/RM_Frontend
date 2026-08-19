import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

import App from "./App.jsx";
import keycloak from "./keycloak";

keycloak.init({
  onLoad: "login-required",
  pkceMethod: "S256"
})
  .then((authenticated) => {

    if (!authenticated) {
      console.log("Usuario no autenticado");
      return;
    }

    console.log("Keycloak conectado");

    createRoot(document.getElementById("root")).render(
      <StrictMode>
        <App />
      </StrictMode>
    );

  })
  .catch((error) => {
    console.error("Error iniciando Keycloak:", error);
  });