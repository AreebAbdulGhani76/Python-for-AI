# Xander AI Assistant — Modern Next.js Chat Interface

A production-grade, ChatGPT/Claude-inspired chat interface built for the **Xander Restaurant AI Agent**, powered by **LangGraph and FastAPI**.

---

## 🌟 Key Features

- **Modern Architecture**: Built with Next.js (App Router, Turbopack, React 19), TypeScript, and Tailwind CSS.
- **Craft & Taste Aesthetic**: Follows the `Leonxlnx/taste-skill` and `unslop` anti-slop guidelines — quiet graphite neutrals, subtle warm amber bistro accent, clean 4px grid spacing, and no generic neon/emoji AI clutter.
- **FastAPI & LangGraph Integration**:
  - Direct communication with `POST /ai/chat` (`query`, `session_id`) and `GET /ai/history?session_id=...`.
  - Zero-CORS Next.js server proxy handlers (`/api/chat`, `/api/history`, `/api/health`).
  - Graceful timeout handling, offline detection, and real-time backend health badge.
- **Agent Execution Transparency**:
  - Displays real LangGraph `ToolNode` execution steps (`role: "tool"`) as collapsible tool activity cards with structured data inspection.
  - Active thinking and reasoning state with elapsed timer and pulsing animation.
- **Full Conversation Management**:
  - Multi-session history saved locally and synced with backend SQLite database.
  - Categorized sidebar: *Today*, *Previous 7 Days*, *Older*.
  - Auto-generated conversation titles from first messages.
  - One-click copy for Session IDs.
- **Rich Markdown & Code Rendering**:
  - GitHub-flavored markdown (GFM) support via `react-markdown`.
  - Beautifully styled restaurant menu tables.
  - Code blocks with syntax formatting and one-click copy button with visual feedback.
  - Lists, blockquotes, and inline code formatting.
- **Refined Composer**:
  - Auto-growing multiline textarea.
  - Enter to send, `Shift + Enter` for new line.
  - Keyboard shortcut `Ctrl + K` / `Cmd + K` to start a new chat.
- **Theme Support**:
  - Dark and Light themes with persistent preference storage and smooth transitions.
- **Fully Responsive**:
  - Optimized for desktop, tablet, and mobile with slide-over drawer sidebar.

---

## 🚀 Getting Started

### 1. Ensure the FastAPI Backend is Running

In your backend directory (`enterprise_agnt`):
```bash
# Verify the parent Python-for-AI/.env has OPEN_ROUTER_KEY
uv sync
uv run fastapi dev --host 127.0.0.1 --port 8000
```
Backend will be live at `http://127.0.0.1:8000`.

### 2. Configure Environment Variables

The frontend includes `.env.local` configured by default:
```env
BACKEND_URL=http://127.0.0.1:8000
NEXT_PUBLIC_BACKEND_URL=http://127.0.0.1:8000
# Required only when the backend auth key is configured.
BACKEND_API_KEY=your_backend_auth_key
```

`BACKEND_API_KEY` is used only by the Next.js server proxy and is never sent to the browser. Keep it in the ignored `.env.local` file.

### 3. Install Dependencies & Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```text
frontend/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── chat/route.ts      # Server proxy to POST /ai/chat
│   │   │   ├── history/route.ts   # Server proxy to GET /ai/history
│   │   │   └── health/route.ts    # Healthcheck to GET /
│   │   ├── globals.css            # Custom CSS & theme variables
│   │   ├── layout.tsx             # Root layout with ThemeProvider & fonts
│   │   └── page.tsx               # Main chat view
│   ├── components/
│   │   ├── chat/
│   │   │   ├── ChatArea.tsx       # Primary chat orchestration & scroll management
│   │   │   ├── ChatHeader.tsx     # Session title, session ID badge, backend health pill
│   │   │   ├── MarkdownContent.tsx# Markdown renderer with code copy & tables
│   │   │   ├── MessageComposer.tsx# Multiline auto-resizing input with shortcuts
│   │   │   ├── MessageItem.tsx    # Message bubbles (User, AI, LangGraph Tool)
│   │   │   ├── ThinkingIndicator.tsx # Pulsing thinking state with timer
│   │   │   └── WelcomeScreen.tsx  # Claude-inspired restaurant prompt starters
│   │   └── sidebar/
│   │       └── Sidebar.tsx        # Session drawer, search, delete, theme switch
│   ├── context/
│   │       └── ThemeContext.tsx   # React context for Dark/Light mode
│   ├── lib/
│   │   ├── api.ts                 # Typed API client with error handling
│   │   └── storage.ts             # Session management & localStorage helpers
│   └── types/
│       └── chat.ts                # TypeScript interfaces matching FastAPI schemas
├── .env.local                     # Environment variables
├── next.config.ts                 # Next.js configuration
├── package.json
└── tsconfig.json
```
