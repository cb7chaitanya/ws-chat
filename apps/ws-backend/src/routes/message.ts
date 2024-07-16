import { Router } from "express";
const messageRouter = Router()

messageRouter.post('/send')
messageRouter.get('/conversation/:conversationId')

export default messageRouter