import * as dotenv from 'dotenv'
dotenv.config()

const conf = {
    JWT_SECRET: process.env.JWT_SECRET,   
}

export default conf