import {
    Modal,
    Form,
    Button,
    Spinner
} from "react-bootstrap";

export default function EjercicioModal({
    mostrarModal,
    cerrarModal,

    modoEdicion,

    formulario,
    cambiarFormulario,

    categorias,

    otraCategoria,
    setOtraCategoria,

    setFormulario,

    guardarEjercicio,
    guardando
}) {
    return (
        <Modal
            show={mostrarModal}
            onHide={cerrarModal}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title className="fw-bold">
                    {modoEdicion
                        ? "Editar ejercicio"
                        : "Nuevo ejercicio"}
                </Modal.Title>
            </Modal.Header>

            <Form onSubmit={guardarEjercicio}>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>
                            Nombre
                        </Form.Label>

                        <Form.Control
                            type="text"
                            name="nombre"
                            value={
                                formulario.nombre
                            }
                            onChange={
                                cambiarFormulario
                            }
                            placeholder="Ej. Curl con mancuernas"
                            maxLength={150}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>
                            Categoría
                        </Form.Label>

                        {!otraCategoria ? (
                            <Form.Select
                                value={
                                    formulario.categoria
                                }
                                onChange={(event) => {
                                    const valor =
                                        event.target.value;

                                    if (
                                        valor ===
                                        "__otra__"
                                    ) {
                                        setOtraCategoria(
                                            true
                                        );

                                        setFormulario(
                                            (actual) => ({
                                                ...actual,
                                                categoria:
                                                    ""
                                            })
                                        );
                                    } else {
                                        setFormulario(
                                            (actual) => ({
                                                ...actual,
                                                categoria:
                                                    valor
                                            })
                                        );
                                    }
                                }}
                                required
                            >
                                <option value="">
                                    Selecciona una categoría
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

                                {/* <option value="__otra__">
                                    + Otra categoría
                                </option> */}
                            </Form.Select>
                        ) : (
                            <>
                                <Form.Control
                                    type="text"
                                    value={
                                        formulario.categoria
                                    }
                                    onChange={(event) =>
                                        setFormulario(
                                            (actual) => ({
                                                ...actual,
                                                categoria:
                                                    event
                                                        .target
                                                        .value
                                            })
                                        )
                                    }
                                    placeholder="Ej. Abdomen"
                                    maxLength={100}
                                    required
                                />

                                <Button
                                    variant="link"
                                    size="sm"
                                    className="px-0 mt-1"
                                    type="button"
                                    onClick={() => {
                                        setOtraCategoria(
                                            false
                                        );

                                        setFormulario(
                                            (actual) => ({
                                                ...actual,
                                                categoria:
                                                    ""
                                            })
                                        );
                                    }}
                                >
                                    ← Volver a categorías
                                </Button>
                            </>
                        )}
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>
                            Descripción
                        </Form.Label>

                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="descripcion"
                            value={
                                formulario.descripcion
                            }
                            onChange={
                                cambiarFormulario
                            }
                            placeholder="Describe brevemente el ejercicio..."
                            maxLength={500}
                        />
                    </Form.Group>
                </Modal.Body>

                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={cerrarModal}
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
                        ) : modoEdicion ? (
                            "Guardar cambios"
                        ) : (
                            "Crear ejercicio"
                        )}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}