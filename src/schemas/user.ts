import { Schema, model, Document } from 'mongoose'
import crypto from 'crypto'

export interface IUser {
    iv: string
    username: string
    password: string
    level: string,
    name: string
    type?: string
}

export interface INewUser {
    iv: string
    username: string
    password: string
    level: string,
    name?: string
    type?: string
}

export interface IUpdateUser {
    iv: string
    username?: string
    password?: string
    level?: string,
    name?: string
    type?: string
}
interface IDocUser extends IUser, Document { }

const UserSchema = new Schema({
    username: {
        type: String,
        trim: true,
        required: [true, 'Campo usuário é requerido'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'O campo senha é requerido'],
        trim: true,
        set: (val: string) => {
            if (val.length < 4) {
                return val
            }
            const hash = crypto.createHash('sha512')
            hash.update(val)
            return hash.digest('hex')
        }
    },
    level: {
        type: String,
    },
    name: {
        type: String,
        trim: true,
        required: [true, 'O campo nome é requerido'],
    },
    type: {
        type: String,
    },
    iv: {
        type: String
    },
})

const User = model<IDocUser>('User', UserSchema)
export default User
