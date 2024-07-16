import prisma from '../db'
import { Response, Request } from 'express'

declare global {
    namespace Express {
        interface Request {
            userId: number
        }
    }
}

const sendMessage = async (req: Request, res: Response): Promise<void> => {
    const { to, message } = req.body
    const from = req.userId
    try{
        let conversation = await prisma.conversation.findFirst({
            where: {
                participants: {
                    every: {
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

        res.send(newMessage)
    } catch (error) { 
        res.status(400).json({ msg: "Error while sending message" })
    }
}

const getMessages = async (req: Request, res: Response): Promise<void> => {
    const { conversationId } = req.params
    const messages = await prisma.message.findMany({
        where: {
            conversationId: parseInt(conversationId)
        }
    })
    res.send(messages)
}

export { sendMessage, getMessages }