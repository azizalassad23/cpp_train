document.addEventListener("DOMContentLoaded", () => {
    const loader = document.getElementById('loader');
    const mainContent = document.getElementById('main-content');
    const statusText = document.getElementById('loading-status');
    const progressBar = document.querySelector('.progress-bar');

    // Simulasi proses loading boot sequence
    setTimeout(() => {
        statusText.innerText = "> Mengompilasi modul dasar...";
        progressBar.style.width = "40%";
    }, 1000);

    setTimeout(() => {
        statusText.innerText = "> Membuka gerbang akses matriks...";
        progressBar.style.width = "80%";
    }, 2000);

    setTimeout(() => {
        progressBar.style.width = "100%";
        statusText.innerText = "> AKSES DIBERIKAN.";
        statusText.style.color = "var(--neon-cyan)";
    }, 2800);

    // Menghilangkan loader dan memunculkan konten utama
    setTimeout(() => {
        loader.style.opacity = '0';
        
        setTimeout(() => {
            loader.style.display = 'none';
            mainContent.style.display = 'block';
            
            // Sedikit trik agar transisi CSS berjalan
            setTimeout(() => {
                mainContent.style.opacity = '1';
            }, 50);
            
        }, 500); // Waktu yang sama dengan durasi transisi opacity di CSS
    }, 3500); // Total waktu loading (3.5 detik)
});