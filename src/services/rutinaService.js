import api from "./api";


// =========================================================
// RUTINAS
// =========================================================

export async function obtenerRutinas() {
    const response = await api.get("/rutinas");
    return response.data;
}

export async function obtenerRutina(id) {
    const response = await api.get(`/rutinas/${id}`);
    return response.data;
}

export async function crearRutina(data) {
    const response = await api.post("/rutinas", data);
    return response.data;
}

export async function actualizarRutina(id, data) {
    const response = await api.put(`/rutinas/${id}`, data);
    return response.data;
}

export async function eliminarRutina(id) {
    const response = await api.delete(`/rutinas/${id}`);
    return response.data;
}


// =========================================================
// EJERCICIOS DE RUTINA
// =========================================================

export async function agregarEjercicioRutina(
    rutinaId,
    data
) {
    const response = await api.post(
        `/rutinas/${rutinaId}/ejercicios`,
        data
    );

    return response.data;
}


// =========================================================
// AGREGAR EJERCICIOS POR LOTE
// =========================================================

export async function agregarEjerciciosLoteRutina(
    rutinaId,
    ejercicios
) {
    const response = await api.post(
        `/rutinas/${rutinaId}/ejercicios/lote`,
        {
            ejercicios
        }
    );

    return response.data;
}


// =========================================================
// ACTUALIZAR EJERCICIO
// =========================================================

export async function actualizarEjercicioRutina(
    rutinaId,
    rutinaEjercicioId,
    data
) {
    const response = await api.put(
        `/rutinas/${rutinaId}/ejercicios/${rutinaEjercicioId}`,
        data
    );

    return response.data;
}


// =========================================================
// ELIMINAR EJERCICIO
// =========================================================

export async function eliminarEjercicioRutina(
    rutinaId,
    rutinaEjercicioId
) {
    const response = await api.delete(
        `/rutinas/${rutinaId}/ejercicios/${rutinaEjercicioId}`
    );

    return response.data;
}