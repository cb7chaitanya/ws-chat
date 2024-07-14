import { Router } from "express";
import { register, login, logout } from '../controllers/user'
const userRouter = Router()

userRouter.post('/register')
userRouter.post('/login')
userRouter.post('/logout')

export default userRouter