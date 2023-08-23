const input = document.getElementById("input");
const ul = document.getElementById("ul");
const form = document.getElementById("form");
const clearAllBtn = document.getElementById("clearAllBtn");

function addTodo() {
  const inputValue = input.value;
  if (inputValue) {
    addToDatabase(inputValue);
    input.value = "";
  }
}

function createRmButton(task) {
  let rmButton = document.createElement("rmButton");
  rmButton.id = "rmBtn";
  rmButton.addEventListener("click", (e) => {
    e.preventDefault();
    deleteItemFromDatabase(task);
    fetchExistingTasks();
  });
  rmButton.innerHTML = "apagar";
  return rmButton;
}

function createTodoItem(inputValue) {
  const li = document.createElement("li");
  li.classList.add("li");
  li.addEventListener("click", () => {
    toggleComplete(inputValue);
  });
  li.innerHTML = inputValue.task;
  rmButton = createRmButton(inputValue);
  li.appendChild(rmButton);
  return li;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  addTodo();
});

clearAllBtn.addEventListener("click", deleteAllItemsFromDatabase);

function fetchExistingTasks() {
  ul.innerHTML = "";
  fetch("http://localhost:3000/todos")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((task) => {
        const li = createTodoItem(task);
        if (task.is_completed) {
          li.classList.toggle("completed");
        }
        ul.appendChild(li);
      });
    });
}

function addToDatabase(task) {
  fetch("http://localhost:3000/todos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ task }),
  })
    .then((response) => response.json())
    .then(() => {
      input.value = "";
      fetchExistingTasks();
    });
}

function deleteItemFromDatabase(task) {
  fetch("http://localhost:3000/todos", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ task }),
  })
    .then((response) => response.json())
    .then(() => {
      input.value = "";
    });
}

function deleteAllItemsFromDatabase() {
  fetch("http://localhost:3000/todos", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  })
    .then((response) => response.json())
    .then(() => {
      input.value = "";
      ul.innerHTML = "";
    });
}

function toggleComplete(task) {
  fetch("http://localhost:3000/todos", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ task }),
  })
    .then((response) => response.json())
    .then(() => {
      input.value = "";
      fetchExistingTasks();
    });
}

if (ul.innerHTML.trim() == "") fetchExistingTasks();
