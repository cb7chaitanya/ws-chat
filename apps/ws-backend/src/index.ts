import WebSocket, { WebSocketServer } from "ws";
import express, { Request } from "express";
import mainRouter from './routes/index'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import handleConnection from './controllers/ws'
import { createServer } from 'http'

//Initiating server
const app = express();
const server = createServer(app)

app.use(express.json()) //Setting Body Parser for the app
app.use(cookieParser()) //Setting Cookie Parser for the app
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
})) //Setting CORS for the app and whitelisting the app


mainRouter.use('/api/v1', mainRouter) //Setting main Router for the app

const wss = new WebSocketServer({ server }); //Creating new web socket server

wss.on('connection', (ws: WebSocket, req: Request) => {
    const token = req.cookies['auth-token']

    if(token){
        handleConnection(ws, token)
    } else {
        ws.close()
    }
}) //Setting connection handler


server.listen(8080, () => {
    console.log('Listening on port 8080')
}) //Starting server