import { Router } from "express";
import UserModel from '../models/user'

const router = Router()

router.get('', async (req, res, next) => {
    try {
        const users = await UserModel.getAllUsers()
        res.json(users)
    } catch (error) {
        next(error)
    }
})

router.post('', async (req, res, next) => {
    try {
        await UserModel.createUser(req.body)
        res.json({ status: 'OK', msg: `Novo usuário criado com sucesso` })
    } catch (error) {
        next(error)
    }
})

router.put('/:id', async (req, res, next) => {
    try {
        const updateduser = await UserModel.updateUser(req.params.id, req.body)
        res.json(updateduser)
    } catch (error) {
        next(error)
    }
})

router.delete('/:id', async (req, res, next) => {
    try {
        const deletedUser = await UserModel.deleteUser(req.params.id)
        res.json(deletedUser)
    } catch (error) {
        next(error)
    }
})
export default router
