const greeting = document.getElementById('greeting');
const subtitle = document.getElementById('subtitle');
const nameInput = document.getElementById('nameInput');
const generateButton = document.getElementById('generateButton');
const result = document.getElementById('result');
const shareLink = document.getElementById('shareLink');
const qrImage = document.getElementById('qrImage');

const micButton = document.getElementById('micButton');
const relightButton = document.getElementById('relightButton');
const cakeStatus = document.getElementById('cakeStatus');
const flames = Array.from(document.querySelectorAll('.flame'));

let audioContext;
let analyzer;
let micSource;
let animationFrame;
let stream;
let blownOut = false;

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

function setCandlesLit(isLit) {
  flames.forEach((flame) => flame.classList.toggle('out', !isLit));
  blownOut = !isLit;
  cakeStatus.textContent = isLit ? 'Candles are lit ✨' : 'Candles blown out! 🎉';
}

function stopMic() {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
    animationFrame = undefined;
  }

  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
    stream = undefined;
  }

  if (audioContext && audioContext.state !== 'closed') {
    audioContext.close();
  }

  audioContext = undefined;
  analyzer = undefined;
  micSource = undefined;
  micButton.textContent = 'Enable Mic Candles';
}

function monitorVolume() {
  if (!analyzer || blownOut) {
    return;
  }

  const data = new Uint8Array(analyzer.frequencyBinCount);
  analyzer.getByteFrequencyData(data);
  const avg = data.reduce((sum, value) => sum + value, 0) / data.length;

  if (avg > 38) {
    setCandlesLit(false);
    cakeStatus.textContent = 'Candles blown out! 🎉 Click relight to try again.';
    stopMic();
    return;
  }

  animationFrame = requestAnimationFrame(monitorVolume);
}

async function startMic() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    cakeStatus.textContent = 'Microphone is not supported in this browser.';
    return;
  }

  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioContext = new AudioContext();
    analyzer = audioContext.createAnalyser();
    analyzer.fftSize = 512;
    micSource = audioContext.createMediaStreamSource(stream);
    micSource.connect(analyzer);

    micButton.textContent = 'Listening... make a loud blow/sound';
    cakeStatus.textContent = 'Mic enabled. Blow or make a sound to extinguish the candles.';
    monitorVolume();
  } catch {
    cakeStatus.textContent = 'Microphone permission denied or unavailable.';
  }
}

generateButton.addEventListener('click', updateResult);
nameInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    updateResult();
  }
});

micButton.addEventListener('click', () => {
  if (audioContext) {
    stopMic();
    cakeStatus.textContent = blownOut
      ? 'Candles are out. Click relight to light them again.'
      : 'Mic stopped. Candles are still lit.';
    return;
  }

  startMic();
});

relightButton.addEventListener('click', () => {
  stopMic();
  setCandlesLit(true);
});
