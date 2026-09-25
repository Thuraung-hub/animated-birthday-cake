const cake = document.getElementById("cake");
const flame = document.getElementById("flame");
const hint = document.getElementById("hint");
const message = document.getElementById("message");
const countdown = document.getElementById("countdown");
const gift = document.getElementById("gift");
const confettiBox = document.getElementById("confetti");
const toolbarReplayButton = document.getElementById("toolbarReplayButton");
const welcomeScreen = document.getElementById("welcomeScreen");
const startButton = document.getElementById("startButton");
const giftNote = document.getElementById("giftNote");
const giftLabel = document.getElementById("giftLabel");
const balloonMessage = document.getElementById("balloonMessage");
const cakeNote = document.getElementById("cakeNote");
const cakeSliceLeft = document.querySelector(".cake-slice-left");
const cakeSliceRight = document.querySelector(".cake-slice-right");
const setupPanel = document.getElementById("setupPanel");
const form = document.getElementById("personalizationForm");
const birthdayCard = document.querySelector(".birthday-card");
const audioContext = window.AudioContext || window.webkitAudioContext;
const revealTextItems = [
  document.querySelector(".cake-area > .eyebrow"),
  document.querySelector(".cake-area > h1"),
  document.querySelector(".cake-area > .name"),
  hint,
  message,
  countdown,
];
const defaults = {
  name: "Wint Warphuu",
  message: "Happy Birthday to my incredible girl. It has been over ten years since we first met, and my love for you is stronger than ever. Even though distance keeps us apart today, you are always close to my heart. I love you more than words can express, and I cannot wait to celebrate many more birthdays with you.",
  birthday: "2026-09-27",
  theme: "night"
};

function readSharedSettings() {
  const params = new URLSearchParams(window.location.search);
  const shared = {};
  if (params.has("name")) shared.name = params.get("name");
  if (params.has("message")) shared.message = params.get("message");
  if (params.has("birthday")) shared.birthday = params.get("birthday");
  if (["night", "sunset", "candy"].includes(params.get("theme"))) shared.theme = params.get("theme");
  return shared;
}

let savedSettings = {};
try {
  savedSettings = JSON.parse(localStorage.getItem("birthdayCard") || "{}");
} catch {
  localStorage.removeItem("birthdayCard");
}
let settings = { ...defaults, ...savedSettings, ...readSharedSettings() };
let blownOut = false;
let typingTimer = null;
let hasCutCake = false;
let parallaxEnabled = false;
let music = null;
let musicTimer = null;
let balloonMessageTimer = null;
const balloonMessages = ["အရမ်းချစ်တယ်", "Happy birthday!", "ချစ်မဝသူလေး", "အချစ်ဆုံးလူငယ်", "ချစ်တယ်", "မင်းကိုချစ်တယ်", "မင်းကအကောင်းဆုံးပါပဲ", "မင်းကိုအမြဲချစ်နေမယ်"];
const elements = {
  name: document.getElementById("recipientName"),
  nameInput: document.getElementById("nameInput"),
  messageInput: document.getElementById("messageInput"),
  birthdayInput: document.getElementById("birthdayInput"),
  photoInput: document.getElementById("photoInput"),
  photoFrame: document.getElementById("photoFrame"),
  photoPreview: document.getElementById("photoPreview")
};

function applySettings() {
  elements.name.textContent = settings.name;
  elements.nameInput.value = settings.name;
  elements.messageInput.value = settings.message;
  elements.birthdayInput.value = settings.birthday;
  document.body.dataset.theme = settings.theme;
  document.querySelectorAll(".theme-swatch").forEach((swatch) => {
    swatch.classList.toggle("active", swatch.dataset.theme === settings.theme);
  });
  updateCountdown();
}

function revealSurprise() {
  if (blownOut) return;
  document.querySelector(".cake-area").classList.add("revealed");
  flame.classList.add("off");
  hint.textContent = "Make a wish come true";
  hint.hidden = false;
  message.hidden = false;
  typeMessage(settings.message);
  if (elements.photoPreview.complete && elements.photoPreview.naturalWidth > 0) {
    elements.photoFrame.hidden = false;
  }
  gift.classList.add("revealed");
  gift.setAttribute("aria-hidden", "false");
  gift.tabIndex = 0;
  revealTextItems.forEach((item, index) => {
    item.classList.remove("text-reveal");
    item.style.setProperty("--text-delay", `${index * 180}ms`);
    window.setTimeout(() => item.classList.add("text-reveal"), 20);
  });
  cake.animate([{ transform: "scale(1)" }, { transform: "scale(1.08)" }, { transform: "scale(1)" }], { duration: 500, easing: "ease-out" });
  createConfetti(70);
  blownOut = true;
}

function resetSurprise() {
  document.querySelector(".cake-area").classList.remove("revealed");
  revealTextItems.forEach((item) => {
    item.classList.remove("text-reveal");
    item.style.removeProperty("--text-delay");
  });
  flame.classList.remove("off");
  hint.textContent = "Click the cake to make a wish";
  hint.hidden = true;
  message.hidden = true;
  elements.photoFrame.hidden = true;
  gift.classList.remove("revealed");
  gift.classList.remove("open");
  giftLabel.textContent = "With love";
  if (giftNote) giftNote.hidden = true;
  document.querySelectorAll(".balloon").forEach((balloon) => balloon.classList.remove("popped"));
  window.clearTimeout(balloonMessageTimer);
  balloonMessage.hidden = true;
  cakeNote.hidden = true;
  cakeSliceLeft.classList.remove("cut-left");
  cakeSliceRight.classList.remove("cut-right");
  document.querySelectorAll(".background-flame, .background-sparkle, .background-heart").forEach((particle) => particle.remove());
  hasCutCake = false;
  gift.setAttribute("aria-hidden", "true");
  gift.tabIndex = -1;
  blownOut = false;
  welcomeScreen.classList.remove("closed");
  welcomeScreen.setAttribute("aria-hidden", "false");
  playBirthdaySong();
  window.setTimeout(() => startButton.focus(), 50);
}

function finishCakeCut() {
  hasCutCake = true;
  cakeSliceLeft.classList.add("cut-left");
  cakeSliceRight.classList.add("cut-right");
  cakeNote.hidden = false;
  createConfetti(18);
  createBackgroundFlames(16);
  createBackgroundSparkles(28);
}

function createBackgroundFlames(amount) {
  for (let index = 0; index < amount; index += 1) {
    const flameParticle = document.createElement("span");
    flameParticle.className = "background-flame";
    flameParticle.textContent = "🔥";
    flameParticle.style.left = `${8 + Math.random() * 84}%`;
    flameParticle.style.top = `${35 + Math.random() * 45}%`;
    flameParticle.style.animationDelay = `${Math.random() * .45}s`;
    confettiBox.appendChild(flameParticle);
    window.setTimeout(() => flameParticle.remove(), 8200);
  }
}

function createBackgroundSparkles(amount) {
  const symbols = ["✦", "✧", "✨", "💖"];
  for (let index = 0; index < amount; index += 1) {
    const sparkle = document.createElement("span");
    sparkle.className = Math.random() > .72 ? "background-heart" : "background-sparkle";
    sparkle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    sparkle.style.left = `${5 + Math.random() * 90}%`;
    sparkle.style.top = `${25 + Math.random() * 65}%`;
    sparkle.style.animationDelay = `${Math.random() * 2.5}s`;
    sparkle.style.animationDuration = `${6.5 + Math.random() * 1.5}s`;
    confettiBox.appendChild(sparkle);
    window.setTimeout(() => sparkle.remove(), 8200);
  }
}

function typeMessage(text) {
  window.clearInterval(typingTimer);
  message.textContent = "";
  let index = 0;
  typingTimer = window.setInterval(() => {
    message.textContent += text[index];
    index += 1;
    if (index >= text.length) window.clearInterval(typingTimer);
  }, 24);
}

function openGift() {
  if (!blownOut) return;
  gift.classList.add("open");
  giftLabel.textContent = "Happy birthday, my love!";
  if (giftNote) giftNote.hidden = false;
  createConfetti(24);
}

function popBalloon(balloon) {
  if (balloon.classList.contains("popped")) return;
  balloon.classList.add("popped");
  const balloonRect = balloon.getBoundingClientRect();
  const cardRect = birthdayCard.getBoundingClientRect();
  const messageLeft = balloonRect.left - cardRect.left + balloonRect.width / 2;
  const messageTop = balloonRect.top - cardRect.top - 12;
  balloonMessage.style.left = `${messageLeft}px`;
  if (messageTop < 55) {
    balloonMessage.dataset.placement = "below";
    balloonMessage.style.top = `${balloonRect.bottom - cardRect.top + 12}px`;
  } else {
    balloonMessage.dataset.placement = "above";
    balloonMessage.style.top = `${messageTop}px`;
  }
  balloonMessage.textContent = balloonMessages[Math.floor(Math.random() * balloonMessages.length)];
  balloonMessage.hidden = false;
  balloonMessage.classList.remove("message-pop");
  window.setTimeout(() => balloonMessage.classList.add("message-pop"), 20);
  window.clearTimeout(balloonMessageTimer);
  balloonMessageTimer = window.setTimeout(() => {
    balloonMessage.hidden = true;
  }, 3000);
  createConfetti(14);
  window.setTimeout(() => balloon.classList.remove("popped"), 5000);
}

async function enableParallax() {
  if (parallaxEnabled || !window.DeviceOrientationEvent) return;
  if (typeof DeviceOrientationEvent.requestPermission === "function") {
    try {
      if (await DeviceOrientationEvent.requestPermission() !== "granted") return;
    } catch {
      return;
    }
  }
  window.addEventListener("deviceorientation", updateParallax, { passive: true });
  parallaxEnabled = true;
}

function updateParallax(event) {
  const tiltX = Math.max(-1, Math.min(1, (event.gamma || 0) / 45)) * 10;
  const tiltY = Math.max(-1, Math.min(1, ((event.beta || 45) - 45) / 45)) * 10;
  document.documentElement.style.setProperty("--tilt-x", `${tiltX.toFixed(2)}px`);
  document.documentElement.style.setProperty("--tilt-y", `${tiltY.toFixed(2)}px`);
}

startButton.addEventListener("click", () => {
  welcomeScreen.classList.add("closed");
  welcomeScreen.setAttribute("aria-hidden", "true");
  playBirthdaySong();
  enableParallax();
});
gift.addEventListener("click", openGift);
gift.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    openGift();
  }
});
document.querySelectorAll(".balloon").forEach((balloon) => {
  balloon.addEventListener("click", () => popBalloon(balloon));
  balloon.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      popBalloon(balloon);
    }
  });
});

cake.addEventListener("click", () => {
  if (blownOut) finishCakeCut();
  else revealSurprise();
});
cake.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    if (blownOut) finishCakeCut();
    else revealSurprise();
  }
});
toolbarReplayButton.addEventListener("click", resetSurprise);
document.getElementById("setupButton").addEventListener("click", () => {
  setupPanel.hidden = false;
  elements.nameInput.focus();
});
document.getElementById("closeSetup").addEventListener("click", () => { setupPanel.hidden = true; });
form.addEventListener("submit", (event) => {
  event.preventDefault();
  settings = {
    ...settings,
    name: elements.nameInput.value.trim() || defaults.name,
    message: elements.messageInput.value.trim() || defaults.message,
    birthday: elements.birthdayInput.value
  };
  localStorage.setItem("birthdayCard", JSON.stringify(settings));
  applySettings();
  setupPanel.hidden = true;
  resetSurprise();
});
document.querySelectorAll(".theme-swatch").forEach((swatch) => {
  swatch.addEventListener("click", () => {
    settings.theme = swatch.dataset.theme;
    document.body.dataset.theme = settings.theme;
    document.querySelectorAll(".theme-swatch").forEach((item) => item.classList.toggle("active", item === swatch));
  });
});
elements.photoInput.addEventListener("change", () => {
  const file = elements.photoInput.files[0];
  if (!file) return;
  elements.photoPreview.src = URL.createObjectURL(file);
  elements.photoFrame.hidden = true;
});
elements.photoPreview.addEventListener("error", () => {
  elements.photoFrame.hidden = true;
});

document.getElementById("downloadButton").addEventListener("click", async () => {
  const button = document.getElementById("downloadButton");
  button.querySelector("span").textContent = "Saving...";
  try {
    if (!window.html2canvas) throw new Error("Image export is unavailable");
    const canvas = await window.html2canvas(document.querySelector(".birthday-card"), {
      backgroundColor: getComputedStyle(document.body).backgroundColor,
      scale: 2,
      useCORS: true,
      ignoreElements: (element) => element.classList.contains("toolbar") || element.classList.contains("welcome-screen")
    });
    const link = document.createElement("a");
    link.download = `${settings.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-birthday-card.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    button.querySelector("span").textContent = "Saved";
  } catch {
    window.print();
    button.querySelector("span").textContent = "Print card";
  }
  window.setTimeout(() => { button.querySelector("span").textContent = "Save"; }, 2200);
});

function playBirthdaySong() {
  if (!audioContext) return;
  stopMusic();
  const context = new audioContext();
  if (context.state === "suspended") context.resume();
  const notes = [
    [261.63, .28], [261.63, .28], [293.66, .5], [261.63, .5], [349.23, .5], [329.63, .9],
    [261.63, .28], [261.63, .28], [293.66, .5], [261.63, .5], [392, .5], [349.23, .9],
    [261.63, .28], [261.63, .28], [523.25, .5], [440, .5], [349.23, .5], [329.63, .5], [293.66, .9],
    [466.16, .28], [466.16, .28], [440, .5], [349.23, .5], [392, .5], [349.23, 1]
  ];
  music = context;
  const playPhrase = () => {
    if (music !== context) return;
    let start = context.currentTime + .05;
    notes.forEach(([frequency, duration]) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(.0001, start);
      gain.gain.exponentialRampToValueAtTime(.13, start + .03);
      gain.gain.exponentialRampToValueAtTime(.0001, start + duration - .03);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start(start);
      oscillator.stop(start + duration);
      start += duration + .035;
    });
    musicTimer = window.setTimeout(playPhrase, (start - context.currentTime) * 1000 + 250);
  };
  playPhrase();
}

function stopMusic() {
  if (musicTimer) window.clearTimeout(musicTimer);
  musicTimer = null;
  if (music) music.close();
  music = null;
}

function updateCountdown() {
  if (!settings.birthday) { countdown.hidden = true; return; }
  const target = new Date(`${settings.birthday}T00:00:00`);
  const days = Math.ceil((target - new Date()) / 86400000);
  countdown.textContent = days > 0 ? `${days} days until the big day` : "Today is the big day!";
  countdown.hidden = false;
}

function createConfetti(amount) {
  const pieces = ["#d4af37", "#c9a7eb", "#ffffff", "#f5b5c8", "#9dd6d0"];

  for (let i = 0; i < amount; i++) {
    const piece = document.createElement("span");
    piece.className = "confetti";

    const x = (Math.random() - 0.5) * 650;
    const y = 100 + Math.random() * 450;

    piece.style.setProperty("--x", `${x}px`);
    piece.style.setProperty("--y", `${y}px`);
    piece.style.background = pieces[Math.floor(Math.random() * pieces.length)];
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;
    piece.style.animationDelay = `${Math.random() * 0.25}s`;

    confettiBox.appendChild(piece);

    setTimeout(() => piece.remove(), 2200);
  }
}

applySettings();
