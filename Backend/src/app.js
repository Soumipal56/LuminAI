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
  origin: function (origin, callback) {
    const allowed = [
      process.env.FRONTEND_URL,
      "http://localhost:5173",
      "http://localhost:5174"
    ].filter(Boolean); // removes undefined
    if (!origin || allowed.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

// Health check route
app.get("/health", (req, res) => {
    res.json({ message: "Health check successful" });
});

app.use(express.static(path.join(__dirname, "../public")));

app.use(`${ROUTES.prefix}/auth`, authRouter);
app.use(`${ROUTES.prefix}/chats`, chatRouter);
app.use(`${ROUTES.prefix}/shares`, shareRouter);

// SPA fallback - MUST be last
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../public", "index.html"));
});

export default app;
