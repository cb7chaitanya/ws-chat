import {Router} from 'express'
import userRouter from './user'
import messageRouter from './message'
import { authMiddleware } from '../middleware/auth'
const mainRouter = Router()

mainRouter.use('/user', userRouter)
mainRouter.use('/message', authMiddleware, messageRouter)

export default mainRouter