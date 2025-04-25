from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_qdrant import QdrantVectorStore
from langchain_huggingface import HuggingFaceEmbeddings
from utillity.utils import pdf_loader
import uuid


class Rag:
    def __init__(self, collection_name, doc_path, user_id):
        self.user_id = user_id
        self.collection_name = f"{collection_name}-{user_id}-{str(uuid.uuid4())}"
        self.embedder = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
        self.doc_path = doc_path

    def text_splitter(self, docs):
        if not docs:
            raise ValueError("No documents provided for splitting.")

        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
        )
        split_docs = text_splitter.split_documents(documents=docs)
        return split_docs

    def retriever(self):
        retriever = QdrantVectorStore.from_existing_collection(
            url="http://localhost:6333",
            collection_name=self.collection_name,
            embedding=self.embedder,
        )
        return retriever

    def store_vectors(self):
        docs = pdf_loader(self.doc_path)
        split_docs = self.text_splitter(docs)
        print("Collection name", self.collection_name)
        QdrantVectorStore.from_documents(
            documents=split_docs,
            url="http://localhost:6333",
            collection_name=self.collection_name,
            embedding=self.embedder,
        )

    def get_relevant_chunks(self, user_query):
        relevant_chunks = self.retriever().similarity_search(query=user_query)

        serializable_chunks = [
            {
                "content": doc.page_content,
            }
            for doc in relevant_chunks
        ]

        return serializable_chunks
