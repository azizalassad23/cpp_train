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

    // Deteksi kasar infinite loop (Opsional)
    if (code.includes("for") && !code.includes("++") && !code.includes("--") && !code.includes("+=") && !code.includes("-=")) {
        console.warn("Potensi Infinite Loop terdeteksi");
    }

    terminalOutput.style.color = "var(--neon-yellow)";
    terminalOutput.innerText = "Memproses struktur data memori...";
    runBtn.innerText = "COMPILING...";
    runBtn.disabled = true;
    missionStatus.innerText = "STATUS: CHECKING...";
    missionStatus.style.color = "var(--neon-yellow)";

    const requestData = {
        code: code,
        compiler: "gcc-head",
        save: false
    };

    try {
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

        const programOutput = data.program_message ? data.program_message.trimEnd() : "";
        terminalOutput.style.color = "var(--text-color)";
        terminalOutput.innerText = programOutput;

        // ==========================================
        // 3. LOGIKA SMART AUTO-GRADER BAB 6
        // ==========================================
        // Normalisasi spasi ekstra dan enter (Toleransi tinggi untuk Array)
        const cleanOutput = programOutput.replace(/\r\n/g, '\n').trim();
        const outputSpaced = cleanOutput.replace(/\s+/g, ' '); // Ubah semua whitespace jadi 1 spasi
        
        // Kunci Jawaban
        const targetLatihan1 = "50";
        const targetLatihan2 = "10 20 30 40 50";
        const targetLatihan3 = "99";
        const targetLatihan4 = "600";
        const targetLatihan5 = "0 1 0 0 1";
        const targetLatihan6 = "2";
        const targetLatihan7 = "5 4 3 2 1";
        
        // Pola Ultimate (Filter Array di atas Rata-rata 78)
        // Boleh dengan Enter "120\n150" atau Spasi "120 150" agar tidak kaku
        const targetUjianAkhir_Enter = "120\n150";
        const targetUjianAkhir_Spasi = "120 150";

        if (cleanOutput === targetUjianAkhir_Enter || outputSpaced === targetUjianAkhir_Spasi) {
            missionStatus.innerText = "STATUS: LULUS UJIAN BAB 6!";
            missionStatus.style.color = "var(--neon-cyan)";
            terminalOutput.style.color = "var(--neon-cyan)";
            terminalOutput.style.boxShadow = "inset 0 0 20px var(--neon-cyan)";
            setTimeout(() => { terminalOutput.style.boxShadow = "none"; }, 1000);

            document.getElementById('success-modal').style.display = 'flex';
        } 
        else if (cleanOutput === targetLatihan1) {
            missionStatus.innerText = "STATUS: LATIHAN 1 SELESAI!";
            missionStatus.style.color = "var(--neon-cyan)";
            document.getElementById('section-2').classList.remove('locked-section');
        } 
        else if (outputSpaced === targetLatihan2) {
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
        else if (outputSpaced === targetLatihan5) {
            missionStatus.innerText = "STATUS: LATIHAN 5 SELESAI!";
            missionStatus.style.color = "var(--neon-cyan)";
            document.getElementById('section-6').classList.remove('locked-section');
        } 
        else if (cleanOutput === targetLatihan6) {
            missionStatus.innerText = "STATUS: LATIHAN 6 SELESAI!";
            missionStatus.style.color = "var(--neon-cyan)";
            document.getElementById('section-7').classList.remove('locked-section');
        } 
        else if (outputSpaced === targetLatihan7) {
            missionStatus.innerText = "STATUS: LATIHAN 7 SELESAI!";
            missionStatus.style.color = "var(--neon-cyan)";
            document.getElementById('section-8').classList.remove('locked-section');
        } 
        else {
            missionStatus.innerText = "STATUS: OUTPUT BELUM SESUAI TARGET";
            missionStatus.style.color = "var(--neon-yellow)";
        }

    } catch (error) {
        runBtn.innerText = "RUN";
        runBtn.disabled = false;
        terminalOutput.style.color = "var(--neon-pink)";
        terminalOutput.innerText = "Koneksi terputus. Pastikan internet aktif.";
        missionStatus.innerText = "STATUS: ERROR JARINGAN";
    }
}

// ==========================================
// 4. FUNGSI PENGIRIMAN DATA
// ==========================================
// GANTI URL DI BAWAH INI DENGAN URL GOOGLE SCRIPT ANDA
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
        bab: "BAB 6" 
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