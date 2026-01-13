// ========================================
// CANVAS OCH KONTEXT
// ========================================

// Hämta canvas-elementet från DOM
const canvas = document.getElementById('canvas');
// Hämta 2D-ritkontext (API för att rita)
const ctx = canvas.getContext('2d');

// ========================================
// TILLSTÅNDSVARIABLER
// ========================================

// Spårar om användaren håller nere musknappen och ritar
let isDrawing = false;

// Lagrar föregående musposition för att rita sammanhängande linjer
let lastX = 0;
let lastY = 0;

// Aktuell färg (synkas med färgväljaren)
let currentColor = '#000000';

// Aktuell penselstorlek (synkas med slider)
let currentBrushSize = 5;

// ========================================
// UNDO/REDO SYSTEM
// ========================================

// Array som lagrar alla canvas-tillstånd som ImageData
let history = [];

// Pekare som håller reda på var i historiken vi är
let historyStep = -1;

// Max antal undo-steg för att spara minne
const MAX_HISTORY = 20;

/**
 * Sparar det aktuella canvas-tillståndet till historiken
 * Anropas efter varje avslutat pennstreck (mouseup)
 */
function saveState() {
    // Om vi är mitt i historiken (efter undo), ta bort allt framåt
    historyStep++;
    
    // Ta bort all "framtid" om vi börjat rita efter en undo
    if (historyStep < history.length) {
        history.length = historyStep;
    }
    
    // Spara aktuellt canvas-tillstånd som ImageData
    history.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    
    // Begränsa historik till MAX_HISTORY steg
    if (history.length > MAX_HISTORY) {
        history.shift(); // Ta bort äldsta
        historyStep--;   // Justera pekare
    }
    
    // Uppdatera knappstatus
    updateButtons();
}

/**
 * Återställer canvas till ett tidigare tillstånd
 */
function undo() {
    if (historyStep > 0) {
        historyStep--;
        // Ladda det tidigare tillståndet
        ctx.putImageData(history[historyStep], 0, 0);
        updateButtons();
    }
}

/**
 * Återgår till ett senare tillstånd (efter undo)
 */
function redo() {
    if (historyStep < history.length - 1) {
        historyStep++;
        // Ladda nästa tillstånd
        ctx.putImageData(history[historyStep], 0, 0);
        updateButtons();
    }
}

/**
 * Aktiverar/inaktiverar undo/redo-knappar baserat på historik
 */
function updateButtons() {
    const undoBtn = document.getElementById('undoBtn');
    const redoBtn = document.getElementById('redoBtn');
    
    // Inaktivera undo om vi är i början
    undoBtn.disabled = historyStep <= 0;
    
    // Inaktivera redo om vi är i slutet
    redoBtn.disabled = historyStep >= history.length - 1;
}

// ========================================
// INITIERING
// ========================================

/**
 * Initierar canvas med vit bakgrund och sparar första tillståndet
 */
function initCanvas() {
    // Fyll canvas med vit bakgrund
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Grundinställningar för ritning
    ctx.lineCap = 'round';      // Rundade pennspetsar
    ctx.lineJoin = 'round';     // Rundade hörn på linjer
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = currentBrushSize;
    
    // Spara initialt tillstånd (tom vit canvas)
    saveState();
}

// ========================================
// RITFUNKTIONER
// ========================================

/**
 * Startar ritning när användaren trycker ner musknappen
 */
function startDrawing(e) {
    isDrawing = true;
    // Sätt startposition till där musen är
    [lastX, lastY] = [e.offsetX, e.offsetY];
}

/**
 * Ritar linje från föregående position till nuvarande musposition
 */
function draw(e) {
    // Gör inget om användaren inte ritar
    if (!isDrawing) return;
    
    // Börja en ny path
    ctx.beginPath();
    // Flytta till föregående position
    ctx.moveTo(lastX, lastY);
    // Rita linje till nuvarande position
    ctx.lineTo(e.offsetX, e.offsetY);
    // Applicera linjen på canvas
    ctx.stroke();
    
    // Uppdatera föregående position till nuvarande
    [lastX, lastY] = [e.offsetX, e.offsetY];
}

/**
 * Avslutar ritning när musknappen släpps
 */
function stopDrawing() {
    if (isDrawing) {
        isDrawing = false;
        // Spara tillståndet efter avslutat pennstreck
        saveState();
    }
}

/**
 * Rensar hela canvas och sparar nytt tillstånd
 */
function clearCanvas() {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveState();
}

// ========================================
// EVENT LISTENERS - CANVAS
// ========================================

// När musen trycks ner på canvas
canvas.addEventListener('mousedown', startDrawing);

// När musen rör sig över canvas
canvas.addEventListener('mousemove', draw);

// När musknappen släpps
canvas.addEventListener('mouseup', stopDrawing);

// När musen lämnar canvas-området (avsluta ritning)
canvas.addEventListener('mouseleave', stopDrawing);

// ========================================
// EVENT LISTENERS - UI-KONTROLLER
// ========================================

// Färgväljare
document.getElementById('colorPicker').addEventListener('change', (e) => {
    currentColor = e.target.value;
    ctx.strokeStyle = currentColor;
});

// Penselstorlek slider
document.getElementById('brushSize').addEventListener('input', (e) => {
    currentBrushSize = e.target.value;
    ctx.lineWidth = currentBrushSize;
    // Uppdatera visat värde
    document.getElementById('brushSizeValue').textContent = currentBrushSize + 'px';
});

// Rensa-knapp
document.getElementById('clearBtn').addEventListener('click', clearCanvas);

// Undo-knapp
document.getElementById('undoBtn').addEventListener('click', undo);

// Redo-knapp
document.getElementById('redoBtn').addEventListener('click', redo);

// ========================================
// STARTA APPLIKATIONEN
// ========================================

// Initiera canvas när sidan laddats
initCanvas();