import Dexie from "https://cdn.jsdelivr.net/npm/dexie@4.2.1/+esm";

const DB_KEY = "PWA::MEDMAN:DB";

export default class MedManService {
  #db = [];

  constructor() {
    this.#initializeDB();
  }

  #initializeDB() {
    console.log(`[MedManService.js] initializing DB`);
    const db = new Dexie(DB_KEY);
    db.version(1).stores({
        medman: "++id, description, dose, time, quantity",
    });
    
    db.on("populate", async () => {
      //
    });
    
    db.open();
    this.#db = db;
  }

  async save({ id, description, dose, time, quantity, createdDate = new Date(), done = false }) {
    if (!description || !dose || !time || quantity == null) {
        console.error(`[MedManService.js] missing fields`);
        return;
    }
    const medRecord = {
        id,
        description,
        dose,
        time,
        quantity,
        createdDate,
        updatedDate: new Date(),
        done,
    };
    try {
        const savedId = await this.#db.medman.put(medRecord);
        console.log(`[MedManService.js] medication ${description} saved`);
        return { id: savedId, ...medRecord };
    } catch (error) {
        console.error(`Error when saving medication: ${description}`, error);
    }
  }

  async getAll() {
    return this.#db.medman.toArray();
  }

  async delete(medId) {
    await this.#db.medman.delete(medId);
    console.log(`[MedManService.js] Medication with ID ${medId} has been deleted`);
    return true;
  }
}