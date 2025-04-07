const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 400;
canvas.height = 300;

const cakeBaseColor = '#f2d1a4'; 
const frostingColor = '#ffffff'; 
const candleColor = '#e67e22'; 
const flameColor = '#f1c40f';

let candles = [ // Store candle data (position and blown state)
    { x: 100, y: 100, width: 10, height: 40, blown: false },
    { x: 150, y: 110, width: 10, height: 30, blown: false },
    { x: 200, y: 90, width: 10, height: 50, blown: false },
    { x: 250, y: 100, width: 10, height: 45, blown: false },
    { x: 300, y: 110, width: 10, height: 30, blown: false }
];

function drawCakeBase(x, y, width, height) {
    ctx.fillStyle = cakeBaseColor;
    ctx.fillRect(x, y, width, height);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(x, y + height / 2, width, height / 4);
}

function drawFrosting(x, y, width, height, dripSize) {
    ctx.fillStyle = frostingColor;
    ctx.fillRect(x, y, width, height);
    for (let i = x + dripSize; i < x + width - dripSize; i += dripSize * 2) {
        ctx.beginPath();
        ctx.moveTo(i, y + height);
        ctx.lineTo(i + dripSize, y + height + dripSize / 2);
        ctx.lineTo(i, y + height + dripSize);
        ctx.fill();
    }
}

function drawCandle(x, y, width, height, blown) {
    ctx.fillStyle = candleColor;
    ctx.fillRect(x, y, width, height);

    if (!blown) { // Only draw flame if not blown out
        ctx.fillStyle = flameColor;
        ctx.beginPath();
        ctx.moveTo(x + width / 2, y - height / 3);
        ctx.lineTo(x + width * 0.6, y - height / 2);
        ctx.lineTo(x + width * 0.4, y - height / 2);
        ctx.closePath();
        ctx.fill();
    }
}

function drawCake() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    candles.forEach(candle => {
        drawCandle(candle.x, candle.y, candle.width, candle.height, candle.blown);
    });
    drawCakeBase(50, 150, 300, 80);
    drawFrosting(50, 140, 300, 20, 20);
}

// Function to handle blowing out candles
function blowOutCandles() {
    candles.forEach(candle => {
        candle.blown = true; // Blow out all candles
    });
    drawCake(); // Redraw the cake without flames
}

// Microphone access and audio processing (You'll need to implement this)
async function getMicrophoneInput() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const audioContext = new AudioContext();
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        source.connect(analyser);

        // Analyze audio data to detect blowing
        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        function checkForBlow() {
            analyser.getByteFrequencyData(dataArray);
            const blowThreshold = 100; // Adjust based on microphone sensitivity
            if (dataArray[0] > blowThreshold) { // Assuming low frequencies indicate blowing
                blowOutCandles();
            }
            requestAnimationFrame(checkForBlow); // Continuously check for blowing
        }
        checkForBlow();
    } catch (error) {
        console.error("Error accessing microphone:", error);
    }
}

// Initialize cake drawing and microphone input
drawCake(); 
getMicrophoneInput();

