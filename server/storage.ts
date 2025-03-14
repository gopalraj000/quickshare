import { files, type File, type InsertFile } from "@shared/schema";
import crypto from "crypto";

export interface IStorage {
  createFile(file: InsertFile): Promise<File>;
  getFileByCode(code: string): Promise<File | undefined>;
  deleteExpiredFiles(): Promise<void>;
}

export class MemStorage implements IStorage {
  private files: Map<number, File>;
  private currentId: number;

  constructor() {
    this.files = new Map();
    this.currentId = 1;
  }

  private generateUniqueCode(): string {
    const code = crypto.randomInt(1000, 10000).toString().padStart(4, '0');
    const exists = Array.from(this.files.values()).some(file => file.code === code);
    if (exists) {
      return this.generateUniqueCode();
    }
    return code;
  }

  async createFile(insertFile: InsertFile): Promise<File> {
    const id = this.currentId++;
    const code = this.generateUniqueCode();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // Files expire after 24 hours

    const file: File = {
      ...insertFile,
      id,
      code,
      expiresAt,
    };

    this.files.set(id, file);
    return file;
  }

  async getFileByCode(code: string): Promise<File | undefined> {
    return Array.from(this.files.values()).find(
      (file) => file.code === code && file.expiresAt > new Date()
    );
  }

  async deleteExpiredFiles(): Promise<void> {
    const now = new Date();
    for (const [id, file] of this.files.entries()) {
      if (file.expiresAt <= now) {
        this.files.delete(id);
      }
    }
  }
}

export const storage = new MemStorage();
