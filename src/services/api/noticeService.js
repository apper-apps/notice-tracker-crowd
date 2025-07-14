import mockNotices from "@/services/mockData/notices.json";

class NoticeService {
  constructor() {
    this.notices = [...mockNotices];
  }

  async getAll() {
    await this.delay();
    return [...this.notices];
  }

  async getById(id) {
    await this.delay();
    const notice = this.notices.find(n => n.Id === id);
    if (!notice) {
      throw new Error("Notice not found");
    }
    return { ...notice };
  }

  async create(noticeData) {
    await this.delay();
    const newNotice = {
      ...noticeData,
      Id: this.getNextId(),
      sentAt: new Date().toISOString(),
    };
    this.notices.push(newNotice);
    return { ...newNotice };
  }

  async update(id, noticeData) {
    await this.delay();
    const index = this.notices.findIndex(n => n.Id === id);
    if (index === -1) {
      throw new Error("Notice not found");
    }
    
    this.notices[index] = {
      ...this.notices[index],
      ...noticeData,
    };
    
    return { ...this.notices[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.notices.findIndex(n => n.Id === id);
    if (index === -1) {
      throw new Error("Notice not found");
    }
    
    this.notices.splice(index, 1);
    return true;
  }

  getNextId() {
    return Math.max(...this.notices.map(n => n.Id), 0) + 1;
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, 200));
  }
}

export const noticeService = new NoticeService();