import re
import json
import requests
import tempfile
import os
import uuid
from langchain_community.document_loaders import PyPDFLoader
import jwt


def limit_emails(emails, limit=None):
    limit = min(int(limit), 5) if limit else 5
    return emails[:limit]


def extract_json_objects(text):
    json_objects = []
    pattern = r"{[^{}]*(?:{[^{}]*}[^{}]*)*}"
    matches = re.findall(pattern, text, re.DOTALL)

    for match in matches:
        try:
            obj = json.loads(match)
            json_objects.append(obj)
        except json.JSONDecodeError:
            continue  # Skip invalid JSON
    return json_objects


def get_previous_chat(access_token):
    try:
        headers = {
            "Cookie": f"access={access_token}",
        }
        response = requests.get(
            "http://127.0.0.1:8000/api/v1/chat/chat/", headers=headers
        )
        if response.status_code == 200:
            print("Previous chat fetched successfully")
            return response.json()["data"]
        else:
            print(f"Error fetching previous chat: {response.status_code}")
            return None
    except Exception as e:
        print(f"Error getting previous chat: {e}")
        return None


def store_chat(messages, access_token):
    try:
        headers = {
            "Cookie": f"access={access_token}",
        }
        response = requests.post(
            "http://127.0.0.1:8000/api/v1/chat/chat/", data=messages, headers=headers
        )
        if response.status_code == 201:
            print("Chat stored successfully")
            return response.json()
        else:
            print(f"Error storing chat: {response.status_code}")
            return None
    except Exception as e:
        print(f"Error storing chat: {e}")
        return None


def transcribe_audio(file, model):
    filename = f"{uuid.uuid4()}.webm"
    filepath = os.path.join("uploads", filename)
    file.save(filepath)

    try:
        segments, info = model.transcribe(filepath)
        transcription = " ".join([segment.text for segment in segments])
        return {"transcription": transcription}
    except Exception as e:
        return {"error": str(e)}
    finally:
        if os.path.exists(filepath):
            os.remove(filepath)


def pdf_loader(pdf_path):
    if not pdf_path.endswith(".pdf"):
        raise ValueError("The file is not a PDF. Please provide a valid PDF file path.")
    loader = PyPDFLoader(file_path=pdf_path)
    docs = loader.load()
    return docs


def get_user_id_from_token(token):
    try:
        # Decode the token
        decoded = jwt.decode(token, options={"verify_signature": False})
        user_id = decoded.get("user_id")
        return user_id
    except jwt.ExpiredSignatureError:
        return "Token expired"
    except jwt.InvalidTokenError:
        return "Invalid token"


def store_file_temporary(file, upload_dir):
    if file:
        save_path = os.path.join(upload_dir, file.filename)
        file.save(save_path)
        return save_path
