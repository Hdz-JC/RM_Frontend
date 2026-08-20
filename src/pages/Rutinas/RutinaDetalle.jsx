import {
    Container,
    Spinner,
    Button,
    Row,
    Col,
    Card,
    Alert,
    Tabs,
    Tab,
    Badge,
    Table
} from "react-bootstrap";

import {
    FaArrowLeft,
    FaEdit,
    FaPlus,
    FaTrash,
    FaDumbbell,
    FaFilePdf
} from "react-icons/fa";

import { formatearFecha } from "../../utils/fecha";
import { generarRutinaPDF } from "./pdf/generarRutinaPDF";

export default function RutinaDetalle(props) {
    const {
        cargandoDetalle,
        rutinaSeleccionada,
        cerrarRutina,
        abrirEditarRutina,
        abrirAgregarEjercicios,
        nombreCliente,
        // formatearFecha,
        diaActivo,
        setDiaActivo,
        dias,
        cantidadEjerciciosDia,
        ejerciciosDeRutina,
        abrirEditarEjercicio,
        eliminarEjercicioRutinaHandler
    } = props;

    if (cargandoDetalle) {
        return (
            <Container fluid>
                <div className="text-center py-5">
                    <Spinner animation="border" />

                    <p className="text-muted mt-3">
                        Cargando rutina...
                    </p>
                </div>
            </Container>
        );
    }

    return (
        <Container fluid>
            <Button
                variant="link"
                className="px-0 mb-3 text-decoration-none"
                onClick={cerrarRutina}
            >
                <FaArrowLeft className="me-2" />
                Volver a mis rutinas
            </Button>

            <Row className="mb-4">
                <Col>
                    <div className="d-flex flex-wrap justify-content-between align-items-start gap-3">
                        <div>
                            <h1 className="fw-bold mb-1">
                                {rutinaSeleccionada.nombre}
                            </h1>

                            <p className="text-muted mb-1">
                                <strong>
                                    Cliente:
                                </strong>{" "}
                                {nombreCliente(
                                    rutinaSeleccionada.cliente ||
                                    rutinaSeleccionada.clientes
                                )}
                            </p>

                            <p className="text-muted mb-0">
                                <strong>
                                    Fecha:
                                </strong>{" "}
                                {formatearFecha(
                                    rutinaSeleccionada.fecha
                                )}
                            </p>
                        </div>

                        <div className="d-flex gap-2">
                            <Button
                                variant="outline-primary"
                                onClick={() =>
                                    abrirEditarRutina(
                                        rutinaSeleccionada
                                    )
                                }
                            >
                                <FaEdit className="me-2" />
                                Editar rutina
                            </Button>

                            <Button
                                variant="outline-danger"
                                onClick={() =>
                                    generarRutinaPDF(
                                        rutinaSeleccionada
                                    )
                                }
                            >
                                <FaFilePdf className="me-2" />
                                Exportar PDF
                            </Button>

                            <Button
                                variant="primary"
                                onClick={
                                    abrirAgregarEjercicios
                                }
                            >
                                <FaPlus className="me-2" />
                                Agregar ejercicios
                            </Button>
                        </div>
                    </div>
                </Col>
            </Row>

            {rutinaSeleccionada.comentarios && (
                <Alert variant="light">
                    <strong>
                        Comentarios:
                    </strong>{" "}
                    {rutinaSeleccionada.comentarios}
                </Alert>
            )}

            <Card className="shadow-sm border-0">
                <Card.Body className="p-0">
                    <div className="px-3 pt-3">
                        <Tabs
                            activeKey={diaActivo}
                            onSelect={(key) =>
                                setDiaActivo(key)
                            }
                            className="mb-0"
                        >
                            {dias.map((dia) => (
                                <Tab
                                    key={dia}
                                    eventKey={dia}
                                    title={
                                        <span>
                                            {dia}

                                            <Badge
                                                bg={
                                                    cantidadEjerciciosDia(
                                                        dia
                                                    ) > 0
                                                        ? "primary"
                                                        : "secondary"
                                                }
                                                className="ms-2"
                                            >
                                                {
                                                    cantidadEjerciciosDia(
                                                        dia
                                                    )
                                                }
                                            </Badge>
                                        </span>
                                    }
                                />
                            ))}
                        </Tabs>
                    </div>

                    <div className="p-4">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <div>
                                <h4 className="fw-bold mb-1">
                                    {diaActivo}
                                </h4>

                                <p className="text-muted mb-0">
                                    Ejercicios programados para este día.
                                </p>
                            </div>

                            <div className="d-flex align-items-center gap-2">
                                <Badge bg="primary">
                                    {ejerciciosDeRutina.length}{" "}
                                    {ejerciciosDeRutina.length === 1
                                        ? "ejercicio"
                                        : "ejercicios"}
                                </Badge>

                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={
                                        abrirAgregarEjercicios
                                    }
                                >
                                    <FaPlus className="me-2" />
                                    Agregar ejercicios
                                </Button>
                            </div>
                        </div>

                        {ejerciciosDeRutina.length === 0 ? (
                            <div className="text-center py-5">
                                <FaDumbbell
                                    size={55}
                                    className="text-muted mb-3"
                                />

                                <h5 className="fw-bold">
                                    No hay ejercicios en {diaActivo}
                                </h5>

                                <p className="text-muted">
                                    Selecciona los ejercicios que quieres
                                    agregar a este día.
                                </p>

                                <Button
                                    variant="primary"
                                    onClick={
                                        abrirAgregarEjercicios
                                    }
                                >
                                    <FaPlus className="me-2" />
                                    Agregar ejercicios
                                </Button>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <Table
                                    hover
                                    bordered
                                    className="align-middle mb-0"
                                >
                                    <thead className="table-light">
                                        <tr>
                                            <th
                                                className="text-center"
                                                style={{
                                                    width: "60px"
                                                }}
                                            >
                                                #
                                            </th>

                                            <th>
                                                Ejercicio
                                            </th>

                                            <th>
                                                Categoría
                                            </th>

                                            <th className="text-center">
                                                Series
                                            </th>

                                            <th className="text-center">
                                                Reps
                                            </th>

                                            <th>
                                                Comentarios
                                            </th>

                                            <th className="text-end">
                                                Acciones
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {ejerciciosDeRutina.map(
                                            (ejercicio) => (
                                                <tr
                                                    key={
                                                        ejercicio.id ??
                                                        ejercicio.id_ejercicio_rutina ??
                                                        ejercicio.id_rutina_ejercicio
                                                    }
                                                >
                                                    <td className="text-center">
                                                        <Badge bg="secondary">
                                                            {
                                                                ejercicio.orden
                                                            }
                                                        </Badge>
                                                    </td>

                                                    <td>
                                                        <strong>
                                                            {
                                                                ejercicio.nombre
                                                            }
                                                        </strong>
                                                    </td>

                                                    <td>
                                                        <Badge
                                                            bg="light"
                                                            text="dark"
                                                        >
                                                            {
                                                                ejercicio.categoria ||
                                                                "Sin categoría"
                                                            }
                                                        </Badge>
                                                    </td>

                                                    <td className="text-center">
                                                        <strong>
                                                            {
                                                                ejercicio.series
                                                            }
                                                        </strong>
                                                    </td>

                                                    <td className="text-center">
                                                        <strong>
                                                            {
                                                                ejercicio.repeticiones
                                                            }
                                                        </strong>
                                                    </td>

                                                    <td>
                                                        <span className="text-muted">
                                                            {
                                                                ejercicio.comentarios ||
                                                                "—"
                                                            }
                                                        </span>
                                                    </td>

                                                    <td>
                                                        <div className="d-flex justify-content-end gap-2">
                                                            <Button
                                                                variant="outline-primary"
                                                                size="sm"
                                                                title="Editar"
                                                                onClick={() =>
                                                                    abrirEditarEjercicio(
                                                                        ejercicio
                                                                    )
                                                                }
                                                            >
                                                                <FaEdit />
                                                            </Button>

                                                            <Button
                                                                variant="outline-danger"
                                                                size="sm"
                                                                title="Eliminar"
                                                                onClick={() =>
                                                                    eliminarEjercicioRutinaHandler(
                                                                        ejercicio
                                                                    )
                                                                }
                                                            >
                                                                <FaTrash />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </Table>
                            </div>
                        )}
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
}