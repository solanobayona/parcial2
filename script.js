/**
 * Universidad - Facultad de Ingeniería
 * Asignatura: Introducción a la Computación Gráfica
 * Estudiante: Nicolas Solano       Código: 6000809
 * * NOTA: El código sigue una estructura modular y utiliza algoritmos de 
 * rasterización a nivel de píxel sin funciones nativas de trazado.
 */
const canvas = document.getElementById("canvasGrafico");
const ctx = canvas.getContext("2d");

// Única función autorizada para pintar. Usamos Math.floor para evitar 
// que el navegador intente suavizar el píxel (antialiasing).
function plotPixel(ctx, x, y, color = "#1a1a1a") {
    ctx.fillStyle = color;
    ctx.fillRect(Math.floor(x), Math.floor(y), 1, 1);
}

function midpointCircle(centerX, centerY, r, color) {
    let x = 0;
    let y = r;
    let d = 1 - r; // Parámetro de decisión inicial d

    const drawOctants = (cx, cy, x, y) => {
        // Aprovechamos la simetría de 8 octantes para optimizar el dibujo
        plotPixel(ctx, cx + x, cy + y, color); plotPixel(ctx, cx - x, cy + y, color);
        plotPixel(ctx, cx + x, cy - y, color); plotPixel(ctx, cx - x, cy - y, color);
        plotPixel(ctx, cx + y, cy + x, color); plotPixel(ctx, cx - y, cy + x, color);
        plotPixel(ctx, cx + y, cy - x, color); plotPixel(ctx, cx - y, cy - x, color);
    };

    drawOctants(centerX, centerY, x, y);

    while (x < y) {
        x++;
        if (d < 0) {
            // Si d < 0, elegimos el píxel E (este). 
            // Actualizamos d basándonos en la nueva posición de x.
            d += 2 * x + 1;
        } else {
            // Si d >= 0, elegimos el píxel SE (sudeste).
            // Reducimos y y actualizamos d.
            y--;
            d += 2 * (x - y) + 1;
        }
        drawOctants(centerX, centerY, x, y);
    }
}
function bresenhamLine(x0, y0, x1, y1, color) {
    let dx = Math.abs(x1 - x0);
    let dy = Math.abs(y1 - y0);
    let sx = (x0 < x1) ? 1 : -1;
    let sy = (y0 < y1) ? 1 : -1;
    let err = dx - dy; // Parámetro de decisión err para controlar el error acumulado

    while (true) {
        plotPixel(ctx, x0, y0, color);
        if (x0 === x1 && y0 === y1) break;
        
        let e2 = 2 * err;
        if (e2 > -dy) {
            // Actualización del parámetro de decisión: nos movemos en X
            err -= dy;
            x0 += sx;
        }
        if (e2 < dx) {
            // Actualización del parámetro de decisión: nos movemos en Y
            err += dx;
            y0 += sy;
        }
    }
}

/**
 * Calcula centros distribuidos uniformemente sobre la circunferencia R
 */
function getOrbitalPositions(r, n) {
    const centers = [];
    const angleStep = (2 * Math.PI) / n; // Dividimos el círculo en N partes iguales
    for (let i = 0; i < n; i++) {
        let theta = i * angleStep;
        centers.push({
            x: centroX + r * Math.cos(theta),
            y: centroY + r * Math.sin(theta)
        });
    }
    return centers;
}

/**
 * Calcula los vértices de los polígonos de menor escala (radio 20)
 */
function getPolygonVertices(cx, cy, r, k) {
    const vertices = [];
    const angleStep = (2 * Math.PI) / k;
    for (let i = 0; i < k; i++) {
        // -Math.PI / 2 es para que el polígono empiece mirando "hacia arriba"
        let theta = (i * angleStep) - (Math.PI / 2);
        vertices.push({
            x: cx + r * Math.cos(theta),
            y: cy + r * Math.sin(theta)
        });
    }
    return vertices;
}
/**
 * Función principal que ordena el dibujo.
 * Se encarga de limpiar el área y llamar a los algoritmos de rasterización.
 */
function main() {
    // Dibujamos la órbita con el algoritmo de punto medio (color gris tenue)
    midpointCircle(centroX, centroY, R, "#dcdde1");

    // Obtenemos los centros de los N polígonos
    const orbitalPoints = getOrbitalPositions(R, N);

    orbitalPoints.forEach(p => {
        // Para cada centro, calculamos los vértices del polígono de k lados
        const vertices = getPolygonVertices(p.x, p.y, 20, K);
        
        // Unimos los vértices usando el algoritmo de Bresenham
        for (let i = 0; i < vertices.length; i++) {
            let p1 = vertices[i];
            let p2 = vertices[(i + 1) % vertices.length]; // Cierra el polígono uniendo el último con el primero
            bresenhamLine(p1.x, p1.y, p2.x, p2.y, "#e84118");
        }
    });

    console.log(`Render completado: N=${N}, K=${K}, R=${R}`);
}

// Ejecución del renderizado
main();