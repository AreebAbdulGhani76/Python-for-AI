from fastapi import APIRouter
from .schema import chat_payload

ai_agent_router = APIRouter(prefix="/ai")

@ai_agent_router.post("/chat")
async def inititate_chat(query: chat_payload):
    print(query.model_dump())
    return query

@ai_agent_router.get("/history")
async def get_history(session_id: str):
    print("Session id has been recieved")
    return f" Here is the chat for {session_id} Session_Id"