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
    Tab
} from "react-bootstrap";

import {
    FaPlus,
    FaEdit,
    FaTrash,
    FaDumbbell,
    FaSearch
} from "react-icons/fa";

import Swal from "sweetalert2";

import api from "../services/api";


function Ejercicios() {

    const [ejercicios, setEjercicios] = useState([]);

    const [cargando, setCargando] = useState(true);

    const [busqueda, setBusqueda] = useState("");

    // Categoría activa de los tabs
    const [categoriaActiva, setCategoriaActiva] =
        useState("todos");

    const [otraCategoria, setOtraCategoria] =
        useState(false);

    const [mostrarModal, setMostrarModal] =
        useState(false);

    const [modoEdicion, setModoEdicion] =
        useState(false);

    const [ejercicioSeleccionado, setEjercicioSeleccionado] =
        useState(null);

    const [guardando, setGuardando] =
        useState(false);

    const [formulario, setFormulario] = useState({
        nombre: "",
        categoria: "",
        descripcion: ""
    });


    // =========================================================
    // CARGAR EJERCICIOS
    // =========================================================

    async function cargarEjercicios() {

        try {

            setCargando(true);

            const response =
                await api.get("/ejercicios");

            setEjercicios(response.data);

        } catch (error) {

            console.error(error);

            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudieron cargar los ejercicios.",
                confirmButtonText: "Aceptar"
            });

        } finally {

            setCargando(false);

        }
    }


    useEffect(() => {

        cargarEjercicios();

    }, []);


    // =========================================================
    // CATEGORÍAS
    // =========================================================

    const categorias = useMemo(() => {

        const categoriasUnicas = [
            ...new Set(
                ejercicios
                    .map((ejercicio) => ejercicio.categoria)
                    .filter(Boolean)
            )
        ];

        return categoriasUnicas.sort((a, b) =>
            a.localeCompare(b)
        );

    }, [ejercicios]);


    // =========================================================
    // FILTRAR EJERCICIOS
    // =========================================================

    const ejerciciosFiltrados = useMemo(() => {

        return ejercicios.filter((ejercicio) => {

            const coincideCategoria =
                categoriaActiva === "todos" ||
                ejercicio.categoria === categoriaActiva;


            const texto =
                busqueda.toLowerCase().trim();


            const coincideBusqueda =
                !texto ||
                ejercicio.nombre
                    .toLowerCase()
                    .includes(texto) ||

                ejercicio.categoria
                    .toLowerCase()
                    .includes(texto) ||

                (ejercicio.descripcion || "")
                    .toLowerCase()
                    .includes(texto);


            return (
                coincideCategoria &&
                coincideBusqueda
            );

        });

    }, [
        ejercicios,
        categoriaActiva,
        busqueda
    ]);


    // =========================================================
    // CAMBIAR CATEGORÍA
    // =========================================================

    function cambiarCategoria(categoria) {

        setCategoriaActiva(
            categoria === "todas"
                ? "todos"
                : categoria
        );

    }


    // =========================================================
    // FORMULARIO
    // =========================================================

    function abrirNuevoEjercicio() {

        setModoEdicion(false);

        setEjercicioSeleccionado(null);

        setOtraCategoria(false);

        setFormulario({
            nombre: "",
            categoria: "",
            descripcion: ""
        });

        setMostrarModal(true);
    }


    function abrirEditarEjercicio(ejercicio) {

        setModoEdicion(true);

        setEjercicioSeleccionado(ejercicio);

        setOtraCategoria(false);

        setFormulario({
            nombre: ejercicio.nombre,
            categoria: ejercicio.categoria,
            descripcion: ejercicio.descripcion || ""
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
    // SABER SI ES PROPIO
    // =========================================================

    function esPropio(ejercicio) {

        /*
         * Los ejercicios propios tienen created_by.
         *
         * Los ejercicios globales tienen created_by = null.
         *
         * El backend también controla los permisos.
         */

        return ejercicio.created_by !== null;

    }


    // =========================================================
    // CREAR / ACTUALIZAR
    // =========================================================

    async function guardarEjercicio(event) {

        event.preventDefault();

        try {

            setGuardando(true);


            const datos = {

                nombre:
                    formulario.nombre.trim(),

                categoria:
                    formulario.categoria.trim(),

                descripcion:
                    formulario.descripcion.trim() || null

            };


            if (modoEdicion) {

                await api.put(
                    `/ejercicios/${ejercicioSeleccionado.id_ejercicio}`,
                    datos
                );


                await Swal.fire({

                    icon: "success",

                    title: "Ejercicio actualizado",

                    text:
                        "Los cambios se guardaron correctamente.",

                    timer: 1800,

                    showConfirmButton: false

                });

            } else {

                await api.post(
                    "/ejercicios",
                    datos
                );


                await Swal.fire({

                    icon: "success",

                    title: "Ejercicio creado",

                    text:
                        "El ejercicio se agregó a tus ejercicios.",

                    timer: 1800,

                    showConfirmButton: false

                });

            }


            setMostrarModal(false);

            await cargarEjercicios();


        } catch (error) {

            console.error(error);

            Swal.fire({

                icon: "error",

                title: "No se pudo guardar",

                text:
                    error.response?.data?.mensaje ||
                    "Ocurrió un error al guardar el ejercicio.",

                confirmButtonText: "Aceptar"

            });

        } finally {

            setGuardando(false);

        }

    }


    // =========================================================
    // ELIMINAR
    // =========================================================

    async function eliminarEjercicio(ejercicio) {

        if (!esPropio(ejercicio)) {
            return;
        }


        const resultado = await Swal.fire({

            icon: "warning",

            title: "¿Eliminar ejercicio?",

            html: `
                ¿Estás seguro de eliminar
                <strong>${ejercicio.nombre}</strong>?
                <br><br>
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
                `/ejercicios/${ejercicio.id_ejercicio}`
            );


            await Swal.fire({

                icon: "success",

                title: "Ejercicio eliminado",

                text:
                    "El ejercicio se eliminó correctamente.",

                timer: 1800,

                showConfirmButton: false

            });


            await cargarEjercicios();


        } catch (error) {

            console.error(error);

            Swal.fire({

                icon: "error",

                title: "No se pudo eliminar",

                text:
                    error.response?.data?.mensaje ||
                    "Ocurrió un error al eliminar el ejercicio.",

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


            {/* =================================================
                CONTENIDO
            ================================================= */}

            <Card className="shadow-sm border-0">

                <Card.Body className="p-0">


                    {/* =================================================
                        BUSCADOR + DROPDOWN
                    ================================================= */}

                    <div className="p-4 border-bottom">

                        <Row className="g-3">

                            {/* BUSCADOR */}

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


                            {/* DROPDOWN */}

                            <Col
                                xs={12}
                                md={5}
                                lg={4}
                            >

                                <Form.Select
                                    value={
                                        categoriaActiva === "todos"
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


                    {/* =================================================
                        TABS
                    ================================================= */}

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


                    {/* =================================================
                        TABLA
                    ================================================= */}

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

                                    : "Todavía no hay ejercicios en esta categoría."

                                }

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

                                                    {/* NOMBRE */}

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


                                                    {/* CATEGORÍA */}

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


                                                    {/* DESCRIPCIÓN */}

                                                    <td>

                                                        <span className="text-muted">

                                                            {
                                                                ejercicio.descripcion ||
                                                                "Sin descripción"
                                                            }

                                                        </span>

                                                    </td>


                                                    {/* TIPO */}

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


                                                    {/* ACCIONES */}

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


            {/* =================================================
                MODAL CREAR / EDITAR
            ================================================= */}

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


                        {/* NOMBRE */}

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


                        {/* CATEGORÍA */}

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
                                                    categoria: ""
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


                                    <option value="__otra__">
                                        + Otra categoría
                                    </option>

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
                                                        event.target.value
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
                                                    categoria: ""
                                                })
                                            );

                                        }}
                                    >

                                        ← Volver a categorías

                                    </Button>

                                </>

                            )}

                        </Form.Group>


                        {/* DESCRIPCIÓN */}

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


                    {/* FOOTER */}

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
                                    : "Crear ejercicio"

                            )}

                        </Button>

                    </Modal.Footer>

                </Form>

            </Modal>

        </Container>

    );

}


export default Ejercicios;