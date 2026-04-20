// ==========================================
// 1. INISIALISASI EDITOR CODEMIRROR
// ==========================================
const editor = CodeMirror.fromTextArea(document.getElementById("code-editor"), {
    lineNumbers: true,
    mode: "text/x-c++src",
    theme: "monokai",
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
    
    const code = editor.getValue();

    terminalOutput.style.color = "var(--neon-yellow)";
    terminalOutput.innerText = "Kompilasi berjalan...";
    runBtn.innerText = "RUNNING...";
    runBtn.disabled = true;
    missionStatus.innerText = "STATUS: CHECKING...";
    missionStatus.style.color = "var(--neon-yellow)";

    const requestData = {
        code: code,
        compiler: "gcc-head",
        save: false
    };

    try {
        // [Unverified] Menggunakan API Publik Wandbox. Ketersediaan bergantung pada server pihak ketiga.
        const response = await fetch("https://wandbox.org/api/compile.json", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestData)
        });

        const data = await response.json();
        runBtn.innerText = "RUN";
        runBtn.disabled = false;

        if (data.status !== "0") {
            terminalOutput.style.color = "var(--neon-pink)";
            terminalOutput.innerText = "ERROR:\n\n" + data.compiler_error;
            missionStatus.innerText = "STATUS: SYNTAX ERROR";
            missionStatus.style.color = "var(--neon-pink)";
            return;
        }

        const programOutput = data.program_message ? data.program_message.trim() : "";
        terminalOutput.style.color = "var(--text-color)";
        terminalOutput.innerText = programOutput;

        // ==========================================
        // 3. LOGIKA SMART AUTO-GRADER BAB 2
        // ==========================================
        const cleanOutput = programOutput.replace(/\r\n/g, '\n');

        // Kunci Jawaban Bab 2 Terkini
        const targetLatihan1 = "Namespace Aktif!";
        const targetLatihan2 = "2077";
        const targetLatihan3 = "2077\n2080";
        const targetLatihan4 = "Katana";
        const targetUjianAkhir = "Total Unit: 542"; // Jawaban perhitungan soal logika

        if (cleanOutput === targetUjianAkhir) {
            missionStatus.innerText = "STATUS: LULUS UJIAN BAB 2!";
            missionStatus.style.color = "var(--neon-cyan)";
            terminalOutput.style.color = "var(--neon-cyan)";
            terminalOutput.style.boxShadow = "inset 0 0 20px var(--neon-cyan)";
            setTimeout(() => { terminalOutput.style.boxShadow = "none"; }, 1000);

            // Memunculkan Form Pengiriman Data
            document.getElementById('success-modal').style.display = 'flex';
        } 
        else if (cleanOutput === targetLatihan1) {
            missionStatus.innerText = "STATUS: LATIHAN 1 SELESAI!";
            missionStatus.style.color = "var(--neon-cyan)";
            document.getElementById('section-2').classList.remove('locked-section');
        } 
        else if (cleanOutput === targetLatihan2) {
            missionStatus.innerText = "STATUS: LATIHAN 2 SELESAI!";
            missionStatus.style.color = "var(--neon-cyan)";
            document.getElementById('section-3').classList.remove('locked-section');
        } 
        else if (cleanOutput === targetLatihan3) {
            missionStatus.innerText = "STATUS: LATIHAN 3 SELESAI!";
            missionStatus.style.color = "var(--neon-cyan)";
            document.getElementById('section-4').classList.remove('locked-section');
        }
        else if (cleanOutput === targetLatihan4) {
            missionStatus.innerText = "STATUS: LATIHAN 4 SELESAI!";
            missionStatus.style.color = "var(--neon-cyan)";
            document.getElementById('section-5').classList.remove('locked-section');
        } 
        else {
            missionStatus.innerText = "STATUS: OUTPUT BELUM SESUAI TARGET";
            missionStatus.style.color = "var(--neon-yellow)";
        }

    } catch (error) {
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
// PENTING: GANTI STRING DI BAWAH INI DENGAN URL WEB APP GOOGLE SCRIPT ANDA!
const SPREADSHEET_URL = "https://script.google.com/macros/s/AKfycbzfuEmC-SCZLKu3d7eFGn14Av6p2kXFuUVt71WdaxbMgIYaVL1_qJn3bFvPNC0Odun1Ig/exec"; 

async function sendDataToSpreadsheet() {
    const nama = document.getElementById("input-nama").value.trim();
    const kelas = document.getElementById("input-kelas").value.trim();
    const submitBtn = document.getElementById("submit-data-btn");
    const uploadStatus = document.getElementById("upload-status");

    if (nama === "" || kelas === "") {
        uploadStatus.innerText = "> ERROR: Nama dan Kelas wajib diisi!";
        uploadStatus.style.color = "var(--neon-pink)";
        return;
    }

    submitBtn.innerText = "[ TRANSMITTING... ]";
    submitBtn.disabled = true;
    uploadStatus.innerText = "> Mengenkripsi dan mengirim data ke matriks...";
    uploadStatus.style.color = "var(--neon-yellow)";

    const payload = {
        nama: nama,
        kelas: kelas,
        bab: "BAB 2" 
    };

    try {
        const response = await fetch(SPREADSHEET_URL, {
            method: "POST",
            body: JSON.stringify(payload)
        });

        uploadStatus.innerText = "> TRANSMISI BERHASIL. DATA TEREKAM.";
        uploadStatus.style.color = "var(--neon-cyan)";
        submitBtn.innerText = "[ COMPLETED ]";
        
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