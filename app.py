from flask import Flask, render_template, request, jsonify
from openai import OpenAI
import os
from dotenv import load_dotenv
import tempfile
from pydub import AudioSegment
import math

load_dotenv()

app = Flask(__name__)

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

CHUNK_SIZE = 23 * 1024 * 1024


def split_audio(file_path):
    print(f"Splitting audio file: {file_path}")
    audio = AudioSegment.from_file(file_path)
    duration_ms = len(audio)
    chunk_duration_ms = (CHUNK_SIZE / len(audio.raw_data)) * duration_ms
    chunks = math.ceil(duration_ms / chunk_duration_ms)

    print(f"Total chunks: {chunks}")
    for i in range(chunks):
        start_ms = i * chunk_duration_ms
        end_ms = min((i + 1) * chunk_duration_ms, duration_ms)
        chunk = audio[start_ms:end_ms]
        chunk_path = f"{file_path}_chunk_{i}.wav"
        chunk.export(chunk_path, format="wav")
        print(f"Created chunk {i+1}/{chunks}: {chunk_path}")
        yield chunk_path


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

    print(f"Received file: {file.filename}")

    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_file:
            file.save(temp_file.name)
            temp_filename = temp_file.name

        print(f"Saved temporary file: {temp_filename}")

        file_size = os.path.getsize(temp_filename)
        print(f"File size: {file_size / (1024 * 1024):.2f} MB")

        if file_size > CHUNK_SIZE:
            print("File size exceeds 24 MB, splitting into chunks")
            chunks = list(split_audio(temp_filename))
            transcripts = []

            for i, chunk in enumerate(chunks):
                print(f"Transcribing chunk {i+1}/{len(chunks)}")
                with open(chunk, "rb") as audio_file:
                    transcript = client.audio.transcriptions.create(model="whisper-1", file=audio_file)
                transcripts.append(transcript.text)
                os.remove(chunk)
                print(f"Removed chunk: {chunk}")

            full_transcript = " ".join(transcripts)
            print("Finished transcribing all chunks")
        else:
            print("File size is under 24 MB, transcribing directly")
            with open(temp_filename, "rb") as audio_file:
                transcript = client.audio.transcriptions.create(model="whisper-1", file=audio_file)
            full_transcript = transcript.text
            print("Finished transcribing")

        os.remove(temp_filename)
        print(f"Removed temporary file: {temp_filename}")

        return jsonify({"transcript": full_transcript})
    except Exception as e:
        if os.path.exists(temp_filename):
            os.remove(temp_filename)
            print(f"Removed temporary file due to error: {temp_filename}")
        print(f"Error during transcription: {str(e)}")
        return jsonify({"error": str(e)})


if __name__ == "__main__":
    app.run(debug=True)
