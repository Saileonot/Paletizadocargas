document.addEventListener("DOMContentLoaded", () => {
    const truck = document.querySelector(".truck");
    const boxesContainer = document.querySelector(".boxes");
    const validateButton = document.getElementById("validate");
    const exportPDFButton = document.getElementById("exportPDF");
    const saveButton = document.getElementById("save");
    const loadButton = document.getElementById("load");
    const dimensionsLabel = document.getElementById("dimensions");
    const areaInfoLabel = document.getElementById("areaInfo");
    const contenedorSelect = document.getElementById("contenedor");
    const resultadoDiv = document.getElementById("resultado");

    // Dimensiones del contenedor (inicialmente Camión Lona)
    let truckWidth = 1230; // 12.30m
    let truckHeight = 235; // 2.35m
    let truckArea = (truckWidth / 100) * (truckHeight / 100); // Área total en m²

    // Lista de bultos
    let boxes = [];
    let currentBox = null;
    let nombreEncabezamiento = ""; // Variable para almacenar el nombre ingresado en VALIDAR

    // Función para actualizar las dimensiones visuales del contenedor
    function updateTruckDimensions() {
        const dimensionHorizontalText = document.getElementById("dimension-horizontal-text");
        const dimensionVerticalText = document.getElementById("dimension-vertical-text");

        // Actualizar el texto de las dimensiones
        dimensionHorizontalText.textContent = `${(truckWidth / 100).toFixed(2)}m`; // Ancho en metros
        dimensionVerticalText.textContent = `${(truckHeight / 100).toFixed(2)}m`; // Alto en metros
    }

    // Actualizar dimensiones del contenedor al cambiar la selección
    contenedorSelect.addEventListener("change", () => {
        const contenedor = contenedorSelect.value;
        if (contenedor === "Camion Lona") {
            truckWidth = 1230; // 12.30m
            truckHeight = 235; // 2.35m
        } else if (contenedor === "Container 20pies") {
            truckWidth = 606; // 6.06m
            truckHeight = 244; // 2.44m
        } else if (contenedor === "Container 40pies") {
            truckWidth = 1219; // 12.19m
            truckHeight = 244; // 2.44m
        } else if (contenedor === "Camion Plataforma Pequeño") {
            truckWidth = 500; // 5.00m
            truckHeight = 220; // 2.20m
        } else if (contenedor === "Camion Plataforma Mediano") {
            truckWidth = 700; // 7.00m
            truckHeight = 250; // 2.50m
        } else if (contenedor === "Camion Plataforma Grande") {
            truckWidth = 1000; // 10.00m
            truckHeight = 280; // 2.80m
        }

        // Actualizar las dimensiones visuales del contenedor
        truck.style.width = `${truckWidth}px`;
        truck.style.height = `${truckHeight}px`;
        updateTruckDimensions(); // Llamar a la función para actualizar las dimensiones visuales

        // Actualizar el área disponible
        truckArea = (truckWidth / 100) * (truckHeight / 100);
        updateAreaInfo();
    });

    // Función para crear un nuevo bulto
    function createBox(name, width, height, color, cantidad = 1) {
        const box = document.createElement("div");
        box.className = "box";
        box.style.width = `${width * 100}px`; // Convertir metros a píxeles
        box.style.height = `${height * 100}px`;
        box.style.backgroundColor = color;

        // Mostrar nombre y dimensiones centradas
        box.innerHTML = `
            <span>${name}</span>
            <span>${width.toFixed(2)}m x ${height.toFixed(2)}m</span>
        `;

        // Aplicar contraste de color para fondos oscuros
        const isDarkColor = color === "black" || color === "brown" || color === "blue";
        if (isDarkColor) {
            box.classList.add("dark");
        }

        // Posicionar el bulto centrado verticalmente y alineado a la derecha
        const boxWidth = width * 100; // Ancho del bulto en píxeles
        const boxHeight = height * 100; // Alto del bulto en píxeles
        box.style.left = `${truckWidth - boxWidth}px`; // Alineado a la derecha
        box.style.top = `0px`; // Alineado a la parte de arriba

        // Seleccionar el bulto automáticamente al crearlo
        if (currentBox) currentBox.classList.remove("selected");
        currentBox = box;
        currentBox.classList.add("selected");
        updateDimensionsLabel(box);

        // Seleccionar el bulto al hacer clic
        box.addEventListener("click", (e) => {
            e.stopPropagation(); // Evitar que el evento se propague al contenedor
            if (currentBox) currentBox.classList.remove("selected");
            currentBox = box;
            currentBox.classList.add("selected");
            updateDimensionsLabel(box);
        });

        // Rotar 90º al hacer doble clic
        box.addEventListener("dblclick", () => {
            const temp = box.style.width;
            box.style.width = box.style.height;
            box.style.height = temp;
            updateDimensionsLabel(box);
        });

        // Agregar el bulto al camión
        boxesContainer.appendChild(box);
        boxes.push({ element: box, name, cantidad, width, height, color, left: box.style.left, top: box.style.top });
        updateAreaInfo();
    }

    // Función para actualizar la etiqueta de dimensiones
    function updateDimensionsLabel(box) {
        const width = parseFloat(box.style.width) / 100;
        const height = parseFloat(box.style.height) / 100;
        dimensionsLabel.textContent = `Dimensiones del bulto seleccionado: ${width.toFixed(2)}m x ${height.toFixed(2)}m`;
    }

    // Función para calcular el área ocupada y disponible
    function updateAreaInfo() {
        let occupiedArea = 0;
        boxes.forEach((box) => {
            const width = parseFloat(box.element.style.width) / 100;
            const height = parseFloat(box.element.style.height) / 100;
            occupiedArea += width * height;
        });
        const availableArea = truckArea - occupiedArea;
        areaInfoLabel.textContent = `Área ocupada: ${occupiedArea.toFixed(2)}m² | Área disponible: ${availableArea.toFixed(2)}m²`;
    }

    // Botones para crear bultos
    document.getElementById("addPanel").addEventListener("click", () => {
        createBox("Paneles", 2, 1, "green", 1); // 1 bulto, verde claro
    });

    document.getElementById("addPanel2").addEventListener("click", () => {
        createBox("Paneles x 2", 2, 1, "#006400", 2); // 2 bultos, verde medio
    });

    document.getElementById("addPanel3").addEventListener("click", () => {
        createBox("Paneles x 3", 2, 1, "#004d00", 3); // 3 bultos, verde oscuro
    });

    document.getElementById("addValla").addEventListener("click", () => {
        createBox("Vallas", 2, 1.25, "blue");
    });

    document.getElementById("addPieValla").addEventListener("click", () => {
        createBox("Pies de Valla", 1.1, 1.1, "orange");
    });

    document.getElementById("addPatines").addEventListener("click", () => {
        createBox("Patines", 1, 1, "purple");
    });

    document.getElementById("addAccesorios").addEventListener("click", () => {
        createBox("Accesorios", 1.2, 0.8, "yellow");
    });

    document.getElementById("addPatineros").addEventListener("click", () => {
        createBox("Patineros", 1.6, 0.9, "brown");
    });

    document.getElementById("addCauchos").addEventListener("click", () => {
        createBox("Cauchos", 1.2, 1.3, "black");
    });

    // Nuevo botón para crear bulto personalizado
    document.getElementById("addCustomBox").addEventListener("click", () => {
        // Solicitar nombre del bulto
        const nombre = prompt("Ingrese el nombre del bulto:");
        if (!nombre) return; // Si el usuario cancela, no hacer nada

        // Solicitar ancho del bulto (mínimo 10 cm)
        let ancho = parseFloat(prompt("Ingrese el ancho del bulto (en metros, mínimo 0.10 m):"));
        if (isNaN(ancho)) {
            alert("El ancho debe ser un número.");
            return;
        }
        if (ancho < 0.10) {
            alert("El ancho mínimo es 0.10 m (10 cm).");
            return;
        }

        // Solicitar largo del bulto (máximo 6 m)
        let largo = parseFloat(prompt("Ingrese el largo del bulto (en metros, máximo 6 m):"));
        if (isNaN(largo)) {
            alert("El largo debe ser un número.");
            return;
        }
        if (largo > 6) {
            alert("El largo máximo es 6 m.");
            return;
        }

        // Color por defecto para bultos personalizados
        const color = "gray"; // Puedes cambiarlo si lo prefieres

        // Crear el bulto personalizado
        createBox(nombre, ancho, largo, color);
    });

    // Validar y mostrar listado de bultos
    validateButton.addEventListener("click", () => {
        // Solicitar el nombre para el encabezamiento
        nombreEncabezamiento = prompt("Ingrese un nombre para el encabezamiento del listado:");
        if (!nombreEncabezamiento) return; // Si el usuario cancela, no hacer nada

        let isValid = true;
        let message = `Listado de bultos para: ${nombreEncabezamiento}\n`;

        // Verificar si los bultos están dentro del camión y no se solapan
        boxes.forEach((box, index) => {
            const rect = box.element.getBoundingClientRect();
            const truckRect = truck.getBoundingClientRect();

            // Verificar límites del camión
            if (
                rect.left < truckRect.left ||
                rect.right > truckRect.right ||
                rect.top < truckRect.top ||
                rect.bottom > truckRect.bottom
            ) {
                isValid = false;
                message = `ERROR: El bulto "${box.element.querySelector("span").textContent}" está fuera del camión.`;
                return;
            }

            // Verificar solapamiento con otros bultos
            boxes.forEach((otherBox, otherIndex) => {
                if (index !== otherIndex) {
                    const otherRect = otherBox.element.getBoundingClientRect();

                    if (
                        rect.left < otherRect.right &&
                        rect.right > otherRect.left &&
                        rect.top < otherRect.bottom &&
                        rect.bottom > otherRect.top
                    ) {
                        isValid = false;
                        message = `ERROR: El bulto "${box.element.querySelector("span").textContent}" se está solapando con "${otherBox.element.querySelector("span").textContent}".`;
                        return;
                    }
                }
            });
        });

        if (isValid) {
            const tiposBultos = {};
            let totalBultos = 0;

            // Contar los bultos por tipo
            boxes.forEach((box) => {
                const tipo = box.name; // Usar el nombre del bulto para agrupar

                // Sumar las cantidades correspondientes para "Paneles", "Paneles x 2" y "Paneles x 3"
                if (tipo.startsWith("Paneles")) {
                    if (tipo === "Paneles x 2") {
                        tiposBultos["Paneles"] = (tiposBultos["Paneles"] || 0) + 2;
                    } else if (tipo === "Paneles x 3") {
                        tiposBultos["Paneles"] = (tiposBultos["Paneles"] || 0) + 3;
                    } else {
                        tiposBultos["Paneles"] = (tiposBultos["Paneles"] || 0) + 1;
                    }
                } else {
                    // Para otros tipos de bultos, contar normalmente
                    tiposBultos[tipo] = (tiposBultos[tipo] || 0) + 1;
                }

                totalBultos += 1; // Contar cada bulto individualmente
            });

            let listado = "<ul>";
            // Generar el listado en el formato "X uds TIPO_DE_BULTO"
            Object.keys(tiposBultos).forEach((tipo) => {
                const cantidad = tiposBultos[tipo];
                listado += `<li>${cantidad} uds ${tipo}</li>`;
            });
            listado += `</ul><p><strong>Total: ${totalBultos} bultos</strong></p>`;

            resultadoDiv.innerHTML = message + listado;
        } else {
            resultadoDiv.textContent = message;
        }
    });

    // Función para guardar los datos en un archivo JSON
    saveButton.addEventListener("click", () => {
        if (!nombreEncabezamiento) {
            alert("Debes validar primero para guardar los datos.");
            return;
        }

        const datos = {
            nombre: nombreEncabezamiento,
            contenedor: contenedorSelect.value,
            bultos: boxes.map((box) => ({
                name: box.name,
                width: box.width,
                height: box.height,
                color: box.color,
                cantidad: box.cantidad,
                left: box.element.style.left, // Guardar la posición izquierda
                top: box.element.style.top,   // Guardar la posición superior
            })),
        };

        // Crear un Blob con los datos en formato JSON
        const blob = new Blob([JSON.stringify(datos, null, 2)], { type: "application/json" });

        // Crear un enlace de descarga
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `contenedor_${nombreEncabezamiento}.json`; // Nombre del archivo
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        alert("Archivo guardado correctamente.");
    });

    // Función para cargar los datos desde un archivo JSON
    loadButton.addEventListener("click", () => {
        // Simular clic en el input de tipo file
        document.getElementById("fileInput").click();
    });

    // Manejar la selección de archivos
    document.getElementById("fileInput").addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const datos = JSON.parse(e.target.result);

                // Restaurar el nombre
                nombreEncabezamiento = datos.nombre;

                // Restaurar el contenedor
                contenedorSelect.value = datos.contenedor;
                contenedorSelect.dispatchEvent(new Event("change"));

                // Limpiar los bultos actuales
                boxesContainer.innerHTML = "";
                boxes = [];

                // Restaurar los bultos
                datos.bultos.forEach((bulto) => {
                    createBox(bulto.name, bulto.width, bulto.height, bulto.color, bulto.cantidad);
                    const box = boxes[boxes.length - 1].element;
                    box.style.left = bulto.left; // Restaurar la posición izquierda
                    box.style.top = bulto.top;   // Restaurar la posición superior
                });

                alert("Archivo cargado correctamente.");
            } catch (error) {
                alert("Error al cargar el archivo. Asegúrate de que sea un archivo JSON válido.");
            }
        };
        reader.readAsText(file);
    });

    // Exportar a PDF (captura de pantalla del contenedor y el listado)
    exportPDFButton.addEventListener("click", () => {
        // Capturar el contenedor y el listado
        const elementsToCapture = [truck, resultadoDiv];

        html2canvas(truck).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF({
                orientation: "landscape",
                unit: "mm",
                format: "a4"
            });

            // Añadir la imagen del contenedor al PDF
            doc.addImage(imgData, "PNG", 10, 10, 280, 0);

            // Capturar el listado y añadirlo al PDF
            html2canvas(resultadoDiv).then((canvasListado) => {
                const imgDataListado = canvasListado.toDataURL("image/png");
                doc.addPage();
                doc.addImage(imgDataListado, "PNG", 10, 10, 180, 0);

                // Guardar el PDF
                doc.save("disposicion_bultos.pdf");
            });
        });
    });

    // Eliminar bulto con la tecla "X"
    document.addEventListener("keydown", (e) => {
        if (e.key === "x" && currentBox) {
            currentBox.remove();
            boxes = boxes.filter((box) => box.element !== currentBox);
            currentBox = null;
            dimensionsLabel.textContent = "Dimensiones del bulto seleccionado: -";
            updateAreaInfo();
        }
    });

    // Movimiento de bultos con las flechas del teclado
    document.addEventListener("keydown", (e) => {
        if (currentBox) {
            const step = e.repeat ? 20 : 5; // 20 cm si la tecla está mantenida, 5 cm si es una pulsación
            let newX = parseFloat(currentBox.style.left) || 0;
            let newY = parseFloat(currentBox.style.top) || 0;

            switch (e.key) {
                case "ArrowUp":
                    newY -= step;
                    break;
                case "ArrowDown":
                    newY += step;
                    break;
                case "ArrowLeft":
                    newX -= step;
                    break;
                case "ArrowRight":
                    newX += step;
                    break;
            }

            // Verificar límites del camión
            if (
                newX >= 0 &&
                newX + currentBox.offsetWidth <= truckWidth &&
                newY >= 0 &&
                newY + currentBox.offsetHeight <= truckHeight
            ) {
                currentBox.style.left = `${newX}px`;
                currentBox.style.top = `${newY}px`;
            }
        }
    });


    // Función para reiniciar el contenedor
    document.getElementById("reset").addEventListener("click", () => {
        // Reiniciar el contenedor a "Camión Lona"
        contenedorSelect.value = "Camion Lona";
        contenedorSelect.dispatchEvent(new Event("change"));

        // Limpiar todos los bultos
        boxesContainer.innerHTML = "";
        boxes = [];
        currentBox = null;

        // Reiniciar el nombre de validación
        nombreEncabezamiento = "";

        // Reiniciar las etiquetas de dimensiones y área
        dimensionsLabel.textContent = "Dimensiones del bulto seleccionado: -";
        areaInfoLabel.textContent = `Área ocupada: 0.00m² | Área disponible: ${truckArea.toFixed(2)}m²`;

        // Reiniciar el resultado de la validación
        resultadoDiv.innerHTML = "";

        alert("Contenedor reiniciado correctamente.");
    });

    // Actualizar el área al cargar la página
    updateAreaInfo();
});