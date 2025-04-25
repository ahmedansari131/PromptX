from rag.Rag import Rag
from constants import DOC_QNA_COLLECTION_NAME
from flask import g
from utillity.utils import get_user_id_from_token


def pdf_qna(pdf_path, user_query):
    token = g.access_token
    if not token:
        raise ValueError("Access token is missing. Please provide a valid token.")

    user_id = get_user_id_from_token(token)
    rag = Rag(
        collection_name=DOC_QNA_COLLECTION_NAME,
        doc_path=pdf_path,
        user_id=user_id,
    )

    rag.store_vectors()
    results = rag.get_relevant_chunks(user_query=user_query)
    print("RESULTS -> ", results)
    return results
