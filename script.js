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
