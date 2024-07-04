require('dotenv').config(); // Add this line to load .env file
const express = require('express');
const WebSocket = require('ws');
const { Pool } = require('pg');
const cluster = require('cluster');
const os = require('os');

// Database configuration
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

const numCPUs = os.cpus().length;

if (cluster.isMaster) {
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);
        cluster.fork();
    });
} else {
    const app = express();
    const port = process.env.PORT;

    const wss = new WebSocket.Server({ noServer: true });

    wss.on('connection', (ws) => {
        ws.on('message', (message) => {
            const data = JSON.parse(message);
            // console.log(data);
            const { latitude, longitude, deviceId } = data;

            const server_datetime = new Date().toISOString();

            // Insert data into PostgreSQL
            pool.query('INSERT INTO locations (latitude, longitude, device_id, server_datetime) VALUES ($1, $2, $3, $4)', [latitude, longitude, deviceId, server_datetime])
                .catch((err) => console.error('Error inserting data', err));

            // Broadcast data to all connected clients
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ latitude, longitude, deviceId, server_datetime }));
                }
            });
        });
    });

    const server = app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });

    server.on('upgrade', (request, socket, head) => {
        wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit('connection', ws, request);
        });
    });

    app.get('/', (req, res) => {
        res.sendFile(__dirname + '/index.html');
    });
}
