// ========================================
// CANVAS OCH KONTEXT - LAGER-SYSTEM
// ========================================

// Hämta alla canvas-lager
const layer0 = document.getElementById('layer0');
const layer1 = document.getElementById('layer1');
const tempCanvas = document.getElementById('tempCanvas');

// Hämta contexts för varje lager
const ctx0 = layer0.getContext('2d');
const ctx1 = layer1.getContext('2d');
const tempCtx = tempCanvas.getContext('2d');

// Array med alla lager för enkel hantering
const layers = [layer0, layer1];
const contexts = [ctx0, ctx1];

// ========================================
// TILLSTÅNDSVARIABLER
// ========================================

// Aktuellt aktivt lager (0 eller 1)
let activeLayerIndex = 0;

// Nuvarande aktivt verktyg
let currentTool = 'brush'; // 'brush', 'eraser', 'rectangle', 'circle', 'triangle', 'fill'

// Spårar om användaren ritar
let isDrawing = false;

// Position för ritning
let lastX = 0;
let lastY = 0;

// Startposition för former (när användaren börjar dra)
let startX = 0;
let startY = 0;

// Aktuell färg och penselstorlek
let currentColor = '#000000';
let currentBrushSize = 5;

// ========================================
// UNDO/REDO SYSTEM - UPPDATERAT FÖR LAGER
// ========================================

// Historik per lager
let history = [[], []]; // En array för varje lager
let historyStep = [-1, -1]; // En pekare per lager

const MAX_HISTORY = 20;

/**
 * Sparar tillstånd för aktivt lager
 */
function saveState() {
    const layerIndex = activeLayerIndex;
    historyStep[layerIndex]++;
    
    // Ta bort framtida historik om vi ritar efter undo
    if (historyStep[layerIndex] < history[layerIndex].length) {
        history[layerIndex].length = historyStep[layerIndex];
    }
    
    // Spara aktuellt lagers tillstånd
    const ctx = contexts[layerIndex];
    const canvas = layers[layerIndex];
    history[layerIndex].push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    
    // Begränsa historik
    if (history[layerIndex].length > MAX_HISTORY) {
        history[layerIndex].shift();
        historyStep[layerIndex]--;
    }
    
    updateButtons();
}

/**
 * Ångra senaste ändring på aktivt lager
 */
function undo() {
    const layerIndex = activeLayerIndex;
    if (historyStep[layerIndex] > 0) {
        historyStep[layerIndex]--;
        const ctx = contexts[layerIndex];
        ctx.putImageData(history[layerIndex][historyStep[layerIndex]], 0, 0);
        updateButtons();
    }
}

/**
 * Gör om ångrad ändring på aktivt lager
 */
function redo() {
    const layerIndex = activeLayerIndex;
    if (historyStep[layerIndex] < history[layerIndex].length - 1) {
        historyStep[layerIndex]++;
        const ctx = contexts[layerIndex];
        ctx.putImageData(history[layerIndex][historyStep[layerIndex]], 0, 0);
        updateButtons();
    }
}

/**
 * Uppdatera knappstatus baserat på aktivt lagers historik
 */
function updateButtons() {
    const layerIndex = activeLayerIndex;
    const undoBtn = document.getElementById('undoBtn');
    const redoBtn = document.getElementById('redoBtn');
    
    undoBtn.disabled = historyStep[layerIndex] <= 0;
    redoBtn.disabled = historyStep[layerIndex] >= history[layerIndex].length - 1;
}

// ========================================
// INITIERING
// ========================================

/**
 * Initierar alla lager och verktyg
 */
function initCanvas() {
    contexts.forEach((ctx, index) => {
        const canvas = layers[index];
        
        // Grundinställningar
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = currentColor;
        ctx.lineWidth = currentBrushSize;
    });
    
    // Endast lager 0 (bakgrund) får vit bakgrund
    ctx0.fillStyle = '#ffffff';
    ctx0.fillRect(0, 0, layer0.width, layer0.height);
    
    // Spara initialt tillstånd för varje lager
    contexts.forEach((ctx, index) => {
        activeLayerIndex = index;
        saveState();
    });
    
    // Återställ till lager 0
    activeLayerIndex = 0;
    updateButtons();
}
// ========================================
// VERKTYGSHANTERING
// ========================================

/**
 * Hämtar aktuell context (beroende på aktivt lager)
 */
function getActiveContext() {
    return contexts[activeLayerIndex];
}

/**
 * Byter aktivt verktyg
 */
function setTool(tool) {
    currentTool = tool;
    
    // Uppdatera UI - markera valt verktyg
    document.querySelectorAll('.tool-btn').forEach(btn => {
        btn.classList.remove('bg-blue-500', 'text-white');
        btn.classList.add('bg-gray-200', 'text-gray-700');
    });
    
    const toolButtons = {
        'brush': 'brushTool',
        'eraser': 'eraserTool',
        'rectangle': 'rectangleTool',
        'circle': 'circleTool',
        'triangle': 'triangleTool',
        'fill': 'fillTool'
    };
    
    const activeBtn = document.getElementById(toolButtons[tool]);
    if (activeBtn) {
        activeBtn.classList.remove('bg-gray-200', 'text-gray-700');
        activeBtn.classList.add('bg-blue-500', 'text-white');
    }
}

/**
 * Byter aktivt lager
 */
function setActiveLayer(index) {
    activeLayerIndex = index;
    
    // Uppdatera UI
    document.querySelectorAll('.layer-btn').forEach(btn => {
        btn.classList.remove('bg-blue-500', 'text-white');
        btn.classList.add('bg-gray-200', 'text-gray-700');
    });
    
    const layerBtn = document.getElementById(`layer${index}Btn`);
    if (layerBtn) {
        layerBtn.classList.remove('bg-gray-200', 'text-gray-700');
        layerBtn.classList.add('bg-blue-500', 'text-white');
    }
    
    updateButtons();
}

// ========================================
// RITFUNKTIONER
// ========================================

/**
 * Startar ritning/formritning
 */
function startDrawing(e) {
    const ctx = getActiveContext();
    isDrawing = true;
    
    // Spara startposition
    startX = e.offsetX;
    startY = e.offsetY;
    lastX = e.offsetX;
    lastY = e.offsetY;
    
    // Hantera verktygsspecifik logik
    if (currentTool === 'brush' || currentTool === 'eraser') {
        // Sätt rätt composite operation för sudd
        if (currentTool === 'eraser') {
            ctx.globalCompositeOperation = 'destination-out';
        } else {
            ctx.globalCompositeOperation = 'source-over';
        }
        
        // Rita en punkt direkt vid klick (buggfix för klick-utan-drag)
        ctx.beginPath();
        ctx.arc(e.offsetX, e.offsetY, currentBrushSize / 2, 0, Math.PI * 2);
        ctx.fillStyle = currentColor;
        ctx.fill();
    } else if (currentTool === 'fill') {
        // Kör flood fill direkt vid klick
        floodFill(e.offsetX, e.offsetY);
        saveState();
        isDrawing = false; // Fill är en engångsoperation
    }
}

/**
 * Ritar medan musen rör sig
 */
function draw(e) {
    if (!isDrawing) return;
    
    const ctx = getActiveContext();
    
    if (currentTool === 'brush' || currentTool === 'eraser') {
        // Frihandsritning (samma som innan, men med eraser-stöd)
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
        
        [lastX, lastY] = [e.offsetX, e.offsetY];
        
    } else if (['rectangle', 'circle', 'triangle'].includes(currentTool)) {
        // Förhandsvisning av former på temp canvas
        drawShapePreview(e.offsetX, e.offsetY);
    }
}

/**
 * Avslutar ritning
 */
function stopDrawing(e) {
    if (!isDrawing) return;
    
    const ctx = getActiveContext();
    
    if (currentTool === 'brush' || currentTool === 'eraser') {
        // Återställ composite operation
        ctx.globalCompositeOperation = 'source-over';
        saveState();
        
    } else if (['rectangle', 'circle', 'triangle'].includes(currentTool)) {
        // Rita slutgiltig form på huvudcanvas
        drawFinalShape(e.offsetX, e.offsetY);
        // Rensa temp canvas
        tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
        saveState();
    }
    
    isDrawing = false;
}

// ========================================
// FORMRITNING
// ========================================

/**
 * Ritar förhandsvisning av form på temp canvas
 */
function drawShapePreview(currentX, currentY) {
    // Rensa temp canvas
    tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
    
    // Kopiera stil från aktivt lager
    tempCtx.strokeStyle = currentColor;
    tempCtx.lineWidth = currentBrushSize;
    tempCtx.lineCap = 'round';
    tempCtx.lineJoin = 'round';
    
    drawShape(tempCtx, startX, startY, currentX, currentY);
}

/**
 * Ritar slutgiltig form på aktivt lager
 */
function drawFinalShape(currentX, currentY) {
    const ctx = getActiveContext();
    drawShape(ctx, startX, startY, currentX, currentY);
}

/**
 * Ritar vald form på given context
 */
function drawShape(ctx, x1, y1, x2, y2) {
    ctx.beginPath();
    
    const width = x2 - x1;
    const height = y2 - y1;
    
    if (currentTool === 'rectangle') {
        ctx.rect(x1, y1, width, height);
        
    } else if (currentTool === 'circle') {
        // Beräkna radie från diagonalen
        const radius = Math.sqrt(width * width + height * height) / 2;
        const centerX = x1 + width / 2;
        const centerY = y1 + height / 2;
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        
    } else if (currentTool === 'triangle') {
        // Triangel: topp i mitten, bas längst ner
        const topX = x1 + width / 2;
        const topY = y1;
        const leftX = x1;
        const leftY = y2;
        const rightX = x2;
        const rightY = y2;
        
        ctx.moveTo(topX, topY);
        ctx.lineTo(leftX, leftY);
        ctx.lineTo(rightX, rightY);
        ctx.closePath();
    }
    
    ctx.stroke();
}

// ========================================
// FLOOD FILL (HINK-VERKTYG)
// ========================================

/**
 * Flood fill-algoritm för att fylla ett område
 * Använder stack-baserad approach för att undvika rekursion
 */
function floodFill(startX, startY) {
    const ctx = getActiveContext();
    const canvas = layers[activeLayerIndex];
    
    // Hämta bilddata
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // Omvandla start-koordinater till heltal
    startX = Math.floor(startX);
    startY = Math.floor(startY);
    
    // Beräkna index i data-array (varje pixel = 4 bytes: R, G, B, A)
    const startIndex = (startY * canvas.width + startX) * 4;
    
    // Hämta ursprungsfärgen vid klickpunkten
    const startR = data[startIndex];
    const startG = data[startIndex + 1];
    const startB = data[startIndex + 2];
    const startA = data[startIndex + 3];
    
    // Omvandla vald färg till RGB
    const fillColor = hexToRgb(currentColor);
    
    // Om färgen redan är samma, gör inget
    if (startR === fillColor.r && startG === fillColor.g && startB === fillColor.b) {
        return;
    }
    
    // Stack för att hålla pixlar som ska fyllas
    const stack = [[startX, startY]];
    
    // Besökta pixlar (undvik att processa samma pixel flera gånger)
    const visited = new Set();
    
    while (stack.length > 0) {
        const [x, y] = stack.pop();
        
        // Hoppa över om utanför canvas
        if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) continue;
        
        // Hoppa över om redan besökt
        const key = `${x},${y}`;
        if (visited.has(key)) continue;
        visited.add(key);
        
        // Beräkna index
        const index = (y * canvas.width + x) * 4;
        
        // Kontrollera om pixeln har samma färg som startfärgen
        const r = data[index];
        const g = data[index + 1];
        const b = data[index + 2];
        const a = data[index + 3];
        
        if (r !== startR || g !== startG || b !== startB || a !== startA) {
            continue; // Inte samma färg, hoppa över
        }
        
        // Fyll pixeln med ny färg
        data[index] = fillColor.r;
        data[index + 1] = fillColor.g;
        data[index + 2] = fillColor.b;
        data[index + 3] = 255; // Full opacitet
        
        // Lägg till grannar i stacken
        stack.push([x + 1, y]);     // Höger
        stack.push([x - 1, y]);     // Vänster
        stack.push([x, y + 1]);     // Ner
        stack.push([x, y - 1]);     // Upp
    }
    
    // Skriv tillbaka modifierad bilddata
    ctx.putImageData(imageData, 0, 0);
}

/**
 * Hjälpfunktion: Konvertera hex-färg till RGB
 */
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
}

// ========================================
// RENSA CANVAS
// ========================================

/**
 * Rensar aktivt lager
 */
function clearCanvas() {
    const ctx = getActiveContext();
    const canvas = layers[activeLayerIndex];
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveState();
}

// ========================================
// SPARA MÅLNING
// ========================================

/**
 * Sparar målning som PNG
 * Kombinerar alla lager till en bild
 */
function savePainting() {
    // Skapa temporärt canvas för att kombinera lager
    const mergedCanvas = document.createElement('canvas');
    mergedCanvas.width = layers[0].width;
    mergedCanvas.height = layers[0].height;
    const mergedCtx = mergedCanvas.getContext('2d');
    
    // Rita alla lager på merged canvas
    layers.forEach(layer => {
        mergedCtx.drawImage(layer, 0, 0);
    });
    
    // Konvertera till data URL
    const dataURL = mergedCanvas.toDataURL('image/png');
    
    // Skapa nedladdningslänk
    const link = document.createElement('a');
    link.download = `målning_${Date.now()}.png`;
    link.href = dataURL;
    
    // Trigga nedladdning
    link.click();
}

// ========================================
// EVENT LISTENERS - CANVAS
// ========================================

// Lägg till listeners på alla lager (endast det översta tar emot events)
layers.forEach(layer => {
    layer.addEventListener('mousedown', startDrawing);
    layer.addEventListener('mousemove', draw);
    layer.addEventListener('mouseup', stopDrawing);
    layer.addEventListener('mouseleave', stopDrawing);
});

// ========================================
// EVENT LISTENERS - UI-KONTROLLER
// ========================================

// Färgväljare
document.getElementById('colorPicker').addEventListener('change', (e) => {
    currentColor = e.target.value;
    contexts.forEach(ctx => ctx.strokeStyle = currentColor);
});

// Penselstorlek
document.getElementById('brushSize').addEventListener('input', (e) => {
    currentBrushSize = e.target.value;
    contexts.forEach(ctx => ctx.lineWidth = currentBrushSize);
    document.getElementById('brushSizeValue').textContent = currentBrushSize + 'px';
});

// Verktygsknappar
document.getElementById('brushTool').addEventListener('click', () => setTool('brush'));
document.getElementById('eraserTool').addEventListener('click', () => setTool('eraser'));
document.getElementById('rectangleTool').addEventListener('click', () => setTool('rectangle'));
document.getElementById('circleTool').addEventListener('click', () => setTool('circle'));
document.getElementById('triangleTool').addEventListener('click', () => setTool('triangle'));
document.getElementById('fillTool').addEventListener('click', () => setTool('fill'));

// Lagerknappar
document.getElementById('layer0Btn').addEventListener('click', () => setActiveLayer(0));
document.getElementById('layer1Btn').addEventListener('click', () => setActiveLayer(1));

// Åtgärdsknappar
document.getElementById('clearBtn').addEventListener('click', clearCanvas);
document.getElementById('undoBtn').addEventListener('click', undo);
document.getElementById('redoBtn').addEventListener('click', redo);
document.getElementById('saveBtn').addEventListener('click', savePainting);

// ========================================
// STARTA APPLIKATIONEN
// ========================================

initCanvas();