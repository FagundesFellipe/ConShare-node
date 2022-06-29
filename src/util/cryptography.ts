import dotenv from 'dotenv'
import crypto from 'crypto'

dotenv.config()
const algorithm = 'aes-256-cbc'
const secrectKey = `${process.env.SECRECTKEY}`

const encrypt = async (anyObj: any) => {
    const iv = crypto.randomBytes(16)
    const obj = Object()
    obj.iv = iv.toString('hex')

    const keysObj: string[] = Object.keys(anyObj)
    const valuesObj: string[] = Object.values(anyObj)

    for (let i = 0; i < keysObj.length; i++) {
        const cipher = crypto.createCipheriv(algorithm, secrectKey, iv)
        const encrypted = Buffer.concat([cipher.update(valuesObj[i]), cipher.final()])
        obj[keysObj[i]] = encrypted.toString('hex')
    }

    return obj
}

const decrypt = async (hashObj: any) => {
    const obj = Object()
    const { iv } = hashObj
    let ivAux = Buffer.from(iv, 'hex')
    delete hashObj.iv

    const keys: string[] = Object.keys(hashObj)
    const values: string[] = Object.values(hashObj)

    for (let i = 0; i < keys.length; i++) {
        const decipher = crypto.createDecipheriv(algorithm, secrectKey, ivAux)
        const decrypted = Buffer.concat([decipher.update(values[i], 'hex'), decipher.final()])
        obj[keys[i]] = decrypted.toString()
    }

    return obj
}

export {
    encrypt,
    decrypt
}
