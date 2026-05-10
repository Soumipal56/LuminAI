import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js"
import chatRouter from "./routes/chat.routes.js"
import shareRouter from "./routes/share.routes.js"
import ROUTES from "./config/routes.config.js"
import cors from "cors"
import morgan from "morgan"
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(cors({
    origin: [process.env.FRONTEND_URL, "http://localhost:5173", "http://localhost:5174"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
}))

// Health check route
app.get(ROUTES.health, (req, res) => {
    res.json({ message: "Health check successful" });
});

app.use("/api/auth", authRouter);
app.use("/api/chats", chatRouter);
app.use("/api/shares", shareRouter);

app.use(express.static(path.join(__dirname, "../public")));

app.get("/{*path}", (req, res) => {
    res.sendFile(path.join(__dirname, "../public", "index.html"));
});

export default app;
