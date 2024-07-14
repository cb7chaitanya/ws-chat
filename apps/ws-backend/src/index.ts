import WebSocket, { WebSocketServer } from "ws";
import express from "express";

const app = express();
const server = app.listen(8080)
const wss = new WebSocketServer({ server });

wss.on('connection', function connection(ws) {
    ws.on('error', console.error);
    ws.on('open', function open() {
        console.log('connected')
    })
    ws.on('message', function message(data, isBinary) {
        wss.clients.forEach(function each(client){
            if (client.readyState === WebSocket.OPEN) {
                client.send(data, { binary: isBinary });
            }
        })
    })
})
