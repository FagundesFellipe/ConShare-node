import passwordValidator from 'password-validator'

export function waitForSeconds(sec: number) {
    return new Promise(resolve => setTimeout(resolve, sec * 1000))
}

export async function validatorPassword(password: string) {
    const schema = new passwordValidator()
    schema
        .is().min(8, 'A senha deve ter um comprimento mínimo de 8 caracteres')
        .has().uppercase(1, 'A senha deve ter no mínimo 1 letra maiúscula')
        .has().lowercase(1, 'A senha deve ter no mínimo 1 letra minúscula')
        .has().symbols(1, 'A senha deve ter no mínimo 1 símbolo')

    const isValidPassword = schema.validate(password)

    return isValidPassword
}

