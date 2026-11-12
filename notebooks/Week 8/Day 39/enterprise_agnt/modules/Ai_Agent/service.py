
from langchain_core.messages import HumanMessage

from core.database.sqlite import (
    load_messages,
    save_messages
)

from modules.Ai_Agent.graph import graph


def process_chat(query: str, session_id: str):

    # 1. Load previous conversation
    previous_messages = load_messages(session_id)

    # 2. Add current user message
    user_message = HumanMessage(content=query)

    conversation = previous_messages + [user_message]

    # 3. Execute LangGraph
    result = graph.invoke({
        "messages": conversation
    })

    # 4. Get newly generated messages
    new_messages = result["messages"][len(previous_messages):]

    # 5. Save user, assistant and tool messages
    save_messages(session_id, new_messages)

    # 6. Get final assistant response
    final_response = result["messages"][-1].content

    return {
        "session_id": session_id,
        "response": final_response
    }


def retrieve_history(session_id: str):

    messages = load_messages(session_id)

    history = []

    for message in messages:

        history.append({
            "role": message.type,
            "content": message.content
        })

    return {
        "session_id": session_id,
        "messages": history
    }
