/* =========================================================
   ⚙️ KONFIGURASI — EDIT BAGIAN INI SESUAI ISI KADO KAMU
   ========================================================= */

const CONFIG = {
  // Kode kunci 4 digit untuk membuka kado. Ganti sesuka kamu.
  lockCode: "0626",

  // Nama orang yang menerima kado ini.
  recipientName: "Sayang",

  // Nama kamu (pengirim), muncul di tanda tangan surat.
  senderName: "Aku",

  // Musik latar. Taruh file mp3 di assets/music.mp3 (nama file harus pas sama).
  // Kalau file belum ada / belum diupload, tombol musik tetap muncul tapi nggak ngapa-ngapain — aman, nggak error.
  musicEnabled: true,

  // Daftar "alasan random" — satu akan muncul acak setiap kali dibuka.
  // Tambah / kurangi / ganti sesuka hati.
  randomReasons: [
    "karena hari Kamis butuh validasi juga",
    "karena senyummu itu bagus buat statistik dunia",
    "karena nggak ada alasan pun, kamu tetap layak dikasih sesuatu",
    "karena aku kebetulan lagi mikirin kamu, itu aja",
    "karena kadang kado terbaik datang di hari yang paling biasa",
  ],

  // Galeri momen. Ganti `image` dengan path foto kamu (taruh di folder assets/),
  // atau biarkan kosong "" untuk pakai placeholder teks.
  moments: [
    {
      tag: "momen 01",
      image: "",
      caption: "Foto pertama kalian — atau apa pun yang paling pas kamu mau tunjukin di sini.",
    },
    {
      tag: "momen 02",
      image: "",
      caption: "Ganti teks ini dengan cerita singkat di balik foto kedua.",
    },
    {
      tag: "momen 03",
      image: "",
      caption: "Satu lagi momen kecil yang menurutmu berarti.",
    },
  ],

  // Isi surat. Pakai \n\n untuk ganti paragraf.
  letter: `Halo.

Aku nggak nulis ini karena ada momen besar yang harus dirayain. Aku cuma mau bilang, di tengah hari-hari yang biasa aja, kamu tetap jadi salah satu hal yang bikin aku senyum sendiri.

Nggak perlu alasan besar buat bikin orang senang. Kadang cukup diingat aja, bahwa ada yang mikirin di hari yang nggak spesial-spesial.

Makasih udah jadi kamu.`,
};

/* =========================================================
   STATE
   ========================================================= */

let currentScene = 0;
let galleryIndex = 0;
const TOTAL_SCENES = 5;

/* =========================================================
   HELPERS
   ========================================================= */

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/* =========================================================
   SCENE NAVIGATION
   ========================================================= */

function goToScene(index) {
  if (index < 0 || index >= TOTAL_SCENES) return;
  if (index === currentScene) return;

  const scenes = $$(".scene");
  const outgoing = scenes[currentScene];
  const incoming = scenes[index];

  launchFlowerTransition(currentScene, index);

  if (outgoing && outgoing !== incoming) {
    outgoing.classList.add("is-leaving");
    outgoing.classList.remove("is-active");
    setTimeout(() => outgoing.classList.remove("is-leaving"), 650);
  }

  incoming.classList.add("is-active");
  currentScene = index;
  updateDots();

  if (index === 4) {
    launchConfetti();
  }
}

function updateDots() {
  $$(".dot").forEach((dot, i) => {
    dot.classList.toggle("is-active", i === currentScene);
    dot.classList.toggle("is-done", i < currentScene);
  });
}

/* =========================================================
   SCENE 0 — LOCK / KEYPAD
   ========================================================= */

function initLock() {
  const slots = $$(".keypad-slot");
  const display = $("#keypadDisplay");
  const hint = $("#keypadHint");
  let entered = "";

  function renderSlots() {
    slots.forEach((slot, i) => {
      slot.classList.toggle("is-filled", i < entered.length);
    });
  }

  function reset() {
    entered = "";
    renderSlots();
  }

  function showError(message) {
    hint.textContent = message;
    hint.classList.add("is-error");
    display.classList.add("is-shake");
    setTimeout(() => {
      display.classList.remove("is-shake");
      reset();
      hint.textContent = "masukkan kode kunci";
      hint.classList.remove("is-error");
    }, 480);
  }

  function tryUnlock() {
    if (entered === CONFIG.lockCode) {
      hint.textContent = "terbuka ✓";
      hint.classList.remove("is-error");
      setTimeout(() => goToScene(1), 420);
    } else {
      showError("kode salah, coba lagi");
    }
  }

  $$(".key").forEach((key) => {
    key.addEventListener("click", () => {
      const value = key.dataset.key;

      if (value === "back") {
        entered = entered.slice(0, -1);
        renderSlots();
        return;
      }

      if (value === "hint") {
        hint.textContent = `kode: ${CONFIG.lockCode}`;
        hint.classList.remove("is-error");
        setTimeout(() => {
          if (hint.textContent.startsWith("kode:")) {
            hint.textContent = "masukkan kode kunci";
          }
        }, 1800);
        return;
      }

      if (entered.length >= 4) return;
      entered += value;
      renderSlots();

      if (entered.length === 4) {
        setTimeout(tryUnlock, 200);
      }
    });
  });

  // Dukung input keyboard juga (untuk yang akses dari desktop)
  document.addEventListener("keydown", (e) => {
    if (currentScene !== 0) return;
    if (/^[0-9]$/.test(e.key) && entered.length < 4) {
      entered += e.key;
      renderSlots();
      if (entered.length === 4) setTimeout(tryUnlock, 200);
    } else if (e.key === "Backspace") {
      entered = entered.slice(0, -1);
      renderSlots();
    }
  });
}

/* =========================================================
   SCENE 1 — INTRO
   ========================================================= */

function initIntro() {
  $("#recipientName").textContent = CONFIG.recipientName;
  $("#reasonRandom").textContent = `"${pickRandom(CONFIG.randomReasons)}"`;

  $("#btnToGallery").addEventListener("click", () => goToScene(2));
}

/* =========================================================
   SCENE 2 — GALLERY
   ========================================================= */

function initGallery() {
  const stage = $("#galleryStage");
  const total = CONFIG.moments.length;

  stage.innerHTML = CONFIG.moments
    .map((moment, i) => {
      const bgStyle = moment.image
        ? `style="background-image:url('${moment.image}')"`
        : "";
      const placeholder = moment.image ? "" : "taruh foto di assets/ lalu isi `image` di script.js";

      return `
        <div class="gallery-slide ${i === 0 ? "is-active" : ""}" data-slide="${i}">
          <div class="gallery-photo" ${bgStyle}>${placeholder}</div>
          <div class="gallery-caption">
            <span class="gallery-caption-tag">${moment.tag}</span>
            <p class="gallery-caption-text">${moment.caption}</p>
          </div>
        </div>
      `;
    })
    .join("");

  $("#galleryTotal").textContent = total;
  updateGalleryIndex();

  $("#galleryPrev").addEventListener("click", () => {
    galleryIndex = (galleryIndex - 1 + total) % total;
    renderGallerySlide();
  });

  $("#galleryNext").addEventListener("click", () => {
    galleryIndex = (galleryIndex + 1) % total;
    renderGallerySlide();
  });

  $("#btnToLetter").addEventListener("click", () => goToScene(3));

  // Swipe gesture untuk mobile
  let touchStartX = 0;
  stage.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
  });
  stage.addEventListener("touchend", (e) => {
    const diff = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(diff) < 40) return;
    if (diff < 0) {
      galleryIndex = (galleryIndex + 1) % total;
    } else {
      galleryIndex = (galleryIndex - 1 + total) % total;
    }
    renderGallerySlide();
  });
}

function renderGallerySlide() {
  $$(".gallery-slide").forEach((slide, i) => {
    slide.classList.toggle("is-active", i === galleryIndex);
  });
  updateGalleryIndex();
}

function updateGalleryIndex() {
  $("#galleryIndex").textContent = galleryIndex + 1;
}

/* =========================================================
   SCENE 3 — LETTER
   ========================================================= */

function initLetter() {
  $("#letterBody").textContent = CONFIG.letter;
  $("#senderName").textContent = CONFIG.senderName;
  $("#btnToClosing").addEventListener("click", () => goToScene(4));
}

/* =========================================================
   SCENE 4 — CLOSING + CONFETTI
   ========================================================= */

function initClosing() {
  $("#btnReplay").addEventListener("click", () => {
    galleryIndex = 0;
    renderGallerySlide();
    $("#reasonRandom").textContent = `"${pickRandom(CONFIG.randomReasons)}"`;
    goToScene(0);
    // reset keypad slots juga
    $$(".keypad-slot").forEach((s) => s.classList.remove("is-filled"));
  });
}

function launchConfetti() {
  const canvas = $("#confettiCanvas");
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;

  function resize() {
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;
    ctx.scale(dpr, dpr);
  }
  resize();

  const colors = ["#FF8C61", "#FFD66B", "#8C7AE6", "#FFF8EC"];
  const particles = Array.from({ length: 80 }, () => ({
    x: Math.random() * canvas.clientWidth,
    y: -20 - Math.random() * canvas.clientHeight * 0.5,
    size: 4 + Math.random() * 5,
    color: colors[Math.floor(Math.random() * colors.length)],
    speedY: 1.5 + Math.random() * 2.5,
    speedX: -1 + Math.random() * 2,
    rotation: Math.random() * 360,
    rotationSpeed: -4 + Math.random() * 8,
  }));

  let frame = 0;
  const maxFrames = 220;

  function animate() {
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    particles.forEach((p) => {
      p.y += p.speedY;
      p.x += p.speedX;
      p.rotation += p.rotationSpeed;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      ctx.restore();
    });

    frame++;
    if (frame < maxFrames) {
      requestAnimationFrame(animate);
    } else {
      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    }
  }

  requestAnimationFrame(animate);
}

/* =========================================================
   FLOWER TRANSITION SYSTEM
   ========================================================= */

// Setiap transisi punya "tema bunga" sendiri: warna + bentuk kelopak.
// key dibuat dari "dariScene-keScene", fallback dipakai kalau kombinasi belum diatur.
const FLOWER_THEMES = {
  "0-1": { colors: ["#FF8C61", "#FFB088"], petalShape: "round", count: 26 },   // lock → intro: coral, kelopak bulat lembut
  "1-2": { colors: ["#8C7AE6", "#B3A4F0"], petalShape: "pointed", count: 26 }, // intro → galeri: lavender, kelopak lancip (anggrek)
  "2-3": { colors: ["#FFD66B", "#FFE49A"], petalShape: "round", count: 26 },   // galeri → surat: kuning madu, kelopak bulat (matahari kecil)
  "3-4": { colors: ["#FF8C61", "#FFD66B", "#8C7AE6"], petalShape: "mixed", count: 34 }, // surat → closing: campuran, paling ramai
  "default": { colors: ["#FFF8EC", "#FF8C61"], petalShape: "round", count: 22 },
  "replay": { colors: ["#8C7AE6", "#FFD66B"], petalShape: "pointed", count: 22 },
};

function getFlowerTheme(fromScene, toScene) {
  if (toScene < fromScene) return FLOWER_THEMES.replay;
  const key = `${fromScene}-${toScene}`;
  return FLOWER_THEMES[key] || FLOWER_THEMES.default;
}

function drawPetal(ctx, size, shape) {
  // Menggambar satu kelopak terpusat di origin (0,0), menghadap ke atas.
  ctx.beginPath();
  if (shape === "pointed") {
    // kelopak lancip ala anggrek/tulip
    ctx.moveTo(0, -size);
    ctx.quadraticCurveTo(size * 0.55, -size * 0.2, 0, size);
    ctx.quadraticCurveTo(-size * 0.55, -size * 0.2, 0, -size);
  } else if (shape === "mixed") {
    // bentuk kelopak kecil membulat dengan lekukan, untuk efek "ramai"
    ctx.moveTo(0, -size);
    ctx.bezierCurveTo(size * 0.7, -size * 0.6, size * 0.6, size * 0.5, 0, size);
    ctx.bezierCurveTo(-size * 0.6, size * 0.5, -size * 0.7, -size * 0.6, 0, -size);
  } else {
    // kelopak bulat lembut (default)
    ctx.moveTo(0, -size);
    ctx.bezierCurveTo(size * 0.85, -size * 0.7, size * 0.85, size * 0.5, 0, size);
    ctx.bezierCurveTo(-size * 0.85, size * 0.5, -size * 0.85, -size * 0.7, 0, -size);
  }
  ctx.closePath();
  ctx.fill();
}

let flowerCtx = null;
let flowerCanvasEl = null;
let flowerAnimId = null;

function setupFlowerCanvas() {
  flowerCanvasEl = $("#flowerCanvas");
  flowerCtx = flowerCanvasEl.getContext("2d");
  resizeFlowerCanvas();
  window.addEventListener("resize", resizeFlowerCanvas);
}

function resizeFlowerCanvas() {
  const dpr = window.devicePixelRatio || 1;
  flowerCanvasEl.width = window.innerWidth * dpr;
  flowerCanvasEl.height = window.innerHeight * dpr;
  flowerCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function launchFlowerTransition(fromScene, toScene) {
  if (!flowerCtx) return;
  if (flowerAnimId) cancelAnimationFrame(flowerAnimId);

  const theme = getFlowerTheme(fromScene, toScene);
  const w = window.innerWidth;
  const h = window.innerHeight;

  const petals = Array.from({ length: theme.count }, () => ({
    x: Math.random() * w,
    y: -40 - Math.random() * h * 0.4,
    size: 7 + Math.random() * 9,
    color: theme.colors[Math.floor(Math.random() * theme.colors.length)],
    rotation: Math.random() * 360,
    rotationSpeed: -3 + Math.random() * 6,
    speedY: 2 + Math.random() * 2.6,
    swing: 0.6 + Math.random() * 1.2,
    swingPhase: Math.random() * Math.PI * 2,
    swingSpeed: 0.02 + Math.random() * 0.02,
    opacity: 0.75 + Math.random() * 0.25,
  }));

  let frame = 0;
  const maxFrames = 95;

  function animate() {
    flowerCtx.clearRect(0, 0, w, h);

    petals.forEach((p) => {
      p.y += p.speedY;
      p.swingPhase += p.swingSpeed;
      p.x += Math.sin(p.swingPhase) * p.swing;
      p.rotation += p.rotationSpeed;

      flowerCtx.save();
      flowerCtx.globalAlpha = p.opacity;
      flowerCtx.translate(p.x, p.y);
      flowerCtx.rotate((p.rotation * Math.PI) / 180);
      flowerCtx.fillStyle = p.color;
      drawPetal(flowerCtx, p.size, theme.petalShape === "mixed"
        ? (Math.random() > 0.5 ? "round" : "pointed")
        : theme.petalShape);
      flowerCtx.restore();
    });

    frame++;
    if (frame < maxFrames) {
      flowerAnimId = requestAnimationFrame(animate);
    } else {
      flowerCtx.clearRect(0, 0, w, h);
      flowerAnimId = null;
    }
  }

  flowerAnimId = requestAnimationFrame(animate);
}

/* =========================================================
   MUSIK LATAR
   ========================================================= */

function initMusic() {
  if (!CONFIG.musicEnabled) {
    $("#soundToggle").style.display = "none";
    return;
  }

  const audio = $("#bgMusic");
  const toggleBtn = $("#soundToggle");
  let userEnabled = false;

  function play() {
    audio.volume = 0.55;
    audio.play().then(() => {
      userEnabled = true;
      toggleBtn.setAttribute("aria-pressed", "true");
    }).catch(() => {
      // Browser menahan autoplay tanpa interaksi — itu wajar, tombol tetap bisa diklik manual.
      toggleBtn.setAttribute("aria-pressed", "false");
    });
  }

  function pause() {
    audio.pause();
    userEnabled = false;
    toggleBtn.setAttribute("aria-pressed", "false");
  }

  toggleBtn.addEventListener("click", () => {
    if (userEnabled) {
      pause();
    } else {
      play();
    }
  });

  // Coba mulai musik otomatis begitu kado pertama kali terbuka (klik pertama di keypad sudah jadi "interaksi user").
  let autoStarted = false;
  document.addEventListener("click", () => {
    if (autoStarted) return;
    autoStarted = true;
    play();
  }, { once: true });
}

/* =========================================================
   INIT
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  setupFlowerCanvas();
  initMusic();
  initLock();
  initIntro();
  initGallery();
  initLetter();
  initClosing();
});
