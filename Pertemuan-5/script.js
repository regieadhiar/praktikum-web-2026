// File: script.js

document.addEventListener("DOMContentLoaded", () => {
    // 1. Ambil elemen DOM
    const todoForm = document.querySelector("#todoForm");
    const taskInput = document.querySelector("#taskInput");
    const inputError = document.querySelector("#inputError");
    const todoList = document.querySelector("#todoList");
    const todoApp = document.querySelector(".todo-app");

    // Element untuk task counter
    let taskCounter = document.getElementById("taskCounter");
    if (!taskCounter) {
        taskCounter = document.createElement("div");
        taskCounter.id = "taskCounter";
        taskCounter.className = "task-counter";
        todoApp.insertBefore(taskCounter, todoList);
    }

    // Fungsi memperbarui task counter
    const updateTaskCounter = () => {
        const tasks = getTasks();
        const total = tasks.length;
        const completed = tasks.filter(t => t.completed).length;
        const remaining = total - completed;
        taskCounter.innerHTML = `Total: ${total} Tugas | Selesai: ${completed} | Belum Selesai: ${remaining}`;
    };

    // 2. Fungsi membaca dan menyimpan ke LocalStorage
    const getTasks = () => JSON.parse(localStorage.getItem("todo_tasks")) || [];
    const saveTasks = (tasks) => localStorage.setItem("todo_tasks", JSON.stringify(tasks));

    // 3. Fungsi menampilkan daftar tugas ke layar
    const renderTasks = () => {
        const tasks = getTasks();
        todoList.innerHTML = "";
        if (tasks.length === 0) {
            todoList.innerHTML = "<p style='text-align:center; color:#64748b; font-size:13px; padding:10px;'>Belum ada tugas tersimpan.</p>";
            updateTaskCounter();
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
        updateTaskCounter();
    };

    // 4. Tambah tugas saat formulir dikirim
    todoForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const taskText = taskInput.value.trim();

        // Validasi input sederhana
        if (taskText.length < 3) {
            taskInput.classList.add("error");
            inputError.innerHTML = "Tugas tidak boleh kosong atau kurang dari 3 karakter!";
            inputError.style.display = "block";
            return;
        }

        // Jika valid, hilangkan pesan error
        taskInput.classList.remove("error");
        inputError.style.display = "none";

        // Maksimal 5 Task, jika lebih dari 5 maka error
        const tasks = getTasks();

        if (tasks.length >= 5) {
            taskInput.classList.add("error");
            inputError.innerHTML = "Maksimal hanya 5 Tugas!";
            inputError.style.display = "block";
            return;
        }

        tasks.push({ text: taskText, completed: false });
        saveTasks(tasks);
        taskInput.value = "";
        renderTasks();
    });

    // Fitur 2: Tombol Bersihkan Tugas Selesai
    const clearCompletedBtn = document.createElement("button");
    clearCompletedBtn.type = "button";
    clearCompletedBtn.className = "clear-completed-btn";
    clearCompletedBtn.innerHTML = "Bersihkan Tugas Selesai";
    todoList.after(clearCompletedBtn);

    clearCompletedBtn.addEventListener("click", () => {
        const tasks = getTasks();
        const remainingTasks = tasks.filter(task => !task.completed);
        saveTasks(remainingTasks);
        renderTasks();
        updateTaskCounter();
    });

    // 5. Tangani klik tombol Selesai dan Hapus menggunakan Event Listener pada todoList
    todoList.addEventListener("click", (e) => {
        const index = e.target.dataset.index;
        if (index === undefined) return;

        const tasks = getTasks();

        // Fitur 3: Konfirmasi sebelum menghapus
        if (e.target.classList.contains("delete-btn")) {
            if (confirm("Apakah Anda yakin ingin menghapus tugas ini?")) {
                tasks.splice(index, 1);
                saveTasks(tasks);
                renderTasks();
                updateTaskCounter();
            }
            return;
        }

        if (e.target.classList.contains("complete-btn")) {
            tasks[index].completed = !tasks[index].completed;
            saveTasks(tasks);
            renderTasks();
            updateTaskCounter();
        }
    });

    // Render pertama kali saat halaman selesai dimuat
    renderTasks();
});