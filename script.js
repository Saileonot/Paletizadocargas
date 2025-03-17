// Función de control de acceso al estar el código accesible en GitHub
(function () {
    const contraseñaCorrecta = "1968"; // Puedes cambiar la contraseña aquí
    let intentos = 3; // Número de intentos permitidos

    while (intentos > 0) {
        let contraseñaIngresada = prompt("Uso exclusivo XTRAICE - 🔒 Introduce la contraseña de 4 dígitos:");

        if (contraseñaIngresada === contraseñaCorrecta) {
            alert("PALETIZADO Y COLOCACIÓN DE CARGAS \n\n ✅ Acceso concedido.\n BIENVENIDO. \n\n Si ves algún error en la ejecución de la aplicación o sus resultados, puedes comunicármelo vía mail: tono@xtraice.com");
            return; // Permite que la aplicación continúe
        } else {
            intentos--;
            alert(`❌ Contraseña incorrecta. Intentos restantes: ${intentos}`);
        }
    }

    // Si se acaban los intentos, redirigir o bloquear acceso
    alert("🚫 Acceso denegado");
    document.body.innerHTML = "<h1>Acceso bloqueado ❌</h1>";
})();

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
    let nombreEncabezamiento = ""; // Variable para almacenar el nombre ingresado en GUARDAR

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
        } else if (contenedor === "Camion Plataforma 7m") {
            truckWidth = 700; // 7.00m
            truckHeight = 248; // 2.48m
        } else if (contenedor === "Camion Plataforma 8m") {
            truckWidth = 800; // 8.00m
            truckHeight = 248; // 2.48m
        } else if (contenedor === "Camion Plataforma 10m") {
            truckWidth = 1000; // 10.00m
            truckHeight = 248; // 2.48m
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
        box.style.left = `${truckWidth - boxWidth-5}px`; // Alineado a la derecha
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
        createBox("Accesorios", 1.2, 0.8, "pink");
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

    // Validar y mostrar listado de bultos (sin solicitar nombre)
    validateButton.addEventListener("click", () => {
        let isValid = true;
        let message = `Listado de bultos:\n`;

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

                // Sumar las cantidades correspondientes para "Paneles x 2" y "Paneles x 3"
                if (tipo === "Paneles x 2") {
                    totalBultos += 2; // Sumar 2 bultos
                    tiposBultos["Paneles"] = (tiposBultos["Paneles"] || 0) + 2;
                } else if (tipo === "Paneles x 3") {
                    totalBultos += 3; // Sumar 3 bultos
                    tiposBultos["Paneles"] = (tiposBultos["Paneles"] || 0) + 3;
                } else {
                    totalBultos += 1; // Sumar 1 bulto
                    tiposBultos[tipo] = (tiposBultos[tipo] || 0) + 1;
                }
            });

            let listado = "<ul>";
            // Generar el listado en el formato "X uds TIPO_DE_BULTO"
            Object.keys(tiposBultos).forEach((tipo) => {
                const cantidad = tiposBultos[tipo];
                listado += `<li>${cantidad} palets de ${tipo}</li>`;
            });
            listado += `</ul><p><strong>Total: ${totalBultos} bultos</strong></p>`;

            resultadoDiv.innerHTML = message + listado;
        } else {
            resultadoDiv.textContent = message;
        }
    });

    // Función para guardar los datos en un archivo JSON (solicitar nombre aquí)
    saveButton.addEventListener("click", () => {
        // Solicitar el nombre para el archivo
        nombreEncabezamiento = prompt("Ingrese un nombre para el archivo:");
        if (!nombreEncabezamiento) return; // Si el usuario cancela, no hacer nada

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

    // Exportar a PDF mejorado
    // Exportar a PDF mejorado (versión corregida)
    exportPDFButton.addEventListener("click", async () => {
        const originalText = exportPDFButton.innerHTML;
        exportPDFButton.innerHTML = '<div class="loader"></div> Generando PDF...';
        
        try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF({
                orientation: "landscape",
                unit: "mm",
                format: "a4"
            });
    
            // Función para convertir cualquier color a RGB
            const colorToRgb = (color) => {
                if (Array.isArray(color)) return color;
                
                const div = document.createElement('div');
                div.style.color = color;
                document.body.appendChild(div);
                const rgb = window.getComputedStyle(div).color;
                document.body.removeChild(div);
                
                const match = rgb.match(/\d+/g);
                return match ? match.map(Number) : [0, 0, 0];
            };
    
            // Cabecera del PDF
            doc.setFontSize(18);
            doc.setFont(undefined, 'bold');
            doc.text("PLANOS DE CARGA - XTRAICE", 10, 10);
            doc.setFontSize(12);
            doc.setFont(undefined, 'normal');
            doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 10, 18);
            doc.text(`Cliente: ${nombreEncabezamiento || 'Sin nombre'}`, 100, 18);
    
            // Capturar imagen del contenedor (posición ajustada 5mm más abajo)
            const truckCanvas = await html2canvas(truck, { 
                scale: 2,
                useCORS: true,
                logging: false
            });
            const truckImg = truckCanvas.toDataURL("image/png");
            const imgWidth = 250;
            const imgHeight = (truckCanvas.height * imgWidth) / truckCanvas.width;
            doc.addImage(truckImg, "PNG", 10, 30, imgWidth, imgHeight); // Posición Y cambiada a 30

                    // Dibujo del contenedor con borde
            doc.setDrawColor(0);
            doc.rect(10, 30, imgWidth, imgHeight);
    
            // Información del contenedor
            let yPos = 30 + imgHeight + 10;
            doc.setFont(undefined, 'bold');
            doc.text("DATOS DEL CONTENEDOR:", 10, yPos);
            doc.setFont(undefined, 'normal');
            doc.text(`Tipo: ${contenedorSelect.value}`, 10, yPos + 6);
            doc.text(`Dimensiones: ${(truckWidth/100).toFixed(2)}m x ${(truckHeight/100).toFixed(2)}m`, 90, yPos + 6);
            doc.text(`Área total: ${truckArea.toFixed(2)}m²`, 180, yPos + 6);
            yPos += 20;
    
            // Agrupar bultos como en la validación
            const groupedBoxes = boxes.reduce((acc, box) => {
                const baseName = box.name.replace(/ x \d+/, '');
                const dimensionKey = `${box.width.toFixed(2)}x${box.height.toFixed(2)}`;
                const key = `${baseName}-${dimensionKey}`;
    
                if (!acc[key]) {
                    acc[key] = {
                        name: baseName,
                        cantidad: 0,
                        width: box.width,
                        height: box.height,
                        color: box.color
                    };
                }
    
                // Sumar cantidad según el multiplicador en el nombre
                acc[key].cantidad += box.name.includes('x 2') ? 2 : 
                                   box.name.includes('x 3') ? 3 : 1;
    
                return acc;
            }, {});
    
            // Crear tabla con bultos agrupados
            const columns = ["Tipo de Bulto", "Cantidad", "Dimensiones (m)", "Color"];
            const rows = Object.values(groupedBoxes).map(box => [
                box.name,
                box.cantidad.toString(),
                `${box.width.toFixed(2)}x${box.height.toFixed(2)}`,
                { 
                    content: '', 
                    styles: { 
                        fillColor: colorToRgb(box.color),
                        textColor: [0, 0, 0]
                    }
                }
            ]);
    
            doc.autoTable({
                startY: yPos,
                head: [columns],
                body: rows,
                theme: 'grid',
                styles: { 
                    fontSize: 10,
                    cellPadding: 2,
                    halign: 'center'
                },
                columnStyles: {
                    0: { halign: 'left' },
                    3: { cellWidth: 15 }
                },
                didDrawCell: (data) => {
                    if (data.column.index === 3 && data.cell.raw) {
                        const color = data.cell.styles.fillColor;
                        doc.setFillColor(...color);
                        doc.rect(data.cell.x + 2, data.cell.y + 2, 10, 10, 'F');
                    }
                }
            });
    
            // Pie de página
            const pageCount = doc.getNumberOfPages();
            for(let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(10);
                doc.text(`Página ${i} de ${pageCount}`, 260, 207);
                doc.text("Documento generado por XTRAICE", 10, 207);
            }
    
            // Guardar PDF
            doc.save(`Planos_Carga_${nombreEncabezamiento || 'SinNombre'}.pdf`);
    
        } catch (error) {
            console.error("Error generando PDF:", error);
            alert("Error al generar el PDF. Por favor inténtalo de nuevo.");
        } finally {
            exportPDFButton.innerHTML = originalText;
        }
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
            const step = e.repeat ? 40 : 5; // 20 cm si la tecla está mantenida, 5 cm si es una pulsación
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
