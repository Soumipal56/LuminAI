import "dotenv/config";
import { generateResponseStream } from "../src/services/ai.service.js";

async function testStreaming() {
    try {
        console.log("Testing Streaming logic...");
        console.log("MISTRAL_API_KEY present:", !!process.env.MISTRAL_API_KEY);
        const messages = [{ role: "user", content: "What is 2+2?" }];
        const stream = await generateResponseStream(messages);
        
        let finalResponse = "";
        for await (const event of stream) {
            console.log("Event Type:", event.event);
            if (event.event === "on_chat_model_stream") {
                const chunk = event.data.chunk;
                if (chunk && typeof chunk.content === 'string') {
                    finalResponse += chunk.content;
                    console.log("Current Response:", finalResponse);
                }
            } else if (event.event === "on_tool_start") {
                console.log("Tool Started:", event.name);
            }
        }
        console.log("Final Response:", finalResponse);
        if (!finalResponse) {
            console.error("ERROR: Final response is empty!");
        }
    } catch (err) {
        console.error("Streaming Error:", err);
    }
}

testStreaming();
