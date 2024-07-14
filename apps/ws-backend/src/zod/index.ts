import zod from 'zod'

const signupSchema = zod.object({
    username: zod.string().min(6).max(24),
    password: zod.string().min(6).max(18),
    email: zod.string().email()
})

const signinSchema = zod.object({
    username: zod.string().min(6).max(24),
    password: zod.string().min(6).max(18)
})

export { signupSchema, signinSchema }