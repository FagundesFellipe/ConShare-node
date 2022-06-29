import User, { INewUser, IUpdateUser } from '../schemas/user'
import { BadRequest, ForbiddenError } from '../util/errors'
import { encrypt, decrypt } from '../util/cryptography'
import { validatorPassword } from '../util/util'
import { IUser } from '../schemas/user'

const findUserByLogin = async (username: string, password: string) => {
    const isUser = await findOneUsername(username)
    if (!isUser.validation) {
        throw new BadRequest(`Nome de usuário inválido`)
    } else {
        return await User.findOne({ username: isUser.objUser?.username, password: password }, { iv: 1, username: 1, level: 1, _id: 1 }).lean().exec()
    }
}

const getAllUsers = async () => {
    const users = await User.find({}, { password: 0, _id: 0, __v: 0 }).lean().exec()
    const usersDecrypted: IUser[] = []

    for (let i = 0; i < users.length; i++) {
        const userDecrypted = await decrypt(users[i])
        usersDecrypted.push(userDecrypted)
    }
    return usersDecrypted
}

const getUserById = async (userId: string) => {
    return await User.findById(userId).lean().exec()
}

const createUser = async (newUser: INewUser) => {
    const isValidPassword = await validatorPassword(newUser.password)
    const isNewUsername = await findOneUsername(newUser.username)

    if (!isValidPassword) {
        throw new BadRequest(`Senha com formato inválido. Verifique se a senha contém 8 caracter, pelo menos 1 letra maiúscula e minuscula e 1 símbolo`)
    } else if (isNewUsername.validation) {
        throw new BadRequest(`Usuário já cadastrado`)
    } else {
        Object.defineProperty(newUser, 'password', { enumerable: false });
        const userEncrypted = await encrypt(newUser)
        Object.defineProperty(newUser, 'password', { enumerable: true });
        userEncrypted.password = newUser.password
        const user = await User.create(userEncrypted)
        const removePass = { ...user.toObject(), password: 0 }
        return removePass
    }
}

const updateUser = async (userId: string, updatedValues: IUpdateUser) => {
    const user = await User.findById(userId).lean().exec()

    if (user?.username === 'admim' && updatedValues.username) {
        throw new ForbiddenError('Não é possivel atualizar o nome do usuário principal')
    }

    if (updatedValues.password === '') {
        delete updatedValues.password
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updatedValues).lean().exec()

    return { ...updatedUser, password: null }
}

const deleteUser = async (userId: string) => {
    const user = await User.findById(userId).lean().exec()

    if (user?.username === 'admim') {
        throw new ForbiddenError('Não é possivel deletar o usuário principal')
    }

    const deletedUser = await User.findByIdAndRemove(userId).lean().exec()

    return deletedUser
}

const findOneUsername = async (usernameAux: string) => {
    let isUser = false, infosUser
    type User = { username: string }
    const users = await User.find({}, { iv: 1, username: 1, _id: 0 }).lean().exec()

    for (let element of users) {
        const { username } = await decrypt(element)
        username === usernameAux ? isUser = true : isUser = false
        if (isUser) {
            let infos: User = {
                username: element.username
            }
            infosUser = infos
            break;
        }
    }
    return { validation: isUser, objUser: infosUser }
}

export default { getAllUsers, getUserById, createUser, findUserByLogin, updateUser, deleteUser, findOneUsername }
