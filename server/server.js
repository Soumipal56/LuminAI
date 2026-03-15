import "dotenv/config";
import app from "./src/app.js";
import connectDB from "./src/config/database.js";
import { testAi } from "./src/services/ai.service.js";

const PORT = process.env.PORT || 8000;

testAi()

connectDB()

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});