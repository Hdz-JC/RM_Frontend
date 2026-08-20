import {
    Container,
    Row,
    Col,
    Card,
    Button,
    Alert,
    Spinner,
    Badge,
    Form
} from "react-bootstrap";

import {
    FaPlus,
    FaEdit,
    FaTrash,
    FaClipboardList,
    FaEye
} from "react-icons/fa";

import { formatearFecha } from "../../utils/fecha";

export default function RutinaList(props) {
    const {
        cargando,
        rutinas,
        error,
        setError,
        abrirNuevaRutina,
        obtenerIdRutina,
        nombreCliente,
        // formatearFecha,
        abrirRutina,
        abrirEditarRutina,
        eliminarRutinaHandler,
        rutinasFiltradas,
        busqueda,
        setBusqueda,
    } = props;

    return (
        <Container fluid>
            <Row className="mb-4 align-items-center">
                <Col>
                    <h1 className="fw-bold mb-1">
                        Mis rutinas
                    </h1>

                    <p className="text-muted mb-0">
                        Crea y administra las rutinas de tus clientes.
                    </p>


                </Col>

                <Col
                    xs={12}
                    md="auto"
                    className="mt-3 mt-md-0"
                >
                    <Button
                        variant="primary"
                        size="lg"
                        onClick={abrirNuevaRutina}
                    >
                        <FaPlus className="me-2" />
                        Nueva rutina
                    </Button>

                </Col>
            </Row>

            <Row className="mb-4">
                <Col xs={12} md={8} lg={6}>
                    <Form.Control
                        type="text"
                        placeholder="Buscar por nombre de rutina o cliente..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                </Col>
            </Row>

            {error && (
                <Alert
                    variant="danger"
                    dismissible
                    onClose={() => setError("")}
                >
                    {error}
                </Alert>
            )}

            {cargando ? (
                <div className="text-center py-5">
                    <Spinner animation="border" />

                    <p className="text-muted mt-3">
                        Cargando rutinas...
                    </p>
                </div>
            ) : rutinasFiltradas.length === 0 ? (
                <Card className="shadow-sm border-0">
                    <Card.Body className="text-center py-5">
                        <FaClipboardList
                            size={55}
                            className="text-muted mb-3"
                        />

                        <h4 className="fw-bold">
                            No hay coincidencias
                        </h4>

                        <p className="text-muted mb-0">
                            No encontramos rutinas que coincidan con:
                            <strong className="ms-1">
                                "{busqueda}"
                            </strong>
                        </p>
                    </Card.Body>
                </Card>
            ) : (
                <Row className="g-4">
                    {rutinasFiltradas.map((rutina) => {
                        const idRutina =
                            obtenerIdRutina(rutina);

                        return (
                            <Col
                                key={idRutina}
                                xs={12}
                                md={6}
                                xl={4}
                            >
                                <Card className="h-100 shadow-sm border-0">
                                    <Card.Body>
                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                            <div>
                                                <h5 className="fw-bold mb-1">
                                                    {rutina.nombre}
                                                </h5>

                                                <p className="text-muted mb-0">
                                                    {nombreCliente(
                                                        rutina.clientes ||
                                                        rutina.cliente
                                                    )}
                                                </p>
                                            </div>

                                            <FaClipboardList
                                                className="text-primary"
                                                size={25}
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <Badge
                                                bg="light"
                                                text="dark"
                                            >
                                                <strong>
                                                    Fecha:
                                                </strong>{" "}
                                                {formatearFecha(
                                                    rutina.fecha
                                                )}
                                            </Badge>
                                        </div>

                                        <div className="d-grid gap-2">
                                            <Button
                                                variant="primary"
                                                onClick={() =>
                                                    abrirRutina(
                                                        idRutina
                                                    )
                                                }
                                            >
                                                <FaEye className="me-2" />
                                                Ver rutina
                                            </Button>

                                            <div className="d-flex gap-2">
                                                <Button
                                                    variant="outline-primary"
                                                    className="flex-grow-1"
                                                    onClick={() =>
                                                        abrirEditarRutina(
                                                            rutina
                                                        )
                                                    }
                                                >
                                                    <FaEdit className="me-2" />
                                                    Editar
                                                </Button>

                                                <Button
                                                    variant="outline-danger"
                                                    onClick={() =>
                                                        eliminarRutinaHandler(
                                                            rutina
                                                        )
                                                    }
                                                >
                                                    <FaTrash />
                                                </Button>
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        );
                    })}
                </Row>
            )}
        </Container>
    );
}