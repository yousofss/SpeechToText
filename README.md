# Speech to Text Transcription

This is a web application that allows users to transcribe audio files into text using OpenAI's Whisper model. The app supports various audio formats and can handle large files by splitting them into chunks for processing.

## Features

- Support for multiple audio formats (M4A, MP3, WEBM, MP4, MPGA, WAV, MPEG)
- Automatic handling of large files by splitting them into chunks
- Download transcription as a text file

## Technologies Used

- Backend: Python with Flask
- Frontend: HTML, CSS, JavaScript
- Audio Processing: pydub
- Transcription: OpenAI Whisper model

## Setup

1. Clone the repository:
   ```
   git clone https://github.com/yousofss/SpeechToText.git
   cd SpeechToText
   ```

2. Create a virtual environment and activate it:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
   ```

3. Install the required packages:
   ```
   pip install -r requirements.txt
   ```

4. Create a `.env` file in the project root and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```

5. Run the Flask application:
   ```
   python app.py
   ```

6. Open a web browser and navigate to `http://localhost:5000` to use the application.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).
