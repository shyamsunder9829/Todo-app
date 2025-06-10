 let tasks = [];

function addTask() {
  const input = document.getElementById("taskInput");
  const taskText = input.value.trim();

  if (taskText === "") {
    alert("Please enter a task!");
    return;
  }

  const task = {
    id: Date.now(),
    text: taskText,
    completed: false
  };

  tasks.push(task);
  input.value = "";
  renderTasks();
  updateCounter();
  showNotification(`📝 Task added: "${task.text}"`);
}

function renderTasks(filter = "all") {
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  let filteredTasks = tasks;
  if (filter === "active") {
    filteredTasks = tasks.filter(task => !task.completed);
  } else if (filter === "completed") {
    filteredTasks = tasks.filter(task => task.completed);
  }

  filteredTasks.forEach(task => {
    const li = document.createElement("li");
    li.className = task.completed ? "completed" : "";

    li.innerHTML = `
      <span onclick="toggleTask(${task.id})">${task.text}</span>
      <button onclick="deleteTask(${task.id})">❌</button>
    `;

    list.appendChild(li);
  });
}

function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.completed = !task.completed;
    renderTasks();
    updateCounter();

    if (task.completed) {
      showNotification(`✅ Task completed: "${task.text}"`);
    }
  }
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  renderTasks();
  updateCounter();
}

function clearAll() {
  if (confirm("Clear all tasks?")) {
    tasks = [];
    renderTasks();
    updateCounter();
  }
}

function filterTasks(type) {
  document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
  const btn = [...document.querySelectorAll(".filter-btn")].find(b => b.textContent.toLowerCase().includes(type));
  if (btn) btn.classList.add("active");
  renderTasks(type);
}

function updateCounter() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  document.getElementById("taskCounter").textContent = `Tasks: ${total} | Completed: ${completed}`;
}

function changeTheme() {
  const theme = document.getElementById("themeSelect").value;
  document.body.classList.remove("light-theme", "dark-theme");
  document.body.classList.add(`${theme}-theme`);
  localStorage.setItem("theme", theme);
}

function showNotification(message) {
  if (Notification.permission === "granted") {
    new Notification(message);
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        new Notification(message);
      }
    });
  }
}

// Load saved theme
document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme") || "light";
  document.body.classList.add(`${savedTheme}-theme`);
  document.getElementById("themeSelect").value = savedTheme;

  if ("Notification" in window) {
    Notification.requestPermission();
  }
});
