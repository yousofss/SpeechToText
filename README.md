# Speech to Text Transcription

This is a web application that allows users to transcribe audio files into text using OpenAI's Whisper model. The app supports various audio formats and can handle large files by splitting them into chunks for processing.

## Features

- Support for multiple audio formats (M4A, MP3, WEBM, MP4, MPGA, WAV, MPEG)
- Automatic handling of large files by splitting them into chunks
- User-provided OpenAI API key for transcription and can be deleted at any time
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

4. Run the Flask application:

   ```
   python app.py
   ```

5. Open a web browser and navigate to `http://localhost:5000` to use the application.

## Security Note

The application stores the API key in the browser's local storage for convenience. Make sure to use this application on a secure, private device. The API key is only sent to the server during transcription requests and is not stored on the server. You can delete the stored API key at any time using the "Delete API Key" button.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).
