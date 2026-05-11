import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai";
import { HumanMessage, SystemMessage, AIMessage, tool, createAgent } from "langchain";
import * as z from "zod"
import { searchInternet } from "./internet.service.js"

const geminiModel = new ChatGoogleGenerativeAI({
    model: "gemini-1.5-flash",
    apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY
});

const mistralModel = new ChatMistralAI({
    model: "mistral-small-latest",
    apiKey: process.env.MISTRAL_API_KEY
});

const searchInternetTool = tool(
    searchInternet,
    {
        name: "searchInternet",
        description: "Use this tool when you need to search the internet for latest information. This tool is not to be used to answer questions which can be answered without searching the internet. If the user asks for weather report, use this tool. If the user asks about a topic, use this tool. If the user asks something that requires searching the internet, use this tool. If the user asks something that can be answered without searching the internet, do not use this tool.",
        inputSchema: z.object({
            query: z.string().describe("The query to search the internet for."),
        }),
    }
)

const agent = createAgent({
    model: mistralModel,
    tools: [searchInternetTool],
})

export async function generateResponseStream(messages) {
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

    const response = await mistralModel.invoke([
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
