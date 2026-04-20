// ==========================================
// 1. INISIALISASI EDITOR CODEMIRROR
// ==========================================
const editor = CodeMirror.fromTextArea(document.getElementById("code-editor"), {
    lineNumbers: true,
    mode: "text/x-c++src", // Mode khusus C++
    theme: "monokai",      // Tema gelap profesional
    indentUnit: 4,
    matchBrackets: true,
    viewportMargin: Infinity
});

// ==========================================
// 2. FUNGSI EKSEKUSI & SMART AUTO-GRADER
// ==========================================
async function executeCode() {
    const runBtn = document.getElementById("run-btn");
    const terminalOutput = document.getElementById("terminal-output");
    const missionStatus = document.getElementById("mission-status");
    
    // Mengambil teks asli dari CodeMirror
    const code = editor.getValue();

    // Mengubah tampilan UI menjadi status "Loading"
    terminalOutput.style.color = "var(--neon-yellow)";
    terminalOutput.innerText = "Kompilasi berjalan...";
    runBtn.innerText = "RUNNING...";
    runBtn.disabled = true;
    missionStatus.innerText = "STATUS: CHECKING...";
    missionStatus.style.color = "var(--neon-yellow)";

    // Konfigurasi request untuk Wandbox API
    const requestData = {
        code: code,
        compiler: "gcc-head", // Menggunakan C++ GCC Compiler terbaru
        save: false
    };

    try {
        // [Unverified] Memanggil Wandbox API (Sangat stabil untuk eksekusi C++ publik)
        const response = await fetch("https://wandbox.org/api/compile.json", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestData)
        });

        const data = await response.json();
        
        // Mengembalikan tombol ke keadaan semula
        runBtn.innerText = "RUN";
        runBtn.disabled = false;

        // Cek jika ada Error Sintaks dari penulisan C++ murid
        if (data.status !== "0") {
            terminalOutput.style.color = "var(--neon-pink)";
            terminalOutput.innerText = "ERROR:\n\n" + data.compiler_error;
            missionStatus.innerText = "STATUS: SYNTAX ERROR";
            missionStatus.style.color = "var(--neon-pink)";
            return;
        }

        // Ambil output program, bersihkan spasi kosong berlebih di ujungnya
        const programOutput = data.program_message ? data.program_message.trim() : "";
        terminalOutput.style.color = "var(--text-color)";
        terminalOutput.innerText = programOutput;

        // ==========================================
        // 3. LOGIKA SMART AUTO-GRADER & UNLOCKER
        // ==========================================
        // Samakan format enter Windows (\r\n) dan Unix (\n) agar validasi akurat
        const cleanOutput = programOutput.replace(/\r\n/g, '\n');

        // Definisi kunci jawaban dari setiap latihan
        const targetLatihan1 = "Sistem Aktif!";
        const targetLatihan2A = "Sistem Aktif!\n2025";
        const targetLatihan2B = "2025";
        const targetLatihan3 = "200";
        const targetUjianAkhir = "Luas Grid: 28756\nKeliling Grid: 886";

        // Pengecekan tingkat dewa (Dimulai dari Ujian Akhir)
        if (cleanOutput === targetUjianAkhir) {
            missionStatus.innerText = "STATUS: LULUS UJIAN AKHIR!";
            missionStatus.style.color = "var(--neon-cyan)";
            terminalOutput.style.color = "var(--neon-cyan)";
            
            terminalOutput.style.boxShadow = "inset 0 0 20px var(--neon-cyan)";
            setTimeout(() => { terminalOutput.style.boxShadow = "none"; }, 1000);

            // MEMUNCULKAN FORMULIR PENGIRIMAN DATA (Tambahkan 2 baris ini)
            document.getElementById('success-modal').style.display = 'flex';
        } 
        else if (cleanOutput === targetLatihan1) {
            missionStatus.innerText = "STATUS: LATIHAN 1 SELESAI!";
            missionStatus.style.color = "var(--neon-cyan)";
            // Membuka gembok Sub-bab 2
            document.getElementById('section-2').classList.remove('locked-section');
        } 
        else if (cleanOutput === targetLatihan2A || cleanOutput === targetLatihan2B) {
            missionStatus.innerText = "STATUS: LATIHAN 2 SELESAI!";
            missionStatus.style.color = "var(--neon-cyan)";
            // Membuka gembok Sub-bab 3
            document.getElementById('section-3').classList.remove('locked-section');
        } 
        else if (cleanOutput === targetLatihan3) {
            missionStatus.innerText = "STATUS: LATIHAN 3 SELESAI!";
            missionStatus.style.color = "var(--neon-cyan)";
            // Membuka gembok Sub-bab 4
            document.getElementById('section-4').classList.remove('locked-section');
        } 
        else {
            missionStatus.innerText = "STATUS: OUTPUT BELUM SESUAI TARGET";
            missionStatus.style.color = "var(--neon-yellow)";
        }

    } catch (error) {
        // Penanganan jika internet mati atau server penuh
        runBtn.innerText = "RUN";
        runBtn.disabled = false;
        terminalOutput.style.color = "var(--neon-pink)";
        terminalOutput.innerText = "Koneksi terputus. Pastikan internet aktif atau coba beberapa saat lagi.";
        missionStatus.innerText = "STATUS: ERROR JARINGAN";
    }
}

// ==========================================
// 4. FUNGSI PENGIRIMAN DATA KE SPREADSHEET
// ==========================================
const SPREADSHEET_URL = "https://script.google.com/macros/s/AKfycbzfuEmC-SCZLKu3d7eFGn14Av6p2kXFuUVt71WdaxbMgIYaVL1_qJn3bFvPNC0Odun1Ig/exec"; 

async function sendDataToSpreadsheet() {
    const nama = document.getElementById("input-nama").value.trim();
    const kelas = document.getElementById("input-kelas").value.trim();
    const submitBtn = document.getElementById("submit-data-btn");
    const uploadStatus = document.getElementById("upload-status");

    // Validasi input kosong
    if (nama === "" || kelas === "") {
        uploadStatus.innerText = "> ERROR: Nama dan Kelas wajib diisi!";
        uploadStatus.style.color = "var(--neon-pink)";
        return;
    }

    // UI Loading
    submitBtn.innerText = "[ TRANSMITTING... ]";
    submitBtn.disabled = true;
    uploadStatus.innerText = "> Mengenkripsi dan mengirim data ke matriks...";
    uploadStatus.style.color = "var(--neon-yellow)";

    // Data yang akan dikirim (Property 'bab' menentukan letak Sheet)
    const payload = {
        nama: nama,
        kelas: kelas,
        bab: "BAB 1" // Ubah ini saat membuat file bab2.html nantinya
    };

    try {
        // [Unverified] Performa pengiriman data dari frontend ke Apps Script bergantung pada konektivitas jaringan Google.
        const response = await fetch(SPREADSHEET_URL, {
            method: "POST",
            body: JSON.stringify(payload)
        });

        // Karena menggunakan mode no-cors atau plain text, kita anggap sukses jika request berhasil dikirim
        uploadStatus.innerText = "> TRANSMISI BERHASIL. DATA TEREKAM.";
        uploadStatus.style.color = "var(--neon-cyan)";
        submitBtn.innerText = "[ COMPLETED ]";
        
        // Menutup modal otomatis setelah 2 detik dan kembali ke menu utama
        setTimeout(() => {
            document.getElementById('success-modal').style.display = 'none';
            window.location.href = "index.html"; 
        }, 2000);

    } catch (error) {
        submitBtn.innerText = "[ TRANSMIT_DATA ]";
        submitBtn.disabled = false;
        uploadStatus.innerText = "> GAGAL TERHUBUNG KE SERVER. COBA LAGI.";
        uploadStatus.style.color = "var(--neon-pink)";
    }
}