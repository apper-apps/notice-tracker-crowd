import mockTemplates from "@/services/mockData/templates.json";

class TemplateService {
  constructor() {
    this.templates = [...mockTemplates];
  }

  async getAll() {
    await this.delay();
    return [...this.templates];
  }

  async getById(id) {
    await this.delay();
    const template = this.templates.find(t => t.Id === id);
    if (!template) {
      throw new Error("Template not found");
    }
    return { ...template };
  }

  async create(templateData) {
    await this.delay();
    const newTemplate = {
      ...templateData,
      Id: this.getNextId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.templates.push(newTemplate);
    return { ...newTemplate };
  }

  async update(id, templateData) {
    await this.delay();
    const index = this.templates.findIndex(t => t.Id === id);
    if (index === -1) {
      throw new Error("Template not found");
    }
    
    this.templates[index] = {
      ...this.templates[index],
      ...templateData,
      updatedAt: new Date().toISOString(),
    };
    
    return { ...this.templates[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.templates.findIndex(t => t.Id === id);
    if (index === -1) {
      throw new Error("Template not found");
    }
    
    this.templates.splice(index, 1);
    return true;
  }

  getNextId() {
    return Math.max(...this.templates.map(t => t.Id), 0) + 1;
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, 250));
  }
}

export const templateService = new TemplateService();