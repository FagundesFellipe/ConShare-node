import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import http from 'http'

import ApiV1Router from './src/routes/ApiV1'
import ErrorHandler from './src/util/errorHandler'
import logger from './src/util/logger'

dotenv.config()

mongoose.connect('mongodb://localhost:27017/conShare')
    .then(() => {
        logger.log('conShare Database is connect')
        createDefaultUser()
    })

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/v1', ApiV1Router)
app.use(ErrorHandler.handle)

const port = process.env.PORT || 8080

http.createServer(app).listen(port, () => {
    logger.log(`Http server started. Port ${port} `)
})

const createDefaultUser = async () => {
    try {
        const User = require('./src/models/user').default
        const user = await User.findOneUsername('admim')

        if (!user) {
            const infosUser = {
                username: 'admim',
                password: 'Master@123',
                name: 'admin',
                level: 'admim',
                type: 'administrador'
            }

            await User.createUser(infosUser)
        }
    } catch (error) {
        logger.error(error)
    }
}
