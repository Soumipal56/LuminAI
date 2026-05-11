import "dotenv/config";
import { generateResponseStream } from "../src/services/ai.service.js";

async function testSearch() {
    try {
        console.log("Testing Search logic...");
        const messages = [{ role: "user", content: "Search the internet for the current stock price of Apple." }];
        const stream = await generateResponseStream(messages);
        
        for await (const event of stream) {
            console.log("Event Type:", event.event);
            if (event.event === "on_tool_start") {
                console.log("TOOL TRIGGERED:", event.name);
            }
            if (event.event === "on_chat_model_stream") {
                process.stdout.write(event.data.chunk.content || "");
            }
        }
        console.log("\nSearch test finished.");
    } catch (err) {
        console.error("Search Error:", err);
    }
}

testSearch();
