import { tavily as Tavily } from "@tavily/core";

let tavily;

export const searchInternet = async ({ query }) => {
    if (!tavily) {
        tavily = Tavily({ 
            apiKey: process.env.TAVILY_API_KEY,
        });
    }

    const results = await tavily.search(query, {
        maxResults: 5,
        searchDepth: "basic"
    })

    return JSON.stringify(results)
}