import { useEffect, useState } from "react";

import {
    Container,
    Row,
    Col,
    Card,
    Button,
    Badge,
    Table,
    Spinner
} from "react-bootstrap";

import {
    FaPlus,
    FaArrowRight,
    FaUsers,
    FaClipboardList,
    FaDumbbell
} from "react-icons/fa";

import { Link } from "react-router-dom";

import api from "../services/api";


function Inicio() {

    const [clientes, setClientes] = useState([]);
    const [rutinas, setRutinas] = useState([]);
    const [ejercicios, setEjercicios] = useState([]);

    const [cargando, setCargando] = useState(true);


    // =========================================================
    // CARGAR ESTADÍSTICAS
    // =========================================================

    async function cargarDashboard() {

        try {

            setCargando(true);

            const [
                clientesResponse,
                rutinasResponse,
                ejerciciosResponse
            ] = await Promise.all([
                api.get("/clientes"),
                api.get("/rutinas"),
                api.get("/ejercicios")
            ]);

            setClientes(clientesResponse.data);
            setRutinas(rutinasResponse.data);
            setEjercicios(ejerciciosResponse.data);

        } catch (error) {

            console.error(
                "Error al cargar dashboard:",
                error
            );

        } finally {

            setCargando(false);

        }
    }


    useEffect(() => {

        cargarDashboard();

    }, []);


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <Container fluid>

            {/* ENCABEZADO */}

            <Row className="mb-4 align-items-center">

                <Col>

                    <h1 className="fw-bold mb-1">
                        Inicio
                    </h1>

                    <p className="text-muted mb-0">
                        Administra tus clientes y crea sus
                        rutinas de entrenamiento.
                    </p>

                </Col>

            </Row>


            {/* =====================================================
                ESTADÍSTICAS
            ===================================================== */}

            <Row className="g-4 mb-4">


                {/* CLIENTES */}

                <Col xs={12} md={4}>

                    <Card className="h-100 shadow-sm border-0">

                        <Card.Body>

                            <div className="d-flex justify-content-between align-items-center">

                                <div>

                                    <Card.Title className="text-muted">
                                        Mis clientes
                                    </Card.Title>

                                    {cargando ? (

                                        <Spinner
                                            animation="border"
                                            size="sm"
                                        />

                                    ) : (

                                        <h2 className="fw-bold mb-0">
                                            {clientes.length}
                                        </h2>

                                    )}

                                </div>

                                <div className="fs-1 text-primary">
                                    <FaUsers />
                                </div>

                            </div>


                            <Button
                                as={Link}
                                to="/clientes"
                                variant="link"
                                className="px-0 mt-3 text-decoration-none"
                            >
                                Ver clientes
                                <FaArrowRight className="ms-2" />
                            </Button>

                        </Card.Body>

                    </Card>

                </Col>


                {/* RUTINAS */}

                <Col xs={12} md={4}>

                    <Card className="h-100 shadow-sm border-0">

                        <Card.Body>

                            <div className="d-flex justify-content-between align-items-center">

                                <div>

                                    <Card.Title className="text-muted">
                                        Mis rutinas
                                    </Card.Title>

                                    {cargando ? (

                                        <Spinner
                                            animation="border"
                                            size="sm"
                                        />

                                    ) : (

                                        <h2 className="fw-bold mb-0">
                                            {rutinas.length}
                                        </h2>

                                    )}

                                </div>

                                <div className="fs-1 text-success">
                                    <FaClipboardList />
                                </div>

                            </div>


                            <Button
                                as={Link}
                                to="/rutinas"
                                variant="link"
                                className="px-0 mt-3 text-decoration-none"
                            >
                                Ver rutinas
                                <FaArrowRight className="ms-2" />
                            </Button>

                        </Card.Body>

                    </Card>

                </Col>


                {/* EJERCICIOS */}

                <Col xs={12} md={4}>

                    <Card className="h-100 shadow-sm border-0">

                        <Card.Body>

                            <div className="d-flex justify-content-between align-items-center">

                                <div>

                                    <Card.Title className="text-muted">
                                        Ejercicios disponibles
                                    </Card.Title>

                                    {cargando ? (

                                        <Spinner
                                            animation="border"
                                            size="sm"
                                        />

                                    ) : (

                                        <h2 className="fw-bold mb-0">
                                            {ejercicios.length}
                                        </h2>

                                    )}

                                </div>

                                <div className="fs-1 text-warning">
                                    <FaDumbbell />
                                </div>

                            </div>


                            <Button
                                as={Link}
                                to="/ejercicios"
                                variant="link"
                                className="px-0 mt-3 text-decoration-none"
                            >
                                Ver ejercicios
                                <FaArrowRight className="ms-2" />
                            </Button>

                        </Card.Body>

                    </Card>

                </Col>

            </Row>


            {/* =====================================================
                CONTENIDO INFERIOR
            ===================================================== */}

            <Row className="g-4">


                {/* RUTINAS RECIENTES */}

                <Col xs={12} lg={8}>

                    <Card className="shadow-sm border-0">

                        <Card.Header className="bg-white border-0 pt-4 px-4">

                            <div className="d-flex justify-content-between align-items-center">

                                <div>

                                    <h4 className="fw-bold mb-1">
                                        Rutinas recientes
                                    </h4>

                                    <p className="text-muted mb-0">
                                        Tus últimas rutinas creadas.
                                    </p>

                                </div>

                                <Badge bg="light" text="dark">
                                    {rutinas.length}
                                </Badge>

                            </div>

                        </Card.Header>


                        <Card.Body className="px-4">

                            {cargando ? (

                                <div className="text-center py-5">

                                    <Spinner animation="border" />

                                    <p className="text-muted mt-3">
                                        Cargando rutinas...
                                    </p>

                                </div>

                            ) : rutinas.length === 0 ? (

                                <div className="text-center py-5">

                                    <FaClipboardList
                                        className="text-muted mb-3"
                                        size={40}
                                    />

                                    <h5>
                                        No hay rutinas todavía
                                    </h5>

                                    <p className="text-muted">
                                        Crea tu primera rutina para comenzar.
                                    </p>

                                    <Button variant="primary">
                                        <FaPlus className="me-2" />
                                        Crear rutina
                                    </Button>

                                </div>

                            ) : (

                                <div className="table-responsive">

                                    <Table
                                        hover
                                        className="align-middle mb-0"
                                    >

                                        <thead>

                                            <tr>
                                                <th>Rutina</th>
                                                <th>Fecha</th>
                                            </tr>

                                        </thead>

                                        <tbody>

                                            {rutinas
                                                .slice(0, 5)
                                                .map((rutina) => (

                                                    <tr
                                                        key={rutina.id_rutina}
                                                    >

                                                        <td className="fw-semibold">
                                                            {rutina.nombre}
                                                        </td>

                                                        <td>
                                                            {new Date(
                                                                rutina.fecha
                                                            ).toLocaleDateString(
                                                                "es-MX"
                                                            )}
                                                        </td>

                                                    </tr>

                                                ))}

                                        </tbody>

                                    </Table>

                                </div>

                            )}

                        </Card.Body>

                    </Card>

                </Col>


                {/* ACCIONES RÁPIDAS */}

                <Col xs={12} lg={4}>

                    <Card className="shadow-sm border-0 h-100">

                        <Card.Body className="p-4">

                            <h4 className="fw-bold mb-1">
                                Acciones rápidas
                            </h4>

                            <p className="text-muted mb-4">
                                Accede rápidamente a las funciones
                                principales.
                            </p>


                            <div className="d-grid gap-3">


                                <Button
                                    as={Link}
                                    to="/rutinas"
                                    variant="primary"
                                    size="lg"
                                >
                                    <FaPlus className="me-2" />
                                    Nueva rutina
                                </Button>


                                <Button
                                    as={Link}
                                    to="/clientes"
                                    variant="outline-primary"
                                    size="lg"
                                >
                                    <FaUsers className="me-2" />
                                    Nuevo cliente
                                </Button>


                                <Button
                                    as={Link}
                                    to="/ejercicios"
                                    variant="outline-secondary"
                                    size="lg"
                                >
                                    <FaDumbbell className="me-2" />
                                    Ver ejercicios
                                </Button>

                            </div>

                        </Card.Body>

                    </Card>

                </Col>

            </Row>

        </Container>

    );
}

export default Inicio;