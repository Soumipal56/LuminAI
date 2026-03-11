import express from "express"
import cookieParser from "cookie-parser"

const app = express()

// built-in middleware
app.use(express.json())

// third-party middleware
app.use(cookieParser())

export default app