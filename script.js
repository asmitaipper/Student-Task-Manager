const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const prioritySelect = document.getElementById("priority-select");
const dueDateInput = document.getElementById("due-date");
const taskList = document.getElementById("task-list");
const filterButtons = document.querySelectorAll(".filters button");

let tasks = JSON.parse(localStorage.getItem("student_tasks") || "[]");

function saveTasks() {
  localStorage.setItem("student_tasks", JSON.stringify(tasks));
}

function renderTasks(filter = "all") {
  taskList.innerHTML = "";

  const filtered = tasks.filter((t) => {
    if (filter === "pending") return !t.done;
    if (filter === "done") return t.done;
    return true;
  });

  filtered.forEach((task) => {
    const li = document.createElement("li");
    li.className = "task-item";

    const left = document.createElement("div");
    left.className = "task-left";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;
    checkbox.addEventListener("change", () => {
      task.done = checkbox.checked;
      saveTasks();
      renderTasks(filter);
    });

    const content = document.createElement("div");
    content.className = "task-content";

    const title = document.createElement("div");
    title.className = "task-title";
    if (task.done) title.classList.add("done");
    title.textContent = task.text;

    const meta = document.createElement("div");
    meta.className = "task-meta";
    const parts = [];
    parts.push(`Priority: `);
    const spanPriority = document.createElement("span");
    spanPriority.textContent = task.priority;
    spanPriority.className = `priority-${task.priority}`;
    meta.append("Priority: ", spanPriority);

    if (task.dueDate) {
      meta.append(`  •  Due: ${task.dueDate}`);
    }

    content.appendChild(title);
    content.appendChild(meta);

    left.appendChild(checkbox);
    left.appendChild(content);

    const actions = document.createElement("div");
    actions.className = "task-actions";

    const editBtn = document.createElement("button");
    editBtn.className = "edit-btn";
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", () => {
      const newText = prompt("Update task:", task.text);
      if (newText && newText.trim() !== "") {
        task.text = newText.trim();
        saveTasks();
        renderTasks(filter);
      }
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => {
      tasks = tasks.filter((t) => t.id !== task.id);
      saveTasks();
      renderTasks(filter);
    });

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    li.appendChild(left);
    li.appendChild(actions);

    taskList.appendChild(li);
  });
}

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const text = taskInput.value.trim();
  if (!text) return;

  const priority = prioritySelect.value;
  const dueDate = dueDateInput.value;

  const newTask = {
    id: Date.now(),
    text,
    priority,
    dueDate,
    done: false,
  };

  tasks.push(newTask);
  saveTasks();
  taskForm.reset();
  renderTasks(getActiveFilter());
});

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    renderTasks(btn.dataset.filter);
  });
});

function getActiveFilter() {
  const active = document.querySelector(".filters button.active");
  return active ? active.dataset.filter : "all";
}

renderTasks(getActiveFilter());
