import {
    Container,
    Nav,
    Navbar as BootstrapNavbar,
    Button
} from "react-bootstrap";

import { NavLink } from "react-router-dom";

import keycloak from "../keycloak";

function Navbar() {

    const nombreUsuario =
        keycloak.tokenParsed?.given_name ||
        keycloak.tokenParsed?.preferred_username ||
        "Usuario";

    return (
        <BootstrapNavbar
            expand="lg"
            bg="dark"
            data-bs-theme="dark"
            sticky="top"
        >
            <Container>

                {/* Logo / nombre de la aplicación */}
                <BootstrapNavbar.Brand
                    as={NavLink}
                    to="/"
                    className="fw-bold"
                >
                    Routines Manager
                </BootstrapNavbar.Brand>


                {/* Botón menú móvil */}
                <BootstrapNavbar.Toggle
                    aria-controls="navbar-principal"
                />


                <BootstrapNavbar.Collapse id="navbar-principal">

                    {/* Navegación principal */}
                    <Nav className="me-auto">

                        <Nav.Link
                            as={NavLink}
                            to="/"
                            end
                        >
                            Inicio
                        </Nav.Link>

                        <Nav.Link
                            as={NavLink}
                            to="/clientes"
                        >
                            Mis clientes
                        </Nav.Link>

                        <Nav.Link
                            as={NavLink}
                            to="/ejercicios"
                        >
                            Ejercicios
                        </Nav.Link>

                        <Nav.Link
                            as={NavLink}
                            to="/rutinas"
                        >
                            Rutinas
                        </Nav.Link>

                    </Nav>


                    {/* Usuario */}
                    <Nav className="align-items-lg-center">

                        <span className="navbar-text me-lg-3">
                            Hola, {nombreUsuario}
                        </span>

                        <Button
                            variant="outline-light"
                            size="sm"
                            onClick={() => keycloak.logout()}
                        >
                            Cerrar sesión
                        </Button>

                    </Nav>

                </BootstrapNavbar.Collapse>

            </Container>
        </BootstrapNavbar>
    );
}

export default Navbar;