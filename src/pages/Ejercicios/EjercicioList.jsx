import {
    Container,
    Row,
    Col,
    Card,
    Button,
    Form,
    Spinner,
    Table,
    Badge,
    Tabs,
    Tab
} from "react-bootstrap";

import {
    FaPlus,
    FaEdit,
    FaTrash,
    FaDumbbell,
    FaSearch
} from "react-icons/fa";

export default function EjercicioList({
    cargando,

    busqueda,
    setBusqueda,

    categoriaActiva,
    setCategoriaActiva,

    categorias,
    ejerciciosFiltrados,

    cambiarCategoria,

    abrirNuevoEjercicio,
    abrirEditarEjercicio,
    eliminarEjercicio,

    esPropio
}) {
    return (
        <Container fluid>
            <Row className="mb-4 align-items-center">
                <Col>
                    <h1 className="fw-bold mb-1">
                        Ejercicios
                    </h1>

                    <p className="text-muted mb-0">
                        Consulta el catálogo de ejercicios y
                        administra tus ejercicios personalizados.
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
                        onClick={abrirNuevoEjercicio}
                    >
                        <FaPlus className="me-2" />
                        Nuevo ejercicio
                    </Button>
                </Col>
            </Row>

            <Card className="shadow-sm border-0">
                <Card.Body className="p-0">
                    <div className="p-4 border-bottom">
                        <Row className="g-3">
                            <Col
                                xs={12}
                                md={7}
                                lg={8}
                            >
                                <div className="position-relative">
                                    <FaSearch
                                        className="position-absolute text-muted"
                                        style={{
                                            left: "14px",
                                            top: "12px"
                                        }}
                                    />

                                    <Form.Control
                                        type="text"
                                        placeholder="Buscar ejercicio..."
                                        value={busqueda}
                                        onChange={(event) =>
                                            setBusqueda(
                                                event.target.value
                                            )
                                        }
                                        style={{
                                            paddingLeft: "40px"
                                        }}
                                    />
                                </div>
                            </Col>

                            <Col
                                xs={12}
                                md={5}
                                lg={4}
                            >
                                <Form.Select
                                    value={
                                        categoriaActiva ===
                                            "todos"
                                            ? "todas"
                                            : categoriaActiva
                                    }
                                    onChange={(event) =>
                                        cambiarCategoria(
                                            event.target.value
                                        )
                                    }
                                >
                                    <option value="todas">
                                        Todas las categorías
                                    </option>

                                    {categorias.map(
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
                            </Col>
                        </Row>
                    </div>

                    <div className="px-3 pt-3">
                        <Tabs
                            activeKey={categoriaActiva}
                            onSelect={(key) =>
                                setCategoriaActiva(key)
                            }
                            className="mb-0"
                            variant="tabs"
                        >
                            <Tab
                                eventKey="todos"
                                title="Todos"
                            />

                            {categorias.map(
                                (categoria) => (
                                    <Tab
                                        key={categoria}
                                        eventKey={categoria}
                                        title={categoria}
                                    />
                                )
                            )}
                        </Tabs>
                    </div>

                    {cargando ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" />

                            <p className="text-muted mt-3 mb-0">
                                Cargando ejercicios...
                            </p>
                        </div>
                    ) : ejerciciosFiltrados.length === 0 ? (
                        <div className="text-center py-5 px-4">
                            <FaDumbbell
                                size={50}
                                className="text-muted mb-3"
                            />

                            <h4 className="fw-bold">
                                No hay ejercicios
                            </h4>

                            <p className="text-muted mb-4">
                                {busqueda
                                    ? "No encontramos ejercicios que coincidan con tu búsqueda."
                                    : "Todavía no hay ejercicios en esta categoría."}
                            </p>

                            {!busqueda && (
                                <Button
                                    variant="primary"
                                    onClick={
                                        abrirNuevoEjercicio
                                    }
                                >
                                    <FaPlus className="me-2" />
                                    Crear ejercicio
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <Table
                                hover
                                className="align-middle mb-0"
                            >
                                <thead className="table-light">
                                    <tr>
                                        <th className="px-4">
                                            Nombre
                                        </th>

                                        <th>
                                            Categoría
                                        </th>

                                        <th>
                                            Descripción
                                        </th>

                                        <th>
                                            Tipo
                                        </th>

                                        <th
                                            className="text-end px-4"
                                            style={{
                                                width: "120px"
                                            }}
                                        >
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {ejerciciosFiltrados.map(
                                        (ejercicio) => {
                                            const propio =
                                                esPropio(
                                                    ejercicio
                                                );

                                            return (
                                                <tr
                                                    key={
                                                        ejercicio.id_ejercicio
                                                    }
                                                >
                                                    <td className="px-4">
                                                        <div className="d-flex align-items-center">
                                                            <div
                                                                className="rounded-circle bg-light text-primary d-flex align-items-center justify-content-center me-3"
                                                                style={{
                                                                    width: "40px",
                                                                    height: "40px",
                                                                    minWidth: "40px"
                                                                }}
                                                            >
                                                                <FaDumbbell />
                                                            </div>

                                                            <strong>
                                                                {
                                                                    ejercicio.nombre
                                                                }
                                                            </strong>
                                                        </div>
                                                    </td>

                                                    <td>
                                                        <Badge
                                                            bg="secondary"
                                                            className="fw-normal"
                                                        >
                                                            {
                                                                ejercicio.categoria
                                                            }
                                                        </Badge>
                                                    </td>

                                                    <td>
                                                        <span className="text-muted">
                                                            {
                                                                ejercicio.descripcion ||
                                                                "Sin descripción"
                                                            }
                                                        </span>
                                                    </td>

                                                    <td>
                                                        {propio ? (
                                                            <Badge bg="primary">
                                                                Mi ejercicio
                                                            </Badge>
                                                        ) : (
                                                            <Badge
                                                                bg="light"
                                                                text="dark"
                                                            >
                                                                Catálogo
                                                            </Badge>
                                                        )}
                                                    </td>

                                                    <td className="text-end px-4">
                                                        {propio ? (
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
                                                                        eliminarEjercicio(
                                                                            ejercicio
                                                                        )
                                                                    }
                                                                >
                                                                    <FaTrash />
                                                                </Button>
                                                            </div>
                                                        ) : (
                                                            <span className="text-muted">
                                                                —
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        }
                                    )}
                                </tbody>
                            </Table>
                        </div>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
}