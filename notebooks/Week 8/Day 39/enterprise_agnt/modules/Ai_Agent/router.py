
from fastapi import APIRouter, HTTPException

from .schema import chat_payload
from .service import process_chat, retrieve_history

ai_agent_router = APIRouter(prefix="/ai")


@ai_agent_router.post("/chat")
def initiate_chat(query: chat_payload):

    try:

        result = process_chat(
            query=query.query,
            session_id=query.session_id
        )

        return result

    except Exception as error:

        print(f"Chat Error: {error}")

        raise HTTPException(
            status_code=500,
            detail="An error occurred while processing your message."
        )


@ai_agent_router.get("/history")
def get_history(session_id: str):

    try:

        return retrieve_history(session_id)

    except Exception as error:

        print(f"History Error: {error}")

        raise HTTPException(
            status_code=500,
            detail="Unable to retrieve chat history."
        )
