import {
    Modal,
    Form,
    Alert,
    Row,
    Col,
    Button,
    Table,
    Badge,
    Spinner
} from "react-bootstrap";

import {
    FaDumbbell,
    FaSave
} from "react-icons/fa";

export default function AgregarEjerciciosModal(props) {
    const {
        mostrarModalEjercicios,
        cerrarModalEjercicios,
        diaActivo,
        guardarEjerciciosLote,

        busquedaEjerciciosModal,
        setBusquedaEjerciciosModal,

        categoriaEjerciciosModal,
        setCategoriaEjerciciosModal,

        categoriasEjerciciosModal,
        ejerciciosFiltradosModal,
        ejercicios,

        obtenerIdEjercicio,
        ejercicioYaExisteEnDia,

        ejerciciosSeleccionados,
        toggleEjercicio,
        cambiarDatosEjercicioSeleccionado,

        guardando
    } = props;

    return (
        <Modal
            show={mostrarModalEjercicios}
            onHide={cerrarModalEjercicios}
            size="xl"
            centered
            backdrop="static"
        >
            <Modal.Header closeButton>
                <Modal.Title className="fw-bold">
                    <FaDumbbell className="me-2" />
                    Agregar ejercicios — {diaActivo}
                </Modal.Title>
            </Modal.Header>

            <Form onSubmit={guardarEjerciciosLote}>
                <Modal.Body>
                    <Alert variant="info">
                        <div className="d-flex align-items-start">
                            <FaDumbbell
                                className="me-3 mt-1"
                                size={22}
                            />

                            <div>
                                <strong>
                                    Agregar ejercicios a {diaActivo}
                                </strong>

                                <div className="small mt-1">
                                    Busca y selecciona uno o varios ejercicios.
                                    Todos los seleccionados se guardarán juntos
                                    en este día.
                                </div>
                            </div>
                        </div>
                    </Alert>

                    <Row className="mb-3">
                        <Col md={7}>
                            <Form.Group>
                                <Form.Label className="fw-semibold">
                                    Buscar ejercicio
                                </Form.Label>

                                <Form.Control
                                    type="text"
                                    value={
                                        busquedaEjerciciosModal
                                    }
                                    onChange={(event) =>
                                        setBusquedaEjerciciosModal(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Buscar por nombre, categoría o descripción..."
                                />
                            </Form.Group>
                        </Col>

                        <Col md={5}>
                            <Form.Group>
                                <Form.Label className="fw-semibold">
                                    Categoría
                                </Form.Label>

                                <Form.Select
                                    value={
                                        categoriaEjerciciosModal
                                    }
                                    onChange={(event) =>
                                        setCategoriaEjerciciosModal(
                                            event.target.value
                                        )
                                    }
                                >
                                    <option value="todos">
                                        Todas las categorías
                                    </option>

                                    {categoriasEjerciciosModal.map(
                                        (categoria) => (
                                            <option
                                                key={categoria}
                                                value={categoria}
                                            >
                                                {categoria}
                                            </option>
                                        )
                                    )}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>

                    <div className="d-flex flex-wrap gap-2 mb-3">
                        <Button
                            type="button"
                            size="sm"
                            variant={
                                categoriaEjerciciosModal ===
                                    "todos"
                                    ? "primary"
                                    : "outline-secondary"
                            }
                            onClick={() =>
                                setCategoriaEjerciciosModal(
                                    "todos"
                                )
                            }
                        >
                            Todas
                        </Button>

                        {categoriasEjerciciosModal.map(
                            (categoria) => (
                                <Button
                                    key={categoria}
                                    type="button"
                                    size="sm"
                                    variant={
                                        categoriaEjerciciosModal ===
                                            categoria
                                            ? "primary"
                                            : "outline-secondary"
                                    }
                                    onClick={() =>
                                        setCategoriaEjerciciosModal(
                                            categoria
                                        )
                                    }
                                >
                                    {categoria}
                                </Button>
                            )
                        )}
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <small className="text-muted">
                            Mostrando{" "}
                            <strong>
                                {
                                    ejerciciosFiltradosModal.length
                                }
                            </strong>{" "}
                            de{" "}
                            <strong>
                                {ejercicios.length}
                            </strong>{" "}
                            ejercicios
                        </small>

                        {busquedaEjerciciosModal ||
                            categoriaEjerciciosModal !==
                            "todos" ? (
                            <Button
                                type="button"
                                variant="link"
                                size="sm"
                                className="text-decoration-none"
                                onClick={() => {
                                    setBusquedaEjerciciosModal(
                                        ""
                                    );

                                    setCategoriaEjerciciosModal(
                                        "todos"
                                    );
                                }}
                            >
                                Limpiar filtros
                            </Button>
                        ) : null}
                    </div>

                    <div
                        className="table-responsive"
                        style={{
                            maxHeight: "55vh",
                            overflowY: "auto"
                        }}
                    >
                        <Table
                            bordered
                            hover
                            className="align-middle"
                        >
                            <thead
                                className="table-light"
                                style={{
                                    position: "sticky",
                                    top: 0,
                                    zIndex: 2
                                }}
                            >
                                <tr>
                                    <th
                                        className="text-center"
                                        style={{
                                            width: "55px"
                                        }}
                                    >
                                        ✓
                                    </th>

                                    <th>
                                        Ejercicio
                                    </th>

                                    <th>
                                        Categoría
                                    </th>

                                    <th
                                        style={{
                                            width: "110px"
                                        }}
                                    >
                                        Series
                                    </th>

                                    <th
                                        style={{
                                            width: "110px"
                                        }}
                                    >
                                        Reps
                                    </th>

                                    <th>
                                        Comentarios
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {ejerciciosFiltradosModal.length ===
                                    0 ? (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="text-center py-5"
                                        >
                                            <FaDumbbell
                                                size={45}
                                                className="text-muted mb-3"
                                            />

                                            <div className="fw-semibold">
                                                No encontramos ejercicios
                                            </div>

                                            <small className="text-muted">
                                                Intenta cambiar la búsqueda
                                                o la categoría.
                                            </small>
                                        </td>
                                    </tr>
                                ) : (
                                    ejerciciosFiltradosModal.map(
                                        (ejercicio) => {
                                            const id =
                                                obtenerIdEjercicio(
                                                    ejercicio
                                                );

                                            if (!id) {
                                                return null;
                                            }

                                            const yaExiste =
                                                ejercicioYaExisteEnDia(
                                                    id
                                                );

                                            const seleccionado =
                                                Boolean(
                                                    ejerciciosSeleccionados[
                                                    id
                                                    ]
                                                );

                                            const datos =
                                                ejerciciosSeleccionados[
                                                id
                                                ];

                                            return (
                                                <tr
                                                    key={id}
                                                    className={
                                                        seleccionado
                                                            ? "table-primary"
                                                            : ""
                                                    }
                                                >
                                                    <td className="text-center">
                                                        <Form.Check
                                                            type="checkbox"
                                                            checked={
                                                                seleccionado
                                                            }
                                                            disabled={
                                                                yaExiste
                                                            }
                                                            onChange={() =>
                                                                toggleEjercicio(
                                                                    ejercicio
                                                                )
                                                            }
                                                        />
                                                    </td>

                                                    <td>
                                                        <div className="fw-semibold">
                                                            {
                                                                ejercicio.nombre
                                                            }
                                                        </div>

                                                        {ejercicio.descripcion && (
                                                            <small className="text-muted">
                                                                {
                                                                    ejercicio.descripcion
                                                                }
                                                            </small>
                                                        )}

                                                        {yaExiste && (
                                                            <div>
                                                                <small className="text-success">
                                                                    ✓ Ya agregado a{" "}
                                                                    {
                                                                        diaActivo
                                                                    }
                                                                </small>
                                                            </div>
                                                        )}
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

                                                    <td>
                                                        <Form.Control
                                                            type="number"
                                                            min="1"
                                                            value={
                                                                datos?.series ??
                                                                3
                                                            }
                                                            disabled={
                                                                !seleccionado
                                                            }
                                                            onChange={(event) =>
                                                                cambiarDatosEjercicioSeleccionado(
                                                                    id,
                                                                    "series",
                                                                    event.target
                                                                        .value
                                                                )
                                                            }
                                                        />
                                                    </td>

                                                    <td>
                                                        <Form.Control
                                                            type="number"
                                                            min="1"
                                                            value={
                                                                datos?.repeticiones ??
                                                                10
                                                            }
                                                            disabled={
                                                                !seleccionado
                                                            }
                                                            onChange={(event) =>
                                                                cambiarDatosEjercicioSeleccionado(
                                                                    id,
                                                                    "repeticiones",
                                                                    event.target
                                                                        .value
                                                                )
                                                            }
                                                        />
                                                    </td>

                                                    <td>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder="Ej. Controlar bajada"
                                                            value={
                                                                datos?.comentarios ??
                                                                ""
                                                            }
                                                            disabled={
                                                                !seleccionado
                                                            }
                                                            onChange={(event) =>
                                                                cambiarDatosEjercicioSeleccionado(
                                                                    id,
                                                                    "comentarios",
                                                                    event.target
                                                                        .value
                                                                )
                                                            }
                                                        />
                                                    </td>
                                                </tr>
                                            );
                                        }
                                    )
                                )}
                            </tbody>
                        </Table>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mt-3">
                        <div>
                            <Badge
                                bg={
                                    Object.keys(
                                        ejerciciosSeleccionados
                                    ).length > 0
                                        ? "primary"
                                        : "secondary"
                                }
                            >
                                {
                                    Object.keys(
                                        ejerciciosSeleccionados
                                    ).length
                                }{" "}
                                {Object.keys(
                                    ejerciciosSeleccionados
                                ).length === 1
                                    ? "ejercicio seleccionado"
                                    : "ejercicios seleccionados"}
                            </Badge>
                        </div>

                        <small className="text-muted">
                            Se guardarán en{" "}
                            <strong>{diaActivo}</strong>{" "}
                            con orden consecutivo.
                        </small>
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={
                            cerrarModalEjercicios
                        }
                        disabled={guardando}
                    >
                        Cancelar
                    </Button>

                    <Button
                        variant="primary"
                        type="submit"
                        disabled={
                            guardando ||
                            Object.keys(
                                ejerciciosSeleccionados
                            ).length === 0
                        }
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
                                Guardar ejercicios
                            </>
                        )}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}