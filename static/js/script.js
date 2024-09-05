const uploadLabel = document.querySelector('.upload-label');
const uploadText = document.getElementById('uploadText');
const fileInput = document.getElementById('fileInput');
const transcribeBtn = document.getElementById('transcribeBtn');
const resultArea = document.getElementById('result');
const transcriptionText = document.getElementById('transcriptionText');
const copyBtn = document.getElementById('copyBtn');
const downloadBtn = document.getElementById('downloadBtn');

const apiKeySection = document.getElementById('apiKeySection');
const apiKeyInput = document.getElementById('apiKeyInput');
const saveApiKeyBtn = document.getElementById('saveApiKeyBtn');
const uploadSection = document.getElementById('uploadSection');

const toggleApiKey = document.getElementById('toggleApiKey');
const deleteApiKeyBtn = document.getElementById('deleteApiKeyBtn');

toggleApiKey.addEventListener('click', () => {
  const apiKeyInput = document.getElementById('apiKeyInput');
  const type = apiKeyInput.getAttribute('type') === 'password' ? 'text' : 'password';
  apiKeyInput.setAttribute('type', type);
  toggleApiKey.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
});

function showMessage(message, isError = false) {
  const messageBox = document.getElementById('messageBox');
  const messageText = document.getElementById('messageText');
  const messageIcon = document.getElementById('messageIcon');

  messageText.textContent = message;
  messageBox.className = `message-box ${isError ? 'error' : 'success'}`;
  messageIcon.className = `fas ${isError ? 'fa-exclamation-circle' : 'fa-check-circle'}`;

  messageBox.style.display = 'flex';

  // Auto-hide the message after 5 seconds
  setTimeout(() => {
    closeMessage();
  }, 5000);
}

function closeMessage() {
  const messageBox = document.getElementById('messageBox');
  messageBox.style.opacity = '0';
  setTimeout(() => {
    messageBox.style.display = 'none';
    messageBox.style.opacity = '1';
  }, 300);
}

document.getElementById('closeMessage').addEventListener('click', closeMessage);

function saveApiKey() {
  const apiKey = apiKeyInput.value.trim();
  if (apiKey) {
    localStorage.setItem('openaiApiKey', apiKey);
    apiKeySection.style.display = 'none';
    uploadSection.style.display = 'block';
    showMessage('API key has been saved.');
  } else {
    showMessage('Please enter a valid API key', true);
  }
}

function deleteApiKey() {
  if (confirm('Are you sure you want to delete your saved API key?')) {
    localStorage.removeItem('openaiApiKey');
    apiKeyInput.value = '';
    apiKeySection.style.display = 'block';
    uploadSection.style.display = 'none';
    showMessage('API key has been deleted.');
  }
}

// Add these event listeners
saveApiKeyBtn.addEventListener('click', saveApiKey);
deleteApiKeyBtn.addEventListener('click', deleteApiKey);

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

  const apiKey = localStorage.getItem('openaiApiKey');
  if (!apiKey) {
    showMessage('Please enter your OpenAI API key first', true);
    return;
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', apiKey);

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
        showMessage(`Error: ${data.error}`, true);
      } else {
        transcriptionText.textContent = data.transcript;
        resultArea.hidden = false;
      }
    })
    .catch(error => {
      showMessage(`Error: ${error.message}`, true);
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
  const blob = new Blob([text], {
    type: 'text/plain'
  });
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
fileInput.addEventListener('change', function () {
  const file = this.files[0];
  if (file) {
    const fileSizeMB = file.size / (1024 * 1024);
    console.log(`File size: ${fileSizeMB.toFixed(2)} MB`);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const savedApiKey = localStorage.getItem('openaiApiKey');
  if (savedApiKey) {
    apiKeySection.style.display = 'none';
    uploadSection.style.display = 'block';
  } else {
    apiKeySection.style.display = 'block';
    uploadSection.style.display = 'none';
  }
});