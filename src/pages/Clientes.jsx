import { useEffect, useState } from "react";

import {
    Container,
    Row,
    Col,
    Card,
    Button,
    Form,
    Modal,
    Spinner
} from "react-bootstrap";

import {
    FaPlus,
    FaSearch,
    FaEdit,
    FaTrash,
    FaUsers
} from "react-icons/fa";

import Swal from "sweetalert2";

import api from "../services/api";


function Clientes() {

    const [clientes, setClientes] = useState([]);

    const [busqueda, setBusqueda] = useState("");

    const [cargando, setCargando] = useState(true);

    const [mostrarModal, setMostrarModal] = useState(false);

    const [modoEdicion, setModoEdicion] = useState(false);

    const [clienteSeleccionado, setClienteSeleccionado] =
        useState(null);

    const [guardando, setGuardando] = useState(false);

    const [formulario, setFormulario] = useState({
        nombre: "",
        paterno: "",
        materno: ""
    });


    // =========================================================
    // OBTENER CLIENTES
    // =========================================================

    async function cargarClientes() {

        try {

            setCargando(true);

            const response = await api.get("/clientes");

            setClientes(response.data);

        } catch (error) {

            console.error(error);

            Swal.fire({
                icon: "error",
                title: "No se pudieron cargar los clientes",
                text:
                    error.response?.data?.mensaje ||
                    "Ocurrió un error al obtener tus clientes.",
                confirmButtonText: "Aceptar"
            });

        } finally {

            setCargando(false);

        }
    }


    useEffect(() => {

        cargarClientes();

    }, []);


    // =========================================================
    // BUSCAR
    // =========================================================

    const clientesFiltrados = clientes.filter((cliente) => {

        const nombreCompleto = `
            ${cliente.nombre}
            ${cliente.paterno}
            ${cliente.materno || ""}
        `.toLowerCase();

        return nombreCompleto.includes(
            busqueda.toLowerCase()
        );

    });


    // =========================================================
    // FORMULARIO
    // =========================================================

    function abrirNuevoCliente() {

        setModoEdicion(false);

        setClienteSeleccionado(null);

        setFormulario({
            nombre: "",
            paterno: "",
            materno: ""
        });

        setMostrarModal(true);
    }


    function abrirEditarCliente(cliente) {

        setModoEdicion(true);

        setClienteSeleccionado(cliente);

        setFormulario({
            nombre: cliente.nombre,
            paterno: cliente.paterno,
            materno: cliente.materno || ""
        });

        setMostrarModal(true);
    }


    function cerrarModal() {

        if (guardando) {
            return;
        }

        setMostrarModal(false);
    }


    function cambiarFormulario(event) {

        const {
            name,
            value
        } = event.target;

        setFormulario((actual) => ({
            ...actual,
            [name]: value
        }));

    }


    // =========================================================
    // CREAR / ACTUALIZAR
    // =========================================================

    async function guardarCliente(event) {

        event.preventDefault();

        try {

            setGuardando(true);

            const datos = {
                nombre: formulario.nombre.trim(),
                paterno: formulario.paterno.trim(),
                materno:
                    formulario.materno.trim() || null
            };


            if (modoEdicion) {

                await api.put(
                    `/clientes/${clienteSeleccionado.id_cliente}`,
                    datos
                );

            } else {

                await api.post(
                    "/clientes",
                    datos
                );

            }


            setMostrarModal(false);

            await cargarClientes();


            // =================================================
            // MENSAJE DE ÉXITO
            // =================================================

            Swal.fire({
                icon: "success",
                title: modoEdicion
                    ? "¡Cliente actualizado!"
                    : "¡Cliente creado!",
                text: modoEdicion
                    ? "Los datos del cliente fueron actualizados correctamente."
                    : "El cliente fue agregado correctamente.",
                confirmButtonText: "Aceptar",
                timer: 2500,
                timerProgressBar: true
            });


        } catch (error) {

            console.error(error);

            Swal.fire({
                icon: "error",
                title: "No se pudo guardar",
                text:
                    error.response?.data?.mensaje ||
                    "Ocurrió un error al guardar el cliente.",
                confirmButtonText: "Aceptar"
            });

        } finally {

            setGuardando(false);

        }
    }


    // =========================================================
    // ELIMINAR
    // =========================================================

    async function eliminarCliente(cliente) {

        const nombreCompleto = [
            cliente.nombre,
            cliente.paterno,
            cliente.materno
        ]
            .filter(Boolean)
            .join(" ");


        // =====================================================
        // CONFIRMACIÓN
        // =====================================================

        const resultado = await Swal.fire({

            icon: "warning",

            title: "¿Eliminar cliente?",

            html: `
                Estás a punto de eliminar a
                <strong>${nombreCompleto}</strong>.
                <br><br>
                Esta acción no se puede deshacer.
            `,

            showCancelButton: true,

            confirmButtonText: "Sí, eliminar",

            cancelButtonText: "Cancelar",

            reverseButtons: true,

            focusCancel: true

        });


        if (!resultado.isConfirmed) {
            return;
        }


        try {

            // =================================================
            // ELIMINANDO
            // =================================================

            Swal.fire({
                title: "Eliminando cliente...",
                text: "Por favor espera.",
                allowOutsideClick: false,
                allowEscapeKey: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });


            await api.delete(
                `/clientes/${cliente.id_cliente}`
            );


            await cargarClientes();


            // =================================================
            // ÉXITO
            // =================================================

            Swal.fire({
                icon: "success",
                title: "Cliente eliminado",
                text: `${nombreCompleto} fue eliminado correctamente.`,
                confirmButtonText: "Aceptar",
                timer: 2500,
                timerProgressBar: true
            });


        } catch (error) {

            console.error(error);

            Swal.fire({
                icon: "error",
                title: "No se pudo eliminar",
                text:
                    error.response?.data?.mensaje ||
                    "Ocurrió un error al eliminar el cliente.",
                confirmButtonText: "Aceptar"
            });

        }

    }


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <Container fluid>

            {/* =================================================
                ENCABEZADO
            ================================================= */}

            <Row className="mb-4 align-items-center">

                <Col>

                    <h1 className="fw-bold mb-1">
                        Mis clientes
                    </h1>

                    <p className="text-muted mb-0">
                        Administra los clientes que entrenas.
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
                        onClick={abrirNuevoCliente}
                        className="w-100"
                    >

                        <FaPlus className="me-2" />

                        Nuevo cliente

                    </Button>

                </Col>

            </Row>


            {/* =================================================
                BUSCADOR
            ================================================= */}

            <Card className="shadow-sm border-0 mb-4">

                <Card.Body>

                    <Row>

                        <Col xs={12} md={6} lg={5}>

                            <div className="position-relative">

                                <FaSearch
                                    className="position-absolute text-muted"
                                    style={{
                                        left: "12px",
                                        top: "12px"
                                    }}
                                />

                                <Form.Control
                                    type="text"
                                    placeholder="Buscar cliente..."
                                    value={busqueda}
                                    onChange={(event) =>
                                        setBusqueda(
                                            event.target.value
                                        )
                                    }
                                    style={{
                                        paddingLeft: "38px"
                                    }}
                                />

                            </div>

                        </Col>

                    </Row>

                </Card.Body>

            </Card>


            {/* =================================================
                CONTENIDO
            ================================================= */}

            {cargando ? (

                <div className="text-center py-5">

                    <Spinner animation="border" />

                    <p className="text-muted mt-3">
                        Cargando clientes...
                    </p>

                </div>

            ) : clientesFiltrados.length === 0 ? (

                <Card className="shadow-sm border-0">

                    <Card.Body className="text-center py-5">

                        <FaUsers
                            size={50}
                            className="text-muted mb-3"
                        />

                        <h4 className="fw-bold">

                            {busqueda
                                ? "No se encontraron clientes"
                                : "No tienes clientes todavía"}

                        </h4>

                        <p className="text-muted">

                            {busqueda
                                ? "Intenta con otro nombre."
                                : "Agrega tu primer cliente para comenzar."}

                        </p>


                        {!busqueda && (

                            <Button
                                variant="primary"
                                onClick={abrirNuevoCliente}
                            >

                                <FaPlus className="me-2" />

                                Nuevo cliente

                            </Button>

                        )}

                    </Card.Body>

                </Card>

            ) : (

                <Row className="g-4">

                    {clientesFiltrados.map((cliente) => (

                        <Col
                            key={cliente.id_cliente}
                            xs={12}
                            sm={6}
                            lg={4}
                            xl={3}
                        >

                            <Card
                                className="h-100 shadow-sm border-0"
                            >

                                <Card.Body>

                                    <div className="d-flex align-items-center mb-3">

                                        <div
                                            className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3"
                                            style={{
                                                width: "50px",
                                                height: "50px",
                                                fontSize: "20px",
                                                flexShrink: 0
                                            }}
                                        >

                                            {cliente.nombre
                                                ?.charAt(0)
                                                .toUpperCase()}

                                        </div>


                                        <div>

                                            <h5 className="fw-bold mb-0">

                                                {cliente.nombre}{" "}

                                                {cliente.paterno}

                                            </h5>


                                            {cliente.materno && (

                                                <small className="text-muted">

                                                    {cliente.materno}

                                                </small>

                                            )}

                                        </div>

                                    </div>


                                    <div className="d-grid gap-2">

                                        <Button
                                            variant="outline-primary"
                                            onClick={() =>
                                                abrirEditarCliente(
                                                    cliente
                                                )
                                            }
                                        >

                                            <FaEdit className="me-2" />

                                            Editar

                                        </Button>


                                        <Button
                                            variant="outline-danger"
                                            onClick={() =>
                                                eliminarCliente(
                                                    cliente
                                                )
                                            }
                                        >

                                            <FaTrash className="me-2" />

                                            Eliminar

                                        </Button>

                                    </div>

                                </Card.Body>

                            </Card>

                        </Col>

                    ))}

                </Row>

            )}


            {/* =================================================
                MODAL
            ================================================= */}

            <Modal
                show={mostrarModal}
                onHide={cerrarModal}
                centered
            >

                <Modal.Header closeButton>

                    <Modal.Title className="fw-bold">

                        {modoEdicion
                            ? "Editar cliente"
                            : "Nuevo cliente"}

                    </Modal.Title>

                </Modal.Header>


                <Form onSubmit={guardarCliente}>

                    <Modal.Body>

                        <Form.Group className="mb-3">

                            <Form.Label>
                                Nombre
                            </Form.Label>

                            <Form.Control
                                type="text"
                                name="nombre"
                                value={formulario.nombre}
                                onChange={cambiarFormulario}
                                placeholder="Ej. Juan"
                                required
                                maxLength={100}
                            />

                        </Form.Group>


                        <Form.Group className="mb-3">

                            <Form.Label>
                                Apellido paterno
                            </Form.Label>

                            <Form.Control
                                type="text"
                                name="paterno"
                                value={formulario.paterno}
                                onChange={cambiarFormulario}
                                placeholder="Ej. Pérez"
                                required
                                maxLength={100}
                            />

                        </Form.Group>


                        <Form.Group className="mb-3">

                            <Form.Label>
                                Apellido materno
                            </Form.Label>

                            <Form.Control
                                type="text"
                                name="materno"
                                value={formulario.materno}
                                onChange={cambiarFormulario}
                                placeholder="Ej. López"
                                maxLength={100}
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

                            ) : (

                                modoEdicion
                                    ? "Guardar cambios"
                                    : "Crear cliente"

                            )}

                        </Button>

                    </Modal.Footer>

                </Form>

            </Modal>

        </Container>

    );
}

export default Clientes;