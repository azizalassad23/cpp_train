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

    // Pencegahan Infinite Loop
    if (code.includes("for") && code.includes(";") && !code.includes("++") && !code.includes("--") && !code.includes("+=") && !code.includes("-=")) {
        console.warn("Potensi Infinite Loop terdeteksi");
    }

    terminalOutput.style.color = "var(--neon-yellow)";
    terminalOutput.innerText = "Merender pola visual...";
    runBtn.innerText = "RENDERING...";
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
        // 3. LOGIKA SMART AUTO-GRADER BAB 5
        // ==========================================
        const cleanOutput = programOutput.replace(/\r\n/g, '\n').trim();

        const targetLatihan1 = "Scan...\nScan...\nScan...\nScan...\nScan...";
        const targetLatihan2 = "Sistem Online";
        const targetLatihan3 = "1\n2\n4\n5";
        
        const targetLatihan4 = "*\n**\n***\n****\n*****";
        const targetLatihan5 = "*****\n*   *\n*   *\n*   *\n*****";
        
        // Pola Ultimate (Dinamis N=7 dengan titik)
        const targetUjianAkhir = "*.....*\n.*...*.\n..*.*..\n...*...\n..*.*..\n.*...*.\n*.....*";

        // Fungsi pembanding pola toleransi
        function comparePattern(output, target) {
            const normalize = (str) => str.split('\n').map(line => line.trimEnd()).join('\n');
            return normalize(output) === normalize(target);
        }

        if (comparePattern(cleanOutput, targetUjianAkhir)) {
            missionStatus.innerText = "STATUS: LULUS UJIAN BAB 5!";
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
        else if (comparePattern(cleanOutput, targetLatihan4)) {
            missionStatus.innerText = "STATUS: LATIHAN 4 SELESAI!";
            missionStatus.style.color = "var(--neon-cyan)";
            document.getElementById('section-5').classList.remove('locked-section');
        } 
        else if (comparePattern(cleanOutput, targetLatihan5)) {
            missionStatus.innerText = "STATUS: LATIHAN 5 SELESAI!";
            missionStatus.style.color = "var(--neon-cyan)";
            document.getElementById('section-6').classList.remove('locked-section');
        } 
        else {
            missionStatus.innerText = "STATUS: POLA TIDAK SESUAI TARGET";
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
const SPREADSHEET_URL = "MASUKKAN_URL_WEB_APP_ANDA_DI_SINI"; 

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
        bab: "BAB 5" 
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