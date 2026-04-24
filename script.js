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