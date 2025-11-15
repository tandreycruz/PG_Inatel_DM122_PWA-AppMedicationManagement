export default class HtmlService {
  #ul = null;
  #medManService;
  #tasks = new Map();

  constructor(medManService) {
    this.#medManService = medManService;
    this.#ul = document.querySelector("ul");
    this.#formInitialization();
    this.#listTasks();
  }

  #formInitialization() {
    const form = document.querySelector("form");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      console.log(`👁️ [HtmlService.js] form trigged`);
      this.#addNewTask(form.task.value);
      form.reset();
      form.task.focus();
    });
  }

  async #listTasks() {
    const tasks = await this.#medManService.getAll();
    tasks.forEach((task) => {
      this.#tasks.set(task.id, task);
      this.#addTaskToDOM(task);
    });
  }

  async #addNewTask(description) {
    const newTask = await this.#medManService.save({ description });
    if (newTask) this.#addTaskToDOM(newTask);
  }

  #addTaskToDOM(task) {
    console.log(`👁️ [HtmlService.js] adding task to DOM: ${task.description}`);
    const taskHtml = `
      <li id="${task.id}" onclick="htmlService.updateTask(${task.id}, this)">
        <span>${task.description}</span>
        <button onclick="htmlService.deleteTask(${task.id})">❌</button>
      </li>
    `;
    this.#ul.insertAdjacentHTML("beforeend", taskHtml);
  }

  async updateTask(taskId, element) {
    const task = this.#tasks.get(taskId);
    task.done = element.classList.toggle("done");
    await this.#medManService.save(task);
    console.log(
      `👁️ [HtmlService.js] task (${task.description}) has been deleted`
    );
  }

  async deleteTask(taskId) {
    console.log(`👁️ [HtmlService.js] deleting task with id ${taskId}`);
    const isDeleted = this.#medManService.delete(taskId);
    if (isDeleted) document.getElementById(taskId).remove();
  }
}