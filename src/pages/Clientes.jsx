import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Form, Modal, Spinner } from "react-bootstrap";
import { FaPlus, FaSearch, FaEdit, FaTrash, FaUsers } from "react-icons/fa";
import Swal from "sweetalert2";
import api from "../services/api";

function Clientes() {
    const [clientes, setClientes] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [cargando, setCargando] = useState(true);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
    const [guardando, setGuardando] = useState(false);
    const [formulario, setFormulario] = useState({ nombre: "", paterno: "", materno: "" });

    const cargarClientes = async () => {
        try {
            setCargando(true);
            const response = await api.get("/clientes");
            setClientes(response.data);
        } catch (error) {
            Swal.fire({ icon: "error", title: "Error", text: error.response?.data?.mensaje || "Error al obtener clientes." });
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => { cargarClientes(); }, []);

    const clientesFiltrados = clientes.filter((c) =>
        `${c.nombre} ${c.paterno} ${c.materno || ""}`.toLowerCase().includes(busqueda.toLowerCase())
    );

    const abrirModal = (cliente = null) => {
        setModoEdicion(!!cliente);
        setClienteSeleccionado(cliente);
        setFormulario(cliente ? { nombre: cliente.nombre, paterno: cliente.paterno, materno: cliente.materno || "" } : { nombre: "", paterno: "", materno: "" });
        setMostrarModal(true);
    };

    const manejarCambio = (e) => setFormulario({ ...formulario, [e.target.name]: e.target.value });

    const guardarCliente = async (e) => {
        e.preventDefault();
        try {
            setGuardando(true);
            const datos = { nombre: formulario.nombre.trim(), paterno: formulario.paterno.trim(), materno: formulario.materno.trim() || null };

            if (modoEdicion) await api.put(`/clientes/${clienteSeleccionado.id_cliente}`, datos);
            else await api.post("/clientes", datos);

            setMostrarModal(false);
            await cargarClientes();
            Swal.fire({ icon: "success", title: modoEdicion ? "¡Actualizado!" : "¡Creado!", timer: 2000, showConfirmButton: false });
        } catch (error) {
            Swal.fire({ icon: "error", title: "Error al guardar", text: error.response?.data?.mensaje });
        } finally {
            setGuardando(false);
        }
    };

    const eliminarCliente = async (cliente) => {
        const nombreCompleto = `${cliente.nombre} ${cliente.paterno} ${cliente.materno || ""}`.trim();
        const res = await Swal.fire({
            icon: "warning", title: "¿Eliminar?", html: `Eliminarás a <strong>${nombreCompleto}</strong>.`,
            showCancelButton: true, confirmButtonText: "Sí, eliminar", reverseButtons: true
        });

        if (res.isConfirmed) {
            try {
                Swal.showLoading();
                await api.delete(`/clientes/${cliente.id_cliente}`);
                await cargarClientes();
                Swal.fire({ icon: "success", title: "Eliminado", timer: 2000, showConfirmButton: false });
            } catch (error) {
                Swal.fire({ icon: "error", title: "Error", text: "No se pudo eliminar el cliente." });
            }
        }
    };

    return (
        <Container fluid>
            <Row className="mb-4 align-items-center">
                <Col>
                    <h1 className="fw-bold mb-1">Mis clientes</h1>
                    <p className="text-muted mb-0">Administra los clientes que entrenas.</p>
                </Col>
                <Col xs={12} md="auto"><Button onClick={() => abrirModal()}><FaPlus className="me-2" />Nuevo cliente</Button></Col>
            </Row>

            <Card className="shadow-sm border-0 mb-4">
                <Card.Body>
                    <div className="position-relative" style={{ maxWidth: '400px' }}>
                        <FaSearch className="position-absolute text-muted" style={{ left: "12px", top: "12px" }} />
                        <Form.Control type="text" placeholder="Buscar cliente..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} style={{ paddingLeft: "38px" }} />
                    </div>
                </Card.Body>
            </Card>

            {cargando ? (
                <div className="text-center py-5"><Spinner animation="border" /></div>
            ) : clientesFiltrados.length === 0 ? (
                <div className="text-center py-5">
                    <FaUsers size={50} className="text-muted mb-3" />
                    <h4 className="fw-bold">{busqueda ? "Sin resultados" : "No tienes clientes"}</h4>
                </div>
            ) : (
                <Row className="g-4">
                    {clientesFiltrados.map((cliente) => (
                        <Col key={cliente.id_cliente} xs={12} sm={6} lg={4} xl={3}>
                            <Card className="h-100 shadow-sm border-0">
                                <Card.Body>
                                    <div className="d-flex align-items-center mb-3">
                                        <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3" style={{ width: "50px", height: "50px", fontSize: "20px" }}>
                                            {cliente.nombre?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h5 className="fw-bold mb-0">{cliente.nombre} {cliente.paterno}</h5>
                                            {cliente.materno && <small className="text-muted">{cliente.materno}</small>}
                                        </div>
                                    </div>
                                    <div className="d-grid gap-2">
                                        <Button variant="outline-primary" onClick={() => abrirModal(cliente)}><FaEdit className="me-2" />Editar</Button>
                                        <Button variant="outline-danger" onClick={() => eliminarCliente(cliente)}><FaTrash className="me-2" />Eliminar</Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}

            <Modal show={mostrarModal} onHide={() => !guardando && setMostrarModal(false)} centered>
                <Modal.Header closeButton><Modal.Title>{modoEdicion ? "Editar" : "Nuevo"} cliente</Modal.Title></Modal.Header>
                <Form onSubmit={guardarCliente}>
                    <Modal.Body>
                        <Form.Group className="mb-3"><Form.Label>Nombre</Form.Label><Form.Control name="nombre" value={formulario.nombre} onChange={manejarCambio} required /></Form.Group>
                        <Form.Group className="mb-3"><Form.Label>Paterno</Form.Label><Form.Control name="paterno" value={formulario.paterno} onChange={manejarCambio} required /></Form.Group>
                        <Form.Group className="mb-3"><Form.Label>Materno</Form.Label><Form.Control name="materno" value={formulario.materno} onChange={manejarCambio} /></Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setMostrarModal(false)} disabled={guardando}>Cancelar</Button>
                        <Button variant="primary" type="submit" disabled={guardando}>{guardando ? "Guardando..." : "Guardar"}</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
}

export default Clientes;