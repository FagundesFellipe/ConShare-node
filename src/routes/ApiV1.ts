import { Router } from "express";

import AuthController from '../controller/auth'
import UserController from '../controller/user'

const router = Router()

router.use('/auth', AuthController)
router.use('/user', UserController)

export default router
