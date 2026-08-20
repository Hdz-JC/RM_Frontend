import { useState } from "react";

import {
    Modal,
    Form,
    Button,
    Spinner
} from "react-bootstrap";

export default function RutinaModal({
    mostrarModalRutina,
    cerrarModalRutina,
    modoEdicionRutina,

    formularioRutina,
    cambiarFormularioRutina,

    clientes,
    nombreCliente,

    guardarRutina,
    guardando
}) {

    const [busquedaCliente, setBusquedaCliente] = useState("");

    return (
        <Modal
            show={mostrarModalRutina}
            onHide={cerrarModalRutina}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title className="fw-bold">
                    {modoEdicionRutina
                        ? "Editar rutina"
                        : "Nueva rutina"}
                </Modal.Title>
            </Modal.Header>

            <Form onSubmit={guardarRutina}>
                <Modal.Body>
                    {!modoEdicionRutina && (
                        <Form.Group className="mb-3">
                            <Form.Label>
                                Cliente
                            </Form.Label>

                            <Form.Control
                                type="text"
                                placeholder="Buscar cliente..."
                                value={busquedaCliente}
                                onChange={(e) =>
                                    setBusquedaCliente(e.target.value)
                                }
                            />

                            {busquedaCliente.trim() && (
                                <div className="mt-2">
                                    {clientes
                                        .filter((cliente) =>
                                            nombreCliente(cliente)
                                                .toLowerCase()
                                                .includes(
                                                    busquedaCliente
                                                        .toLowerCase()
                                                        .trim()
                                                )
                                        )
                                        .slice(0, 10)
                                        .map((cliente) => (
                                            <Button
                                                key={cliente.id_cliente}
                                                variant={
                                                    formularioRutina.cliente_id ===
                                                        cliente.id_cliente
                                                        ? "primary"
                                                        : "light"
                                                }
                                                className="w-100 text-start mb-1"
                                                type="button"
                                                onClick={() => {
                                                    cambiarFormularioRutina({
                                                        target: {
                                                            name: "cliente_id",
                                                            value: cliente.id_cliente
                                                        }
                                                    });

                                                    setBusquedaCliente(
                                                        nombreCliente(cliente)
                                                    );
                                                }}
                                            >
                                                {nombreCliente(cliente)}
                                            </Button>
                                        ))}
                                </div>
                            )}
                        </Form.Group>
                    )}

                    <Form.Group className="mb-3">
                        <Form.Label>
                            {modoEdicionRutina
                                ? "Nombre"
                                : "Nombre de la rutina"}
                        </Form.Label>

                        <Form.Control
                            type="text"
                            name="nombre"
                            value={
                                formularioRutina.nombre
                            }
                            onChange={
                                cambiarFormularioRutina
                            }
                            placeholder={
                                modoEdicionRutina
                                    ? undefined
                                    : "Ej. Hipertrofia"
                            }
                            maxLength={150}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>
                            Fecha
                        </Form.Label>

                        <Form.Control
                            type="date"
                            name="fecha"
                            value={
                                formularioRutina.fecha
                            }
                            onChange={
                                cambiarFormularioRutina
                            }
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>
                            Comentarios
                        </Form.Label>

                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="comentarios"
                            value={
                                formularioRutina.comentarios
                            }
                            onChange={
                                cambiarFormularioRutina
                            }
                            placeholder="Notas de la rutina..."
                        />
                    </Form.Group>
                </Modal.Body>

                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={cerrarModalRutina}
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
                            modoEdicionRutina
                                ? "Guardar cambios"
                                : "Crear rutina"
                        )}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}