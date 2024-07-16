import {Router} from 'express'
import userRouter from './user'
import messageRouter from './message'
const mainRouter = Router()

mainRouter.use('/user', userRouter)
mainRouter.use('/message', messageRouter)

export default mainRouter