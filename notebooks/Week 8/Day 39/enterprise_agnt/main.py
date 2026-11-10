from fastapi import FastAPI
from pydantic import BaseModel

from modules.Ai_Agent.router import ai_agent_router
app = FastAPI()

app.include_router(
    ai_agent_router, 
    tags = ["AI Module"]
)

@app.get("/", status_code=200)
async def root():
    return {"message": "You are at the Xander's backend!"}