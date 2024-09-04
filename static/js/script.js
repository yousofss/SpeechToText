// Get DOM elements
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const transcribeBtn = document.getElementById('transcribeBtn');
const resultArea = document.getElementById('result');

// Add event listeners
uploadArea.addEventListener('click', () => fileInput.click());
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});
uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
});
uploadArea.addEventListener('drop', handleDrop);
fileInput.addEventListener('change', handleFileSelect);
transcribeBtn.addEventListener('click', transcribeAudio);

// Handle file drop
function handleDrop(e) {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    handleFiles(e.dataTransfer.files);
}

// Handle file selection
function handleFileSelect(e) {
    handleFiles(e.target.files);
}

// Process selected files
function handleFiles(files) {
    if (files.length > 0) {
        const file = files[0];
        if (file.type.startsWith('audio/')) {
            uploadArea.textContent = `Selected file: ${file.name}`;
            transcribeBtn.disabled = false;
        } else {
            alert('Please select an audio file.');
        }
    }
}

// Transcribe audio
function transcribeAudio() {
    const file = fileInput.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    transcribeBtn.disabled = true;
    transcribeBtn.textContent = 'Transcribing...';
    resultArea.textContent = 'Processing...';

    fetch('/transcribe', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                resultArea.textContent = `Error: ${data.error}`;
            } else {
                resultArea.textContent = data.transcript;
            }
        })
        .catch(error => {
            resultArea.textContent = `Error: ${error.message}`;
        })
        .finally(() => {
            transcribeBtn.disabled = false;
            transcribeBtn.textContent = 'Transcribe';
        });
}