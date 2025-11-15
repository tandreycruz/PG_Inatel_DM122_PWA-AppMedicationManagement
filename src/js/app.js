import HtmlService from "./HtmlService.js";
import MedManService from "./MedManService.js";

class App {
  constructor() {
    this.#registerServiceWorker();
    const medManService = new MedManService();
    window.htmlService = new HtmlService(medManService);
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