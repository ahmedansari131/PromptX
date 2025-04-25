from langchain_community.document_loaders import PyPDFLoader


def load_pdf_content(file_path):
    loader = PyPDFLoader(file_path)
    doc = loader.load()[0]
    doc_content = doc.page_content
    return doc_content
