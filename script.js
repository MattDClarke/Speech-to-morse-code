const transcriptContainer = document.querySelector('.transcript-container');
const buttonStartAndPause = document.querySelector('.button-start-and-pause');
const buttonReset = document.querySelector('.button-reset');

const morseCode = {
  '0': '-----',
  '1': '.----',
  '2': '..---',
  '3': '...--',
  '4': '....-',
  '5': '.....',
  '6': '-....',
  '7': '--...',
  '8': '---..',
  '9': '----.',
  a: '.-',
  b: '-...',
  c: '-.-.',
  d: '-..',
  e: '.',
  f: '..-.',
  g: '--.',
  h: '....',
  i: '..',
  j: '.---',
  k: '-.-',
  l: '.-..',
  m: '--',
  n: '-.',
  o: '---',
  p: '.--.',
  q: '--.-',
  r: '.-.',
  s: '...',
  t: '-',
  u: '..-',
  v: '...-',
  w: '.--',
  x: '-..-',
  y: '-.--',
  z: '--..',
  '.': '.-.-.-',
  ',': '--..--',
  '?': '..--..',
  '!': '-.-.--',
  '-': '-....-',
  '/': '-..-.',
  '@': '.--.-.',
  '(': '-.--.',
  ')': '-.--.-',
  "'": '.-..-.'
};

function convertToMorse(str) {
  return str
    .toLowerCase()
    .split('')
    .map(el => (morseCode[el] ? morseCode[el] : el))
    .join('');
}

function start() {
  if (!(window.SpeechRecognition || window.webkitSpeechRecognition)) {
    transcriptContainer.style.fontSize = '20px';
    transcriptContainer.innerHTML =
      'Sorry, your browser does not support speech recognition. Try Chrome or Edge. This CodePen uses the Web Speech API speech recognition interface. It is an experimental technology (https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition).';
    return;
  }
  // it does work
  console.log('Starting...');
}
start();

let recognizing = false;

window.SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

// Make a new speech recogn
const recognition = new SpeechRecognition();
recognition.continuous = true;

// debounce function
const debounce = (callback, wait) => {
  let timeoutId = null;
  return (...args) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      callback.apply(null, args);
    }, wait);
  };
};

function handleResult({ results }) {
  // get last child of results
  const text = results[results.length - 1][0].transcript;
  text.trim();
  const words = text.split(' ').filter(word => word !== '');
  const morse = convertToMorse(text)
    .split(' ')
    .filter(word => word !== '');
  console.log(morse);
  const html = words
    .map(
      (word, i) =>
        `<div class="flex-item"><p>${word}&nbsp;</p><p>${morse[i]}</p></div>`
    )
    .join('');
  transcriptContainer.insertAdjacentHTML('beforeend', html);
}

function startCount() {
  recognition.onresult = handleResult;
  recognition.start();
  recognizing = true;
  buttonStartAndPause.innerHTML = '<i class="fas fa-pause"></i>';
}

function pauseCount() {
  recognition.stop();
  recognizing = false;
  buttonStartAndPause.innerHTML = '<i class="fas fa-play"></i>';
}

function handleStartAndPause() {
  if (recognizing === false) {
    startCount();
  } else {
    pauseCount();
  }
}

function resetCount() {
  recognition.stop();
  recognizing = false;
  buttonStartAndPause.innerHTML = '<i class="fas fa-play"></i>';
  transcriptContainer.textContent = '';
}

buttonStartAndPause.addEventListener(
  'click',
  debounce(handleStartAndPause, 300)
);
buttonReset.addEventListener('click', resetCount);
