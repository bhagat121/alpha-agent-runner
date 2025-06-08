"use client"
import { useState } from "react";
import PromptInput from "../app/components/PromptInput";
import ToolSelector from "../app/components/ToolSelector";
import RunButton from "../app/components/RunButton";
import ResponseBox from "../app/components/ResponseBox";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [tool, setTool] = useState("calculator");
  const [response, setResponse] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-xl space-y-4 bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-2xl font-semibold">Agent Runner</h1>
        <PromptInput />
        {/* <ToolSelector value={tool} onChange={setTool} />
        <RunButton prompt={prompt} tool={tool} setResponse={setResponse} />
        <ResponseBox response={response} /> */}
      </div>
    </div>
  );
}
