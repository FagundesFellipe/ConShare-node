import { Request, Response, NextFunction } from "express";
import JWT, { Secret } from 'jsonwebtoken'
import UserModel from '../models/user'

const isValidToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['token_access'] as string

    if (!token) {
        return res.status(400).json({ auth: false, messsage: 'Token inexistente' })
    }

    JWT.verify(token, process.env.TOKEN as Secret, async (err, decoded) => {
        if (err) {
            if (err.message == 'jwt expired') {
                return res.status(401).json({ auth: false, message: 'O Token expirou' })
            }

            return res.status(500).json({ auth: false, message: err.message })
        }

        const decode = decoded as { _id: string }

        if (decode && decode._id) {
            const user = await UserModel.getUserById(decode._id)

            if (!user) {
                return res.status(401).json({ auth: false, message: 'Usuário não existe' })
            }

            //res.user = user

            return next()
        }

        return res.status(500).json({ auth: false, message: 'Falha na autenticação do usuário' })
    })

}

export default isValidToken

