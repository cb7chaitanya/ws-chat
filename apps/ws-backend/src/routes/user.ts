import { Router } from "express";
import { register, login, logout } from '../controllers/user'
import { authMiddleware } from "../middleware/auth";
const userRouter = Router()

userRouter.post('/register', register)
userRouter.post('/login', login)
userRouter.post('/logout', authMiddleware, logout)

export default userRouter