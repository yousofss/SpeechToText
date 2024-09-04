const uploadLabel = document.querySelector('.upload-label');
const uploadText = document.getElementById('uploadText');
const fileInput = document.getElementById('fileInput');
const transcribeBtn = document.getElementById('transcribeBtn');
const resultArea = document.getElementById('result');
const transcriptionText = document.getElementById('transcriptionText');
const copyBtn = document.getElementById('copyBtn');

uploadLabel.addEventListener('dragover', (e) => {
  e.preventDefault();
  uploadLabel.style.backgroundColor = '#ecf0f1';
});

uploadLabel.addEventListener('dragleave', () => {
  uploadLabel.style.backgroundColor = '';
});

uploadLabel.addEventListener('drop', handleDrop);
fileInput.addEventListener('change', handleFileSelect);
transcribeBtn.addEventListener('click', transcribeAudio);
copyBtn.addEventListener('click', copyToClipboard);

function handleDrop(e) {
  e.preventDefault();
  uploadLabel.style.backgroundColor = '';
  handleFiles(e.dataTransfer.files);
}

function handleFileSelect(e) {
  handleFiles(e.target.files);
}

function handleFiles(files) {
  if (files.length > 0) {
    const file = files[0];
    if (file.type.startsWith('audio/')) {
      uploadText.textContent = `Selected: ${file.name}`;
      transcribeBtn.disabled = false;
    } else {
      alert('Please select an audio file.');
    }
  }
}

function transcribeAudio() {
  const file = fileInput.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('file', file);

  transcribeBtn.disabled = true;
  transcribeBtn.textContent = 'Transcribing...';
  resultArea.hidden = true;

  fetch('/transcribe', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    if (data.error) {
      showError(`Error: ${data.error}`);
    } else {
      transcriptionText.textContent = data.transcript;
      resultArea.hidden = false;
    }
  })
  .catch(error => {
    showError(`Error: ${error.message}`);
  })
  .finally(() => {
    transcribeBtn.disabled = false;
    transcribeBtn.textContent = 'Transcribe';
  });
}

function showError(message) {
  resultArea.hidden = false;
  transcriptionText.innerHTML = `<span style="color: #e74c3c;">${message}</span>`;
}

function copyToClipboard() {
  navigator.clipboard.writeText(transcriptionText.textContent).then(() => {
    const originalText = copyBtn.textContent;
    copyBtn.textContent = 'Copied!';
    setTimeout(() => {
      copyBtn.textContent = originalText;
    }, 2000);
  });
}