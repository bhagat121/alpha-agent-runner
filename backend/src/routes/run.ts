import express, { Request, Response } from "express";
import { z } from "zod";
import { calculate } from "../services/calculator";
import { webSearch } from "../services/webSearch";
import { streamFriendlyResponse } from "../llm";
import { pg, redis } from "../db";

const router = express.Router();

const RunInputSchema = z.object({
  prompt: z.string().max(500),
  tool: z.enum(["calculator", "web-search"]),
});

router.post("/", async (req: Request, res: Response): Promise<any> => {
  const parse = RunInputSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: "Invalid input" });

  const { prompt, tool } = parse.data;

  let rawResult = "";

  try {
    if (tool === "calculator") {
      rawResult = calculate(prompt);
    } else if (tool === "web-search") {
      rawResult = await webSearch(prompt);
    }

    let fullResponse = "";

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    await streamFriendlyResponse(tool, rawResult, res, (chunk: string) => {
      fullResponse += chunk;
    });

    res.end();

    // Save to DB after streaming
    try {
      await pg.query(
        `INSERT INTO runs (prompt, tool, raw_result, response) VALUES ($1, $2, $3, $4)`,
        [prompt, tool, rawResult, fullResponse]
      );
    } catch (err) {
      console.error("Error inserting to DB:", err);
    }

    // Cache last 10
    const userKey = "user:recentRuns"; // You can later enhance this with real user IDs
    await redis.lpush(
      userKey,
      JSON.stringify({ prompt, tool, streamFriendlyResponse })
    );
    await redis.ltrim(userKey, 0, 9);
    // Log the cached runs from Redis
    const cachedRuns = await redis.lrange(userKey, 0, 9);
    console.log("Cached Redis Runs:");
    cachedRuns.forEach((item, index) => {
      console.log(`#${index + 1}:`, JSON.parse(item));
    });
  } catch (error) {
    console.error("Error in /run:", error);
    res.write(`data: Something went wrong.\n\n`);
    res.end();
  }
});

export default router;
