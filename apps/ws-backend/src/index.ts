import WebSocket, { WebSocketServer } from "ws";
import express from "express";
import mainRouter from './routes/index'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express();
app.use(express.json())
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use(cookieParser())

mainRouter.use('/api/v1', mainRouter)

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
