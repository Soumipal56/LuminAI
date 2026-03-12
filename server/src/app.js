import express from "express"
import cookieParser from "cookie-parser"
import authRouter from "./routes/auth.routes.js"

const app = express()

// built-in middleware
app.use(express.json())

// third-party middleware
app.use(cookieParser())

// routes
app.use("/api/auth", authRouter)

export default app