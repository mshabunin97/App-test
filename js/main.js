// Находим элементы на странице
const form = document.querySelector("#form");
const taskInput = document.querySelector("#taskInput");
const tasksList = document.querySelector("#tasksList");
const emptyList = document.querySelector("#emptyList");
const themeSelectBtn = document.getElementById("theme-select-btn");
const themeSquares = document.getElementById("theme-squares");
let themeSquaresVisible = false;
const titleElement = document.querySelector(".display-4");
const subtitleElement = document.querySelector(".h4");

// Определение параметров анимации
const animationParams = {
  targets: [titleElement, subtitleElement],
  opacity: [0, 1],
  translateY: ["-40px", "0"],
  duration: 1000,
  easing: "easeInOutSine",
  delay: anime.stagger(200),
};

anime(animationParams);

// Блок с настройкой темы
themeSquares.addEventListener("click", function (event) {
  const selectedSquare = event.target;

  if (selectedSquare.classList.contains("theme-square")) {
    const themeClassName = selectedSquare.classList[1];

    animateThemeChange(themeClassName);
  }
});

themeSelectBtn.addEventListener("click", function () {
  themeSquares.style.display =
    themeSquares.style.display === "none" ? "block" : "none";
});

const savedTheme = localStorage.getItem("selectedTheme");

if (savedTheme) {
  document.body.className = savedTheme;
}

function animateThemeChange(newThemeClassName) {
  const currentThemeClassName = document.body.className;

  anime({
    targets: document.body,
    opacity: [1, 0],
    duration: 300,
    easing: "easeInOutSine",
    complete: () => {
      document.body.className = newThemeClassName;
      anime({
        targets: document.body,
        opacity: [0, 1],
        duration: 300,
        easing: "easeInOutSine",
      });
      localStorage.setItem("selectedTheme", newThemeClassName);
    },
  });
}

// Конец блока

let tasks = [];

if (localStorage.getItem("tasks")) {
  tasks = JSON.parse(localStorage.getItem("tasks"));
  tasks.forEach((task) => renderTask(task));
}

checkEmptyList();

form.addEventListener("submit", addTask);
tasksList.addEventListener("click", deleteTask);
tasksList.addEventListener("click", doneTask);

// Функции
function addTask(event) {
  event.preventDefault();

  const taskText = taskInput.value;

  const newTask = {
    id: Date.now(),
    text: taskText,
    done: false,
  };

  tasks.push(newTask);

  saveToLocalStorage();

  renderTask(newTask);

  taskInput.value = "";
  taskInput.focus();

  checkEmptyList();
}

function deleteTask(event) {
  if (event.target.dataset.action !== "delete") return;

  const parenNode = event.target.closest(".list-group-item");

  const id = Number(parenNode.id);

  anime({
    targets: parenNode,
    opacity: 0,
    scaleY: [1, 0],
    duration: 500,
    easing: "easeOutExpo",
    complete: () => {
      parenNode.style.marginBottom = "0";
      parenNode.remove();
      tasks = tasks.filter((task) => task.id !== id);
      saveToLocalStorage();
      checkEmptyList();
    },
  });
}

function doneTask(event) {
  if (event.target.dataset.action !== "done") return;

  const parentNode = event.target.closest(".list-group-item");

  const id = Number(parentNode.id);
  const task = tasks.find((task) => task.id === id);
  task.done = !task.done;

  saveToLocalStorage();

  const taskTitle = parentNode.querySelector(".task-title");
  taskTitle.classList.toggle("task-title--done");
}

function checkEmptyList() {
  if (tasks.length === 0) {
    const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
					<img src="./img/neon-cactus.png" alt="Empty" width="48" class="mt-3">
					<div class="empty-list__title">Список дел пуст</div>
				</li>`;
    tasksList.insertAdjacentHTML("afterbegin", emptyListHTML);
  }

  if (tasks.length > 0) {
    const emptyListEl = document.querySelector("#emptyList");
    emptyListEl ? emptyListEl.remove() : null;
  }
}

function saveToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTask(task) {
  const cssClass = task.done ? "task-title task-title--done" : "task-title";

  const taskHTML = `
                <li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
					<span class="${cssClass}">${task.text}</span>
					<div class="task-item__buttons">
						<button type="button" data-action="done" class="btn-action">
							<img src="./img/tick.svg" alt="Done" width="18" height="18">
						</button>
						<button type="button" data-action="delete" class="btn-action">
							<img src="./img/cross.svg" alt="Done" width="18" height="18">
						</button>
					</div>
				</li>`;

  tasksList.insertAdjacentHTML("beforeend", taskHTML);

  const newTaskElement = tasksList.lastElementChild;

  animateTask(newTaskElement);

  checkEmptyList();

  function animateTask(taskElement) {
    anime({
      targets: taskElement,
      opacity: [0, 1],
      translateY: ["-20px", "5px"],
      easing: "easeOutExpo",
      duration: 600,
    });
  }
}
