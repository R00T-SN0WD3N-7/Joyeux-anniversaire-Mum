const startButton = document.getElementById("startButton");
const welcome = document.getElementById("welcome");
const surprise = document.getElementById("surprise");
const audio = document.getElementById("birthdayAudio");
const musicToggle = document.getElementById("musicToggle");
const musicStatus = document.getElementById("musicStatus");
const musicDisc = document.getElementById("musicDisc");
const photoInput = document.getElementById("photoInput");
const slideImage = document.getElementById("slideImage");
const placeholder = document.getElementById("photoPlaceholder");
const photoCounter = document.getElementById("photoCounter");
const dotsContainer = document.getElementById("dots");
const slideCaption = document.getElementById("slideCaption");
const prevButton = document.getElementById("prevButton");
const nextButton = document.getElementById("nextButton");
const replayButton = document.getElementById("replayButton");


let photos = (Array.isArray(window.MUM_PHOTOS)
  ? window.MUM_PHOTOS
  : []).map(path => ({
    url: path,
    name: path.split("/").pop(),
    caption: "Un joli souvenir pour une journée spéciale ✨"
  }));
let currentIndex = 0;
let slideshowTimer = null;
let objectUrls = [];

function setMusicState(playing) {
  musicToggle.textContent = playing ? "Ⅱ" : "▶";
  musicToggle.setAttribute("aria-label", playing ? "Mettre la musique en pause" : "Reprendre la musique");
  musicStatus.textContent = playing ? "La musique joue" : "Musique en pause";
  musicDisc.classList.toggle("playing", playing);
}

async function playMusic() {
  try {
    await audio.play();
    setMusicState(true);
  } catch (error) {
    setMusicState(false);
    musicStatus.textContent = "Ajoute audio/PETIT BOZARD joyeux anniversaire.mp3";
  }
}

function pauseMusic() {
  audio.pause();
  setMusicState(false);
}

startButton.addEventListener("click", async () => {
  launchConfetti();
  welcome.classList.add("hidden");
  surprise.classList.remove("hidden");
  showPhoto(0);
  startSlideshow();
  await playMusic();
  surprise.scrollIntoView({ behavior: "smooth", block: "start" });
});

musicToggle.addEventListener("click", () => {
  if (audio.paused) playMusic();
  else pauseMusic();
});

audio.addEventListener("play", () => setMusicState(true));
audio.addEventListener("pause", () => setMusicState(false));
audio.addEventListener("error", () => {
  musicStatus.textContent = "Ajoute audio/anniversaire.mp3";
  setMusicState(false);
});

function renderDots() {
  dotsContainer.innerHTML = "";
  photos.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "dot" + (index === currentIndex ? " active" : "");
    dot.setAttribute("aria-label", `Afficher la photo ${index + 1}`);
    dot.addEventListener("click", () => showPhoto(index));
    dotsContainer.appendChild(dot);
  });
}

function showPhoto(index) {
  if (!photos.length) {
    slideImage.classList.remove("loaded");
    placeholder.hidden = false;
    photoCounter.textContent = "0 / 0";
    dotsContainer.innerHTML = "";
    slideCaption.textContent = "Les plus beaux souvenirs méritent d’être célébrés ✨";
    return;
  }
  currentIndex = (index + photos.length) % photos.length;
  slideImage.classList.remove("loaded");
  slideImage.onload = () => {
    slideImage.classList.add("loaded");
    placeholder.hidden = true;
  };
  slideImage.onerror = () => {
    slideImage.classList.remove("loaded");
    placeholder.hidden = false;
  };
  slideImage.src = photos[currentIndex].url;
  slideImage.alt = photos[currentIndex].name || `Photo souvenir ${currentIndex + 1}`;
  photoCounter.textContent = `${currentIndex + 1} / ${photos.length}`;
  slideCaption.textContent = photos[currentIndex].caption || "Un joli souvenir pour une journée spéciale ✨";
  renderDots();
}

function startSlideshow() {
  clearInterval(slideshowTimer);
  if (photos.length > 1) {
    slideshowTimer = setInterval(() => showPhoto(currentIndex + 1), 4500);
  }
}

prevButton.addEventListener("click", () => { showPhoto(currentIndex - 1); startSlideshow(); });
nextButton.addEventListener("click", () => { showPhoto(currentIndex + 1); startSlideshow(); });

photoInput.addEventListener("change", (event) => {
  const selectedFiles = Array.from(event.target.files || []).filter(file => file.type.startsWith("image/"));
  if (!selectedFiles.length) return;
  objectUrls.forEach(URL.revokeObjectURL);
  objectUrls = [];
  photos = selectedFiles.map(file => {
    const url = URL.createObjectURL(file);
    objectUrls.push(url);
    return { url, name: file.name, caption: "Un joli souvenir pour une journée spéciale ✨" };
  });
  showPhoto(0);
  startSlideshow();
  if (!audio.paused) setMusicState(true);
});

replayButton.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
  surprise.classList.add("hidden");
  welcome.classList.remove("hidden");
  pauseMusic();
});

showPhoto(0);

function launchConfetti() {
  const container = document.getElementById("confetti-container");
  if (!container) return;

  const symbols = ["✦", "✧", "♥", "●", "✿"];
  const colors = ["#d4af37", "#e88aaa", "#f5dce6", "#ffffff"];

  for (let i = 0; i < 65; i++) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    piece.textContent =
      symbols[Math.floor(Math.random() * symbols.length)];

    piece.style.left = Math.random() * 100 + "vw";
    piece.style.color =
      colors[Math.floor(Math.random() * colors.length)];
    piece.style.fontSize = (10 + Math.random() * 14) + "px";
    piece.style.animationDelay = (Math.random() * 1.2) + "s";

    container.appendChild(piece);
    piece.addEventListener("animationend", () => piece.remove());
  }
}