import { users, workers, permits, type User, type InsertUser, type Worker, type InsertWorker, type Permit, type InsertPermit } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

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

export class DatabaseStorage implements IStorage {
  public sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Worker methods
  async getWorkers(): Promise<Worker[]> {
    return await db.select().from(workers);
  }

  async getWorker(id: number): Promise<Worker | undefined> {
    const [worker] = await db.select().from(workers).where(eq(workers.id, id));
    return worker;
  }

  async createWorker(worker: InsertWorker): Promise<Worker> {
    const [newWorker] = await db.insert(workers).values(worker).returning();
    return newWorker;
  }

  async updateWorker(id: number, worker: Partial<InsertWorker>): Promise<Worker> {
    const [updated] = await db
      .update(workers)
      .set(worker)
      .where(eq(workers.id, id))
      .returning();

    if (!updated) {
      throw new Error("Worker not found");
    }

    return updated;
  }

  async deleteWorker(id: number): Promise<void> {
    await db.delete(workers).where(eq(workers.id, id));
  }

  // Permit methods
  async getPermits(): Promise<Permit[]> {
    return await db.select().from(permits);
  }

  async getPermit(id: number): Promise<Permit | undefined> {
    const [permit] = await db.select().from(permits).where(eq(permits.id, id));
    return permit;
  }

  async createPermit(permit: InsertPermit): Promise<Permit> {
    const [newPermit] = await db.insert(permits).values(permit).returning();
    return newPermit;
  }

  async updatePermit(id: number, permit: Partial<InsertPermit>): Promise<Permit> {
    const [updated] = await db
      .update(permits)
      .set(permit)
      .where(eq(permits.id, id))
      .returning();

    if (!updated) {
      throw new Error("Permit not found");
    }

    return updated;
  }
}

export const storage = new DatabaseStorage();