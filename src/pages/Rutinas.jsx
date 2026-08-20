import { useRutinas } from "./Rutinas/useRutinas";

import RutinaList from "./Rutinas/RutinaList";
import RutinaDetalle from "./Rutinas/RutinaDetalle";

import AgregarEjerciciosModal from "./Rutinas/modals/AgregarEjerciciosModal";
import EditarEjercicioRutinaModal from "./Rutinas/modals/EditarEjercicioRutinaModal";
import RutinaModal from "./Rutinas/modals/RutinaModal";

export default function Rutinas() {
    const rutinas = useRutinas();

    return (
        <>
            {rutinas.rutinaSeleccionada ? (
                <RutinaDetalle {...rutinas} />
            ) : (
                <RutinaList {...rutinas} />
            )}

            <AgregarEjerciciosModal {...rutinas} />

            <EditarEjercicioRutinaModal {...rutinas} />

            <RutinaModal {...rutinas} />
        </>
    );
}