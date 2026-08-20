import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const logo = "/logoRM.png"

function cargarImagen(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();

        img.onload = () => resolve(img);
        img.onerror = reject;

        img.src = src;
    });
}

function nombreCompleto(persona) {
    if (!persona) return "Sin especificar";

    return [
        persona.nombre,
        persona.paterno,
        persona.materno
    ]
        .filter(Boolean)
        .join(" ");
}

function formatearFechaPDF(fecha) {
    if (!fecha) return "Sin fecha";

    const [anio, mes, dia] = fecha
        .split("T")[0]
        .split("-");

    const meses = [
        "enero",
        "febrero",
        "marzo",
        "abril",
        "mayo",
        "junio",
        "julio",
        "agosto",
        "septiembre",
        "octubre",
        "noviembre",
        "diciembre"
    ];

    return `${parseInt(dia)} de ${meses[parseInt(mes) - 1]} de ${anio}`;
}

export async function generarRutinaPDF(rutina) {
    const doc = new jsPDF();

    const cliente =
        rutina.cliente ||
        rutina.clientes;

    const entrenador =
        rutina.entrenador;

    const ordenDias = [
        "Lunes",
        "Martes",
        "Miércoles",
        "Miercoles",
        "Jueves",
        "Viernes",
        "Sábado",
        "Sabado",
        "Domingo"
    ];

    const dias = [...(rutina.dias || [])].sort(
        (a, b) =>
            ordenDias.indexOf(a.dia) -
            ordenDias.indexOf(b.dia)
    );

    const margen = 15;

    // =========================
    // ENCABEZADO
    // =========================

    const logo = await cargarImagen(
        "/logoRM.png"
    );

    doc.addImage(
        logo,
        "PNG",
        margen,
        10,
        50,
        20
    );

    doc.setFontSize(12);
    doc.text(
        rutina.nombre || "Rutina",
        margen,
        40
    );

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    doc.text(
        `Fecha: ${formatearFechaPDF(rutina.fecha)}`,
        margen,
        50
    );

    // =========================
    // INFORMACIÓN
    // =========================

    autoTable(doc, {
        startY: 55,
        margin: {
            left: margen,
            right: margen
        },
        theme: "plain",
        styles: {
            fontSize: 10,
            cellPadding: 1.5
        },
        columnStyles: {
            0: {
                fontStyle: "bold",
                cellWidth: 50
            }
        },
        body: [
            [
                "Rutina de ejercicios para:",
                nombreCompleto(cliente)
            ],
            [
                "Entrenador:",
                nombreCompleto(entrenador)
            ]
        ]
    });

    let posicionY =
        doc.lastAutoTable.finalY + 8;


    // =========================
    // DÍAS Y EJERCICIOS
    // =========================

    dias.forEach((dia) => {
        if (posicionY > 250) {
            doc.addPage();
            posicionY = 20;
        }

        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");

        doc.text(
            dia.dia,
            margen,
            posicionY
        );

        posicionY += 5;

        const ejercicios =
            dia.ejercicios || [];

        if (ejercicios.length === 0) {
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");

            doc.text(
                "Sin ejercicios programados.",
                margen,
                posicionY + 5
            );

            posicionY += 15;

            return;
        }

        autoTable(doc, {
            startY: posicionY + 3,
            margin: {
                left: margen,
                right: margen
            },
            head: [
                [
                    "#",
                    "Ejercicio",
                    "Categoría",
                    "Series",
                    "Reps",
                    "Comentarios"
                ]
            ],
            body: ejercicios.map(
                (ejercicio) => [
                    ejercicio.orden ?? "",
                    ejercicio.nombre ?? "",
                    ejercicio.categoria ||
                    "Sin categoría",
                    ejercicio.series ?? "",
                    ejercicio.repeticiones ?? "",
                    ejercicio.comentarios ||
                    "—"
                ]
            ),
            styles: {
                fontSize: 8,
                cellPadding: 3,
                valign: "middle"
            },
            headStyles: {
                fillColor: [0, 0, 0],
                textColor: [255, 255, 255],
                fontStyle: "bold"
            },
            columnStyles: {
                0: {
                    cellWidth: 10,
                    halign: "center"
                },
                1: {
                    cellWidth: 45
                },
                2: {
                    cellWidth: 28
                },
                3: {
                    cellWidth: 15,
                    halign: "center"
                },
                4: {
                    cellWidth: 15,
                    halign: "center"
                },
                5: {
                    cellWidth: "auto"
                }
            },
            didDrawPage: () => {
                agregarPiePagina(doc);
            }
        });

        posicionY =
            doc.lastAutoTable.finalY + 10;
    });

    // =========================
    // PIE DE PÁGINA
    // =========================

    const paginas =
        doc.internal.getNumberOfPages();

    for (let i = 1; i <= paginas; i++) {
        doc.setPage(i);
        agregarPiePagina(doc);
    }

    // =========================
    // DESCARGAR
    // =========================

    const nombreArchivo = [
        "Rutina",
        nombreCompleto(cliente)
    ]
        .filter(Boolean)
        .join("_")
        .replace(/\s+/g, "_");

    doc.save(`${nombreArchivo}.pdf`);
}

function agregarPiePagina(doc) {
    const pagina =
        doc.internal.getCurrentPageInfo()
            .pageNumber;

    const total =
        doc.internal.getNumberOfPages();

    const alto =
        doc.internal.pageSize.height;

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");

    doc.text(
        `Página ${pagina} de ${total}`,
        195,
        alto - 10,
        {
            align: "right"
        }
    );
}