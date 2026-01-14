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

// Processing flag för flood fill
let isProcessing = false;

// ========================================
// VALIDERING AV ANVÄNDARINPUT
// ========================================

/**
 * Validerar och säkrar färgvärde
 */
function sanitizeColor(color) {
    // Kontrollera att det är en giltig hex-färg
    const hexPattern = /^#[0-9A-Fa-f]{6}$/;
    if (typeof color === 'string' && hexPattern.test(color)) {
        return color;
    }
    console.warn('Ogiltig färg detekterad, använder standardfärg #000000');
    return '#000000';
}

/**
 * Validerar och säkrar penselstorlek
 */
function sanitizeBrushSize(size) {
    const numSize = Number(size);
    // Säkerställ att värdet är ett positivt tal mellan 1 och 50
    if (isNaN(numSize) || numSize < 1 || numSize > 50) {
        console.warn('Ogiltig penselstorlek detekterad, använder standardstorlek 5');
        return 5;
    }
    return Math.floor(numSize);
}

/**
 * Validerar koordinater
 */
function sanitizeCoordinate(coord, max) {
    const numCoord = Number(coord);
    if (isNaN(numCoord)) return 0;
    return Math.max(0, Math.min(max, Math.floor(numCoord)));
}

/**
 * Säker getter för aktuell färg
 */
function getCurrentColor() {
    return sanitizeColor(currentColor);
}

/**
 * Säker getter för aktuell penselstorlek
 */
function getCurrentBrushSize() {
    return sanitizeBrushSize(currentBrushSize);
}

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
// DEBOUNCING OCH LADDNINGSSTATUS
// ========================================

/**
 * Visar laddningsindikator
 */
function showLoadingIndicator() {
    // Ändra muspekaren
    document.body.style.cursor = 'wait';
    layers.forEach(layer => layer.style.cursor = 'wait');
    
    // Disable alla knappar
    document.querySelectorAll('button').forEach(btn => {
        btn.disabled = true;
        btn.classList.add('opacity-50');
    });
}

/**
 * Döljer laddningsindikator
 */
function hideLoadingIndicator() {
    document.body.style.cursor = 'default';
    layers.forEach(layer => layer.style.cursor = 'crosshair');
    
    // Enable alla knappar utom undo/redo (de har egen logik)
    document.querySelectorAll('button').forEach(btn => {
        btn.disabled = false;
        btn.classList.remove('opacity-50');
    });
    
    updateButtons(); // Återställ undo/redo status
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
        ctx.strokeStyle = getCurrentColor();
        ctx.lineWidth = getCurrentBrushSize();
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
 * Byter aktivt verktyg med förbättrad visuell feedback
 */
function setTool(tool) {
    currentTool = tool;
    
    // Återställ alla knappar
    document.querySelectorAll('.tool-btn').forEach(btn => {
        btn.classList.remove('bg-blue-600', 'text-white', 'ring-4', 'ring-blue-300', 'shadow-lg', 'scale-105');
        btn.classList.add('bg-gray-200', 'text-gray-700', 'shadow-sm');
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
        activeBtn.classList.remove('bg-gray-200', 'text-gray-700', 'shadow-sm');
        activeBtn.classList.add('bg-blue-600', 'text-white', 'ring-4', 'ring-blue-300', 'shadow-lg', 'scale-105', 'transform');
    }
}

/**
 * Byter aktivt lager med förbättrad visuell feedback
 */
function setActiveLayer(index) {
    activeLayerIndex = index;
    
    // Återställ alla lagerknappar
    document.querySelectorAll('.layer-btn').forEach(btn => {
        btn.classList.remove('bg-blue-600', 'text-white', 'ring-4', 'ring-blue-300', 'font-bold');
        btn.classList.add('bg-gray-200', 'text-gray-700');
    });
    
    const layerBtn = document.getElementById(`layer${index}Btn`);
    if (layerBtn) {
        layerBtn.classList.remove('bg-gray-200', 'text-gray-700');
        layerBtn.classList.add('bg-blue-600', 'text-white', 'ring-4', 'ring-blue-300', 'font-bold');
    }
    
    updateButtons();
}

// ========================================
// TOUCH-STÖD FÖR SURFPLATTOR
// ========================================

/**
 * Normaliserar event-koordinater från både mus och touch
 */
function getEventCoordinates(e, canvas) {
    let x, y;
    
    if (e.type.startsWith('touch')) {
        // Touch event
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0] || e.changedTouches[0];
        x = touch.clientX - rect.left;
        y = touch.clientY - rect.top;
    } else {
        // Mouse event
        x = e.offsetX;
        y = e.offsetY;
    }
    
    // Validera koordinater
    x = sanitizeCoordinate(x, canvas.width);
    y = sanitizeCoordinate(y, canvas.height);
    
    return { x, y };
}

/**
 * Unified start-funktion för både mus och touch
 */
function handleStart(e) {
    // Förhindra default touch-beteende (scrollning)
    if (e.type.startsWith('touch')) {
        e.preventDefault();
    }
    
    const canvas = layers[activeLayerIndex];
    const coords = getEventCoordinates(e, canvas);
    
    const ctx = getActiveContext();
    isDrawing = true;
    
    startX = coords.x;
    startY = coords.y;
    lastX = coords.x;
    lastY = coords.y;
    
    if (currentTool === 'brush' || currentTool === 'eraser') {
        if (currentTool === 'eraser') {
            ctx.globalCompositeOperation = 'destination-out';
        } else {
            ctx.globalCompositeOperation = 'source-over';
        }
        
        ctx.beginPath();
        ctx.arc(coords.x, coords.y, getCurrentBrushSize() / 2, 0, Math.PI * 2);
        ctx.fillStyle = getCurrentColor();
        ctx.fill();
    } else if (currentTool === 'fill') {
        // Kör flood fill asynkront
        floodFill(coords.x, coords.y).then(() => {
            saveState();
        });
        isDrawing = false;
    }
}

/**
 * Unified move-funktion för både mus och touch
 */
function handleMove(e) {
    if (!isDrawing) return;
    
    if (e.type.startsWith('touch')) {
        e.preventDefault();
    }
    
    const canvas = layers[activeLayerIndex];
    const coords = getEventCoordinates(e, canvas);
    
    const ctx = getActiveContext();
    
    if (currentTool === 'brush' || currentTool === 'eraser') {
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(coords.x, coords.y);
        ctx.stroke();
        
        lastX = coords.x;
        lastY = coords.y;
        
    } else if (['rectangle', 'circle', 'triangle'].includes(currentTool)) {
        drawShapePreview(coords.x, coords.y);
    }
}

/**
 * Unified stop-funktion för både mus och touch
 */
function handleStop(e) {
    if (!isDrawing) return;
    
    if (e.type.startsWith('touch')) {
        e.preventDefault();
    }
    
    const canvas = layers[activeLayerIndex];
    const coords = getEventCoordinates(e, canvas);
    
    const ctx = getActiveContext();
    
    if (currentTool === 'brush' || currentTool === 'eraser') {
        ctx.globalCompositeOperation = 'source-over';
        saveState();
        
    } else if (['rectangle', 'circle', 'triangle'].includes(currentTool)) {
        drawFinalShape(coords.x, coords.y);
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
    tempCtx.strokeStyle = getCurrentColor();
    tempCtx.lineWidth = getCurrentBrushSize();
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

/**
 * Optimerad flood fill-algoritm med async processing
 * Använder requestAnimationFrame för att inte blockera UI
 */
async function floodFill(startX, startY) {
    // Förhindra flera samtidiga fills
    if (isProcessing) {
        console.log('Fyllning pågår redan, vänligen vänta...');
        return;
    }
    
    isProcessing = true;
    showLoadingIndicator();
    
    const ctx = getActiveContext();
    const canvas = layers[activeLayerIndex];
    
    // Hämta bilddata
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    startX = Math.floor(startX);
    startY = Math.floor(startY);
    
    const startIndex = (startY * canvas.width + startX) * 4;
    
    const startR = data[startIndex];
    const startG = data[startIndex + 1];
    const startB = data[startIndex + 2];
    const startA = data[startIndex + 3];
    
    const fillColor = hexToRgb(getCurrentColor());
    
    // Om färgen redan är samma, gör inget
    if (startR === fillColor.r && startG === fillColor.g && startB === fillColor.b) {
        isProcessing = false;
        hideLoadingIndicator();
        return;
    }
    
    const stack = [[startX, startY]];
    const visited = new Set();
    
    // Process i batches för att inte frysa UI
    const BATCH_SIZE = 1000;
    let processedCount = 0;
    
    while (stack.length > 0) {
        // Processa en batch
        for (let i = 0; i < BATCH_SIZE && stack.length > 0; i++) {
            const [x, y] = stack.pop();
            
            if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) continue;
            
            const key = `${x},${y}`;
            if (visited.has(key)) continue;
            visited.add(key);
            
            const index = (y * canvas.width + x) * 4;
            
            const r = data[index];
            const g = data[index + 1];
            const b = data[index + 2];
            const a = data[index + 3];
            
            if (r !== startR || g !== startG || b !== startB || a !== startA) {
                continue;
            }
            
            data[index] = fillColor.r;
            data[index + 1] = fillColor.g;
            data[index + 2] = fillColor.b;
            data[index + 3] = 255;
            
            stack.push([x + 1, y]);
            stack.push([x - 1, y]);
            stack.push([x, y + 1]);
            stack.push([x, y - 1]);
            
            processedCount++;
        }
        
        // Ge webbläsaren chans att uppdatera UI
        if (stack.length > 0) {
            await new Promise(resolve => requestAnimationFrame(resolve));
        }
    }
    
    // Skriv tillbaka modifierad bilddata
    ctx.putImageData(imageData, 0, 0);
    
    isProcessing = false;
    hideLoadingIndicator();
}

// ========================================
// RENSA CANVAS
// ========================================

/**
 * Rensar aktivt lager
 * Lager 0 (bakgrund) fylls med vitt
 * Övriga lager rensas till transparent
 */
function clearCanvas() {
    const ctx = getActiveContext();
    const canvas = layers[activeLayerIndex];
    
    if (activeLayerIndex === 0) {
        // Bakgrundslager: fyll med vitt
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
        // Övriga lager: rensa till transparent
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    
    saveState();
}

// ========================================
// BEKRÄFTELSEDIALOG FÖR RENSNING
// ========================================

/**
 * Visar bekräftelsedialog innan rensning
 */
function showClearConfirmation() {
    const modal = document.getElementById('confirmModal');
    modal.classList.remove('hidden');
    
    // Fokusera på "Nej"-knappen som standard (säkrare)
    document.getElementById('confirmNo').focus();
}

/**
 * Döljer bekräftelsedialogren
 */
function hideClearConfirmation() {
    const modal = document.getElementById('confirmModal');
    modal.classList.add('hidden');
}

/**
 * Hanterar bekräftad rensning
 */
function handleConfirmedClear() {
    clearCanvas();
    hideClearConfirmation();
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
// EVENT LISTENERS - CANVAS (MUS + TOUCH)
// ========================================

layers.forEach(layer => {
    // Mus-events
    layer.addEventListener('mousedown', handleStart);
    layer.addEventListener('mousemove', handleMove);
    layer.addEventListener('mouseup', handleStop);
    layer.addEventListener('mouseleave', handleStop);
    
    // Touch-events
    layer.addEventListener('touchstart', handleStart, { passive: false });
    layer.addEventListener('touchmove', handleMove, { passive: false });
    layer.addEventListener('touchend', handleStop, { passive: false });
    layer.addEventListener('touchcancel', handleStop, { passive: false });
});

// ========================================
// EVENT LISTENERS - UI-KONTROLLER
// ========================================

// Färgväljare
document.getElementById('colorPicker').addEventListener('change', (e) => {
    const sanitized = sanitizeColor(e.target.value);
    currentColor = sanitized;
    e.target.value = sanitized; // Uppdatera UI om värdet korrigerades
    contexts.forEach(ctx => ctx.strokeStyle = sanitized);
});

// Penselstorlek
document.getElementById('brushSize').addEventListener('input', (e) => {
    const sanitized = sanitizeBrushSize(e.target.value);
    currentBrushSize = sanitized;
    e.target.value = sanitized;
    contexts.forEach(ctx => ctx.lineWidth = sanitized);
    document.getElementById('brushSizeValue').textContent = sanitized + 'px';
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
document.getElementById('clearBtn').addEventListener('click', showClearConfirmation);
document.getElementById('undoBtn').addEventListener('click', undo);
document.getElementById('redoBtn').addEventListener('click', redo);
document.getElementById('saveBtn').addEventListener('click', savePainting);

// Bekräftelsedialog-knappar
document.getElementById('confirmYes').addEventListener('click', handleConfirmedClear);
document.getElementById('confirmNo').addEventListener('click', hideClearConfirmation);

// Stäng modal vid klick utanför
document.getElementById('confirmModal').addEventListener('click', (e) => {
    if (e.target.id === 'confirmModal') {
        hideClearConfirmation();
    }
});

// Responsiv toolbar-toggle
document.getElementById('toolbarToggle').addEventListener('click', () => {
    const content = document.getElementById('toolbarContent');
    const toggleText = document.getElementById('toolbarToggleText');
    
    if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        toggleText.textContent = 'Dölj verktyg ▲';
    } else {
        content.classList.add('hidden');
        toggleText.textContent = 'Visa verktyg ▼';
    }
});

// ========================================
// STARTA APPLIKATIONEN
// ========================================

initCanvas();