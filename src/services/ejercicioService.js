import api from "./api";


// Obtener todos los ejercicios
export async function obtenerEjercicios() {

    const response = await api.get("/ejercicios");

    return response.data;
}


// Obtener un ejercicio por ID
export async function obtenerEjercicio(id) {

    const response =
        await api.get(`/ejercicios/${id}`);

    return response.data;
}


// Crear ejercicio
export async function crearEjercicio(datos) {

    const response =
        await api.post("/ejercicios", datos);

    return response.data;
}


// Actualizar ejercicio
export async function actualizarEjercicio(id, datos) {

    const response =
        await api.put(
            `/ejercicios/${id}`,
            datos
        );

    return response.data;
}


// Eliminar ejercicio
export async function eliminarEjercicio(id) {

    const response =
        await api.delete(
            `/ejercicios/${id}`
        );

    return response.data;
}