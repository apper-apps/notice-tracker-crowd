import mockOfficers from "@/services/mockData/officers.json";

class OfficerService {
  constructor() {
    this.officers = [...mockOfficers];
  }

  async getAll() {
    await this.delay();
    return [...this.officers];
  }

  async getById(id) {
    await this.delay();
    const officer = this.officers.find(o => o.Id === id);
    if (!officer) {
      throw new Error("Officer not found");
    }
    return { ...officer };
  }

  async create(officerData) {
    await this.delay();
    const newOfficer = {
      ...officerData,
      Id: this.getNextId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.officers.push(newOfficer);
    return { ...newOfficer };
  }

  async update(id, officerData) {
    await this.delay();
    const index = this.officers.findIndex(o => o.Id === id);
    if (index === -1) {
      throw new Error("Officer not found");
    }
    
    this.officers[index] = {
      ...this.officers[index],
      ...officerData,
      updatedAt: new Date().toISOString(),
    };
    
    return { ...this.officers[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.officers.findIndex(o => o.Id === id);
    if (index === -1) {
      throw new Error("Officer not found");
    }
    
    this.officers.splice(index, 1);
    return true;
  }

  getNextId() {
    return Math.max(...this.officers.map(o => o.Id), 0) + 1;
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, 300));
  }
}

export const officerService = new OfficerService();