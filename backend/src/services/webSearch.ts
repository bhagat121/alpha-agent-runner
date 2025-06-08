import axios from "axios";
import dotenv from "dotenv";
dotenv.config();


const SERP_API_KEY = process.env.SERP_API_KEY;


export async function webSearch(query: string) {
  try {
    const response = await axios.get("https://serpapi.com/search.json", {
      params: {
        q: query,
        api_key: SERP_API_KEY,
      },
    });

    const topResult = response.data.organic_results?.[0];

    if (topResult) {
      return `Top result: ${topResult.title}\n${topResult.link}`;
    } else {
      return "No results found.";
    }
  } catch (error) {
    console.error("Web search error:", error);
    return "Search failed.";
  }
}
