import HtmlService from "./HtmlService.js";

class App {
  constructor() {
    this.#registerServiceWorker();
    window.htmlService = new HtmlService();
  }

  #registerServiceWorker() {
    // prettier-ignore
    navigator.serviceWorker
      .register("./sw.js", { type: 'module' })
      .then(() => console.log(`👁️ [app.js] SW registered`))
      .catch(() => console.log(`👁️ [app.js] SW failed to register`));
  }
}

new App();