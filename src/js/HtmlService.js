export default class HtmlService {
  #ul = null;
  #medManService;

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
    tasks.forEach((task) => this.#addTaskToDOM(task));
  }

  async #addNewTask(description) {
    const newTask = await this.#medManService.save({ description });
    if (newTask) this.#addTaskToDOM(newTask);
  }

  #addTaskToDOM(task) {
    console.log(`👁️ [HtmlService.js] adding task to DOM: ${task.description}`);
    const taskHtml = `
      <li id="${task.id}" onclick="this.classList.toggle('done')">
        <span>${task.description}</span>
        <button onclick="htmlService.deleteTask(${task.id})">❌</button>
      </li>
    `;
    this.#ul.insertAdjacentHTML("beforeend", taskHtml);
  }

  async deleteTask(taskId) {
    console.log(`👁️ [HtmlService.js] deleting task with id ${taskId}`);
    const isDeleted = this.#medManService.delete(taskId);
    if (isDeleted) document.getElementById(taskId).remove();
  }
}