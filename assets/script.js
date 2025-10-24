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

/* ==================================================== */
/* LOGIKA BARU: BELAJAR BERSAMA TEMAN (Dropdown Sederhana)*/
/* ==================================================== */

function displayGroupInfo() {
    const selector = document.getElementById('group-selector');
    const selectedOption = selector.options[selector.selectedIndex];
    const infoDisplay = document.querySelector('.group-info-display');
    
    if (selectedOption.value) {
        const capacity = selectedOption.getAttribute('data-capacity');
        const current = selectedOption.getAttribute('data-current');
        
        // Cek apakah kelompok penuh
        if (parseInt(current) >= parseInt(capacity)) {
            infoDisplay.textContent = `Kelompok ${selectedOption.value} PENUH (${current}/${capacity}). Mohon pilih kelompok lain.`;
            infoDisplay.classList.add('full');
            // Menonaktifkan tombol "Gabung Kelompok" jika penuh
            document.querySelector('.primary-btn').disabled = true;
            document.querySelector('.primary-btn').textContent = "Kelompok Penuh";
        } else {
            infoDisplay.textContent = `Anda memilih Kelompok ${selectedOption.value}. Kursi tersedia: ${current}/${capacity}.`;
            infoDisplay.classList.remove('full');
            // Mengaktifkan kembali tombol
            document.querySelector('.primary-btn').disabled = false;
            document.querySelector('.primary-btn').textContent = "Gabung Kelompok";
        }
    } else {
        infoDisplay.textContent = `Pilih kelompok dari daftar di bawah.`;
        infoDisplay.classList.remove('full');
        document.querySelector('.primary-btn').disabled = true; // Menonaktifkan jika belum memilih
        document.querySelector('.primary-btn').textContent = "Pilih Kelompok Dulu";
    }
}


function joinSimpleGroup() {
    const selector = document.getElementById('group-selector');
    const studentNameInput = document.getElementById('student-name-simple');
    
    const selectedGroup = selector.value;
    const studentName = studentNameInput.value.trim();
    
    if (!selectedGroup) {
        alert("Mohon pilih Kelompok terlebih dahulu.");
        return;
    }

    if (!studentName) {
        alert("Mohon masukkan Nama Anda terlebih dahulu.");
        studentNameInput.focus();
        return;
    }
    
    const selectedOption = selector.options[selector.selectedIndex];
    const capacity = parseInt(selectedOption.getAttribute('data-capacity'));
    let current = parseInt(selectedOption.getAttribute('data-current'));
    
    if (current >= capacity) {
        alert(`Kelompok ${selectedGroup} sudah PENUH (${current}/${capacity}). Silakan pilih kelompok lain.`);
        return;
    }
    
    // --- Simulasi Proses Bergabung ---
    
    // 1. Tambah jumlah anggota (simulasi)
    current += 1;
    selectedOption.setAttribute('data-current', current);
    
    // 2. Perbarui teks di dropdown (agar berubah setelah gabung)
    if (current >= capacity) {
        selectedOption.text = `Kelompok ${selectedGroup} (PENUH)`;
    } else {
        selectedOption.text = `Kelompok ${selectedGroup} (${current}/${capacity})`;
    }
    
    // 3. Tampilkan info sukses
    alert(`Selamat, ${studentName}! Anda telah berhasil gabung ke Kelompok ${selectedGroup}!`);
    
    // 4. Reset form dan update tampilan info
    studentNameInput.value = '';
    selector.value = ''; // Reset pilihan dropdown
    displayGroupInfo();
}

// Inisialisasi tampilan saat halaman dimuat
document.addEventListener('DOMContentLoaded', displayGroupInfo);

/* ==================================================== */
/* LOGIKA BARU: BLOK KHUSUS EKSPLORASI BUDAYA */
/* ==================================================== */

// Fungsi untuk mengirim ringkasan cerita (Simulasi)
function checkRingkasan() {
    const ringkasan = document.getElementById('cerita-ringkasan').value.trim();
    if (ringkasan.length < 20) {
        alert("Mohon tuliskan ringkasan Ananda dengan lebih lengkap (minimal 20 karakter).");
    } else {
        alert("Terima kasih! Ringkasan Anda telah berhasil disimpan untuk diskusi. ✨");
    }
}

// Fungsi untuk memeriksa jawaban Asal Provinsi (Simulasi Teks Bebas)
function checkProvinsiAnswers() {
    // ASUMSI KUNCI JAWABAN (Harap sesuaikan dengan gambar Baju Adat yang sebenarnya)
    const kunciProvinsi = {
        'provinsi-1': 'Aceh',
        'provinsi-2': 'Jawa Barat',
        'provinsi-3': 'Bali',
        'provinsi-4': 'Papua'
    };
    
    let correctCount = 0;
    const totalQuestions = Object.keys(kunciProvinsi).length;
    
    for (let i = 1; i <= totalQuestions; i++) {
        const inputId = `provinsi-${i}`;
        const inputElement = document.getElementById(inputId);
        const jawabanSiswa = inputElement.value.trim().toLowerCase();
        const jawabanBenar = kunciProvinsi[inputId].toLowerCase();
        const parentCard = inputElement.closest('.card');

        // Menghapus kelas feedback sebelumnya
        parentCard.classList.remove('jawaban-benar', 'jawaban-salah');

        // Cek jawaban
        if (jawabanSiswa === jawabanBenar) {
            correctCount++;
            parentCard.classList.add('jawaban-benar');
        } else if (jawabanSiswa.length > 0) {
            parentCard.classList.add('jawaban-salah');
        }
    }

    alert(`Anda berhasil menjawab ${correctCount} dari ${totalQuestions} provinsi dengan tepat!`);
}

// Fungsi untuk memeriksa jawaban Pencocokan Dropdown
function checkMatchingAnswers() {
    // Kunci Jawaban: Nilai dari dropdown Teks harus sama dengan nilai yang dipilih untuk Gambar pasangannya.
    // Pasangan Benar: (1. Baju Kurung <-> Gambar C), (2. Cekak Musang <-> Gambar A), (3. Teluk Belanga <-> Gambar B)
    
    // Kunci Kiri (Teks ID) -> Kunci Kanan (Gambar ID)
    const textToImageMatch = {
        'text-match-1': 'image-match-C', // Baju Kurung (1) harus dipasangkan dengan Gambar C
        'text-match-2': 'image-match-A', // Cekak Musang (2) harus dipasangkan dengan Gambar A
        'text-match-3': 'image-match-B'  // Teluk Belanga (3) harus dipasangkan dengan Gambar B
    };

    let correctCount = 0;
    const totalQuestions = Object.keys(textToImageMatch).length;
    
    for (const textId in textToImageMatch) {
        const imageId = textToImageMatch[textId];
        
        const textSelect = document.getElementById(textId);
        const imageSelect = document.getElementById(imageId);
        
        const textValue = textSelect.value;
        const imageValue = imageSelect.value;
        
        const textItem = textSelect.closest('.match-item');
        const imageItem = imageSelect.closest('.match-item');
        
        // Bersihkan visual feedback sebelumnya
        textItem.classList.remove('jawaban-benar', 'jawaban-salah');
        imageItem.classList.remove('jawaban-benar', 'jawaban-salah');

        // Logika Pemeriksaan
        // 1. Cek apakah kedua sisi sudah memilih angka
        if (textValue && imageValue) {
            // 2. Cek apakah angka yang dipilih SAMA
            if (textValue === imageValue) {
                correctCount++;
                // Beri feedback hijau pada kedua pasangan
                textItem.classList.add('jawaban-benar');
                imageItem.classList.add('jawaban-benar');
            } else {
                // Angka dipilih, tapi TIDAK COCOK
                textItem.classList.add('jawaban-salah');
                imageItem.classList.add('jawaban-salah');
            }
        }
    }

    // Tampilkan hasil
    alert(`Hasil Pencocokan: ${correctCount} dari ${totalQuestions} pasangan benar!`);
}
