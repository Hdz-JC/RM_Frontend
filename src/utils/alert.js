import Swal from "sweetalert2";

export function alertaExito(mensaje) {
    return Swal.fire({
        icon: "success",
        title: "¡Listo!",
        text: mensaje,
        confirmButtonText: "Aceptar"
    });
}

export function alertaError(mensaje) {
    return Swal.fire({
        icon: "error",
        title: "Ocurrió un error",
        text: mensaje,
        confirmButtonText: "Aceptar"
    });
}

export async function confirmarEliminacion(nombre = "este elemento") {
    const resultado = await Swal.fire({
        icon: "warning",
        title: "¿Eliminar?",
        text: `¿Seguro que deseas eliminar ${nombre}?`,
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
        reverseButtons: true
    });

    return resultado.isConfirmed;
}