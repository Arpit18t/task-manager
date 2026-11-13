const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, "tasks.json");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

function readTasks() {
  if (!fs.existsSync(DB_FILE)) return [];
  return JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
}

function writeTasks(tasks) {
  fs.writeFileSync(DB_FILE, JSON.stringify(tasks, null, 2));
}

// READ
app.get("/api/tasks", (req, res) => {
  res.json(readTasks());
});

// CREATE
app.post("/api/tasks", (req, res) => {
  const text = (req.body.text || "").trim();
  if (!text) return res.status(400).json({ error: "Text required hai" });

  const tasks = readTasks();
  const newTask = { id: Date.now(), text };
  tasks.push(newTask);
  writeTasks(tasks);

  res.status(201).json(newTask);
});

// UPDATE
app.put("/api/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const text = (req.body.text || "").trim();
  if (!text) return res.status(400).json({ error: "Text required hai" });

  const tasks = readTasks();
  const task = tasks.find(t => t.id === id);
  if (!task) return res.status(404).json({ error: "Task nahi mila" });

  task.text = text;
  writeTasks(tasks);
  res.json(task);
});

// DELETE
app.delete("/api/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const tasks = readTasks();

  if (!tasks.some(t => t.id === id)) {
    return res.status(404).json({ error: "Task nahi mila" });
  }

  writeTasks(tasks.filter(t => t.id !== id));
  res.json({ message: "Deleted" });
});

app.listen(PORT, () => {
  console.log(`Server chal raha hai: http://localhost:${PORT}`);
});