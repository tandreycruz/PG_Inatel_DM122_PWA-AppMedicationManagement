export default class HtmlService {
  #ul = null;
  #medManService;
  #medications = new Map();
  #editingId = null;


  constructor(medManService) {
    this.#medManService = medManService;
    this.#ul = document.querySelector("ul");
    this.#formInitialization();
    this.#listMedications();
  }

  #formInitialization() {
    const form = document.querySelector("#med-form");
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const data = {
        description: form.description.value,
        dose: parseInt(form.dose.value),
        time: form.time.value,
        quantity: parseInt(form.quantity.value),
      };

      if (this.#editingId) {
        // Atualiza medicação existente
        data.id = this.#editingId;
        await this.#medManService.save(data); // atualiza no armazenamento
        this.#medications.set(data.id, data); // atualiza no Map local
        document.getElementById(data.id).remove(); // remove do DOM
        this.#addMedicationToDOM(data); // insere versão atualizada
        this.#editingId = null;
        form.querySelector("button[type='submit']").textContent = "Add Medication";

        if (data.quantity <= 0) {
          const element = document.getElementById(data.id);
          this.markMedication(data.id, element);
        }

      } else {
        // Adiciona nova medicação
        await this.#addNewMedication(data);
      }

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
    if (newMed) {
      this.#medications.set(newMed.id, newMed);
      this.#addMedicationToDOM(newMed);
    }
  }

  #addMedicationToDOM(med) {    
    const medHtml = `
      <li id="${med.id}">
        <span>
          <strong>${med.description}</strong><br>
          Dose: ${med.dose} | Time: ${med.time} | Qty: ${med.quantity}
        </span>
        <button onclick="htmlService.startEditingMedication(${med.id})">✏️</button>
        <button onclick="htmlService.deleteMedication(${med.id})">🗑️</button>
        <button onclick="htmlService.confirmMedicationTaken(${med.id})">✅</button>
      </li>
    `;
    this.#ul.insertAdjacentHTML("beforeend", medHtml);
  }

  startEditingMedication(medId) {
    const med = this.#medications.get(medId);
    if (!med) return;

    const form = document.querySelector("#med-form");
    form.description.value = med.description;
    form.dose.value = med.dose;
    form.time.value = med.time;
    form.quantity.value = med.quantity;

    this.#editingId = medId;

    // MUDAR O TEXTO DO BOTAO QUANDO FOR ATUALIZAR
    form.querySelector("button[type='submit']").textContent = "Update Medication";
  }

  async markMedication(medId, element) {
    const med = this.#medications.get(medId);
    med.done = element.classList.toggle("done");
    await this.#medManService.save(med);
    console.log(`👁️ [HtmlService.js] medication (${med.description}) has been updated`
    );
  }
    
  async deleteMedication(medId) {
    console.log(`👁️ [HtmlService.js] deleting medication with id ${medId}`);
    const isDeleted = this.#medManService.delete(medId);
    if (isDeleted) document.getElementById(medId).remove();
  }


  async confirmMedicationTaken(medId) {
    const med = this.#medications.get(medId);
    if (!med || med.quantity <= 0) {
      alert("Out of stock or invalid medication.");
      return;
    }

    const confirmed = confirm(`Confirm that you took ${med.description}?`);
    if (!confirmed) return;

    med.quantity -= 1;

    if (med.quantity <= 0) {
      med.done = true;
    }

    await this.#medManService.save(med);
    this.#medications.set(medId, med);

    // Atualiza visualmente
    const oldElement = document.getElementById(medId);
    if (oldElement) oldElement.remove();

    this.#addMedicationToDOM(med); // agora o novo elemento está no DOM

    // Marca como feito se necessário
    if (med.done) {
      const newElement = document.getElementById(medId);
      this.markMedication(medId, newElement);
    }

    console.log(`👁️ [HtmlService.js] ${med.description} taken. Current stock: ${med.quantity}`);
  }

}