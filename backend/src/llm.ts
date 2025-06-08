import { GoogleGenerativeAI } from "@google/generative-ai";
import { Response } from "express";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function streamFriendlyResponse(
  tool: string,
  rawResult: string,
  res: Response,
  onChunk?: (chunk: string) => void // Optional callback
) {
  const prompt =
    tool === "calculator"
      ? `Convert this result into a short, friendly message a chatbot would say to a user. Ensure proper spacing and punctuation. Only return the response: "${rawResult}"`
      : `The web search found: "${rawResult}". Summarize it into a helpful one-liner. Use proper spacing and punctuation. Return only the friendly response.`;

  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const result = await model.generateContentStream(prompt);

  for await (const chunk of result.stream) {
    const text = chunk.text();
    if (text) {
      res.write(`data: ${text}\n\n`);
      if (onChunk) onChunk(text); // Feed the chunk to caller
    }
  }

  res.end(); // Finalize streaming
}
