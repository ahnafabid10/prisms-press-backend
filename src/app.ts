import cookieParser from "cookie-parser";
import express,{ Application, Request, Response } from "express";
import cors from "cors";
import config from "./config";
import { userRoutes } from "./modules/users/user.route";
import { authRoutes } from "./modules/Auth/auth.route";



const app: Application = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors({
    origin: config.app_url,
    credentials: true
}))


app.get("/", async (req: Request, res: Response) => {
    res.send("Hello World!")
})

app.use("/api/users", userRoutes)
app.use("/api/auth", authRoutes)

export default app;