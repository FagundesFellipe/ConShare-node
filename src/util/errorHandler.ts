import e, { Request, Response, NextFunction } from 'express'
import { Error } from 'mongoose'
import { HttpError } from './errors'
import Logger from './logger'

const handle = (err: any, req: Request, res: Response, next: NextFunction) => {
    Logger.error(err)
    if (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: err.message })
        }

        if (err instanceof Error.ValidationError) {
            let message = 'Falha na validação'

            if (err.errors) {
                const firstObj = Object.entries<{ message: string }>(err.errors)[0][1]
                message = firstObj.message
            }

            return res.status(400).json({ message: message })
        }

        if (err instanceof HttpError) {
            return res.status(err.statusCode).send({ message: err.message })
        }

        if (err.message) {
            return res.status(400).json({ message: err.message })
        }
    }

    res.status(500).json({ message: 'Erro interno do servidor.' })
}

export default { handle }
