from flask import Flask, render_template, request, jsonify
from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/transcribe", methods=["POST"])
def transcribe():
    if "file" not in request.files:
        return jsonify({"error": "No file part"})

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"})

    temp_filename = "temp_audio.wav"
    file.save(temp_filename)

    try:
        with open(temp_filename, "rb") as audio_file:
            transcript = client.audio.transcriptions.create(model="whisper-1", file=audio_file)

        os.remove(temp_filename)

        return jsonify({"transcript": transcript.text})
    except Exception as e:
        print(f"Error during transcription: {str(e)}")
        return jsonify({"error": str(e)})


if __name__ == "__main__":
    app.run(debug=True)
