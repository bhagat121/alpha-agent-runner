"use client";
import { useState, useRef, useEffect } from "react";

export default function PromptComposer() {
  const [prompt, setPrompt] = useState("");
  const [tool, setTool] = useState("calculator");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleRun = async () => {
    setLoading(true);
    setResult("");

    const res = await fetch("http://localhost:4000/run", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt, tool }),
    });

    const reader = res.body?.getReader();
    const decoder = new TextDecoder("utf-8");

    if (!reader) {
      setResult("Error reading response");
      setLoading(false);
      return;
    }

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });

      // Parse SSE chunks (clean out "data: " etc.)
      const clean = chunk
        .split("\n")
        .filter((line) => line.startsWith("data: "))
        .map((line) => line.replace("data: ", "").trim())
        .join("");

      // Typing animation effect
      for (let char of clean) {
        await new Promise((r) => setTimeout(r, 15)); // Typing speed
        setResult((prev) => prev + char);
      }
    }

    setLoading(false);
  };

  // Auto-scroll to latest output
  useEffect(() => {
    if (resultRef.current) {
      resultRef.current.scrollTop = resultRef.current.scrollHeight;
    }
  }, [result]);

  return (
    <div className="max-w-2xl mx-auto mt-16 p-8 border border-gray-300 rounded-2xl shadow-lg space-y-6 bg-white">
      <h1 className="text-3xl font-bold text-center text-gray-800">
        Agent Runner
      </h1>

      <div className="space-y-2">
        <textarea
          rows={4}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type your prompt here..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
      </div>

      <div className="flex items-center justify-center gap-4">
        <button
          className={`px-6 py-2 rounded-full font-medium border ${
            tool === "calculator"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-800 border-gray-300"
          }`}
          onClick={() => setTool("calculator")}
        >
          Calculator
        </button>
        <button
          className={`px-6 py-2 rounded-full font-medium border ${
            tool === "web-search"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-800 border-gray-300"
          }`}
          onClick={() => setTool("web-search")}
        >
          Web Search
        </button>
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleRun}
          className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-600 transition-all duration-200"
          disabled={loading}
        >
          {loading ? "Running..." : "Run"}
        </button>
      </div>

      <div
        ref={resultRef}
        className="min-h-[150px] p-4 border rounded-xl overflow-y-auto whitespace-pre-wrap text-gray-800"
      >
        {loading && result === "" && (
          <p className="italic text-gray-500 animate-pulse">Thinking...</p>
        )}

        {!loading && result === "" && (
          <p className="italic text-gray-500">Output will come here...</p>
        )}

        {result && (
          <>
            <p className="font-semibold mb-2 text-lg">Output:</p>
            <p>{result}</p>
          </>
        )}
      </div>
    </div>
  );
}
