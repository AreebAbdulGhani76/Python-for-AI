import os
from secrets import compare_digest
from time import perf_counter

from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

load_dotenv()

from core.database.sqlite import init_database
from modules.Ai_Agent.router import ai_agent_router

init_database()

app = FastAPI(
    title="Xander Restaurant API",
    description="AI-powered Restaurant Customer Support",
    version="1.0.0",
)

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5500",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


@app.middleware("http")
async def request_middleware(request: Request, call_next):
    """Optionally authenticate API calls and report request duration."""
    start_time = perf_counter()
    api_key = os.getenv("AUTHENTICATED_KEY") or os.getenv("AUNTHENTICATED_KEY")
    public_paths = {"/", "/health", "/docs", "/openapi.json", "/redoc"}

    if (
        api_key
        and request.url.path not in public_paths
        and request.method != "OPTIONS"
        and not compare_digest(request.headers.get("X-API-KEY", ""), api_key)
    ):
        return JSONResponse(
            status_code=401,
            content={"detail": "A valid X-API-KEY header is required."},
        )

    response = await call_next(request)
    response.headers["X-Process-Time"] = str(perf_counter() - start_time)
    return response


app.include_router(ai_agent_router, tags=["AI Module"])


@app.get("/", status_code=200)
@app.get("/health", status_code=200)
def root():
    return {"message": "You are at the Xander's backend!"}
