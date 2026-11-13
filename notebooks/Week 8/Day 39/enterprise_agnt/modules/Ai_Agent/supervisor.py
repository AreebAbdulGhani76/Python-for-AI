
"""Load conversation history -> run supervisor graph -> save new messages."""

from langchain_core.messages import HumanMessage

from core.database import sqlite
from core.services.LLMs import llm_client

# Import build_supervisor from the file where you actually define it.
# This assumes build_supervisor is defined in modules/Ai_Agent/supervisor_graph.py
from modules.Ai_Agent.graph import build_graph
from core.services.LLMs import llm_client

graph = build_graph(llm=llm_client)


WORKERS = ("menu_agent", "complaint_agent")


def is_answer(message):
    """Check whether a message contains a normal AI response."""

    return (
        message.type == "ai"
        and bool(message.content)
        and not message.tool_calls
        and not message.content.startswith("Transferring back")
    )


def chat(query: str, session_id: str):
    """Load history, invoke the graph, and save new messages."""

    history = sqlite.load_messages(session_id)

    result = graph.invoke({
        "messages": history + [HumanMessage(content=query)]
    })

    new_messages = result["messages"][len(history):]

    sqlite.append_messages(session_id, new_messages)

    # Prefer the worker's answer instead of the supervisor's closing message.
    for message in reversed(new_messages):
        if is_answer(message) and message.name in WORKERS:
            return message.content

    # Fallback for greetings or other responses.
    for message in reversed(new_messages):
        if is_answer(message):
            return message.content

    return "Sorry, I couldn't generate a response."


def get_history(session_id: str):
    """Return only user messages and readable AI responses."""

    shown = []

    for message in sqlite.load_messages(session_id):

        if message.type == "human":
            item = {
                "role": "user",
                "content": message.content.strip()
            }

        elif is_answer(message):
            item = {
                "role": "ai",
                "content": message.content.strip()
            }

        else:
            continue

        # Avoid duplicate consecutive messages.
        if item != (shown[-1] if shown else None):
            shown.append(item)

    return shown
