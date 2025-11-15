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
      medman: "++id",
    });
    db.on("populate", async () => {
      db.medman.bulkPut([
        {
          description: "Inzelm 20mg",
          createdDate: new Date(),
          done: false,
        },
        {
          description: "Tolrest 25mg",
          createdDate: new Date(),
          done: true,
        },
        {
          description: "Ancoron 100mg",
          createdDate: new Date(),
          done: false,
        },
      ]);
    });
    db.open();
    this.#db = db;
  }

  async save({ description, createdDate = new Date(), done = false }) {
    if (!description) {
      console.error(`[MedManService.js] no description provided`);
      return;
    }
    const taskRecord = {
      description,
      createdDate,
      updatedDate: new Date(),
      done,
    };
    try {
      const savedId = await this.#db.medman.put(taskRecord);
      console.log(`[MedManService.js] ${description} saved`);
      return { id: savedId, ...taskRecord };
    } catch (error) {
      console.error(`Error when adding task: ${description}`, error);
    }
  }

  async getAll() {
    return this.#db.medman.toArray();
  }

  async delete(taskId) {
    await this.#db.medman.delete(taskId);
    console.log(`[MedManService.js] deleted ${taskId}`);
    return true;
  }
}