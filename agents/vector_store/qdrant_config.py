from langchain_qdrant import QdrantVectorStore
from langchain_huggingface import HuggingFaceEmbeddings
from qdrant_client import QdrantClient
from qdrant_client.http.models import Distance, VectorParams


def get_qdrant_store(collection_name):
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

    client = QdrantClient(host="localhost", port=6333)

    if collection_name not in [
        col.name for col in client.get_collections().collections
    ]:
        print(f"Creating collection: {collection_name}")
        client.create_collection(
            collection_name=collection_name,
            vectors_config=VectorParams(size=384, distance=Distance.COSINE),
        )

    store = QdrantVectorStore(
        client=client,
        collection_name=collection_name,
        embedding=embeddings,
    )

    return store
