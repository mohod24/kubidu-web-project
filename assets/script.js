const modal = document.getElementById("cerita-modal"),
  modalBody = document.getElementById("modal-body-content"),
  closeBtn = document.querySelector(".close-button"),
  ceritaItems = document.querySelectorAll(".cerita-item");

// Konversi URL ke embed jika dari YouTube/Drive
function getEmbedUrl(url) {
  try {
    const youtubeRegex =
      /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]+)/;
    const match = url.match(youtubeRegex);

    if (match && match[1]) {
      // autoplay=1 agar langsung jalan
      return `https://www.youtube.com/embed/${match[1]}?autoplay=1`;
    }

    if (url.includes("drive.google.com/file/d/")) {
      const fileId = url.split("/d/")[1].split("/")[0];
      return `https://drive.google.com/file/d/${fileId}/preview`;
    }

    // Kalau bukan YouTube/Drive, return langsung (untuk lokal)
    return url;
  } catch (e) {
    console.error("URL tidak valid:", e);
    return url;
  }
}

// Buka modal
function openModal(e) {
  const type = e.getAttribute("data-type");
  const title = e.getAttribute("data-title");
  modalBody.innerHTML = "";

  // Judul
  const heading = document.createElement("h2");
  heading.textContent = title;
  modalBody.appendChild(heading);

  // Jika tipe video
  if (type === "video") {
    const videoSrc = e.getAttribute("data-src");
    const embedSrc = getEmbedUrl(videoSrc);

    // === Untuk video lokal (file .mp4) ===
    if (embedSrc.endsWith(".mp4")) {
      const video = document.createElement("video");
      video.setAttribute("src", embedSrc);
      video.setAttribute("controls", "true");
      video.setAttribute("playsinline", "true");
      video.setAttribute("autoplay", "true");
      video.setAttribute("class", "video-iframe");
      video.volume = 1.0; // pastikan suara aktif
      video.muted = false;

      // Pastikan video mulai play saat modal dibuka (klik user)
      video.addEventListener("loadeddata", () => {
        video.play().catch((err) => {
          console.warn("Autoplay gagal, mungkin diblokir browser:", err);
        });
      });

      modalBody.appendChild(video);
    } else {
      // === Untuk YouTube atau Google Drive ===
      const iframe = document.createElement("iframe");
      iframe.setAttribute("src", embedSrc);
      iframe.setAttribute("class", "video-iframe");
      iframe.setAttribute("frameborder", "0");
      iframe.setAttribute(
        "allow",
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      );
      iframe.setAttribute("allowfullscreen", "true");
      modalBody.appendChild(iframe);
    }
  } else {
    // Jika tipe teks biasa
    modalBody.innerHTML += e.querySelector(".full-content").innerHTML;
  }

  modal.style.display = "flex";
}

// Tutup modal
function closeModal() {
  modal.style.display = "none";
  modalBody.innerHTML = "";
}

// Event listeners
ceritaItems.forEach((e) => {
  e.addEventListener("click", () => openModal(e));
});
closeBtn.addEventListener("click", closeModal);
window.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});
