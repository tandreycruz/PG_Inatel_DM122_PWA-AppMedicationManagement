export default class HtmlService {
  #ul = null;
  #medManService;
  #medications = new Map();

  constructor(medManService) {
    this.#medManService = medManService;
    this.#ul = document.querySelector("ul");
    this.#formInitialization();
    this.#listMedications();
  }

  #formInitialization() {
    const form = document.querySelector("#med-form");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = {
        description: form.description.value,
        dose: parseInt(form.dose.value),
        time: form.time.value,
        quantity: parseInt(form.quantity.value),
      };
      this.#addNewMedication(data);
      form.reset();
      form.description.focus();
    });
  }


  async #listMedications() {
    const meds = await this.#medManService.getAll();
    meds.forEach((med) => {
      this.#medications.set(med.id, med);
      this.#addMedicationToDOM(med);
    });
  }

  async #addNewMedication(medication) {
    const newMed = await this.#medManService.save(medication);
    if (newMed) this.#addMedicationToDOM(newMed);
  }


  #addMedicationToDOM(med) {
    const medHtml = `
      <li id="${med.id}" onclick="htmlService.updateMedication(${med.id}, this)">
        <span>
          <strong>${med.description}</strong><br>
          Dose: ${med.dose} | Horário: ${med.time} | Qtde: ${med.quantity}
        </span>
        <button onclick="htmlService.deleteMedication(${med.id})">❌</button>
      </li>
    `;
    this.#ul.insertAdjacentHTML("beforeend", medHtml);
  }

  async updateMedication(medId, element) {
    const med = this.#medications.get(medId);
    med.done = element.classList.toggle("done");
    await this.#medManService.save(med);
    console.log(
      `👁️ [HtmlService.js] task (${med.description}) has been deleted`
    );
  }

  async deleteMedication(medId) {
    console.log(`👁️ [HtmlService.js] deleting task with id ${medId}`);
    const isDeleted = this.#medManService.delete(medId);
    if (isDeleted) document.getElementById(medId).remove();
  }
}