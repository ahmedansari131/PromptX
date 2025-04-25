from langchain.schema import Document
from vector_store.qdrant_config import get_qdrant_store

store = get_qdrant_store()


def store_chat(user_id: str, user_query: str, assistant_response: str):
    document = Document(
        page_content=f"User: {user_query}\nAssistant: {assistant_response}",
        metadata={"source": "chat", "user_id": user_id},
    )
    store.add_documents([document])
