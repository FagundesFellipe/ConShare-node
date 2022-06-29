import { Router } from "express";
import jwt, { Secret } from 'jsonwebtoken'
import UserModel from '../models/user'
import { decrypt } from "../util/cryptography";
import { BadRequest } from "../util/errors";

const router = Router()

router.post('/login', async (req, res, next) => {
    try {
        const user = await UserModel.findUserByLogin(req.body.username, req.body.password)
        if (user) {
            const { _id } = user
            Object.defineProperty(user, '_id', { enumerable: false });
            const userDecrypted = await decrypt(user)
            const { username, level } = userDecrypted
            const token = jwt.sign({ _id, username, level }, process.env.TOKEN as Secret, {
                expiresIn: 1 * 60 * 60
            })
            res.json({ status: 'OK', msg: 'Usuário logado com sucesso', token: token })
        } else {
            throw new BadRequest(`Senha incorreta.`)
        }
    } catch (error) {
        next(error)
    }
})

router.post('/logout', async (req, res, next) => {
    try {

    } catch (error) {

    }
})

export default router
