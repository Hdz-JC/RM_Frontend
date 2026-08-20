import {
    Modal,
    Form,
    Alert,
    Row,
    Col,
    Button,
    Spinner
} from "react-bootstrap";

import {
    FaEdit,
    FaSave
} from "react-icons/fa";

export default function EditarEjercicioRutinaModal(props) {
    const {
        mostrarModalEditarEjercicio,
        cerrarModalEditarEjercicio,
        ejercicioSeleccionado,

        formularioEditarEjercicio,
        cambiarFormularioEditarEjercicio,

        dias,

        guardarEdicionEjercicio,
        guardando
    } = props;

    return (
        <Modal
            show={mostrarModalEditarEjercicio}
            onHide={cerrarModalEditarEjercicio}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title className="fw-bold">
                    <FaEdit className="me-2" />
                    Editar ejercicio
                </Modal.Title>
            </Modal.Header>

            <Form
                onSubmit={
                    guardarEdicionEjercicio
                }
            >
                <Modal.Body>
                    <Alert variant="light">
                        <strong>
                            Ejercicio:
                        </strong>{" "}
                        {ejercicioSeleccionado?.nombre}
                    </Alert>

                    <Form.Group className="mb-3">
                        <Form.Label>
                            Día
                        </Form.Label>

                        <Form.Select
                            name="dia"
                            value={
                                formularioEditarEjercicio.dia
                            }
                            onChange={
                                cambiarFormularioEditarEjercicio
                            }
                            required
                        >
                            {dias.map(
                                (dia) => (
                                    <option
                                        key={dia}
                                        value={dia}
                                    >
                                        {dia}
                                    </option>
                                )
                            )}
                        </Form.Select>
                    </Form.Group>

                    <Row>
                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label>
                                    Series
                                </Form.Label>

                                <Form.Control
                                    type="number"
                                    min="1"
                                    name="series"
                                    value={
                                        formularioEditarEjercicio.series
                                    }
                                    onChange={
                                        cambiarFormularioEditarEjercicio
                                    }
                                    required
                                />
                            </Form.Group>
                        </Col>

                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label>
                                    Reps
                                </Form.Label>

                                <Form.Control
                                    type="number"
                                    min="1"
                                    name="repeticiones"
                                    value={
                                        formularioEditarEjercicio.repeticiones
                                    }
                                    onChange={
                                        cambiarFormularioEditarEjercicio
                                    }
                                    required
                                />
                            </Form.Group>
                        </Col>

                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label>
                                    Orden
                                </Form.Label>

                                <Form.Control
                                    type="number"
                                    min="1"
                                    name="orden"
                                    value={
                                        formularioEditarEjercicio.orden
                                    }
                                    onChange={
                                        cambiarFormularioEditarEjercicio
                                    }
                                    required
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group>
                        <Form.Label>
                            Comentarios
                        </Form.Label>

                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="comentarios"
                            value={
                                formularioEditarEjercicio.comentarios
                            }
                            onChange={
                                cambiarFormularioEditarEjercicio
                            }
                            placeholder="Ej. Controlar bajada..."
                        />
                    </Form.Group>
                </Modal.Body>

                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={
                            cerrarModalEditarEjercicio
                        }
                        disabled={guardando}
                    >
                        Cancelar
                    </Button>

                    <Button
                        variant="primary"
                        type="submit"
                        disabled={guardando}
                    >
                        {guardando ? (
                            <>
                                <Spinner
                                    size="sm"
                                    animation="border"
                                    className="me-2"
                                />

                                Guardando...
                            </>
                        ) : (
                            <>
                                <FaSave className="me-2" />
                                Guardar cambios
                            </>
                        )}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}