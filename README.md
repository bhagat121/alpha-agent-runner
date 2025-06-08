# Alpha Agent Runner

An interactive tool that lets users enter a prompt and choose between a calculator or web-search agent to receive chatbot-style responses in real time.

---

## Architecture Overview

### Frontend Tech Stack:

* Netx.js (Client Components)
* TailwindCSS

#### Functionality:

* Users' input prompts
* Select between **calculator** or **web-search** tools
* Submits prompt to backend and streams AI response
* Displays results in a smooth typing animation

### Backend Tech Stack:

* Express.js + TypeScript

#### Services:

* `/run` API receives prompt + tool
* Processes prompt via **calculator** or **SERP API**
* Uses **Gemini API** to generate a chatbot-style response (streamed)
* Saves the run in **PostgreSQL** (`runs` table)
* Stores last 10 runs in **Redis** cache

---

## Key Design Decisions

### Streaming Responses:

* Enhances UX with real-time typing effect

### PostgreSQL Logging:

* Persistent storage of:

  * prompt
  * tool
  * raw result
  * LLM response

### Redis Caching:

* Fast access to recent runs (future personalization)

### Modular Design:

* Services like `webSearch`, `calculate`, `streamFriendlyResponse` are isolated and testable

---

## How to Run Locally

### 1. Clone the repo

```bash
git clone <your-repo-url>
cd agent-runner
```

### 2. Setup `.env`

```
PORT=4000
DATABASE_URL=postgres://postgres:<your_password>@localhost:5432/agent_runner
GEMINI_API_KEY=<your_gemini_api_key>
SERP_API_KEY=<your_serp_api_key>
```

### 3. Start PostgreSQL & Redis

* PostgreSQL must have the following table:

```sql
CREATE TABLE IF NOT EXISTS runs (
  id SERIAL PRIMARY KEY,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  prompt TEXT,
  tool TEXT,
  raw_result TEXT,
  response TEXT
);
```

* Redis should be running on default port: **6379**

### 4. Install dependencies and start

#### Backend

```bash
cd backend
npm install
npm run dev
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Folder Structure (Simplified)

```
backend/
├── routes/
│   └── run.ts
├── services/
│   ├── calculator.ts
│   └── webSearch.ts
├── llm.ts
├── db.ts
└── index.ts

frontend/
└── app/
    └── PromptComposer.tsx
```

---

## Future Ideas

* User authentication
* View past runs
* Add more tools (Wikipedia, WolframAlpha)
* Add conversation context via memory
