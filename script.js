const greeting = document.getElementById('greeting');
const subtitle = document.getElementById('subtitle');
const nameInput = document.getElementById('nameInput');
const generateButton = document.getElementById('generateButton');
const result = document.getElementById('result');
const shareLink = document.getElementById('shareLink');
const qrImage = document.getElementById('qrImage');

const params = new URLSearchParams(window.location.search);
const scannedName = params.get('name');

if (scannedName) {
  const safeName = scannedName.trim().slice(0, 40);
  if (safeName) {
    greeting.textContent = `🎉 Happy Birthday, ${safeName}! 🎂`;
    subtitle.textContent = 'Wishing you an amazing year ahead!';
    nameInput.value = safeName;
  }
}

function buildShareUrl(name) {
  const url = new URL(window.location.href);
  url.searchParams.set('name', name);
  return url.toString();
}

function updateResult() {
  const name = nameInput.value.trim();
  if (!name) {
    result.classList.add('hidden');
    return;
  }

  const shareUrl = buildShareUrl(name);
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=${encodeURIComponent(shareUrl)}`;

  shareLink.href = shareUrl;
  shareLink.textContent = shareUrl;
  qrImage.src = qrUrl;
  result.classList.remove('hidden');
}

generateButton.addEventListener('click', updateResult);
nameInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    updateResult();
  }
});
