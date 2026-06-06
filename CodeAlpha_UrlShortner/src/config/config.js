import dotenv from 'dotenv';
dotenv.config()
const config={
    PORT:process.env.PORT,
    MONGO_URI:process.env.MONGO_URI,
    BASE_URL:process.env.BASE_URL
}

export default config;
