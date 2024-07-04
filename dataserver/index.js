const WebSocket = require('ws');

// WebSocket server URL
const wsServerUrl = 'ws://localhost:3000';

// Function to generate random latitude and longitude
function generateRandomCoordinates() {

    const minLat = 27.65, maxLat = 27.75;
    const minLon = 85.25, maxLon = 85.35;

    const latitude = Math.random() * (maxLat - minLat) + minLat;
    const longitude = Math.random() * (maxLon - minLon) + minLon;

    return { latitude, longitude };
}

// Function to generate random device ID
function generateRandomDeviceId() {
    const devices = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const randomIndex = Math.floor(Math.random() * devices.length);
    return devices[randomIndex];
}

// Function to send random data to WebSocket server
function sendDataOverWebSocket(ws) {
    const devices = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    devices.forEach(deviceId => {
        const { latitude, longitude } = generateRandomCoordinates();
        const data = { latitude, longitude, deviceId };
        ws.send(JSON.stringify(data));
    });
}

// Function to connect to WebSocket server
function connectWebSocket() {
    // Connect to WebSocket server
    const ws = new WebSocket(wsServerUrl);

    ws.on('open', function open() {
        console.log('Connected to WebSocket server');

        // Send random data every 5 seconds
        setInterval(() => {
            sendDataOverWebSocket(ws);
        }, 5000);
    });

    ws.on('close', function close() {
        console.log('Disconnected from WebSocket server');
        setTimeout(connectWebSocket, 5000); // Attempt to reconnect after 5 seconds

    });

    ws.on('error', function error(err) {
        console.error('WebSocket error:', err);
    });
}

// Initial connection
connectWebSocket();