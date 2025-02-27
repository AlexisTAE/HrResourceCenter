import { Worker, InsertWorker, Permit, InsertPermit, User, InsertUser } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Worker operations
  getWorkers(): Promise<Worker[]>;
  getWorker(id: number): Promise<Worker | undefined>;
  createWorker(worker: InsertWorker): Promise<Worker>;
  updateWorker(id: number, worker: Partial<InsertWorker>): Promise<Worker>;
  deleteWorker(id: number): Promise<void>;
  
  // Permit operations
  getPermits(): Promise<Permit[]>;
  getPermit(id: number): Promise<Permit | undefined>;
  createPermit(permit: InsertPermit): Promise<Permit>;
  updatePermit(id: number, permit: Partial<InsertPermit>): Promise<Permit>;
  
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private workers: Map<number, Worker>;
  private permits: Map<number, Permit>;
  private currentId: { [key: string]: number };
  public sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.workers = new Map();
    this.permits = new Map();
    this.currentId = { users: 1, workers: 1, permits: 1 };
    this.sessionStore = new MemoryStore({ checkPeriod: 86400000 });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId.users++;
    const user: User = { ...insertUser, id, role: "employee" };
    this.users.set(id, user);
    return user;
  }

  // Worker methods
  async getWorkers(): Promise<Worker[]> {
    return Array.from(this.workers.values());
  }

  async getWorker(id: number): Promise<Worker | undefined> {
    return this.workers.get(id);
  }

  async createWorker(worker: InsertWorker): Promise<Worker> {
    const id = this.currentId.workers++;
    const newWorker: Worker = { ...worker, id };
    this.workers.set(id, newWorker);
    return newWorker;
  }

  async updateWorker(id: number, worker: Partial<InsertWorker>): Promise<Worker> {
    const existing = await this.getWorker(id);
    if (!existing) throw new Error("Worker not found");
    
    const updated: Worker = { ...existing, ...worker };
    this.workers.set(id, updated);
    return updated;
  }

  async deleteWorker(id: number): Promise<void> {
    this.workers.delete(id);
  }

  // Permit methods
  async getPermits(): Promise<Permit[]> {
    return Array.from(this.permits.values());
  }

  async getPermit(id: number): Promise<Permit | undefined> {
    return this.permits.get(id);
  }

  async createPermit(permit: InsertPermit): Promise<Permit> {
    const id = this.currentId.permits++;
    const newPermit: Permit = {
      ...permit,
      id,
      createdAt: new Date(),
      status: "pending"
    };
    this.permits.set(id, newPermit);
    return newPermit;
  }

  async updatePermit(id: number, permit: Partial<InsertPermit>): Promise<Permit> {
    const existing = await this.getPermit(id);
    if (!existing) throw new Error("Permit not found");
    
    const updated: Permit = { ...existing, ...permit };
    this.permits.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();
