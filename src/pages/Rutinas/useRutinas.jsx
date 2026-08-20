import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";

import api from "../../services/api";

import {
    obtenerRutinas,
    obtenerRutina,
    crearRutina,
    actualizarRutina,
    eliminarRutina,
    agregarEjerciciosLoteRutina,
    actualizarEjercicioRutina,
    eliminarEjercicioRutina
} from "../../services/rutinaService";

export function useRutinas() {
    const [rutinas, setRutinas] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [ejercicios, setEjercicios] = useState([]);

    const [cargando, setCargando] = useState(true);
    const [cargandoDetalle, setCargandoDetalle] = useState(false);

    const [rutinaSeleccionada, setRutinaSeleccionada] = useState(null);
    const [rutinaEditandoId, setRutinaEditandoId] = useState(null);

    const [mostrarModalRutina, setMostrarModalRutina] = useState(false);
    const [mostrarModalEjercicios, setMostrarModalEjercicios] =
        useState(false);
    const [mostrarModalEditarEjercicio, setMostrarModalEditarEjercicio] =
        useState(false);

    const [modoEdicionRutina, setModoEdicionRutina] = useState(false);

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

    const [ejerciciosSeleccionados, setEjerciciosSeleccionados] =
        useState({});

    const [busquedaEjerciciosModal, setBusquedaEjerciciosModal] =
        useState("");

    const [categoriaEjerciciosModal, setCategoriaEjerciciosModal] =
        useState("todos");

    const [formularioEditarEjercicio, setFormularioEditarEjercicio] =
        useState({
            ejercicio_id: "",
            dia: "Lunes",
            series: 3,
            repeticiones: 10,
            orden: 1,
            comentarios: ""
        });

    const [busqueda, setBusqueda] = useState("");

    function obtenerIdRutina(rutina) {
        return rutina?.id_rutina ?? rutina?.id ?? null;
    }

    function obtenerIdEjercicioRutina(ejercicio) {
        return (
            ejercicio?.id ??
            ejercicio?.id_ejercicio_rutina ??
            ejercicio?.id_rutina_ejercicio ??
            null
        );
    }

    function obtenerIdEjercicio(ejercicio) {
        return (
            ejercicio?.id_ejercicio ??
            ejercicio?.ejercicio_id ??
            ejercicio?.id ??
            null
        );
    }

    async function cargarDatos() {
        try {
            setCargando(true);
            setError("");

            const [
                rutinasData,
                clientesResponse,
                ejerciciosResponse
            ] = await Promise.all([
                obtenerRutinas(),
                api.get("/clientes"),
                api.get("/ejercicios")
            ]);

            setRutinas(
                Array.isArray(rutinasData)
                    ? rutinasData
                    : []
            );

            setClientes(
                Array.isArray(clientesResponse.data)
                    ? clientesResponse.data
                    : []
            );

            setEjercicios(
                Array.isArray(ejerciciosResponse.data)
                    ? ejerciciosResponse.data
                    : []
            );
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.mensaje ||
                "No se pudieron cargar los datos."
            );
        } finally {
            setCargando(false);
        }
    }

    useEffect(() => {
        cargarDatos();
    }, []);

    const rutinasFiltradas = rutinas.filter((rutina) => {
        const texto = busqueda.toLowerCase().trim();

        if (!texto) return true;

        const nombreRutina =
            rutina.nombre?.toLowerCase() || "";

        const cliente =
            rutina.clientes || rutina.cliente;

        const nombreCliente = [
            cliente?.nombre,
            cliente?.paterno,
            cliente?.materno
        ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

        return (
            nombreRutina.includes(texto) ||
            nombreCliente.includes(texto)
        );
    });

    async function abrirRutina(id) {
        try {
            setCargandoDetalle(true);
            setError("");

            const data = await obtenerRutina(id);

            const ejerciciosNormalizados = [];

            if (Array.isArray(data?.dias)) {
                for (const dia of data.dias) {
                    if (!Array.isArray(dia.ejercicios)) {
                        continue;
                    }

                    for (const ejercicio of dia.ejercicios) {
                        ejerciciosNormalizados.push({
                            ...ejercicio,
                            dia: ejercicio.dia || dia.dia
                        });
                    }
                }
            }

            const rutinaNormalizada = {
                ...data,
                ejercicios: ejerciciosNormalizados
            };

            setRutinaSeleccionada(rutinaNormalizada);
            setDiaActivo("Lunes");
        } catch (error) {
            console.error(error);

            Swal.fire({
                icon: "error",
                title: "Error",
                text:
                    error.response?.data?.mensaje ||
                    error.message ||
                    "No se pudo cargar la rutina.",
                confirmButtonText: "Aceptar"
            });
        } finally {
            setCargandoDetalle(false);
        }
    }

    function cerrarRutina() {
        setRutinaSeleccionada(null);
        setEjerciciosSeleccionados({});
    }

    function abrirNuevaRutina() {
        setModoEdicionRutina(false);
        setRutinaEditandoId(null);

        setFormularioRutina({
            cliente_id: "",
            nombre: "",
            fecha: "",
            comentarios: ""
        });

        setMostrarModalRutina(true);
    }

    function abrirEditarRutina(rutina) {
        const idRutina = obtenerIdRutina(rutina);

        setModoEdicionRutina(true);
        setRutinaEditandoId(idRutina);

        setFormularioRutina({
            cliente_id:
                rutina.cliente_id ||
                rutina.clientes?.id_cliente ||
                rutina.cliente?.id ||
                "",

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
        const { name, value } = event.target;

        setFormularioRutina((actual) => ({
            ...actual,
            [name]: value
        }));
    }

    async function guardarRutina(event) {
        event.preventDefault();

        try {
            setGuardando(true);

            const datos = {
                nombre: formularioRutina.nombre.trim(),
                fecha: formularioRutina.fecha || undefined,
                comentarios:
                    formularioRutina.comentarios.trim() || null
            };

            if (modoEdicionRutina) {
                const idRutina = rutinaEditandoId;

                if (!idRutina) {
                    throw new Error(
                        "No se encontró el ID de la rutina."
                    );
                }

                await actualizarRutina(idRutina, datos);

                await Swal.fire({
                    icon: "success",
                    title: "Rutina actualizada",
                    timer: 1500,
                    showConfirmButton: false
                });

                setMostrarModalRutina(false);

                await cargarDatos();

                if (rutinaSeleccionada) {
                    await abrirRutina(idRutina);
                }
            } else {
                await crearRutina({
                    ...datos,
                    cliente_id: formularioRutina.cliente_id
                });

                await Swal.fire({
                    icon: "success",
                    title: "Rutina creada",
                    timer: 1500,
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
                    error.message ||
                    "Ocurrió un error al guardar la rutina.",
                confirmButtonText: "Aceptar"
            });
        } finally {
            setGuardando(false);
        }
    }

    async function eliminarRutinaHandler(rutina) {
        const resultado = await Swal.fire({
            icon: "warning",
            title: "¿Eliminar rutina?",
            html: `
                ¿Estás seguro de eliminar
                <strong>${rutina.nombre}</strong>?
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
            const idRutina = obtenerIdRutina(rutina);

            await eliminarRutina(idRutina);

            await Swal.fire({
                icon: "success",
                title: "Rutina eliminada",
                timer: 1500,
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
                    error.message ||
                    "Ocurrió un error al eliminar la rutina.",
                confirmButtonText: "Aceptar"
            });
        }
    }

    const todosLosEjerciciosDeRutina =
        rutinaSeleccionada?.ejercicios || [];

    const categoriasEjerciciosModal = useMemo(() => {
        const categorias = [
            ...new Set(
                ejercicios
                    .map((ejercicio) =>
                        ejercicio.categoria?.trim()
                    )
                    .filter(Boolean)
            )
        ];

        return categorias.sort((a, b) =>
            a.localeCompare(b, "es", {
                sensitivity: "base"
            })
        );
    }, [ejercicios]);

    function normalizarTexto(texto) {
        return String(texto || "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim();
    }

    const ejerciciosFiltradosModal = useMemo(() => {
        const texto = normalizarTexto(
            busquedaEjerciciosModal
        );

        return ejercicios.filter((ejercicio) => {
            const categoria = ejercicio.categoria || "";

            const coincideCategoria =
                categoriaEjerciciosModal === "todos" ||
                categoria === categoriaEjerciciosModal;

            const coincideBusqueda =
                !texto ||
                normalizarTexto(
                    ejercicio.nombre
                ).includes(texto) ||
                normalizarTexto(
                    ejercicio.categoria
                ).includes(texto) ||
                normalizarTexto(
                    ejercicio.descripcion
                ).includes(texto);

            return coincideCategoria && coincideBusqueda;
        });
    }, [
        ejercicios,
        busquedaEjerciciosModal,
        categoriaEjerciciosModal
    ]);

    const ejerciciosDeRutina = useMemo(() => {
        return todosLosEjerciciosDeRutina
            .filter(
                (ejercicio) =>
                    ejercicio.dia === diaActivo
            )
            .sort(
                (a, b) =>
                    Number(a.orden || 0) -
                    Number(b.orden || 0)
            );
    }, [
        todosLosEjerciciosDeRutina,
        diaActivo
    ]);

    function cantidadEjerciciosDia(dia) {
        return todosLosEjerciciosDeRutina.filter(
            (ejercicio) =>
                ejercicio.dia === dia
        ).length;
    }

    function obtenerSiguienteOrden(dia) {
        const ejerciciosDia =
            todosLosEjerciciosDeRutina.filter(
                (ejercicio) =>
                    ejercicio.dia === dia
            );

        if (ejerciciosDia.length === 0) {
            return 1;
        }

        const ordenes = ejerciciosDia
            .map(
                (ejercicio) =>
                    Number(ejercicio.orden || 0)
            )
            .filter(
                (orden) =>
                    orden > 0
            );

        if (ordenes.length === 0) {
            return 1;
        }

        return Math.max(...ordenes) + 1;
    }

    function abrirAgregarEjercicios() {
        setEjerciciosSeleccionados({});
        setBusquedaEjerciciosModal("");
        setCategoriaEjerciciosModal("todos");
        setMostrarModalEjercicios(true);
    }

    function cerrarModalEjercicios() {
        if (guardando) {
            return;
        }

        setMostrarModalEjercicios(false);
        setEjerciciosSeleccionados({});
    }

    function ejercicioYaExisteEnDia(ejercicioId) {
        return ejerciciosDeRutina.some(
            (ejercicio) =>
                ejercicio.ejercicio_id === ejercicioId
        );
    }

    function toggleEjercicio(ejercicio) {
        const ejercicioId =
            obtenerIdEjercicio(ejercicio);

        if (!ejercicioId) {
            return;
        }

        if (ejercicioYaExisteEnDia(ejercicioId)) {
            Swal.fire({
                icon: "info",
                title: "Ejercicio ya agregado",
                text:
                    "Este ejercicio ya forma parte del día seleccionado.",
                timer: 1800,
                showConfirmButton: false
            });

            return;
        }

        setEjerciciosSeleccionados((actual) => {
            const nuevo = { ...actual };

            if (nuevo[ejercicioId]) {
                delete nuevo[ejercicioId];
            } else {
                nuevo[ejercicioId] = {
                    ejercicio_id: ejercicioId,
                    series: 3,
                    repeticiones: 10,
                    comentarios: ""
                };
            }

            return nuevo;
        });
    }

    function cambiarDatosEjercicioSeleccionado(
        ejercicioId,
        campo,
        valor
    ) {
        setEjerciciosSeleccionados((actual) => ({
            ...actual,
            [ejercicioId]: {
                ...actual[ejercicioId],
                [campo]:
                    campo === "series" ||
                        campo === "repeticiones"
                        ? Number(valor)
                        : valor
            }
        }));
    }

    async function guardarEjerciciosLote(event) {
        event.preventDefault();

        try {
            setGuardando(true);

            const idRutina =
                obtenerIdRutina(
                    rutinaSeleccionada
                );

            if (!idRutina) {
                throw new Error(
                    "No se encontró la rutina."
                );
            }

            const seleccionados =
                Object.values(
                    ejerciciosSeleccionados
                );

            if (seleccionados.length === 0) {
                throw new Error(
                    "Selecciona al menos un ejercicio."
                );
            }

            let siguienteOrden =
                obtenerSiguienteOrden(diaActivo);

            const lote = seleccionados.map(
                (ejercicio) => {
                    const datos = {
                        ejercicio_id:
                            ejercicio.ejercicio_id,

                        dia: diaActivo,

                        series:
                            Number(
                                ejercicio.series
                            ),

                        repeticiones:
                            Number(
                                ejercicio.repeticiones
                            ),

                        orden: siguienteOrden,

                        comentarios:
                            ejercicio.comentarios
                                ?.trim() || null
                    };

                    siguienteOrden++;

                    return datos;
                }
            );

            const resultado =
                await agregarEjerciciosLoteRutina(
                    idRutina,
                    lote
                );

            if (
                resultado &&
                !Array.isArray(resultado) &&
                resultado.tipo
            ) {
                let mensaje =
                    "No se pudieron agregar los ejercicios.";

                if (
                    resultado.tipo ===
                    "ORDEN_DUPLICADO"
                ) {
                    mensaje =
                        `Ya existe un ejercicio con el orden ${resultado.orden} en ${resultado.dia}.`;
                } else if (
                    resultado.tipo ===
                    "EJERCICIO_NO_DISPONIBLE"
                ) {
                    mensaje =
                        "Uno de los ejercicios seleccionados no está disponible.";
                } else if (
                    resultado.tipo ===
                    "RUTINA_NO_DISPONIBLE"
                ) {
                    mensaje =
                        "La rutina no está disponible.";
                }

                throw new Error(mensaje);
            }

            setMostrarModalEjercicios(false);
            setEjerciciosSeleccionados({});

            await Swal.fire({
                icon: "success",
                title: "Ejercicios agregados",
                text:
                    `${lote.length} ejercicio${lote.length === 1 ? "" : "s"} agregado${lote.length === 1 ? "" : "s"} a ${diaActivo}.`,
                timer: 1800,
                showConfirmButton: false
            });

            await abrirRutina(idRutina);
        } catch (error) {
            console.error(error);

            Swal.fire({
                icon: "error",
                title: "No se pudieron agregar",
                text:
                    error.response?.data?.mensaje ||
                    error.message ||
                    "No se pudieron guardar los ejercicios.",
                confirmButtonText: "Aceptar"
            });
        } finally {
            setGuardando(false);
        }
    }

    function abrirEditarEjercicio(ejercicio) {
        setEjercicioSeleccionado(ejercicio);

        setFormularioEditarEjercicio({
            ejercicio_id:
                ejercicio.ejercicio_id || "",

            dia:
                ejercicio.dia || diaActivo,

            series:
                Number(
                    ejercicio.series || 3
                ),

            repeticiones:
                Number(
                    ejercicio.repeticiones || 10
                ),

            orden:
                Number(
                    ejercicio.orden || 1
                ),

            comentarios:
                ejercicio.comentarios || ""
        });

        setMostrarModalEditarEjercicio(true);
    }

    function cerrarModalEditarEjercicio() {
        if (guardando) {
            return;
        }

        setMostrarModalEditarEjercicio(false);
        setEjercicioSeleccionado(null);
    }

    function cambiarFormularioEditarEjercicio(event) {
        const { name, value } = event.target;

        setFormularioEditarEjercicio(
            (actual) => ({
                ...actual,
                [name]:
                    name === "series" ||
                        name === "repeticiones" ||
                        name === "orden"
                        ? Number(value)
                        : value
            })
        );
    }

    async function guardarEdicionEjercicio(event) {
        event.preventDefault();

        try {
            setGuardando(true);

            const idRutina =
                obtenerIdRutina(
                    rutinaSeleccionada
                );

            const idEjercicioRutina =
                obtenerIdEjercicioRutina(
                    ejercicioSeleccionado
                );

            if (!idRutina) {
                throw new Error(
                    "No se encontró la rutina."
                );
            }

            if (!idEjercicioRutina) {
                throw new Error(
                    "No se encontró el ejercicio dentro de la rutina."
                );
            }

            const datos = {
                ejercicio_id:
                    formularioEditarEjercicio.ejercicio_id,

                dia:
                    formularioEditarEjercicio.dia,

                series:
                    Number(
                        formularioEditarEjercicio.series
                    ),

                repeticiones:
                    Number(
                        formularioEditarEjercicio.repeticiones
                    ),

                orden:
                    Number(
                        formularioEditarEjercicio.orden
                    ),

                comentarios:
                    formularioEditarEjercicio.comentarios
                        ?.trim() || null
            };

            await actualizarEjercicioRutina(
                idRutina,
                idEjercicioRutina,
                datos
            );

            setMostrarModalEditarEjercicio(false);
            setEjercicioSeleccionado(null);

            await Swal.fire({
                icon: "success",
                title: "Ejercicio actualizado",
                timer: 1500,
                showConfirmButton: false
            });

            await abrirRutina(idRutina);
        } catch (error) {
            console.error(error);

            Swal.fire({
                icon: "error",
                title: "No se pudo actualizar",
                text:
                    error.response?.data?.mensaje ||
                    error.message ||
                    "No se pudo actualizar el ejercicio.",
                confirmButtonText: "Aceptar"
            });
        } finally {
            setGuardando(false);
        }
    }

    async function eliminarEjercicioRutinaHandler(
        ejercicio
    ) {
        const resultado =
            await Swal.fire({
                icon: "warning",
                title: "¿Quitar ejercicio?",
                html: `
                    ¿Quieres quitar
                    <strong>${ejercicio.nombre}</strong>
                    de esta rutina?
                    <br><br>
                    El ejercicio seguirá disponible
                    en tu catálogo.
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
            const idRutina =
                obtenerIdRutina(
                    rutinaSeleccionada
                );

            const idEjercicioRutina =
                obtenerIdEjercicioRutina(
                    ejercicio
                );

            if (!idRutina) {
                throw new Error(
                    "No se encontró la rutina."
                );
            }

            if (!idEjercicioRutina) {
                throw new Error(
                    "No se encontró el ejercicio dentro de la rutina."
                );
            }

            await eliminarEjercicioRutina(
                idRutina,
                idEjercicioRutina
            );

            await Swal.fire({
                icon: "success",
                title: "Ejercicio quitado",
                timer: 1200,
                showConfirmButton: false
            });

            await abrirRutina(idRutina);
        } catch (error) {
            console.error(error);

            Swal.fire({
                icon: "error",
                title: "No se pudo quitar",
                text:
                    error.response?.data?.mensaje ||
                    error.message ||
                    "No se pudo eliminar el ejercicio.",
                confirmButtonText: "Aceptar"
            });
        }
    }

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

    return {
        rutinas,
        clientes,
        ejercicios,

        cargando,
        cargandoDetalle,

        rutinaSeleccionada,
        rutinaEditandoId,

        mostrarModalRutina,
        mostrarModalEjercicios,
        mostrarModalEditarEjercicio,

        modoEdicionRutina,

        ejercicioSeleccionado,
        guardando,

        diaActivo,
        error,
        dias,

        formularioRutina,
        ejerciciosSeleccionados,

        busquedaEjerciciosModal,
        categoriaEjerciciosModal,

        formularioEditarEjercicio,

        todosLosEjerciciosDeRutina,
        categoriasEjerciciosModal,
        ejerciciosFiltradosModal,
        ejerciciosDeRutina,

        setError,
        setDiaActivo,
        setBusquedaEjerciciosModal,
        setCategoriaEjerciciosModal,

        cerrarRutina,
        abrirRutina,

        abrirNuevaRutina,
        abrirEditarRutina,
        cerrarModalRutina,
        cambiarFormularioRutina,
        guardarRutina,
        eliminarRutinaHandler,

        abrirAgregarEjercicios,
        cerrarModalEjercicios,
        ejercicioYaExisteEnDia,
        toggleEjercicio,
        cambiarDatosEjercicioSeleccionado,
        guardarEjerciciosLote,

        abrirEditarEjercicio,
        cerrarModalEditarEjercicio,
        cambiarFormularioEditarEjercicio,
        guardarEdicionEjercicio,
        eliminarEjercicioRutinaHandler,

        cantidadEjerciciosDia,

        // formatearFecha,
        nombreCliente,

        obtenerIdRutina,
        obtenerIdEjercicioRutina,
        obtenerIdEjercicio,

        busqueda,
        setBusqueda,
        rutinasFiltradas,
    };
}