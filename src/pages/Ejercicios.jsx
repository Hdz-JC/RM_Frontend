import { useEjercicios } from "./Ejercicios/useEjercicios";

import EjercicioList from "./Ejercicios/EjercicioList";
import EjercicioModal from "./Ejercicios/modals/EjercicioModal";

export default function Ejercicios() {
    const ejercicios = useEjercicios();

    return (
        <>
            <EjercicioList {...ejercicios} />

            <EjercicioModal {...ejercicios} />
        </>
    );
}