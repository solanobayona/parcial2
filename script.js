console.log("Script cargado");
/**
 * UMNG - Facultad de Ingeniería Multimedia
 * Asignatura: Introducción a la Computación Gráfica
 * Estudiante: Nicolas Solano     Código: 6000809
 * * Estructura modular basada en algoritmos de rasterización.
 */

const canvas = document.getElementById("canvasGrafico");
const ctx = canvas.getContext("2d");

// Única función autorizada para pintar.
function plotPixel(ctx, x, y, color = "#1a1a1a") {
    ctx.fillStyle = color;
    ctx.fillRect(Math.floor(x), Math.floor(y), 1, 1);
}

/**
 * Algoritmo de Punto Medio para circunferencias
 * @param {number} d - Parámetro de decisión para elegir entre el píxel E o SE.
 */
function midpointCircle(ctx, centerX, centerY, r, color) {
    let x = 0;
    let y = r;
    let d = 1 - r; // Parámetro de decisión inicial d

    const drawOctants = (cx, cy, x, y) => {
        plotPixel(ctx, cx + x, cy + y, color); plotPixel(ctx, cx - x, cy + y, color);
        plotPixel(ctx, cx + x, cy - y, color); plotPixel(ctx, cx - x, cy - y, color);
        plotPixel(ctx, cx + y, cy + x, color); plotPixel(ctx, cx - y, cy + x, color);
        plotPixel(ctx, cx + y, cy - x, color); plotPixel(ctx, cx - y, cy - x, color);
    };

    drawOctants(centerX, centerY, x, y);

    while (x < y) {
        x++;
        if (d < 0) {
            // Actualización d: Se selecciona el píxel al Este.
            d += 2 * x + 1;
        } else {
            // Actualización d: Se selecciona el píxel Sudeste, bajando en Y.
            y--;
            d += 2 * (x - y) + 1;
        }
        drawOctants(centerX, centerY, x, y);
    }
}

/**
 * Algoritmo de Bresenham para líneas
 * @param {number} err - Parámetro de decisión que controla el error acumulado.
 */
function bresenhamLine(ctx, x0, y0, x1, y1, color) {
    let dx = Math.abs(x1 - x0);
    let dy = Math.abs(y1 - y0);
    let sx = (x0 < x1) ? 1 : -1;
    let sy = (y0 < y1) ? 1 : -1;
    let err = dx - dy; // Inicialización del error acumulado

    while (true) {
        plotPixel(ctx, x0, y0, color);
        if (x0 === x1 && y0 === y1) break;
        
        let e2 = 2 * err;
        if (e2 > -dy) {
            // Se actualiza el error para avanzar en el eje X
            err -= dy;
            x0 += sx;
        }
        if (e2 < dx) {
            // Se actualiza el error para avanzar en el eje Y
            err += dx;
            y0 += sy;
        }
    }
}

function getOrbitalPositions(cx, cy, r, n) {
    const centers = [];
    const angleStep = (2 * Math.PI) / n;
    for (let i = 0; i < n; i++) {
        centers.push({
            x: cx + r * Math.cos(i * angleStep),
            y: cy + r * Math.sin(i * angleStep)
        });
    }
    return centers;
}

function getPolygonVertices(cx, cy, r, k) {
    const vertices = [];
    const angleStep = (2 * Math.PI) / k;
    for (let i = 0; i < k; i++) {
        let theta = (i * angleStep) - (Math.PI / 2);
        vertices.push({
            x: cx + r * Math.cos(theta),
            y: cy + r * Math.sin(theta)
        });
    }
    return vertices;
}

// Variables globales de la composición
const centroX = canvas.width / 2;
const centroY = canvas.height / 2;
const R = Math.floor(Math.random() * (180 - 120 + 1)) + 120; 
const N = Math.floor(Math.random() * (10 - 4 + 1)) + 4;       
const K = Math.floor(Math.random() * (8 - 3 + 1)) + 3;       

function main() {
console.log("Main ejecutándose");
    // 1. Dibujar órbita (Punto Medio)
    midpointCircle(ctx, centroX, centroY, R, "#bdc3c7");

    // 2. Calcular centros de polígonos
    const orbitalPoints = getOrbitalPositions(centroX, centroY, R, N);

    // 3. Dibujar polígonos (Bresenham)
    orbitalPoints.forEach(p => {
        const vertices = getPolygonVertices(p.x, p.y, 25, K);
        for (let i = 0; i < vertices.length; i++) {
            let start = vertices[i];
            let end = vertices[(i + 1) % vertices.length];
            bresenhamLine(ctx, start.x, start.y, end.x, end.y, "#e74c3c");
        }
    });

    console.log(`Render finalizado: N=${N}, K=${K}, R=${R}`);
}

// Iniciar aplicación
main();

//link chat gpt https://chatgpt.com/share/69ebbd76-9690-83e9-89bd-edd116a6f0d5