import prisma from '../db'
import { Response } from 'express'
import { request } from '../interfaces/extends'

const sendMessage = async (req: request, res: Response): Promise<void> => {
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