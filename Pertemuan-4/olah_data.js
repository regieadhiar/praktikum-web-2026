// File: olah_data.js
// Praktik Manipulasi Array of Objects dengan ES6+

const projects = [
    {
        id: 1,
        title: "Sistem Inventaris Keuangan",
        category: "Web App",
        budget: 2500000,
        completed: true
    },
    {
        id: 2,
        title: "Sistem Kasir Digiral POS",
        category: "Desktop App",
        budget: 5000000,
        completed: true
    },
    {
        id: 3,
        title: "Landing Page Profil Perusahaan",
        category: "Web App",
        budget: 1500000,
        completed: false
    },
    {
        id: 4,
        title: "Aplikasi Presensi GPS Mobile",
        category: "Mobile App",
        budget: 4500000,
        completed: false
    }
];

// Helper function format Rupiah
const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0
    }).format(angka);
};

console.log("=== 1. SEMUA DAFTAR PROYEK (forEach) ===");
projects.forEach((proj, idx) => {
    const status = proj.completed ? "[SELESAI]" : "[PROSES]";
    console.log(`${idx + 1}. ${status} ${proj.title} (${proj.category}) - ${formatRupiah(proj.budget)}`);
});

console.log("\n=== 2. PROYEK KATEGORI WEB APP (filter) ===");
const webProjects = projects.filter(proj => proj.category === "Web App");
console.log(webProjects);

console.log("\n=== 3. RINGKASAN NAMA & ANGGARAN (map) ===");
const ringkasanProyek = projects.map(proj => ({
    nama: proj.title,
    status: proj.completed ? "Selesai" : "Proses",
    biaya: formatRupiah(proj.budget)
}));
console.table(ringkasanProyek);

console.log("\n=== 4. TOTAL ANGGARAN (reduce) ===");
const totalAnggaran = projects.reduce((total, proj) => total + proj.budget, 0);
console.log(`Total Estimasi Anggaran Portofolio: ${formatRupiah(totalAnggaran)}`);

const totalSelesai = projects
    .filter(proj => proj.completed)
    .reduce((total, proj) => total + proj.budget, 0);
console.log(`Total Anggaran Proyek Selesai: ${formatRupiah(totalSelesai)}`);