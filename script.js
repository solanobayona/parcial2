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