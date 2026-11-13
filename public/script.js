const API = "/api/tasks";
let tasks = [];
let editId = null;

const input = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("taskList");

// READ
async function loadTasks() {
  const res = await fetch(API);
  tasks = await res.json();
  render();
}

function render() {
  list.innerHTML = "";
  tasks.forEach(task => {
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = task.text;

    const actions = document.createElement("div");

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.onclick = () => editTask(task.id);

    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.className = "delete";
    delBtn.onclick = () => deleteTask(task.id);

    actions.append(editBtn, delBtn);
    li.append(span, actions);
    list.appendChild(li);
  });
}

// CREATE + UPDATE
addBtn.addEventListener("click", async () => {
  const text = input.value.trim();
  if (!text) return;

  if (editId === null) {
    await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });
  } else {
    await fetch(`${API}/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });
    editId = null;
    addBtn.textContent = "Add";
  }

  input.value = "";
  loadTasks();
});

function editTask(id) {
  const task = tasks.find(t => t.id === id);
  input.value = task.text;
  editId = id;
  addBtn.textContent = "Update";
  input.focus();
}

// DELETE
async function deleteTask(id) {
  await fetch(`${API}/${id}`, { method: "DELETE" });
  loadTasks();
}

loadTasks();