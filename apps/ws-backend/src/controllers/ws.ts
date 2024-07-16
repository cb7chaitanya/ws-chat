import prisma from "../db";
import { WebSocket } from "ws";
import jwt, { JwtPayload, Secret } from 'jsonwebtoken'
import conf from '../conf'
interface Clients {
    [key: number]: WebSocket
}

let clients: Clients = {}

const handleConnection = (ws: WebSocket, token: string): void => {
    let userId: number

    try {
        const payload = jwt.verify(token, conf.JWT_SECRET as Secret) as JwtPayload
        userId = payload._id
    } catch (error) {
        return ws.close()
    }
    clients[userId] = ws

    ws.on('message', async(message: string) => {
        const parsedMessage = JSON.parse(message)
        const { type, payload } = parsedMessage

        switch(type) {
            case 'message':
                const {from, to, message} = payload
                let conversation = await prisma.conversation.findFirst({
                    where: {
                        participants: {
                            every : {
                                id: {
                                    in: [from, to]
                                }
                            }
                        }
                    }
                })

                if(!conversation){
                    conversation = await prisma.conversation.create({
                        data: {
                            participants: {
                                connect: [{id: from}, {id: to}]
                            }
                        }
                    })
                }

                const newMessage = await prisma.message.create({
                    data: {
                        conversationId: conversation.id,
                        fromId: from,
                        message
                    }
                })

                const targetClient = clients[to]
                if(targetClient){
                    targetClient.send(JSON.stringify({
                        type: 'message',
                        payload: {from, message}
                    }))
                }

                break;

                default:
                    break;
        }
    })

    ws.on('close', () => {
        delete clients[userId]
    })
}

export default handleConnection