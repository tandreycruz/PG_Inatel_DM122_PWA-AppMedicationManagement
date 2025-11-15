export default class HtmlService {
  #ul = null;
  constructor() {
    this.#formInitialization();
    this.#ul = document.querySelector("ul");
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

  #addNewTask(task) {
    console.log(`👁️ [HtmlService.js] adding new task: ${task}`);
    const randomID = window.crypto.randomUUID();
    const taskHtml = `
      <li id="${randomID}" onclick="this.classList.toggle('done')">
        <span>${task}</span>
        <button onclick="htmlService.deleteTask('${randomID}')">❌</button>
      </li>
    `;
    this.#ul.insertAdjacentHTML("beforeend", taskHtml);
  }

  deleteTask(taskId) {
    console.log(`👁️ [HtmlService.js] I was called to delete ${taskId}`);
    document.getElementById(taskId).remove();
  }
}