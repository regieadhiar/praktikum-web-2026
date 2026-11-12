// File: public/script.js - Logika Client-Side JavaScript CRUD
document.addEventListener("DOMContentLoaded", () => {
  // 1. Tangkap Elemen DOM
  const mhsForm = document.querySelector("#mhsForm");
  const mhsIdInput = document.querySelector("#mhsId");
  const nimInput = document.querySelector("#nim");
  const namaInput = document.querySelector("#nama");
  const jurusanInput = document.querySelector("#jurusan");
  const emailInput = document.querySelector("#email");
  const btnSubmit = document.querySelector("#btnSubmit");
  const btnCancel = document.querySelector("#btnCancel");
  const formTitle = document.querySelector("#formTitle");
  const mhsTableBody = document.querySelector("#mhsTableBody");
  const alertMessage = document.querySelector("#alertMessage");
  const searchInput = document.querySelector("#searchInput");
  const studentCounter = document.querySelector("#studentCounter");
  let listMahasiswa = [];
  // Fungsi Pembantu Notifikasi Alert
  const showAlert = (text, type = "success") => {
    alertMessage.textContent = text;
    alertMessage.className = `alert alert-${type}`;
    alertMessage.style.display = "block";
    setTimeout(() => {
      alertMessage.style.display = "none";
    }, 3000);
  };
  // 2. READ: Ambil Data Mahasiswa dari API Node.js
  const loadMahasiswa = async () => {
    try {
      const res = await fetch("/api/mahasiswa");
      listMahasiswa = await res.json();
      renderTable(listMahasiswa);
    } catch (err) {
      showAlert("Gagal memuat data dari server backend", "error");
    }
  };
  const renderTable = (data) => {
    mhsTableBody.innerHTML = "";
    if (data.length === 0) {
      mhsTableBody.innerHTML =
        "<tr><td colspan='6' style='text-align:center;color:#64748b;'>Belum ada data mahasiswa tersimpan.</td></tr>";
      return;
    }
    data.forEach((mhs, idx) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
    <td>${idx + 1}</td>
    <td>${mhs.nim}</td>
    <td>${mhs.nama}</td>
    <td>${mhs.jurusan}</td>
    <td>${mhs.email}</td>
    <td>
    <button class="btn-action btn-edit"
    data-id="${mhs.id}">Edit</button>
    <button class="btn-action btn-delete"
    data-id="${mhs.id}">Hapus</button>
    </td>
    `;
      mhsTableBody.appendChild(tr);
    });
  };
  // Fitur 2: Validasi Pencegahan NIM Duplikat di Frontend JavaScript
  const isNimAlreadyRegistered = (nimToCheck) => {
    return listMahasiswa.some((mhs) => mhs.nim === nimToCheck);
  };

  // 3. CREATE & UPDATE: Submit Formulir
  mhsForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const payload = {
      nim: nimInput.value.trim(),
      nama: namaInput.value.trim(),
      jurusan: jurusanInput.value,
      email: emailInput.value.trim(),
    };
    const id = mhsIdInput.value;
    const isEdit = Boolean(id);

    // Fitur 2: Cek duplikat NIM hanya saat menambah mahasiswa baru
    if (!isEdit && isNimAlreadyRegistered(payload.nim)) {
      showAlert("NIM sudah terdaftar!", "error");
      nimInput.focus();
      return;
    }

    const url = isEdit ? `/api/mahasiswa/${id}` : "/api/mahasiswa";
    const method = isEdit ? "PUT" : "POST";
    try {
      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (result.success) {
        showAlert(result.message);
        resetForm();
        loadMahasiswaWithCounter();
      } else {
        showAlert("Terjadi kesalahan: " + result.message, "error");
      }
    } catch (err) {
      showAlert("Gagal mengirim data ke server", "error");
    }
  });
  // Fitur 1: Kolom Pencarian Real-Time (Search Filter di JavaScript)
  const renderFilteredTable = () => {
    const keyword = searchInput.value.trim().toLowerCase();
    const filtered = keyword
      ? listMahasiswa.filter((mhs) =>
          mhs.nama.toLowerCase().includes(keyword) ||
          mhs.nim.toLowerCase().includes(keyword)
        )
      : listMahasiswa;
    renderTable(filtered);
  };

  searchInput.addEventListener("input", renderFilteredTable);

  // Fitur 3: Indikator Counter Total Mahasiswa
  const updateStudentCounter = () => {
    studentCounter.textContent = `Total Mahasiswa Terdaftar: ${listMahasiswa.length} Orang`;
  };

  const loadMahasiswaWithCounter = async () => {
    await loadMahasiswa();
    updateStudentCounter();
    renderFilteredTable();
  };

  // 4. DELETE & EDIT: Tangani Event Klik pada Tabel (Event Delegation)
  mhsTableBody.addEventListener("click", async (e) => {
    const id = Number(e.target.dataset.id);
    if (!id) return;
    // Mode Edit: Isi form otomatis
    if (e.target.classList.contains("btn-edit")) {
      const targetMhs = listMahasiswa.find((m) => m.id === id);
      if (targetMhs) {
        mhsIdInput.value = targetMhs.id;
        nimInput.value = targetMhs.nim;
        namaInput.value = targetMhs.nama;
        jurusanInput.value = targetMhs.jurusan;
        emailInput.value = targetMhs.email;
        formTitle.textContent = "Edit Data Mahasiswa";
        btnSubmit.textContent = "Perbarui Mahasiswa";
        btnCancel.style.display = "inline-block";
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
    // Mode Delete: Hapus data via HTTP DELETE
    else if (e.target.classList.contains("btn-delete")) {
      if (confirm("Apakah Anda yakin ingin menghapus data mahasiswa ini?")) {
        try {
          const res = await fetch(`/api/mahasiswa/${id}`, { method: "DELETE" });
          const result = await res.json();
          if (result.success) {
            showAlert(result.message);
            loadMahasiswaWithCounter();
          } else {
            showAlert("Gagal menghapus data dari server", "error");
          }
        } catch (err) {
          showAlert("Gagal menghapus data dari server", "error");
        }
      }
    }
  });
  // 5. Reset Form ke Mode Tambah
  const resetForm = () => {
    mhsForm.reset();
    mhsIdInput.value = "";
    formTitle.textContent = "Tambah Mahasiswa Baru";
    btnSubmit.textContent = "Simpan Mahasiswa";
    btnCancel.style.display = "none";
  };
  btnCancel.addEventListener("click", resetForm);
  // Ambil data pertama kali
  loadMahasiswaWithCounter();
  renderFilteredTable();
});
