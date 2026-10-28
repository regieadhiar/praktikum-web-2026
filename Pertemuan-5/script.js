// File: script.js

document.addEventListener("DOMContentLoaded", () => {
    // 1. Ambil elemen DOM
    const todoForm = document.querySelector("#todoForm");
    const taskInput = document.querySelector("#taskInput");
    const inputError = document.querySelector("#inputError");
    const todoList = document.querySelector("#todoList");

    // 2. Fungsi membaca dan menyimpan ke LocalStorage
    const getTasks = () => JSON.parse(localStorage.getItem("todo_tasks")) || [];
    const saveTasks = (tasks) => localStorage.setItem("todo_tasks", JSON.stringify(tasks));

    // 3. Fungsi menampilkan daftar tugas ke layar
    const renderTasks = () => {
        const tasks = getTasks();
        todoList.innerHTML = "";
        if (tasks.length === 0) {
            todoList.innerHTML = "<p style='text-align:center; color:#64748b; font-size:13px; padding:10px;'>Belum ada tugas tersimpan.</p>";
            return;
        }

        tasks.forEach((task, index) => {
            const li = document.createElement("li");
            li.className = `todo-item ${task.completed ? 'completed' : ''}`;
            li.innerHTML = `
            <span class="todo-text">${task.text}</span>
            <div class="todo-actions">
                <button class="action-btn complete-btn" data-index="${index}">
                ${task.completed ? 'Batal' : 'Selesai'}
                </button>
                <button class="action-btn delete-btn" data-index="${index}">Hapus</button>
            </div>
            `;
            todoList.appendChild(li);
        });
    };

    // 4. Tambah tugas saat formulir dikirim
    todoForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const taskText = taskInput.value.trim();

        // Validasi input sederhana
        if (taskText.length < 3) {
            taskInput.classList.add("error");
            inputError.style.display = "block";
            return;
        }

        // Jika valid, hilangkan pesan error
        taskInput.classList.remove("error");
        inputError.style.display = "none";

        // Simpan tugas baru ke array LocalStorage
        const tasks = getTasks();
        tasks.push({ text: taskText, completed: false});
        saveTasks(tasks);

        taskInput.value = "";
        renderTasks();
    });

    // 5. Tangani klik tombol Selesai dan Hapus menggunakan Event Listener pada todoList
    todoList.addEventListener("click", (e) => {
        const index = e.target.dataset.index;
        if (index === undefined) return;

        const tasks = getTasks();

        if (e.target.classList.contains("complete-btn")) {
            tasks[index].completed = !tasks[index].completed;
            saveTasks(tasks);
            renderTasks();
        } else if (e.target.classList.contains("delete-btn")) {
            tasks.splice(index, 1);
            saveTasks(tasks);
            renderTasks();
        }
    });

    // Render pertama kali saat halaman selesai dimuat
    renderTasks();
});