import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import { sendMessage, getMessages } from "../controllers/message"
const messageRouter = Router()

messageRouter.use(authMiddleware)

messageRouter.post('/send', sendMessage)
messageRouter.get('/conversation/:conversationId', getMessages)

export default messageRouter