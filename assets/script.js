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

// Event listeners (HANYA UNTUK MODAL)
// Pastikan listener ini tidak error jika elemennya tidak ada di halaman
if (ceritaItems && closeBtn && modal) {
  ceritaItems.forEach((e) => {
    e.addEventListener("click", () => openModal(e));
  });
  closeBtn.addEventListener("click", closeModal);
  window.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
}

/* ==================================================== */
/* LOGIKA BARU: BELAJAR BERSAMA TEMAN (Dropdown Sederhana)*/
/* ==================================================== */

function displayGroupInfo() {
  const groupSelector = document.getElementById("group-selector");
  // Periksa apakah elemen ada sebelum melanjutkan
  if (!groupSelector) return;

  const displayArea = document.querySelector(".group-info-display");

  // Dapatkan opsi yang sedang dipilih
  const selectedOption = groupSelector.options[groupSelector.selectedIndex];

  // Dapatkan value dari opsi yang dipilih
  const groupValue = selectedOption.value;

  if (groupValue === "") {
    // Jika kembali ke "-- Pilih Kelompok --", reset teksnya
    displayArea.textContent = "Pilih kelompok dari daftar di bawah.";
    displayArea.style.color = "#333"; // Warna teks default
  } else {
    // Dapatkan data dari atribut data-*
    const groupName = selectedOption.text;
    const currentMembers = parseInt(selectedOption.dataset.current);
    const capacity = parseInt(selectedOption.dataset.capacity);

    // Tampilkan status kelompok
    let statusText = `kamu memilih ${groupName}. (${currentMembers} / ${capacity} anggota)`;
    displayArea.textContent = statusText;

    // Beri warna merah jika kelompok sudah penuh
    if (currentMembers >= capacity) {
      displayArea.style.color = "red";
      displayArea.textContent += " - Penuh!";
    } else {
      displayArea.style.color = "green"; // Warna hijau jika tersedia
      displayArea.textContent += " - Tersedia";
    }
  }
}

function joinSimpleGroup() {
  const groupSelector = document.getElementById("group-selector");
  const nameInput = document.getElementById("student-name-simple");
  const displayArea = document.querySelector(".group-info-display");

  // Periksa apakah elemen ada
  if (!groupSelector || !nameInput || !displayArea) return;

  // Dapatkan nama dan kelompok yang dipilih
  const studentName = nameInput.value.trim(); // .trim() untuk hapus spasi di awal/akhir
  const selectedOption = groupSelector.options[groupSelector.selectedIndex];
  const groupValue = selectedOption.value;
  const groupText = selectedOption.text; // "Kelompok A", "Kelompok B", dst.

  // === Validasi Input ===

  // 1. Cek apakah nama sudah diisi
  if (studentName === "") {
    alert("Harap masukkan nama kamu terlebih dahulu.");
    return; // Hentikan fungsi
  }

  // 2. Cek apakah kelompok sudah dipilih
  if (groupValue === "") {
    alert("Harap pilih kelompok kamu terlebih dahulu.");
    return; // Hentikan fungsi
  }

  // === Validasi Kapasitas Kelompok ===
  let currentMembers = parseInt(selectedOption.dataset.current);
  const capacity = parseInt(selectedOption.dataset.capacity);

  if (currentMembers >= capacity) {
    displayArea.textContent = `Maaf, ${groupText} sudah penuh. Silakan pilih kelompok lain.`;
    displayArea.style.color = "red";
    return; // Hentikan fungsi karena kelompok penuh
  }

  // === Jika Sukses ===

  // Tampilkan pesan sukses yang kamu minta
  const successMessage = `Selamat, ${studentName}! Kamu telah berhasil bergabung dengan ${groupText}.`;

  // Update jumlah anggota di data attribute
  currentMembers++;
  selectedOption.dataset.current = currentMembers;

  // Tampilkan pesan di display area
  displayArea.innerHTML = `
      <span style="font-weight: bold; color: green;">${successMessage}</span>
      <br>
      Status kelompok saat ini: ${currentMembers} / ${capacity} anggota.
    `;

  // Kosongkan input nama setelah berhasil bergabung
  nameInput.value = "";
}

/* ==================================================== */
/* LOGIKA BARU: BLOK KHUSUS EKSPLORASI BUDAYA */
/* ==================================================== */

// Fungsi untuk mengirim ringkasan cerita (Simulasi)
function checkRingkasan(buttonElement) {
  // 1. Dapatkan elemen textarea
  const textarea = document.getElementById("cerita-ringkasan");
  if (!textarea) return;

  // 2. Dapatkan teks di dalamnya (dihilangkan spasi di awal/akhir)
  const ringkasanText = textarea.value.trim();

  // 3. Validasi: Cek apakah textarea kosong
  if (ringkasanText === "") {
    alert("Harap tuliskan ringkasan Ananda terlebih dahulu.");
    return; // Hentikan fungsi jika kosong
  }

  // 4. Jika berhasil (sesuai permintaan Anda):

  // - Terapkan border hijau
  textarea.style.borderColor = "green";
  textarea.style.borderWidth = "2px";

  // - Buat textarea tidak bisa diedit lagi
  textarea.readOnly = true;

  // 5. (Tambahan Opsional) Nonaktifkan tombolnya
  buttonElement.disabled = true;
  buttonElement.textContent = "Telah Tersimpan";
}

// Fungsi untuk memeriksa jawaban Asal Provinsi (Simulasi Teks Bebas)
function checkProvinsiAnswers() {
  // ASUMSI KUNCI JAWABAN (Harap sesuaikan dengan gambar Baju Adat yang sebenarnya)
  const kunciProvinsi = {
    "provinsi-1": "Aceh",
    "provinsi-2": "Jawa Barat",
    "provinsi-3": "Bali",
    "provinsi-4": "Papua",
  };

  let correctCount = 0;
  const totalQuestions = Object.keys(kunciProvinsi).length;

  for (let i = 1; i <= totalQuestions; i++) {
    const inputId = `provinsi-${i}`;
    const inputElement = document.getElementById(inputId);
    if (!inputElement) continue; // Lewati jika elemen tidak ada

    const jawabanSiswa = inputElement.value.trim().toLowerCase();
    const jawabanBenar = kunciProvinsi[inputId].toLowerCase();
    const parentCard = inputElement.closest(".card");

    // Menghapus kelas feedback sebelumnya
    parentCard.classList.remove("jawaban-benar", "jawaban-salah");

    // Cek jawaban
    if (jawabanSiswa === jawabanBenar) {
      correctCount++;
      parentCard.classList.add("jawaban-benar");
    } else if (jawabanSiswa.length > 0) {
      parentCard.classList.add("jawaban-salah");
    }
  }

  alert(
    `kamu berhasil menjawab ${correctCount} dari ${totalQuestions} provinsi dengan tepat!`
  );
}

function checkMatchingAnswers() {
  // Kunci Jawaban berdasarkan gambar:
  // Teks 1 (Kebaya Labuh) -> Gambar 2
  // Teks 2 (Teluk Belanga) -> Gambar 3
  // Teks 3 (Cekak Musang) -> Gambar 1
  // Teks 4 (Kebaya Pendek) -> Gambar 5
  // Teks 5 (Pengantin Melayu) -> Gambar 4

  // Kunci Kiri (Teks ID) -> Kunci Kanan (Gambar ID)
  const textToImageMatch = {
    "text-match-1": "image-match-2", // Kebaya Labuh (1) -> Gambar (2)
    "text-match-2": "image-match-3", // Teluk Belanga (2) -> Gambar (3)
    "text-match-3": "image-match-1", // Cekak Musang (3) -> Gambar (1)
    "text-match-4": "image-match-5", // Kebaya Pendek (4) -> Gambar (5)
    "text-match-5": "image-match-4", // Pengantin Melayu (5) -> Gambar (4)
  };

  let correctCount = 0;
  const totalQuestions = Object.keys(textToImageMatch).length;

  // 1. Bersihkan semua feedback visual dan teks sebelum pengecekan baru
  document.querySelectorAll(".match-item").forEach((item) => {
    item.classList.remove("jawaban-benar", "jawaban-salah");
    const label = item.querySelector("label");
    if (label) {
      label.style.color = ""; // Hapus warna teks label
    }
  });
  document.querySelectorAll(".feedback-message").forEach((span) => {
    span.textContent = ""; // Hapus teks feedback
    span.classList.remove("text-benar", "text-salah"); // Hapus warna teks feedback
  });

  for (const textId in textToImageMatch) {
    const imageId = textToImageMatch[textId];

    const textSelect = document.getElementById(textId);
    const imageSelect = document.getElementById(imageId);

    // Periksa apakah elemen ditemukan sebelum mengakses properti
    if (textSelect && imageSelect) {
      const textValue = textSelect.value;
      const imageValue = imageSelect.value;

      const textItem = textSelect.closest(".match-item");
      const imageItem = imageSelect.closest(".match-item");

      const textLabel = textItem.querySelector("label");
      const imageFeedbackSpan = document.getElementById(`feedback-${imageId}`); // Ambil span feedback untuk gambar
      const textFeedbackSpan = document.getElementById(`feedback-${textId}`); // Ambil span feedback untuk teks

      // Logika Pemeriksaan
      // 1. Cek apakah kedua sisi sudah memilih angka
      if (textValue && imageValue) {
        // 2. Cek apakah angka yang dipilih SAMA
        if (textValue === imageValue) {
          correctCount++;
          // Beri feedback hijau pada kedua pasangan
          textItem.classList.add("jawaban-benar");
          imageItem.classList.add("jawaban-benar");
          if (textLabel) textLabel.style.color = "green";
          if (textFeedbackSpan) {
            textFeedbackSpan.textContent = "Benar!";
            textFeedbackSpan.classList.add("text-benar");
          }
          if (imageFeedbackSpan) {
            imageFeedbackSpan.textContent = "Benar!";
            imageFeedbackSpan.classList.add("text-benar");
          }
        } else {
          // Angka dipilih, tapi TIDAK COCOK
          textItem.classList.add("jawaban-salah");
          imageItem.classList.add("jawaban-salah");
          if (textLabel) textLabel.style.color = "red";
          if (textFeedbackSpan) {
            textFeedbackSpan.textContent = "Salah.";
            textFeedbackSpan.classList.add("text-salah");
          }
          if (imageFeedbackSpan) {
            imageFeedbackSpan.textContent = "Salah.";
            imageFeedbackSpan.classList.add("text-salah");
          }
        }
      } else {
        // Jika salah satu atau keduanya belum dipilih
        if (textFeedbackSpan) {
          textFeedbackSpan.textContent = "Belum dipilih.";
          textFeedbackSpan.classList.add("text-salah"); // Opsional: kasih warna merah juga
        }
        if (imageFeedbackSpan) {
          imageFeedbackSpan.textContent = "Belum dipilih.";
          imageFeedbackSpan.classList.add("text-salah"); // Opsional: kasih warna merah juga
        }
      }
    } else {
      console.error("Elemen tidak ditemukan:", textId, imageId);
    }
  }

  // Tampilkan hasil akhir yang lebih menarik
  const finalResultContainer = document.getElementById(
    "final-result-container"
  );
  const finalResultMessage = document.getElementById("final-result-message");
  const finalResultDetail = document.getElementById("final-result-detail");

  if (!finalResultContainer || !finalResultMessage || !finalResultDetail)
    return;

  let message = "";
  let detail = `Anda berhasil mencocokkan ${correctCount} dari ${totalQuestions} pasangan.`;

  if (correctCount === totalQuestions) {
    message = "Selamat! Semua Jawaban Anda Benar!";
    finalResultMessage.style.color = "green";
  } else if (correctCount > totalQuestions / 2) {
    message = "Bagus! Anda sudah cukup baik.";
    finalResultMessage.style.color = "orange";
  } else {
    message = "Terus Berlatih! Anda bisa lebih baik.";
    finalResultMessage.style.color = "red";
  }

  finalResultMessage.textContent = message;
  finalResultDetail.textContent = detail;
  finalResultContainer.style.display = "block"; // Tampilkan container hasil
}

/* ==================================================== */
/* LOGIKA BARU: KUIS SLIDER (UJI KEMAMPUAN) */
/* ==================================================== */

// Data Kuis (diekstrak dari HTML asli)
const quizData = [
  {
    id: 1,
    question:
      '"Mereka saling bertukar cerita tentang pakaian adat masing-masing". Hal yang dilakukan mereka termasuk bentuk cara melestarikan keberagaman budaya secara umum yang mana?',
    options: [
      "Meningkatkan toleransi antar sesama",
      "Menghormati budaya orang lain",
      "Memakan pakaian Melayu Riau di acara penting",
      "Mengenalkan budaya ke orang lain.",
    ],
    correct: 3, // "Mengenalkan budaya ke orang lain."
  },
  {
    id: 2,
    question: "Apa manfaat memakai pakaian adat di sekolah?",
    options: [
      "Melestarikan keberagaman budaya",
      "Ajang pamer",
      "Mempercantik diri",
      "Agar bisa memaksa orang lain",
    ],
    correct: 0, // "Melestarikan keberagaman budaya"
  },
  {
    id: 3,
    question:
      "Salah satu cara melestarikan keberagaman budaya secara umum, kecuali",
    options: [
      "Mengikuti kegiatan budaya",
      "Menambah penghasilan",
      "Mengenalkan budaya ke orang lain",
      "Menghormati budaya orang lain",
    ],
    correct: 1, // "Menambah penghasilan"
  },
  {
    id: 4,
    question:
      "Kamu punya teman dari daerah lain yang memakai pakaian adatnya. Apa sikap yang paling baik?",
    options: [
      "Mengejek supaya dia malu",
      "Diam saja dan tidak peduli",
      "Menghargai dan memuji karena budayanya indah",
      "Menyuruhnya ganti dengan baju modern",
    ],
    correct: 2, // "Menghargai dan memuji..."
  },
  {
    id: 5,
    question: "Mengapa keberagaman budaya perlu diwariskan ke generasi muda?",
    options: [
      "Supaya budaya Indonesia tetap terjaga dan tidak hilang",
      "Supaya hanya orang tua yang mengenalnya",
      "Supaya budaya asing lebih banyak masuk",
      "Supaya anak-anak tidak mau belajar budaya",
    ],
    correct: 0, // "Supaya budaya Indonesia tetap terjaga..."
  },
  {
    id: 6,
    question:
      "Andi melihat ada pertunjukkan tari daerah di alun-alun. Temannnya paling malas nonton karena menurutnya itu kuno. Apa yang sebaiknyaaa Andi lakukan agar budaya tetap terjaga?",
    options: [
      "Ikut menertawakan tarian itu",
      "Mengajak temannya untuk menonton dan menghargai tarian daerah",
      "Pulang saja karena acaranya membosankan",
      "Meminta pertunjukkan diganti dengan konser modern",
    ],
    correct: 1, // "Mengajak temannya untuk menonton..."
  },
  {
    id: 7,
    question:
      "Di sekolah, guru meminta murid mengenalkan budaya daerahnya. Siti bingung mau pilih cara yang mana. Menurut Ananda, cara mana yang paling baik untuk menjaga budaya tetap dikenal?",
    options: [
      "Menceritakan budaya lewat gambar, lagu, atau video sederhana",
      "Diam saja agar tidak salah bicara",
      "Meniru budaya negara lain",
      "Membiarkan budaya dilupakan karena sudah tua",
    ],
    correct: 0, // "Menceritakan budaya lewat gambar..."
  },
  {
    id: 8,
    question:
      "Saat lomba, Beni memakai baju derah Melayu Riau. Ada teman yang menertawakan. Jika kamu jadi Beni, apa yang harus dilakukan untuk melestarikan budaya?",
    options: [
      "Melepas baju adat lalu ganti baju kaos modern",
      "Tetap memakai baju daerah Melayu Riau dengan bangga",
      "Ikut menertawakan dirinya sendiri",
      "Tidak ikut lomba supaya tidak malu",
    ],
    correct: 1, // "Tetap memakai baju daerah..."
  },
  {
    id: 9,
    question:
      "Lina ingin menjaga budaya daerahnya agar tidak hilang. Menurutmu, tindakan apa yang paling tepat?",
    options: [
      "Mengikuti acara budaya di sekolah atau lingkungan sekitar",
      "Membiarkan orang lain menjaga budaya sendiri",
      "Hanya belajar budaya lewat internet tanpa ikut serta",
      "Menyembunyikan budayanya supaya tidak diketahui orang lain",
    ],
    correct: 0, // "Mengikuti acara budaya..."
  },
  {
    id: 10,
    question:
      "Di rumah, Raka suka mendengar cerita kakeknya tentang budaya daerah. Apa yang bisa dilakukan Raka supaya budaya itu tetap dikenal orang lain?",
    options: [
      "Menyimpan cerita itu sendiri saja",
      "Menceritakan kembali ke teman",
      "Melupakan karena sudah kuno",
      "Menutup-nutupi supaya tidak diketahui",
    ],
    correct: 1, // "Menceritakan kembali ke teman"
  },
];

let currentQuestion = 0;
let userAnswers = new Array(quizData.length).fill(undefined);

// Inisialisasi Kuis
function initQuiz() {
  const container = document.getElementById("quizContainer");
  if (!container) return; // Hentikan jika container tidak ada
  container.innerHTML = "";

  quizData.forEach((quiz, index) => {
    const quizCard = document.createElement("div");
    // Gunakan kelas .card dari style.css
    quizCard.className = `quiz-card card ${
      index === 0 ? "active" : "inactive"
    }`;
    quizCard.id = `quiz-${index}`;

    let optionsHTML = "";
    quiz.options.forEach((option, optIndex) => {
      // Adaptasi ke struktur kelas .checkbox-item dari style.css
      optionsHTML += `
        <label class="checkbox-item" style="margin-bottom: 10px; padding-left: 5px;">
          <input type="radio" name="question${index}" value="${optIndex}" style="width: 18px; height: 18px; margin-right: 10px;">
          <span>${option}</span>
        </label>
      `;
    });

    // Gunakan kelas .question-number dan .sub-heading dari style.css
    quizCard.innerHTML = `
      <p class="question-number">Soal ${quiz.id} dari 10</p>
      <h4 class="sub-heading quiz-question-text" style="margin-top: 5px; margin-bottom: 20px;">
        ${quiz.question}
      </h4>
      <div class="checkbox-group" style="display: flex; flex-direction: column; gap: 10px;">
        ${optionsHTML}
      </div>
    `;

    container.appendChild(quizCard);
  });

  // Tambahkan event listeners ke radio buttons yang baru dibuat
  document
    .querySelectorAll('#quizContainer input[type="radio"]')
    .forEach((radio) => {
      radio.addEventListener("change", saveAnswer);
    });

  // Panggil updateNav/Progress untuk set state awal
  updateNavigation();
  updateProgress();
}

// Simpan jawaban
function saveAnswer(e) {
  const questionIndex = parseInt(e.target.name.replace("question", ""));
  const answer = parseInt(e.target.value);
  userAnswers[questionIndex] = answer;
  updateProgress();

  // Opsional: Otomatis pindah ke soal berikutnya setelah memilih
  // if (currentQuestion < quizData.length - 1) {
  //   setTimeout(() => navigateQuiz(1), 300);
  // }
}

// Navigasi Kuis
function navigateQuiz(direction) {
  const prevCard = document.getElementById(`quiz-${currentQuestion}`);
  if (prevCard) {
    prevCard.classList.remove("active");
    prevCard.classList.add("inactive");
  }

  currentQuestion += direction;

  const nextCard = document.getElementById(`quiz-${currentQuestion}`);
  if (nextCard) {
    nextCard.classList.remove("inactive");
    nextCard.classList.add("active");
  }

  updateNavigation();
}

// Update Tombol Navigasi
function updateNavigation() {
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const submitSection = document.getElementById("submitSection");
  const questionNumber = document.getElementById("questionNumber");
  const navContainer = document.querySelector(".quiz-navigation");

  // **** PERUBAHAN DI SINI ****
  const introBox = document.getElementById("quiz-intro-box");

  if (
    !prevBtn ||
    !nextBtn ||
    !submitSection ||
    !questionNumber ||
    !navContainer
  )
    return;

  // Update nomor soal
  questionNumber.textContent = `Soal ${currentQuestion + 1} dari 10`;

  // Tombol Sebelumnya
  prevBtn.disabled = currentQuestion === 0;

  // Tombol Selanjutnya / Submit
  if (currentQuestion === quizData.length - 1) {
    nextBtn.style.display = "none";
    submitSection.style.display = "block";
  } else {
    nextBtn.style.display = "block";
    submitSection.style.display = "none";
  }

  // **** PERUBAHAN DI SINI ****
  // (Untuk menyembunyikan/menampilkan kotak intro)
  if (introBox) {
    if (currentQuestion === 0) {
      introBox.style.display = "block";
    } else {
      introBox.style.display = "none";
    }
  }
}

// Update Progress Bar
function updateProgress() {
  const answeredCount = userAnswers.filter((a) => a !== undefined).length;
  const progressPercent = (answeredCount / quizData.length) * 100;

  const progressBar = document.getElementById("progressBar");
  const progressText = document.getElementById("progressText");

  if (progressBar) progressBar.style.width = `${progressPercent}%`;
  if (progressText)
    progressText.textContent = `${answeredCount} / ${quizData.length}`;
}

// Kirim Kuis
function submitQuiz() {
  // ADAPTASI: Gunakan 'student-name-quiz' sesuai ID di HTML
  const namaSiswa = document.getElementById("student-name-quiz").value.trim();

  if (!namaSiswa) {
    alert("Silakan masukkan nama Anda terlebih dahulu!");
    document.getElementById("student-name-quiz").focus();
    return;
  }

  const unanswered = userAnswers.filter((a) => a === undefined).length;
  if (unanswered > 0) {
    const confirmSubmit = confirm(
      `Anda belum menjawab ${unanswered} soal. Yakin ingin submit?`
    );
    if (!confirmSubmit) return;
  }

  // Hitung skor
  let score = 0;
  quizData.forEach((quiz, index) => {
    if (userAnswers[index] === quiz.correct) {
      score++;
    }
  });

  // Sembunyikan UI Kuis
  document.getElementById("quizContainer").style.display = "none";
  document.querySelector(".quiz-navigation").style.display = "none";
  document.getElementById("submitSection").style.display = "none";

  // Sembunyikan juga progress bar dan nama
  if (document.querySelector(".quiz-progress-container")) {
    document.querySelector(".quiz-progress-container").style.display = "none";
  }
  if (document.querySelector(".quiz-input-group")) {
    document.querySelector(".quiz-input-group").style.display = "none";
  }

  // **** PERUBAHAN DI SINI ****
  // (Ganti querySelector lama dengan ID baru)
  const introBox = document.getElementById("quiz-intro-box");
  if (introBox) {
    introBox.style.display = "none";
  }

  // Tampilkan hasil
  const resultSection = document.getElementById("resultSection");
  resultSection.style.display = "block";

  document.getElementById("scoreDisplay").textContent = `${score}/10`;

  let message = "";
  if (score >= 9) {
    message = `Luar biasa, ${namaSiswa}! Kamu sangat memahami materi ini! 🌟`;
  } else if (score >= 7) {
    message = `Bagus sekali, ${namaSiswa}! Pemahaman kamu sangat baik! 👏`;
  } else if (score >= 5) {
    message = `Cukup baik, ${namaSiswa}! Terus belajar ya! 💪`;
  } else {
    message = `Jangan menyerah, ${namaSiswa}! Coba ulangi dan baca materi lagi! 📚`;
  }

  document.getElementById("scoreMessage").textContent = message;
}

// Reset Kuis
function resetQuiz() {
  currentQuestion = 0;
  userAnswers.fill(undefined);

  // ADAPTASI: Gunakan 'student-name-quiz'
  document.getElementById("student-name-quiz").value = "";

  // Tampilkan kembali UI kuis
  document.getElementById("quizContainer").style.display = "block";
  document.querySelector(".quiz-navigation").style.display = "flex"; // Gunakan 'flex'
  document.getElementById("resultSection").style.display = "none";

  // Tampilkan kembali progress bar dan nama
  if (document.querySelector(".quiz-progress-container")) {
    document.querySelector(".quiz-progress-container").style.display = "block";
  }
  if (document.querySelector(".quiz-input-group")) {
    document.querySelector(".quiz-input-group").style.display = "block";
  }

  // **** PERUBAHAN DI SINI ****
  // (Ganti querySelector lama dengan ID baru)
  const introBox = document.getElementById("quiz-intro-box");
  if (introBox) {
    introBox.style.display = "block";
  }

  // Reset semua radio buttons
  document
    .querySelectorAll('#quizContainer input[type="radio"]')
    .forEach((radio) => {
      radio.checked = false;
    });

  // Reset ke soal pertama
  document.querySelectorAll(".quiz-card").forEach((card, index) => {
    if (index === 0) {
      card.classList.remove("inactive");
      card.classList.add("active");
    } else {
      card.classList.remove("active");
      card.classList.add("inactive");
    }
  });

  updateNavigation();
  updateProgress();
}

// Inisialisasi tampilan saat halaman dimuat
// INI ADALAH BAGIAN PALING PENTING
document.addEventListener("DOMContentLoaded", function () {
  // Menjalankan fungsi untuk halaman yang memiliki 'group-selector'
  if (document.getElementById("group-selector")) {
    displayGroupInfo();
  }

  // Menjalankan fungsi untuk halaman yang memiliki 'quizContainer'
  if (document.getElementById("quizContainer")) {
    initQuiz();
  }

  // (Fungsi modal tidak perlu ada di sini karena event listenernya
  // sudah ditambahkan di atas dengan pengecekan 'if (ceritaItems ...)')
});
