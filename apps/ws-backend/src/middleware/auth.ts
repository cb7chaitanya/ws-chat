import  conf from '../conf'
import jwt, { JwtPayload, Secret } from 'jsonwebtoken'
import { Response, NextFunction, Request } from 'express'

interface authMiddleware {
    (req: Request, res: Response, next: NextFunction): void
}

export const authMiddleware: any = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies['auth-token']
    if(!token) {
        return res.status(401).json({
            msg: "Unauthorized user, missing headers"
        })
    }
    try {
        const payload = jwt.verify(token, conf.JWT_SECRET as Secret) as JwtPayload
        req.userId = payload._id
        next()
    } catch (error) {
        return res.status(401).json({
            msg: "Unauthorized User, incorrect credentials or token expired"
        })   
    }
}

