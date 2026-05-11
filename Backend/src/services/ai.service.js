import "dotenv/config";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai";
import { HumanMessage, SystemMessage, AIMessage, tool, createAgent } from "langchain";
import * as z from "zod"
import { searchInternet } from "./internet.service.js"

const geminiModel = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY 
    ? new ChatGoogleGenerativeAI({
        model: "gemini-1.5-flash",
        apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY
    })
    : null;

const mistralModel = process.env.MISTRAL_API_KEY
    ? new ChatMistralAI({
        model: "mistral-small-latest",
        apiKey: process.env.MISTRAL_API_KEY
    })
    : null;

const searchInternetTool = tool(
    async (args) => {
        const query = typeof args === 'string' ? args : args.query;
        return await searchInternet({ query });
    },
    {
        name: "search_internet",
        description: "Search the internet for real-time information. Use this tool when you need up-to-date info or facts not in your training data.",
        schema: z.object({
            query: z.string().describe("The search query to search for on the internet")
        })
    }
)

const agent = createAgent({
    model: mistralModel || geminiModel,
    tools: [searchInternetTool],
})

export async function generateResponseStream(messages) {
    if (!mistralModel && !geminiModel) {
        throw new Error("No AI model available. Please check your API keys.");
    }
    const stream = await agent.streamEvents(
        {
            messages: messages.map(msg => {
                if (msg.role == "user") {
                    return new HumanMessage(msg.content)
                } else if (msg.role == "ai") {
                    return new AIMessage(msg.content)
                }
            })
        },
        { version: "v2" }
    );

    return stream;
}

export async function generateChatTitle(message) {
    const model = mistralModel || geminiModel;
    if (!model) {
        return "New Chat";
    }

    const response = await model.invoke([
        new SystemMessage(`
            You are a helpful assistant that generates concise and descriptive titles for chat conversations.
            
            User will provide you with the first message of a chat conversation, and you will generate a title that captures the essence of the conversation in 2-4 words. The title should be clear, relevant, and engaging, giving users a quick understanding of the chat's topic.    
        `),
        new HumanMessage(`
            Generate a title for a chat conversation based on the following first message:
            "${message}"
        `)
    ])

    return response.text;
}
