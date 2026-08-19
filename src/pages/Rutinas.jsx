import { useEffect, useMemo, useState } from "react";

import {
    Container,
    Row,
    Col,
    Card,
    Button,
    Form,
    Modal,
    Spinner,
    Table,
    Badge,
    Tabs,
    Tab,
    Alert
} from "react-bootstrap";

import {
    FaPlus,
    FaEdit,
    FaTrash,
    FaDumbbell,
    FaClipboardList,
    FaEye,
    FaArrowLeft
} from "react-icons/fa";

import Swal from "sweetalert2";

import api from "../services/api";


function Rutinas() {

    // =========================================================
    // ESTADOS
    // =========================================================

    const [rutinas, setRutinas] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [ejercicios, setEjercicios] = useState([]);

    const [cargando, setCargando] = useState(true);
    const [cargandoDetalle, setCargandoDetalle] = useState(false);

    const [rutinaSeleccionada, setRutinaSeleccionada] = useState(null);

    const [mostrarModalRutina, setMostrarModalRutina] =
        useState(false);

    const [mostrarModalEjercicio, setMostrarModalEjercicio] =
        useState(false);

    const [modoEdicionRutina, setModoEdicionRutina] =
        useState(false);

    const [modoEdicionEjercicio, setModoEdicionEjercicio] =
        useState(false);

    const [ejercicioSeleccionado, setEjercicioSeleccionado] =
        useState(null);

    const [guardando, setGuardando] = useState(false);

    const [diaActivo, setDiaActivo] = useState("Lunes");

    const [error, setError] = useState("");

    const dias = [
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado",
        "Domingo"
    ];

    const [formularioRutina, setFormularioRutina] = useState({
        cliente_id: "",
        nombre: "",
        fecha: "",
        comentarios: ""
    });

    const [formularioEjercicio, setFormularioEjercicio] = useState({
        ejercicio_id: "",
        series: 3,
        repeticiones: 10,
        orden: 1,
        comentarios: ""
    });


    // =========================================================
    // CARGAR DATOS
    // =========================================================

    async function cargarDatos() {

        try {

            setCargando(true);
            setError("");

            const [
                rutinasResponse,
                clientesResponse,
                ejerciciosResponse
            ] = await Promise.all([
                api.get("/rutinas"),
                api.get("/clientes"),
                api.get("/ejercicios")
            ]);

            setRutinas(rutinasResponse.data);
            setClientes(clientesResponse.data);
            setEjercicios(ejerciciosResponse.data);

        } catch (error) {

            console.error(error);

            setError(
                "No se pudieron cargar los datos."
            );

        } finally {

            setCargando(false);

        }
    }


    useEffect(() => {

        cargarDatos();

    }, []);


    // =========================================================
    // ABRIR RUTINA
    // =========================================================

    async function abrirRutina(id) {

        try {

            setCargandoDetalle(true);
            setError("");

            const response =
                await api.get(`/rutinas/${id}`);

            setRutinaSeleccionada(response.data);

            setDiaActivo("Lunes");

        } catch (error) {

            console.error(error);

            Swal.fire({
                icon: "error",
                title: "Error",
                text:
                    error.response?.data?.mensaje ||
                    "No se pudo cargar la rutina.",
                confirmButtonText: "Aceptar"
            });

        } finally {

            setCargandoDetalle(false);

        }
    }


    function cerrarRutina() {

        setRutinaSeleccionada(null);

    }


    // =========================================================
    // CREAR RUTINA
    // =========================================================

    function abrirNuevaRutina() {

        setModoEdicionRutina(false);

        setFormularioRutina({
            cliente_id: "",
            nombre: "",
            fecha: "",
            comentarios: ""
        });

        setMostrarModalRutina(true);

    }


    // =========================================================
    // EDITAR RUTINA
    // =========================================================

    function abrirEditarRutina(rutina) {

        setModoEdicionRutina(true);

        setFormularioRutina({
            cliente_id: rutina.cliente_id || "",
            nombre: rutina.nombre || "",
            fecha: rutina.fecha
                ? rutina.fecha.substring(0, 10)
                : "",
            comentarios: rutina.comentarios || ""
        });

        setMostrarModalRutina(true);

    }


    function cerrarModalRutina() {

        if (guardando) {
            return;
        }

        setMostrarModalRutina(false);

    }


    function cambiarFormularioRutina(event) {

        const {
            name,
            value
        } = event.target;

        setFormularioRutina((actual) => ({
            ...actual,
            [name]: value
        }));

    }


    // =========================================================
    // GUARDAR RUTINA
    // =========================================================

    async function guardarRutina(event) {

        event.preventDefault();

        try {

            setGuardando(true);

            const datos = {
                nombre:
                    formularioRutina.nombre.trim(),

                fecha:
                    formularioRutina.fecha || undefined,

                comentarios:
                    formularioRutina.comentarios.trim() || null
            };


            if (modoEdicionRutina) {

                const response =
                    await api.put(
                        `/rutinas/${rutinaSeleccionada.id}`,
                        datos
                    );

                await Swal.fire({
                    icon: "success",
                    title: "Rutina actualizada",
                    text: "Los cambios se guardaron correctamente.",
                    timer: 1800,
                    showConfirmButton: false
                });

                setMostrarModalRutina(false);

                await abrirRutina(rutinaSeleccionada.id);

            } else {

                const datosCrear = {
                    ...datos,
                    cliente_id:
                        formularioRutina.cliente_id
                };

                await api.post(
                    "/rutinas",
                    datosCrear
                );

                await Swal.fire({
                    icon: "success",
                    title: "Rutina creada",
                    text: "La rutina se creó correctamente.",
                    timer: 1800,
                    showConfirmButton: false
                });

                setMostrarModalRutina(false);

                await cargarDatos();

            }

        } catch (error) {

            console.error(error);

            Swal.fire({
                icon: "error",
                title: "No se pudo guardar",
                text:
                    error.response?.data?.mensaje ||
                    "Ocurrió un error al guardar la rutina.",
                confirmButtonText: "Aceptar"
            });

        } finally {

            setGuardando(false);

        }

    }


    // =========================================================
    // ELIMINAR RUTINA
    // =========================================================

    async function eliminarRutina(rutina) {

        const resultado = await Swal.fire({

            icon: "warning",

            title: "¿Eliminar rutina?",

            html: `
                ¿Estás seguro de eliminar
                <strong>${rutina.nombre}</strong>?
                <br>
                Esta acción no se puede deshacer.
            `,

            showCancelButton: true,

            confirmButtonText: "Sí, eliminar",

            cancelButtonText: "Cancelar",

            confirmButtonColor: "#dc3545",

            cancelButtonColor: "#6c757d"

        });


        if (!resultado.isConfirmed) {
            return;
        }


        try {

            await api.delete(
                `/rutinas/${rutina.id_rutina}`
            );

            await Swal.fire({
                icon: "success",
                title: "Rutina eliminada",
                text: "La rutina se eliminó correctamente.",
                timer: 1800,
                showConfirmButton: false
            });

            await cargarDatos();

        } catch (error) {

            console.error(error);

            Swal.fire({
                icon: "error",
                title: "No se pudo eliminar",
                text:
                    error.response?.data?.mensaje ||
                    "Ocurrió un error al eliminar la rutina.",
                confirmButtonText: "Aceptar"
            });

        }

    }


    // =========================================================
    // EJERCICIOS DE LA RUTINA
    // =========================================================

    const ejerciciosDeRutina =
        rutinaSeleccionada?.ejercicios || [];


    // =========================================================
    // ABRIR AGREGAR EJERCICIO
    // =========================================================

    function abrirAgregarEjercicio() {

        setModoEdicionEjercicio(false);

        setEjercicioSeleccionado(null);

        setFormularioEjercicio({
            ejercicio_id: "",
            series: 3,
            repeticiones: 10,
            orden:
                ejerciciosDeRutina.length + 1,
            comentarios: ""
        });

        setMostrarModalEjercicio(true);

    }


    // =========================================================
    // EDITAR EJERCICIO
    // =========================================================

    function abrirEditarEjercicio(ejercicio) {

        setModoEdicionEjercicio(true);

        setEjercicioSeleccionado(ejercicio);

        setFormularioEjercicio({
            ejercicio_id:
                ejercicio.ejercicio_id,

            series:
                ejercicio.series,

            repeticiones:
                ejercicio.repeticiones,

            orden:
                ejercicio.orden,

            comentarios:
                ejercicio.comentarios || ""
        });

        setMostrarModalEjercicio(true);

    }


    function cerrarModalEjercicio() {

        if (guardando) {
            return;
        }

        setMostrarModalEjercicio(false);

    }


    function cambiarFormularioEjercicio(event) {

        const {
            name,
            value
        } = event.target;

        setFormularioEjercicio((actual) => ({
            ...actual,
            [name]:
                name === "series" ||
                    name === "repeticiones" ||
                    name === "orden"
                    ? Number(value)
                    : value
        }));

    }


    // =========================================================
    // GUARDAR EJERCICIO DE RUTINA
    // =========================================================

    async function guardarEjercicioRutina(event) {

        event.preventDefault();

        try {

            setGuardando(true);

            const datos = {
                ejercicio_id:
                    formularioEjercicio.ejercicio_id,

                series:
                    Number(formularioEjercicio.series),

                repeticiones:
                    Number(formularioEjercicio.repeticiones),

                orden:
                    Number(formularioEjercicio.orden),

                comentarios:
                    formularioEjercicio.comentarios.trim() ||
                    null
            };


            if (modoEdicionEjercicio) {

                await api.put(
                    `/rutinas/${rutinaSeleccionada.id}/ejercicios/${ejercicioSeleccionado.id}`,
                    {
                        series: datos.series,
                        repeticiones: datos.repeticiones,
                        orden: datos.orden,
                        comentarios: datos.comentarios
                    }
                );

                await Swal.fire({
                    icon: "success",
                    title: "Ejercicio actualizado",
                    timer: 1500,
                    showConfirmButton: false
                });

            } else {

                await api.post(
                    `/rutinas/${rutinaSeleccionada.id}/ejercicios`,
                    datos
                );

                await Swal.fire({
                    icon: "success",
                    title: "Ejercicio agregado",
                    timer: 1500,
                    showConfirmButton: false
                });

            }


            setMostrarModalEjercicio(false);

            await abrirRutina(
                rutinaSeleccionada.id
            );

        } catch (error) {

            console.error(error);

            Swal.fire({
                icon: "error",
                title: "No se pudo guardar",
                text:
                    error.response?.data?.mensaje ||
                    "No se pudo guardar el ejercicio en la rutina.",
                confirmButtonText: "Aceptar"
            });

        } finally {

            setGuardando(false);

        }

    }


    // =========================================================
    // ELIMINAR EJERCICIO DE RUTINA
    // =========================================================

    async function eliminarEjercicioRutina(ejercicio) {

        const resultado = await Swal.fire({

            icon: "warning",

            title: "¿Quitar ejercicio?",

            html: `
                ¿Quieres quitar
                <strong>${ejercicio.nombre}</strong>
                de esta rutina?
                <br><br>
                El ejercicio seguirá disponible en tu catálogo.
            `,

            showCancelButton: true,

            confirmButtonText: "Sí, quitar",

            cancelButtonText: "Cancelar",

            confirmButtonColor: "#dc3545",

            cancelButtonColor: "#6c757d"

        });


        if (!resultado.isConfirmed) {
            return;
        }


        try {

            await api.delete(
                `/rutinas/${rutinaSeleccionada.id}/ejercicios/${ejercicio.id}`
            );


            await Swal.fire({
                icon: "success",
                title: "Ejercicio quitado",
                timer: 1500,
                showConfirmButton: false
            });


            await abrirRutina(
                rutinaSeleccionada.id
            );

        } catch (error) {

            console.error(error);

            Swal.fire({
                icon: "error",
                title: "No se pudo quitar",
                text:
                    error.response?.data?.mensaje ||
                    "No se pudo eliminar el ejercicio de la rutina.",
                confirmButtonText: "Aceptar"
            });

        }

    }


    // =========================================================
    // FORMATEAR FECHA
    // =========================================================

    function formatearFecha(fecha) {

        if (!fecha) {
            return "Sin fecha";
        }

        return new Date(fecha).toLocaleDateString(
            "es-MX",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            }
        );

    }


    // =========================================================
    // CLIENTE
    // =========================================================

    function nombreCliente(cliente) {

        if (!cliente) {
            return "Sin cliente";
        }

        return [
            cliente.nombre,
            cliente.paterno,
            cliente.materno
        ]
            .filter(Boolean)
            .join(" ");

    }


    // =========================================================
    // RENDER DETALLE
    // =========================================================

    if (rutinaSeleccionada) {

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
                                        rutinaSeleccionada.cliente
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
                                    variant="primary"
                                    onClick={
                                        abrirAgregarEjercicio
                                    }
                                >
                                    <FaPlus className="me-2" />
                                    Agregar ejercicio
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
                                        title={dia}
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
                                        Ejercicios de este día.
                                    </p>

                                </div>

                                <Badge bg="primary">
                                    {ejerciciosDeRutina.length} ejercicios
                                </Badge>

                            </div>


                            {ejerciciosDeRutina.length === 0 ? (

                                <div className="text-center py-5">

                                    <FaDumbbell
                                        size={50}
                                        className="text-muted mb-3"
                                    />

                                    <h5 className="fw-bold">
                                        No hay ejercicios todavía
                                    </h5>

                                    <p className="text-muted">
                                        Agrega ejercicios para comenzar
                                        a construir esta rutina.
                                    </p>

                                    <Button
                                        variant="primary"
                                        onClick={
                                            abrirAgregarEjercicio
                                        }
                                    >
                                        <FaPlus className="me-2" />
                                        Agregar ejercicio
                                    </Button>

                                </div>

                            ) : (

                                <div className="table-responsive">

                                    <Table
                                        hover
                                        className="align-middle"
                                    >

                                        <thead className="table-light">

                                            <tr>

                                                <th>
                                                    #
                                                </th>

                                                <th>
                                                    Ejercicio
                                                </th>

                                                <th>
                                                    Categoría
                                                </th>

                                                <th>
                                                    Series
                                                </th>

                                                <th>
                                                    Repeticiones
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

                                            {ejerciciosDeRutina
                                                .sort(
                                                    (a, b) =>
                                                        a.orden -
                                                        b.orden
                                                )
                                                .map(
                                                    (ejercicio) => (

                                                        <tr
                                                            key={
                                                                ejercicio.id
                                                            }
                                                        >

                                                            <td>
                                                                <Badge
                                                                    bg="secondary"
                                                                >
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
                                                                        ejercicio.categoria
                                                                    }
                                                                </Badge>

                                                            </td>


                                                            <td>
                                                                {
                                                                    ejercicio.series
                                                                }
                                                            </td>


                                                            <td>
                                                                {
                                                                    ejercicio.repeticiones
                                                                }
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
                                                                            eliminarEjercicioRutina(
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


                {/* MODAL RUTINA */}

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

                            <Form.Group className="mb-3">

                                <Form.Label>
                                    Nombre
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
                                    placeholder="Ej. Hipertrofia"
                                    maxLength={150}
                                    required
                                />

                            </Form.Group>


                            {!modoEdicionRutina && (

                                <Form.Group className="mb-3">

                                    <Form.Label>
                                        Cliente
                                    </Form.Label>

                                    <Form.Select
                                        name="cliente_id"
                                        value={
                                            formularioRutina.cliente_id
                                        }
                                        onChange={
                                            cambiarFormularioRutina
                                        }
                                        required
                                    >

                                        <option value="">
                                            Selecciona un cliente
                                        </option>

                                        {clientes.map(
                                            (cliente) => (

                                                <option
                                                    key={
                                                        cliente.id_cliente
                                                    }
                                                    value={
                                                        cliente.id_cliente
                                                    }
                                                >
                                                    {
                                                        nombreCliente(
                                                            cliente
                                                        )
                                                    }
                                                </option>

                                            )
                                        )}

                                    </Form.Select>

                                </Form.Group>

                            )}


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
                                    placeholder="Notas sobre la rutina..."
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


                {/* MODAL EJERCICIO */}

                <Modal
                    show={mostrarModalEjercicio}
                    onHide={cerrarModalEjercicio}
                    centered
                >

                    <Modal.Header closeButton>

                        <Modal.Title className="fw-bold">

                            {modoEdicionEjercicio
                                ? "Editar ejercicio"
                                : "Agregar ejercicio"}

                        </Modal.Title>

                    </Modal.Header>


                    <Form
                        onSubmit={
                            guardarEjercicioRutina
                        }
                    >

                        <Modal.Body>

                            {!modoEdicionEjercicio && (

                                <Form.Group className="mb-3">

                                    <Form.Label>
                                        Ejercicio
                                    </Form.Label>

                                    <Form.Select
                                        name="ejercicio_id"
                                        value={
                                            formularioEjercicio.ejercicio_id
                                        }
                                        onChange={
                                            cambiarFormularioEjercicio
                                        }
                                        required
                                    >

                                        <option value="">
                                            Selecciona un ejercicio
                                        </option>

                                        {ejercicios.map(
                                            (ejercicio) => (

                                                <option
                                                    key={
                                                        ejercicio.id_ejercicio
                                                    }
                                                    value={
                                                        ejercicio.id_ejercicio
                                                    }
                                                >
                                                    {
                                                        ejercicio.nombre
                                                    }{" "}
                                                    —{" "}
                                                    {
                                                        ejercicio.categoria
                                                    }
                                                </option>

                                            )
                                        )}

                                    </Form.Select>

                                </Form.Group>

                            )}


                            {modoEdicionEjercicio && (

                                <Alert variant="light">

                                    <strong>
                                        Ejercicio:
                                    </strong>{" "}

                                    {
                                        ejercicioSeleccionado?.nombre
                                    }

                                </Alert>

                            )}


                            <Row>

                                <Col xs={4}>

                                    <Form.Group className="mb-3">

                                        <Form.Label>
                                            Series
                                        </Form.Label>

                                        <Form.Control
                                            type="number"
                                            name="series"
                                            min="1"
                                            value={
                                                formularioEjercicio.series
                                            }
                                            onChange={
                                                cambiarFormularioEjercicio
                                            }
                                            required
                                        />

                                    </Form.Group>

                                </Col>


                                <Col xs={4}>

                                    <Form.Group className="mb-3">

                                        <Form.Label>
                                            Repeticiones
                                        </Form.Label>

                                        <Form.Control
                                            type="number"
                                            name="repeticiones"
                                            min="1"
                                            value={
                                                formularioEjercicio.repeticiones
                                            }
                                            onChange={
                                                cambiarFormularioEjercicio
                                            }
                                            required
                                        />

                                    </Form.Group>

                                </Col>


                                <Col xs={4}>

                                    <Form.Group className="mb-3">

                                        <Form.Label>
                                            Orden
                                        </Form.Label>

                                        <Form.Control
                                            type="number"
                                            name="orden"
                                            min="1"
                                            value={
                                                formularioEjercicio.orden
                                            }
                                            onChange={
                                                cambiarFormularioEjercicio
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
                                        formularioEjercicio.comentarios
                                    }
                                    onChange={
                                        cambiarFormularioEjercicio
                                    }
                                    placeholder="Ej. Descanso de 90 segundos..."
                                />

                            </Form.Group>

                        </Modal.Body>


                        <Modal.Footer>

                            <Button
                                variant="secondary"
                                onClick={
                                    cerrarModalEjercicio
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

                                    modoEdicionEjercicio
                                        ? "Guardar cambios"
                                        : "Agregar ejercicio"

                                )}

                            </Button>

                        </Modal.Footer>

                    </Form>

                </Modal>

            </Container>

        );

    }


    // =========================================================
    // RENDER LISTADO
    // =========================================================

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

            ) : rutinas.length === 0 ? (

                <Card className="shadow-sm border-0">

                    <Card.Body className="text-center py-5">

                        <FaClipboardList
                            size={55}
                            className="text-muted mb-3"
                        />

                        <h4 className="fw-bold">
                            No tienes rutinas todavía
                        </h4>

                        <p className="text-muted mb-4">
                            Crea tu primera rutina para comenzar.
                        </p>

                        <Button
                            variant="primary"
                            onClick={abrirNuevaRutina}
                        >
                            <FaPlus className="me-2" />
                            Nueva rutina
                        </Button>

                    </Card.Body>

                </Card>

            ) : (

                <Row className="g-4">

                    {rutinas.map((rutina) => (

                        <Col
                            key={rutina.id_rutina}
                            xs={12}
                            md={6}
                            xl={4}
                        >

                            <Card
                                className="h-100 shadow-sm border-0"
                            >

                                <Card.Body>

                                    <div className="d-flex justify-content-between align-items-start mb-3">

                                        <div>

                                            <h5 className="fw-bold mb-1">
                                                {rutina.nombre}
                                            </h5>

                                            <p className="text-muted mb-0">

                                                {nombreCliente(
                                                    rutina.clientes
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
                                            className="me-2"
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
                                                    rutina.id_rutina
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
                                                    eliminarRutina(
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

                    ))}

                </Row>

            )}


            {/* =================================================
                MODAL NUEVA RUTINA
            ================================================= */}

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

                        <Form.Group className="mb-3">

                            <Form.Label>
                                Cliente
                            </Form.Label>

                            <Form.Select
                                name="cliente_id"
                                value={
                                    formularioRutina.cliente_id
                                }
                                onChange={
                                    cambiarFormularioRutina
                                }
                                disabled={
                                    modoEdicionRutina
                                }
                                required
                            >

                                <option value="">
                                    Selecciona un cliente
                                </option>

                                {clientes.map(
                                    (cliente) => (

                                        <option
                                            key={
                                                cliente.id_cliente
                                            }
                                            value={
                                                cliente.id_cliente
                                            }
                                        >
                                            {
                                                nombreCliente(
                                                    cliente
                                                )
                                            }
                                        </option>

                                    )
                                )}

                            </Form.Select>

                        </Form.Group>


                        <Form.Group className="mb-3">

                            <Form.Label>
                                Nombre de la rutina
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
                                placeholder="Ej. Hipertrofia"
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

        </Container>

    );

}


export default Rutinas;