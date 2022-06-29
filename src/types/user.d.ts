declare global {
    namespace Express {
        interface Response {
            user?: {
                _id?: string
                username: string
                password: string
                level: string
                name: string
            }
        }
    }
}

export { }
