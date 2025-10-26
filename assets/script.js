/* ==================================================== */
/* INISIALISASI                    */
/* ==================================================== */

document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM fully loaded and parsed"); // Log 1: Pastikan DOM siap

  // --- Inisialisasi Modal Cerita/Video ---
  initializeCeritaModal();

  // --- Inisialisasi Fungsi Halaman Spesifik ---
  // Menjalankan fungsi untuk halaman yang memiliki 'group-selector'
  if (document.getElementById("group-selector")) {
    console.log("Initializing Group Selector"); // Log: Grup
    displayGroupInfo();
  }

  // Menjalankan fungsi untuk halaman yang memiliki 'quizContainer'
  if (document.getElementById("quizContainer")) {
    console.log("Initializing Quiz"); // Log: Kuis
    initQuiz();
  }
});


/* ==================================================== */
/* LOGIKA MODAL (CERITA & VIDEO) - Bootstrap Integration */
/* ==================================================== */

function initializeCeritaModal() {
  const ceritaModalElement = document.getElementById("cerita-modal");
  const modalBody = document.getElementById("modal-body-content");
  const modalTitle = document.getElementById("ceritaModalLabel");
  const clickableItems = document.querySelectorAll(".cerita-item, .video-item"); // Target item cerita DAN video

  if (!ceritaModalElement) {
    console.log("Modal element #cerita-modal not found."); // Log 2: Cek elemen modal
    return; // Hentikan jika elemen modal tidak ada
  }

  // Buat instance modal Bootstrap SATU KALI
  const bootstrapModalInstance = new bootstrap.Modal(ceritaModalElement);
  console.log("Bootstrap Modal instance created:", bootstrapModalInstance); // Log 3: Cek instance modal

  if (clickableItems.length === 0) {
      console.log("No clickable .cerita-item or .video-item elements found."); // Log 4: Cek item yang bisa diklik
      return;
  }

  // --- Event Listener untuk SETIAP item yang bisa diklik ---
  clickableItems.forEach((item) => {
    item.addEventListener("click", function (event) {
      console.log("Clickable item clicked:", item); // Log 5: Cek event klik

      // Pastikan elemen modal body dan title ada
      if (!modalBody || !modalTitle) {
          console.error("Modal body or title element not found!");
          return;
      }

      const type = item.getAttribute("data-type");
      const title = item.getAttribute("data-title") || "Detail";
      const videoSrc = item.getAttribute("data-src");
      const fullContentElement = item.querySelector(".full-content"); // Hanya relevan untuk cerita

      // 1. Bersihkan konten modal sebelumnya
      modalBody.innerHTML = "";

      // 2. Set judul modal
      modalTitle.textContent = title;
      console.log(`Setting modal title to: ${title}`); // Log 6: Cek judul

      // 3. Isi konten modal berdasarkan tipe
      if (type === "video" && videoSrc) {
        console.log(`Processing video type with src: ${videoSrc}`); // Log 7: Cek video
        const embedSrc = getEmbedUrl(videoSrc); // Konversi URL
        console.log(`Embed URL generated: ${embedSrc}`); // Log 8: Cek URL embed

        let videoElementHTML = "";
        if (embedSrc && embedSrc.endsWith(".mp4")) {
          // Video Lokal
          videoElementHTML = `
            <div class="ratio ratio-16x9">
              <video src="${embedSrc}" class="video-iframe" controls playsinline autoplay muted>
                Browser Anda tidak mendukung tag video.
              </video>
            </div>`;
        } else if (embedSrc) {
          // YouTube atau Google Drive
          videoElementHTML = `
            <div class="ratio ratio-16x9">
              <iframe src="${embedSrc}" class="video-iframe" frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowfullscreen></iframe>
            </div>`;
        } else {
            console.error("Failed to get a valid embed source."); // Log error jika URL embed gagal
            videoElementHTML = "<p>Gagal memuat video.</p>";
        }
        modalBody.innerHTML = videoElementHTML;

      } else if (type === "text" && fullContentElement) {
        console.log("Processing text type"); // Log 9: Cek tipe teks
        modalBody.innerHTML = fullContentElement.innerHTML;
      } else {
        console.warn("Item type is not video or text, or required data/elements missing."); // Log warning
        modalBody.innerHTML = "<p>Konten tidak tersedia atau tipe tidak dikenali.</p>";
      }

      // 4. Tampilkan modal Bootstrap
      console.log("Showing Bootstrap modal..."); // Log 10: Sebelum menampilkan
      bootstrapModalInstance.show();

    }); // Akhir event listener klik
  }); // Akhir forEach

  // --- Event Listener untuk membersihkan modal saat ditutup ---
  ceritaModalElement.addEventListener('hidden.bs.modal', function () {
    console.log("Modal hidden, clearing body."); // Log 11: Saat modal ditutup
    if (modalBody) {
      modalBody.innerHTML = ""; // Hentikan video/iframe
    }
  });

} // Akhir function initializeCeritaModal

// Konversi URL ke embed (Tetap sama)
function getEmbedUrl(url) {
  try {
    const youtubeRegex = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]+)/;
    const driveRegex = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/; // Regex lebih spesifik untuk ID
    const youtubeMatch = url.match(youtubeRegex);
    const driveMatch = url.match(driveRegex);

    if (youtubeMatch && youtubeMatch[1]) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=1`;
    }
    if (driveMatch && driveMatch[1]) {
       // Selalu gunakan /preview untuk Google Drive
      return `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
    }
    // Cek ekstensi .mp4 untuk video lokal
    if (url.toLowerCase().endsWith(".mp4")) {
        return url;
    }

    console.warn("URL format not recognized for YouTube or Google Drive:", url);
    // Return null atau URL asli jika tidak dikenali? Return null lebih aman untuk error handling
    return null; // Return null jika tidak bisa dikonversi

  } catch (e) {
    console.error("Error parsing URL:", url, e);
    return null; // Return null jika error
  }
}

/* ==================================================== */
/* LOGIKA BELAJAR BERSAMA TEMAN (Dropdown Sederhana)    */
/* ==================================================== */
// --- Functions displayGroupInfo() and joinSimpleGroup() remain UNCHANGED ---
function displayGroupInfo() {
  const groupSelector = document.getElementById("group-selector");
  if (!groupSelector) return;
  const displayArea = document.querySelector(".group-info-display");
  const selectedOption = groupSelector.options[groupSelector.selectedIndex];
  const groupValue = selectedOption.value;

  if (groupValue === "") {
    displayArea.textContent = "Pilih kelompok dari daftar di bawah.";
    displayArea.className = 'group-info-display'; // Reset class
  } else {
    const groupName = selectedOption.text;
    const currentMembers = parseInt(selectedOption.dataset.current || 0);
    const capacity = parseInt(selectedOption.dataset.capacity || 1);
    let statusText = `Kamu memilih ${groupName}. (${currentMembers} / ${capacity} anggota)`;
    displayArea.textContent = statusText;

    if (currentMembers >= capacity) {
      displayArea.className = 'group-info-display full';
      displayArea.textContent += " - Penuh!";
    } else {
      displayArea.className = 'group-info-display';
      displayArea.textContent += " - Tersedia";
    }
  }
}

function joinSimpleGroup() {
  const groupSelector = document.getElementById("group-selector");
  const nameInput = document.getElementById("student-name-simple");
  const displayArea = document.querySelector(".group-info-display");
  if (!groupSelector || !nameInput || !displayArea) return;

  const studentName = nameInput.value.trim();
  const selectedOption = groupSelector.options[groupSelector.selectedIndex];
  const groupValue = selectedOption.value;
  const groupText = selectedOption.text;

  if (studentName === "") {
    alert("Harap masukkan nama kamu terlebih dahulu.");
    nameInput.focus();
    return;
  }
  if (groupValue === "") {
    alert("Harap pilih kelompok kamu terlebih dahulu.");
    groupSelector.focus();
    return;
  }

  let currentMembers = parseInt(selectedOption.dataset.current || 0);
  const capacity = parseInt(selectedOption.dataset.capacity || 1);

  if (currentMembers >= capacity) {
    displayArea.textContent = `Maaf, ${groupText} sudah penuh. Silakan pilih kelompok lain.`;
    displayArea.className = 'group-info-display full';
    return;
  }

  currentMembers++;
  selectedOption.dataset.current = currentMembers;
  const successMessage = `Selamat, ${studentName}! Kamu telah berhasil bergabung dengan ${groupText}.`;
  displayArea.innerHTML = `
      <span style="font-weight: bold; color: green;">${successMessage}</span>
      <br>
      Status kelompok saat ini: ${currentMembers} / ${capacity} anggota.
    `;
  displayArea.className = 'group-info-display';
  nameInput.value = "";
  displayGroupInfo();
}


/* ==================================================== */
/* LOGIKA EKSPLORASI BUDAYA                          */
/* ==================================================== */
// --- Functions checkRingkasan(), checkProvinsiAnswers(), checkMatchingAnswers() remain UNCHANGED (kecuali penambahan kelas Bootstrap) ---
function checkRingkasan(buttonElement) {
  const textarea = document.getElementById("cerita-ringkasan");
  if (!textarea) return;
  const ringkasanText = textarea.value.trim();
  if (ringkasanText === "") {
    alert("Harap tuliskan ringkasan Ananda terlebih dahulu.");
    return;
  }
  textarea.classList.add('is-valid'); // Bootstrap class
  textarea.readOnly = true;
  buttonElement.disabled = true;
  buttonElement.textContent = "Telah Tersimpan";
}

function checkProvinsiAnswers() {
  const kunciProvinsi = { "provinsi-1": "Aceh", "provinsi-2": "Jawa Barat", "provinsi-3": "Bali", "provinsi-4": "Papua", };
  let correctCount = 0;
  const totalQuestions = Object.keys(kunciProvinsi).length;
  for (let i = 1; i <= totalQuestions; i++) {
    const inputId = `provinsi-${i}`;
    const inputElement = document.getElementById(inputId);
    if (!inputElement) continue;
    const jawabanSiswa = inputElement.value.trim().toLowerCase();
    const jawabanBenar = kunciProvinsi[inputId].toLowerCase();
    const parentCard = inputElement.closest(".card");
    inputElement.classList.remove("is-valid", "is-invalid");
    if(parentCard) parentCard.classList.remove("border-success", "border-danger");
    if (jawabanSiswa === jawabanBenar) {
      correctCount++;
      inputElement.classList.add("is-valid");
       if(parentCard) parentCard.classList.add("border-success");
    } else if (jawabanSiswa.length > 0) {
      inputElement.classList.add("is-invalid");
       if(parentCard) parentCard.classList.add("border-danger");
    }
  }
  alert(`Kamu berhasil menjawab ${correctCount} dari ${totalQuestions} provinsi dengan tepat!`);
}

function checkMatchingAnswers() {
   const textToImageMatch = { "text-match-1": "image-match-2", "text-match-2": "image-match-3", "text-match-3": "image-match-1", "text-match-4": "image-match-5", "text-match-5": "image-match-4", };
   let correctCount = 0;
   const totalQuestions = Object.keys(textToImageMatch).length;
   document.querySelectorAll(".match-item").forEach((item) => { item.classList.remove("border-success", "border-danger"); const select = item.querySelector('.form-select'); if(select) select.classList.remove('is-valid', 'is-invalid'); });
   document.querySelectorAll(".feedback-message").forEach(span => { span.textContent = ""; span.classList.remove("text-success", "text-danger"); });
   for (const textId in textToImageMatch) {
     const imageId = textToImageMatch[textId];
     const textSelect = document.getElementById(textId);
     const imageSelect = document.getElementById(imageId);
     if (textSelect && imageSelect) {
       const textValue = textSelect.value; const imageValue = imageSelect.value;
       const textItem = textSelect.closest(".match-item"); const imageItem = imageSelect.closest(".match-item");
       const textFeedbackSpan = document.getElementById(`feedback-${textId}`); const imageFeedbackSpan = document.getElementById(`feedback-${imageId}`);
       let textIsValid = false; let imageIsValid = false;
       if (textValue && imageValue) {
         if (textValue === imageValue) { correctCount++; textIsValid = true; imageIsValid = true; if(textFeedbackSpan) { textFeedbackSpan.textContent = "Benar!"; textFeedbackSpan.classList.add("text-success"); } if(imageFeedbackSpan) { imageFeedbackSpan.textContent = "Benar!"; imageFeedbackSpan.classList.add("text-success"); } }
         else { if(textFeedbackSpan) { textFeedbackSpan.textContent = "Salah."; textFeedbackSpan.classList.add("text-danger"); } if(imageFeedbackSpan) { imageFeedbackSpan.textContent = "Salah."; imageFeedbackSpan.classList.add("text-danger"); } }
       } else { if(!textValue && textFeedbackSpan) { textFeedbackSpan.textContent = "Pilih."; textFeedbackSpan.classList.add("text-danger"); } if(!imageValue && imageFeedbackSpan) { imageFeedbackSpan.textContent = "Pilih."; imageFeedbackSpan.classList.add("text-danger"); } }
       textSelect.classList.toggle('is-valid', textIsValid); textSelect.classList.toggle('is-invalid', !textValue || (textValue && !textIsValid)); textItem.classList.toggle('border-success', textIsValid); textItem.classList.toggle('border-danger', !textValue || (textValue && !textIsValid));
       imageSelect.classList.toggle('is-valid', imageIsValid); imageSelect.classList.toggle('is-invalid', !imageValue || (imageValue && !imageIsValid)); imageItem.classList.toggle('border-success', imageIsValid); imageItem.classList.toggle('border-danger', !imageValue || (imageValue && !imageIsValid));
     }
   }
   const finalResultContainer = document.getElementById("final-result-container"); const finalResultMessage = document.getElementById("final-result-message"); const finalResultDetail = document.getElementById("final-result-detail"); if (!finalResultContainer || !finalResultMessage || !finalResultDetail) return;
   let message = ""; finalResultMessage.classList.remove('text-success', 'text-warning', 'text-danger');
   if (correctCount === totalQuestions) { message = "Selamat! Semua Jawaban Anda Benar!"; finalResultMessage.classList.add('text-success'); }
   else if (correctCount > totalQuestions / 2) { message = "Bagus! Anda sudah cukup baik."; finalResultMessage.classList.add('text-warning'); }
   else { message = "Terus Berlatih! Anda bisa lebih baik."; finalResultMessage.classList.add('text-danger'); }
   finalResultMessage.textContent = message; finalResultDetail.textContent = `Anda berhasil mencocokkan ${correctCount} dari ${totalQuestions} pasangan.`; finalResultContainer.style.display = "block";
}


/* ==================================================== */
/* LOGIKA KUIS SLIDER (UJI KEMAMPUAN)                */
/* ==================================================== */
// --- quizData array remains UNCHANGED ---
const quizData = [ { id: 1, question: '"Mereka saling bertukar cerita tentang pakaian adat masing-masing". Hal yang dilakukan mereka termasuk bentuk cara melestarikan keberagaman budaya secara umum yang mana?', options: [ "Meningkatkan toleransi antar sesama", "Menghormati budaya orang lain", "Memakan pakaian Melayu Riau di acara penting", "Mengenalkan budaya ke orang lain.", ], correct: 3, }, { id: 2, question: "Apa manfaat memakai pakaian adat di sekolah?", options: [ "Melestarikan keberagaman budaya", "Ajang pamer", "Mempercantik diri", "Agar bisa memaksa orang lain", ], correct: 0, }, { id: 3, question: "Salah satu cara melestarikan keberagaman budaya secara umum, kecuali", options: [ "Mengikuti kegiatan budaya", "Menambah penghasilan", "Mengenalkan budaya ke orang lain", "Menghormati budaya orang lain", ], correct: 1, }, { id: 4, question: "Kamu punya teman dari daerah lain yang memakai pakaian adatnya. Apa sikap yang paling baik?", options: [ "Mengejek supaya dia malu", "Diam saja dan tidak peduli", "Menghargai dan memuji karena budayanya indah", "Menyuruhnya ganti dengan baju modern", ], correct: 2, }, { id: 5, question: "Mengapa keberagaman budaya perlu diwariskan ke generasi muda?", options: [ "Supaya budaya Indonesia tetap terjaga dan tidak hilang", "Supaya hanya orang tua yang mengenalnya", "Supaya budaya asing lebih banyak masuk", "Supaya anak-anak tidak mau belajar budaya", ], correct: 0, }, { id: 6, question: "Andi melihat ada pertunjukkan tari daerah di alun-alun. Temannnya paling malas nonton karena menurutnya itu kuno. Apa yang sebaiknyaaa Andi lakukan agar budaya tetap terjaga?", options: [ "Ikut menertawakan tarian itu", "Mengajak temannya untuk menonton dan menghargai tarian daerah", "Pulang saja karena acaranya membosankan", "Meminta pertunjukkan diganti dengan konser modern", ], correct: 1, }, { id: 7, question: "Di sekolah, guru meminta murid mengenalkan budaya daerahnya. Siti bingung mau pilih cara yang mana. Menurut Ananda, cara mana yang paling baik untuk menjaga budaya tetap dikenal?", options: [ "Menceritakan budaya lewat gambar, lagu, atau video sederhana", "Diam saja agar tidak salah bicara", "Meniru budaya negara lain", "Membiarkan budaya dilupakan karena sudah tua", ], correct: 0, }, { id: 8, question: "Saat lomba, Beni memakai baju derah Melayu Riau. Ada teman yang menertawakan. Jika kamu jadi Beni, apa yang harus dilakukan untuk melestarikan budaya?", options: [ "Melepas baju adat lalu ganti baju kaos modern", "Tetap memakai baju daerah Melayu Riau dengan bangga", "Ikut menertawakan dirinya sendiri", "Tidak ikut lomba supaya tidak malu", ], correct: 1, }, { id: 9, question: "Lina ingin menjaga budaya daerahnya agar tidak hilang. Menurutmu, tindakan apa yang paling tepat?", options: [ "Mengikuti acara budaya di sekolah atau lingkungan sekitar", "Membiarkan orang lain menjaga budaya sendiri", "Hanya belajar budaya lewat internet tanpa ikut serta", "Menyembunyikan budayanya supaya tidak diketahui orang lain", ], correct: 0, }, { id: 10, question: "Di rumah, Raka suka mendengar cerita kakeknya tentang budaya daerah. Apa yang bisa dilakukan Raka supaya budaya itu tetap dikenal orang lain?", options: [ "Menyimpan cerita itu sendiri saja", "Menceritakan kembali ke teman", "Melupakan karena sudah kuno", "Menutup-nutupi supaya tidak diketahui", ], correct: 1, }, ];
// --- Global quiz variables remain UNCHANGED ---
let currentQuestion = 0;
let userAnswers = new Array(quizData.length).fill(undefined);
// --- initQuiz() remains UNCHANGED ---
function initQuiz(){const container=document.getElementById("quizContainer");if(!container)return;container.innerHTML="";quizData.forEach((quiz,index)=>{const quizCard=document.createElement("div");quizCard.className=`quiz-card card p-3 ${index===0?"active":"inactive"}`;quizCard.id=`quiz-${index}`;let optionsHTML="";quiz.options.forEach((option,optIndex)=>{optionsHTML+=`
          <div class="form-check mb-2">
            <input class="form-check-input" type="radio" name="question${index}" id="q${index}_opt${optIndex}" value="${optIndex}">
            <label class="form-check-label" for="q${index}_opt${optIndex}">
              ${option}
            </label>
          </div>
        `});quizCard.innerHTML=`
        <p class="question-number text-muted small mb-1">Soal ${quiz.id} dari ${quizData.length}</p>
        <h5 class="sub-heading quiz-question-text mt-1 mb-3">
          ${quiz.question}
        </h5>
        <div>
          ${optionsHTML}
        </div>
      `;container.appendChild(quizCard)});document.querySelectorAll('#quizContainer input[type="radio"]').forEach(radio=>{radio.addEventListener('change',saveAnswer)});updateNavigation();updateProgress()}
// --- saveAnswer() remains UNCHANGED ---
function saveAnswer(e){const questionIndex=parseInt(e.target.name.replace("question",""));const answer=parseInt(e.target.value);userAnswers[questionIndex]=answer;updateProgress()}
// --- navigateQuiz() remains UNCHANGED ---
function navigateQuiz(direction){const prevCard=document.getElementById(`quiz-${currentQuestion}`);if(prevCard){prevCard.classList.remove("active");prevCard.classList.add("inactive")}currentQuestion+=direction;const nextCard=document.getElementById(`quiz-${currentQuestion}`);if(nextCard){nextCard.classList.remove("inactive");nextCard.classList.add("active")}updateNavigation()}
// --- updateNavigation() remains UNCHANGED ---
function updateNavigation(){const prevBtn=document.getElementById("prevBtn");const nextBtn=document.getElementById("nextBtn");const submitSection=document.getElementById("submitSection");const questionNumber=document.getElementById("questionNumber");const navContainer=document.querySelector(".quiz-navigation");const introBox=document.getElementById("quiz-intro-box");if(!prevBtn||!nextBtn||!submitSection||!questionNumber||!navContainer)return;questionNumber.textContent=`Soal ${currentQuestion+1} dari ${quizData.length}`;prevBtn.disabled=currentQuestion===0;if(currentQuestion===quizData.length-1){nextBtn.style.display="none";submitSection.style.display="block"}else{nextBtn.style.display="inline-block";submitSection.style.display="none"}if(introBox){introBox.style.display=currentQuestion===0?"block":"none"}}
// --- updateProgress() remains UNCHANGED ---
function updateProgress(){const answeredCount=userAnswers.filter(a=>a!==undefined).length;const progressPercent=answeredCount/quizData.length*100;const progressBar=document.getElementById("progressBar");const progressText=document.getElementById("progressText");if(progressBar)progressBar.style.width=`${progressPercent}%`;if(progressText)progressText.textContent=`${answeredCount} / ${quizData.length}`}
// --- submitQuiz() remains UNCHANGED ---
function submitQuiz(){const namaSiswa=document.getElementById("student-name-quiz").value.trim();if(!namaSiswa){alert("Silakan masukkan nama Anda terlebih dahulu!");document.getElementById("student-name-quiz").focus();return}const unanswered=userAnswers.filter(a=>a===undefined).length;if(unanswered>0){const confirmSubmit=confirm(`Anda belum menjawab ${unanswered} soal. Yakin ingin submit?`);if(!confirmSubmit)return}let score=0;quizData.forEach((quiz,index)=>{if(userAnswers[index]===quiz.correct){score++}});const quizContainer=document.getElementById("quizContainer");const quizNavigation=document.querySelector(".quiz-navigation");const submitBtnSection=document.getElementById("submitSection");const progressContainer=document.querySelector(".quiz-progress-container");const nameInputGroup=document.querySelector(".quiz-input-group");const introBox=document.getElementById("quiz-intro-box");if(quizContainer)quizContainer.style.display="none";if(quizNavigation)quizNavigation.style.display="none";if(submitBtnSection)submitBtnSection.style.display="none";if(progressContainer)progressContainer.style.display="none";if(nameInputGroup)nameInputGroup.style.display="none";if(introBox)introBox.style.display="none";const resultSection=document.getElementById("resultSection");const scoreDisplay=document.getElementById("scoreDisplay");const scoreMessage=document.getElementById("scoreMessage");if(resultSection)resultSection.style.display="block";if(scoreDisplay)scoreDisplay.textContent=`${score}/${quizData.length}`;let message="";if(score>=9){message=`Luar biasa, ${namaSiswa}! Kamu sangat memahami materi ini! 🌟`}else if(score>=7){message=`Bagus sekali, ${namaSiswa}! Pemahaman kamu sangat baik! 👏`}else if(score>=5){message=`Cukup baik, ${namaSiswa}! Terus belajar ya! 💪`}else{message=`Jangan menyerah, ${namaSiswa}! Coba ulangi dan baca materi lagi! 📚`}if(scoreMessage)scoreMessage.textContent=message}
// --- resetQuiz() remains UNCHANGED ---
function resetQuiz(){currentQuestion=0;userAnswers.fill(undefined);const nameInput=document.getElementById("student-name-quiz");if(nameInput)nameInput.value="";const quizContainer=document.getElementById("quizContainer");const quizNavigation=document.querySelector(".quiz-navigation");const resultSect=document.getElementById("resultSection");const progressContainer=document.querySelector(".quiz-progress-container");const nameInputGroup=document.querySelector(".quiz-input-group");const introBox=document.getElementById("quiz-intro-box");if(quizContainer)quizContainer.style.display="block";if(quizNavigation)quizNavigation.style.display="flex";if(resultSect)resultSect.style.display="none";if(progressContainer)progressContainer.style.display="block";if(nameInputGroup)nameInputGroup.style.display="block";if(introBox)introBox.style.display="block";document.querySelectorAll('#quizContainer input[type="radio"]').forEach(radio=>{radio.checked=false});document.querySelectorAll(".quiz-card").forEach((card,index)=>{card.classList.toggle("active",index===0);card.classList.toggle("inactive",index!==0)});updateNavigation();updateProgress()}