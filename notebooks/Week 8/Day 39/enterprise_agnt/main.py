
from fastapi import FastAPI

from modules.Ai_Agent.router import ai_agent_router

app = FastAPI(
    title="Xander Restaurant API",
    description="AI-powered Restaurant Customer Support",
    version="1.0.0"
)

app.include_router(
    ai_agent_router,
    tags=["AI Module"]
)


@app.get("/", status_code=200)
def root():

    return {
        "message": "You are at the Xander's backend!"
    }
