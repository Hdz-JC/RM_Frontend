import api from "./api";


// Obtener todos los clientes
export async function obtenerClientes() {

    const response =
        await api.get("/clientes");

    return response.data;
}


// Obtener un cliente por ID
export async function obtenerCliente(id) {

    const response =
        await api.get(`/clientes/${id}`);

    return response.data;
}