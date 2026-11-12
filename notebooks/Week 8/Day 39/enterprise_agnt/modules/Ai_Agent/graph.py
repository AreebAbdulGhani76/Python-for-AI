from modules.Ai_Agent.tools import Tools
from core.services.LLMs import llm_client, MODEL
from langchain_core.messages import SystemMessage
from langgraph.graph import START, END, MessagesState, StateGraph
from langgraph.prebuilt import ToolNode, tools_condition


SYSTEM_PROMPT = """You are the friendly customer support assistant for Xander Restaurant.
Keep replies short. Prices are in Pakistani rupees. Use fetch_menu for menu/prices.
For complaints, collect customer name, phone, complaint and order ID. Validate the
order ID with validate_order_id, then call log_complaint only for a valid order.
Never invent facts. Ask for missing details."""


def assistant(state: MessagesState, model_with_tools):
    messages = [
        SystemMessage(content=SYSTEM_PROMPT),
        *state["messages"]
    ]

    reply = model_with_tools.invoke(messages)

    return {"messages": [reply]}


def build_graph(llm=None, model=None, tools=None):
    tools = Tools if tools is None else tools

    chat_model = llm if llm is not None else llm_client

    model_with_tools = chat_model.bind_tools(tools)

    builder = StateGraph(MessagesState)

    builder.add_node(
        "assistant",
        lambda state: assistant(state, model_with_tools)
    )

    builder.add_node("tools", ToolNode(tools))

    builder.add_edge(START, "assistant")

    builder.add_conditional_edges(
        "assistant",
        tools_condition
    )

    builder.add_edge("tools", "assistant")

    return builder.compile()


if __name__ == "__main__":
    import sys

    provider = sys.argv[1] if len(sys.argv) > 1 else "openai"

    graph = build_graph()

    out = graph.invoke({
        "messages": [
            ("user", "What is on the menu?")
        ]
    })

    print(out["messages"][-1].content)