import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";

import {
    obtenerEjercicios,
    crearEjercicio,
    actualizarEjercicio,
    eliminarEjercicio as eliminarEjercicioService
} from "../../services/ejercicioService";

export function useEjercicios() {
    const [ejercicios, setEjercicios] = useState([]);

    const [cargando, setCargando] = useState(true);

    const [busqueda, setBusqueda] = useState("");

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

    async function cargarEjercicios() {
        try {
            setCargando(true);

            const data = await obtenerEjercicios();

            setEjercicios(data);
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

    const categorias = useMemo(() => {
        const categoriasUnicas = [
            ...new Set(
                ejercicios
                    .map(
                        (ejercicio) =>
                            ejercicio.categoria
                    )
                    .filter(Boolean)
            )
        ];

        return categoriasUnicas.sort((a, b) =>
            a.localeCompare(b)
        );
    }, [ejercicios]);

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

    function cambiarCategoria(categoria) {
        setCategoriaActiva(
            categoria === "todas"
                ? "todos"
                : categoria
        );
    }

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
            descripcion:
                ejercicio.descripcion || ""
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

    function esPropio(ejercicio) {
        return ejercicio.created_by !== null;
    }

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
                    formulario.descripcion.trim() ||
                    null
            };

            if (modoEdicion) {
                await actualizarEjercicio(
                    ejercicioSeleccionado.id_ejercicio,
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
                await crearEjercicio(datos);

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
            await eliminarEjercicioService(
                ejercicio.id_ejercicio
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

    return {
        ejercicios,
        cargando,

        busqueda,
        setBusqueda,

        categoriaActiva,
        setCategoriaActiva,

        otraCategoria,
        setOtraCategoria,

        mostrarModal,

        modoEdicion,

        ejercicioSeleccionado,

        guardando,

        formulario,

        categorias,
        ejerciciosFiltrados,

        cambiarCategoria,

        abrirNuevoEjercicio,
        abrirEditarEjercicio,
        cerrarModal,

        cambiarFormulario,

        guardarEjercicio,
        eliminarEjercicio,

        esPropio,

        setFormulario
    };
}