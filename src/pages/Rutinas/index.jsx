import { useRutinas } from "./useRutinas";

import RutinaList from "./RutinaList";
import RutinaDetalle from "./RutinaDetalle";

import AgregarEjerciciosModal from "./modals/AgregarEjerciciosModal";
import EditarEjercicioRutinaModal from "./modals/EditarEjercicioRutinaModal";
import RutinaModal from "./modals/RutinaModal";

export default function Rutinas() {
    const rutinas = useRutinas();

    if (rutinas.rutinaSeleccionada) {
        return (
            <>
                <RutinaDetalle {...rutinas} />

                <AgregarEjerciciosModal {...rutinas} />

                <EditarEjercicioRutinaModal {...rutinas} />

                <RutinaModal {...rutinas} />
            </>
        );
    }

    return (
        <>
            <RutinaList {...rutinas} />

            <RutinaModal {...rutinas} />
        </>
    );
}