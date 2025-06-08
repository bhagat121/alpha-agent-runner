Architecture Overview

Frontend
Tech Stack: React (Client Components), TailwindCSS

Function:

Lets users input prompts.

Select between calculator or web-search tools.

Submits prompt to backend and streams AI response.

Displays results in a smooth typing animation.

Backend
Tech Stack: Express.js + TypeScript

Services:

/run API receives prompt + tool

Processes prompt via calculator or SERP API

Converts the raw result to a chatbot-style response using Gemini API (streamed)

Saves the run in PostgreSQL: runs table

Stores last 10 runs in Redis cache

Key Design Decisions
Streaming Responses:

Enhances UX with real-time typing effect.

PostgreSQL Logging:

Persistent storage of prompt, tool, raw result, and LLM response.

Redis Caching:

Quickly access recent runs for a user (future personalization).

Modular Design:

Services like webSearch, calculate, streamFriendlyResponse are isolated for testability.

How to Run Locally

1. Clone the repo

git clone <repo link>
cd agent-runner

2. Setup .env

PORT=4000
DATABASE_URL=postgres://postgres:<your_password>@localhost:5432/agent_runner
GEMINI_API_KEY=your_google_gemini_api_key
SERP_API_KEY=your_serpapi_key

3. Start PostgreSQL & Redis (locally installed)
PostgreSQL should have a runs table:

CREATE TABLE IF NOT EXISTS runs (
  id SERIAL PRIMARY KEY,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  prompt TEXT,
  tool TEXT,
  raw_result TEXT,
  response TEXT
);

Redis should be running on default port (6379)

4. Install dependencies & start

# From backend/
npm install
npm run dev

# From frontend/
npm install
npm run dev

Folder Structure (simplified)

backend/
  ├── routes/
  │   └── run.ts
  ├── services/
  │   ├── calculator.ts
  │   ├── webSearch.ts
  ├── llm.ts
  ├── db.ts
  └── index.ts
frontend/
  └── app/
      └── PromptComposer.tsx

Future Ideas

User auth
View past runs
Additional tools (e.g., Wikipedia, WolframAlpha)
Conversation context (via memory)