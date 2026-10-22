// File: main.js
// Integrasi Logika Data dan Render ke Elemen DOM

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
        title: "Sistem Kasir Digital POS",
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

// Menyimpan kondisi filter kategori dan kata kunci pencarian
let activeCategory = "Semua";
let searchKeyword = "";

const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0
    }).format(angka);
};

// Mengubah teks menjadi HTML aman supaya judul dari user tidak merusak tampilan
const escapeHtml = (teks) => {
    return String(teks).replace(/[&<>"']/g, (karakter) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    }[karakter]));
};

const updateStats = (dataList) => {
    const totalProjects = dataList.length;
    const totalBudget = dataList.reduce((acc, curr) => acc + curr.budget, 0);
    const completedCount = dataList.filter(item => item.completed).length;

    document.getElementById("stat-total-projects").textContent = totalProjects;
    document.getElementById("stat-total-budget").textContent = formatRupiah(totalBudget);
    document.getElementById("stat-completed-projects").textContent = completedCount;
};

// Menggabungkan filter kategori dengan pencarian nama (filter terpadu)
const getFilteredProjects = () => {
    const keyword = searchKeyword.trim().toLowerCase();

    return projects.filter((proj) => {
        const cocokKategori = activeCategory === "Semua" || proj.category === activeCategory;
        const cocokNama = proj.title.toLowerCase().includes(keyword);
        return cocokKategori && cocokNama;
    });
};

const renderProjects = (filteredList) => {
    const container = document.getElementById("project-list");
    if (!container) return;

    if (filteredList.length === 0) {
        container.innerHTML = "<p style='text-align: center; color: #64748b; padding: 20px;'>Tidak ada proyek yang cocok.</p>";
        return;
    }

    const htmlString = filteredList.map(proj => {
        const badgeClass = proj.completed ? "badge-success" : "badge-pending";
        const statusText = proj.completed ? "Selesai" : "Dalam Pengerjaan";

        return `
        <div class="project-card">
        <div class="project-info">
        <span class="project-category">${escapeHtml(proj.category)}</span>
        <h4>${escapeHtml(proj.title)}</h4>
        <p class="project-budget">${formatRupiah(proj.budget)}</p>
        </div>
        <div class="project-actions">
        <span class="badge ${badgeClass}">${statusText}</span>
        <button class="btn-action" data-action="toggle" data-id="${proj.id}">Ubah Status</button>
        <button class="btn-action btn-danger" data-action="delete" data-id="${proj.id}">Hapus Proyek</button>
        </div>
        </div>
        `;
    }).join("");

    container.innerHTML = htmlString;
};

// Render ulang daftar proyek + kartu statistik sekaligus
// (statistik menghitung SELURUH proyek, bukan hanya hasil filter/pencarian)
const renderApp = () => {
    renderProjects(getFilteredProjects());
    updateStats(projects);
};

document.addEventListener("DOMContentLoaded", () => {
    // ---------- FITUR 1: Formulir Input Proyek Dinamis ----------
    const form = document.getElementById("project-form");
    const titleInput = document.getElementById("project-title");
    const categoryInput = document.getElementById("project-category");
    const budgetInput = document.getElementById("project-budget");
    const completedInput = document.getElementById("project-completed");
    const errorBox = document.getElementById("form-error");

    const showError = (pesan) => {
        errorBox.textContent = pesan;
        errorBox.classList.add("show");
    };

    const clearError = () => {
        errorBox.textContent = "";
        errorBox.classList.remove("show");
    };

    form.addEventListener("submit", (e) => {
        e.preventDefault(); // mencegah reload halaman

        const title = titleInput.value.trim();
        const category = categoryInput.value;
        const budget = Number(budgetInput.value);
        const completed = completedInput.checked;

        // Validasi: judul tidak boleh kosong
        if (title === "") {
            showError("Judul proyek tidak boleh kosong.");
            titleInput.focus();
            return;
        }

        // Validasi: anggaran harus lebih besar dari 0
        if (budgetInput.value === "" || Number.isNaN(budget) || budget <= 0) {
            showError("Estimasi anggaran harus berupa angka lebih besar dari 0.");
            budgetInput.focus();
            return;
        }

        // Membuat objek proyek baru dengan id unik (Date.now)
        const newProject = {
            id: Date.now(),
            title: title,
            category: category,
            budget: budget,
            completed: completed
        };

        // Menambahkan proyek ke dalam array (method array push)
        projects.push(newProject);

        // Bersihkan form dan render ulang tampilan
        form.reset();
        clearError();
        renderApp();
    });

    // ---------- FITUR 2: Pencarian Real-Time (Live Search) ----------
    const searchInput = document.getElementById("search-input");

    searchInput.addEventListener("input", (e) => {
        searchKeyword = e.target.value; // event 'input' berjalan setiap karakter diketik
        renderProjects(getFilteredProjects());
    });

    // Filter kategori (digabung dengan pencarian di getFilteredProjects)
    const filterButtons = document.querySelectorAll(".btn-filter");
    filterButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            filterButtons.forEach(b => b.classList.remove("active"));
            e.target.classList.add("active");

            activeCategory = e.target.getAttribute("data-category");
            renderProjects(getFilteredProjects());
        })
    })

    // ---------- FITUR 3: Aksi Interaktif Kartu Proyek ----------
    // Event delegation: satu listener untuk semua tombol di dalam daftar proyek
    const projectList = document.getElementById("project-list");

    projectList.addEventListener("click", (e) => {
        const button = e.target.closest("button[data-action]");
        if (!button) return;

        const action = button.getAttribute("data-action");
        const id = Number(button.getAttribute("data-id"));

        if (action === "toggle") {
            // Mengubah status: 'Dalam Pengerjaan' <-> 'Selesai'
            const project = projects.find(p => p.id === id);
            if (project) {
                project.completed = !project.completed;
            }
        } else if (action === "delete") {
            // Menghapus proyek berdasarkan id-nya
            const index = projects.findIndex(p => p.id === id);
            if (index !== -1) {
                projects.splice(index, 1);
            }
        }

        // Tampilan kartu dan angka statistik langsung diperbarui
        renderApp();
    });

    // Render pertama kali
    renderApp();
})
