import jwt from 'jsonwebtoken'
import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import prisma from '../db'
import { signupSchema, signinSchema } from '../zod'
import conf from '../conf.ts'

const register = async (req: Request, res: Response) => {
    const { username, password, email } = req.body
    try {
        const { success } = signupSchema.safeParse({username, password, email})
        if(!success){
            return res.status(400).json({
                msg: "Incorrect credential format"
            })
        }
        const isExisting = await prisma.user.findUnique({
            where: {
                email: email
            }
        })
        if(isExisting){
            return res.status(409).json({
                msg: "User already exists"
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword
            }
        })
        const token = jwt.sign({ id: user.id }, conf.JWT_SECRET)
        res.cookie('auth-token', token)
        return res.status(201).json({
            msg: "User created successfully"
        })
    } catch (error) {
        return res.status(500).json({
            msg: "Internal server error"
        })
    }
}

const login = async (req: Request, res: Response) => {
    const { username, password } = req.body
    try {
        const {success} = signinSchema.safeParse({username, password})
        if(!success){
            return res.status(400).json({
                msg: "Incorrect credential format"
            })
        }
        const isExisting = await prisma.user.findUnique({
            where: {
                username: username
            }
        })
        if(!isExisting){
            return res.status(404).json({
                msg: "User not found"
            })
        }
        const isMatch = await bcrypt.compare(password, isExisting.password)
        if(!isMatch){
            return res.status(401).json({
                msg: "Incorrect password"
            })
        }
        const token = jwt.sign({ id: isExisting.id }, conf.JWT_SECRET)
        res.cookie('auth-token', token)
        return res.status(200).json({
            msg: "User logged in successfully"
        })
    } catch (error) {
        return res.status(500).json({
            msg: "Internal server error"
        })   
    }
}
