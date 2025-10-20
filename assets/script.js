const modal = document.getElementById("cerita-modal"),
  modalBody = document.getElementById("modal-body-content"),
  closeBtn = document.querySelector(".close-button"),
  ceritaItems = document.querySelectorAll(".cerita-item");
function openModal(e) {
  const t = e.getAttribute("data-type"),
    l = e.getAttribute("data-title");
  if (((modalBody.innerHTML = ""), "video" === t)) {
    const t = e.getAttribute("data-src"),
      a = document.createElement("video");
    (a.src = t), (a.controls = !0), (a.autoplay = !0);
    const o = document.createElement("h2");
    (o.textContent = l), modalBody.appendChild(o), modalBody.appendChild(a);
  } else {
    const t = e.querySelector(".full-content").innerHTML,
      a = document.createElement("h2");
    (a.textContent = l), modalBody.appendChild(a), (modalBody.innerHTML += t);
  }
  modal.style.display = "flex";
}
function closeModal() {
  modal.style.display = "none";
  const e = modalBody.querySelector("video");
  e && (e.pause(), (e.currentTime = 0));
}
ceritaItems.forEach((e) => {
  e.addEventListener("click", () => openModal(e));
}),
  closeBtn.addEventListener("click", closeModal),
  window.addEventListener("click", (e) => {
    e.target == modal && closeModal();
  });
