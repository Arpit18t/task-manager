let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let editId = null;

const input = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("taskList");

function save() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// READ
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
addBtn.addEventListener("click", () => {
  const text = input.value.trim();
  if (!text) return;

  if (editId === null) {
    tasks.push({ id: Date.now(), text });          // Create
  } else {
    const task = tasks.find(t => t.id === editId); // Update
    task.text = text;
    editId = null;
    addBtn.textContent = "Add";
  }

  input.value = "";
  save();
  render();
});

// UPDATE (form mein purana text laao)
function editTask(id) {
  const task = tasks.find(t => t.id === id);
  input.value = task.text;
  editId = id;
  addBtn.textContent = "Update";
  input.focus();
}

// DELETE
function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  save();
  render();
}

render();