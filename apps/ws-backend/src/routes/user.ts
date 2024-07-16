import { Router } from "express";
import { register, login, logout } from '../controllers/user'
const userRouter = Router()

userRouter.post('/register', register)
userRouter.post('/login', login)
userRouter.post('/logout', logout)

export default userRouter