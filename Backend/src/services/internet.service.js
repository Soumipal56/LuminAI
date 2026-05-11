import "dotenv/config";
import { tavily as Tavily } from "@tavily/core";

let tavily;

export const searchInternet = async ({ query }) => {
    if (!tavily) {
        tavily = Tavily({ 
            apiKey: process.env.TAVILY_API_KEY,
        });
    }

    console.log("Internet Search Query:", query);
    try {
        const results = await tavily.search(query, {
            maxResults: 5,
            searchDepth: "basic"
        })
        console.log("Internet Search Success. Results count:", results.results?.length);
        return JSON.stringify(results)
    } catch (err) {
        console.error("Internet Search Error:", err);
        return JSON.stringify({ error: "Failed to search internet", details: err.message });
    }
}