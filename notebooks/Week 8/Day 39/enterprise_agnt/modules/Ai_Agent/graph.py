
from modules.Ai_Agent.tools import Tools
from core.services.LLMs import llm_client
from langchain_core.messages import SystemMessage
from langgraph.graph import START, MessagesState, StateGraph
from langgraph.prebuilt import ToolNode, tools_condition


SYSTEM_PROMPT = """
You are the friendly customer support assistant for Xander Restaurant.

Rules:
1. Keep responses short, clear and helpful.
2. All prices are in Pakistani Rupees (PKR).
3. Always use fetch_menu to answer questions about menu items and prices.
4. Never invent menu items, prices or restaurant information.
5. For complaints, collect:
   - Customer name
   - Phone number
   - Complaint
   - Order ID
6. Validate the order ID using validate_order_id before logging a complaint.
7. Only call log_complaint if the order ID is valid.
8. Never claim that a complaint was registered unless log_complaint succeeds.
9. Ask the customer for any missing information.
"""


def assistant(state: MessagesState, model_with_tools):

    messages = [
        SystemMessage(content=SYSTEM_PROMPT),
        *state["messages"]
    ]

    reply = model_with_tools.invoke(messages)

    return {"messages": [reply]}


def build_graph(llm=None, tools=None):

    selected_tools = Tools if tools is None else tools
    chat_model = llm if llm is not None else llm_client

    model_with_tools = chat_model.bind_tools(selected_tools)

    builder = StateGraph(MessagesState)

    builder.add_node(
        "assistant",
        lambda state: assistant(state, model_with_tools)
    )

    builder.add_node(
        "tools",
        ToolNode(selected_tools)
    )

    builder.add_edge(START, "assistant")

    builder.add_conditional_edges(
        "assistant",
        tools_condition
    )

    builder.add_edge("tools", "assistant")

    return builder.compile()


# Build the graph once when this module is imported.
graph = build_graph()


if __name__ == "__main__":

    result = graph.invoke({
        "messages": [
            ("user", "What is on the menu?")
        ]
    })

    print(result["messages"][-1].content)
