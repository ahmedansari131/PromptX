from flask import Flask, request, jsonify, g
from utillity.prompts import system_prompt
from utillity.utils import (
    extract_json_objects,
    store_chat,
    get_previous_chat,
    transcribe_audio,
    store_file_temporary,
)
from llm_model.gemini import GeminiClient
from llm_model.model_processor import process_step
from functools import wraps
import json
import requests
from flask_cors import CORS
from faster_whisper import WhisperModel
import os

app = Flask(__name__)
CORS(app, supports_credentials=True, origins=["http://localhost:5173"])
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
model = WhisperModel("medium", device="cpu", compute_type="int8")


def require_token(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        print("Checking for access token...")

        print(f"Access Token: {g.access_token}")
        return f(*args, **kwargs)

    return decorated


@app.route("/api/upload", methods=["POST", "OPTIONS"])
def upload():
    print("Uploading file...")
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400

    user_query = request.form.get("query")
    file = request.files["file"]
    access_token = request.cookies.get("access")
    url = "http://localhost:5000/api/execute"
    headers = {
        "Cookie": f"access={access_token}",
    }

    if file:
        response = requests.post(
            url, headers=headers, files={"file": file}, data={"query": user_query}
        )
        print(response)
        if response.status_code != 200:
            return jsonify({"error": "Failed to upload file"}), 500
        print("File uploaded successfully")
        return jsonify({"message": "File uploaded successfully"}), 200


@app.route("/chat", methods=["POST"])
def execute_query():
    input_type = request.form.get("input_type")
    if input_type == "text":
        user_query = request.form.get("query")
    elif input_type == "audio":
        audio = request.files.get("audio")
        user_query = transcribe_audio(audio, model)["transcription"]
    elif input_type == "text-file":
        user_query = request.form.get("query")
        file = request.files.get("file")
        file_path = store_file_temporary(file, UPLOAD_FOLDER)
        user_query = f"{user_query} FILE_PATH: {file_path}"
    else:
        return jsonify({"error": "Invalid input type"}), 400

    g.access_token = request.cookies.get("access")
    context = get_previous_chat(request.cookies.get("access")) or ""
    messages = [
        {"role": "user", "parts": [{"text": system_prompt}]},
        {"role": "user", "parts": [{"text": f"Previous Context:\n{context}"}]},
        {"role": "user", "parts": [{"text": user_query}]},
    ]

    gemini_instance = GeminiClient()
    gemini_client = gemini_instance.client
    gemini_instance.set_messages(messages)

    while True:
        print("Generating content...")
        try:
            response = gemini_client.models.generate_content(
                model=gemini_instance.model,
                contents=messages,
                config={"temperature": 0},
            )
        except Exception as e:
            return jsonify({"error": f"Error generating content: {str(e)}"}), 500

        cleaned_output = extract_json_objects(response.text)
        parsed_output = cleaned_output[0] if cleaned_output else {}

        messages.append(
            {"role": "user", "parts": [{"text": json.dumps(parsed_output)}]}
        )
        
        print("Parsed output:", parsed_output)
        print("Messages:", messages)

        if isinstance(parsed_output, list):
            for item in parsed_output:
                if process_step(item, messages):
                    store_chat(
                        {
                            "user_query": user_query,
                            "ai_response": parsed_output.get("content"),
                        },
                        request.cookies.get("access"),
                    )

                    return jsonify({"response": item.get("content")})
        else:
            if process_step(parsed_output, messages):
                store_chat(
                    {
                        "user_query": user_query,
                        "ai_response": parsed_output.get("content"),
                    },
                    request.cookies.get("access"),
                )

                return jsonify({"response": parsed_output.get("content")})


if __name__ == "__main__":
    app.run(debug=True)
