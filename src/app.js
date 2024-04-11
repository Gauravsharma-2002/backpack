import express from "express"
import cors from "cors"

const app = express();

app.use(cors({
    orgin:process.env.CORS_ORIGIN,
    credentials:true,
    
}))

export {app};