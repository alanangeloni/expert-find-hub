type Persistence = {
  setItem(key: string, value: string): Promise<void>;
  getItem(key: string): Promise<string | null>;
  removeItem(key: string): Promise<void>;
};

export const persistence: Persistence = {
  async setItem(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch {
      /* ignore quota errors */
    }
  },
  async getItem(key) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  async removeItem(key) {
    try {
      localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
  },
};
