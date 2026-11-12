
import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI

load_dotenv()

MODEL = "nvidia/nemotron-3.5-lightning:free"
EMBEDDING_MODEL = "nvidia/nemotron-3.5-embed-8b:free"

llm_client = ChatOpenAI(
    model=MODEL,
    temperature=0,
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPEN_ROUTER_KEY")
)
