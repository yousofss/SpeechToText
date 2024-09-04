const uploadLabel = document.querySelector('.upload-label');
const uploadText = document.getElementById('uploadText');
const fileInput = document.getElementById('fileInput');
const transcribeBtn = document.getElementById('transcribeBtn');
const resultArea = document.getElementById('result');
const transcriptionText = document.getElementById('transcriptionText');
const copyBtn = document.getElementById('copyBtn');
const downloadBtn = document.getElementById('downloadBtn');

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
downloadBtn.addEventListener('click', downloadTranscription);

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
  transcribeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Transcribing...';
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
    transcribeBtn.innerHTML = '<i class="fas fa-language"></i> Transcribe';
  });
}

function showError(message) {
  resultArea.hidden = false;
  transcriptionText.innerHTML = `<span style="color: #e74c3c;">${message}</span>`;
}

function copyToClipboard() {
  navigator.clipboard.writeText(transcriptionText.textContent).then(() => {
    const notification = document.createElement('div');
    notification.textContent = 'Text copied!';
    notification.className = 'copy-notification';
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 2000);
  });
}

function downloadTranscription() {
  const text = transcriptionText.textContent;
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'transcription.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Remove or modify the file size check
fileInput.addEventListener('change', function() {
  const file = this.files[0];
  if (file) {
    const fileSizeMB = file.size / (1024 * 1024);
    console.log(`File size: ${fileSizeMB.toFixed(2)} MB`);
    // You can add a message here if you want to inform users about potential longer processing times for larger files
  }
});