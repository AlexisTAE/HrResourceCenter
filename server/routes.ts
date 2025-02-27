import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertWorkerSchema, insertPermitSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // Worker routes
  app.get("/api/workers", async (_req, res) => {
    const workers = await storage.getWorkers();
    res.json(workers);
  });

  app.post("/api/workers", async (req, res) => {
    const parsed = insertWorkerSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json(parsed.error);
    }
    const worker = await storage.createWorker(parsed.data);
    res.status(201).json(worker);
  });

  app.put("/api/workers/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const parsed = insertWorkerSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json(parsed.error);
    }
    try {
      const worker = await storage.updateWorker(id, parsed.data);
      res.json(worker);
    } catch (error) {
      res.status(404).json({ message: "Worker not found" });
    }
  });

  app.delete("/api/workers/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    await storage.deleteWorker(id);
    res.sendStatus(204);
  });

  // Permit routes
  app.get("/api/permits", async (_req, res) => {
    const permits = await storage.getPermits();
    res.json(permits);
  });

  app.post("/api/permits", async (req, res) => {
    const parsed = insertPermitSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json(parsed.error);
    }
    const permit = await storage.createPermit(parsed.data);
    res.status(201).json(permit);
  });

  app.put("/api/permits/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const parsed = insertPermitSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json(parsed.error);
    }
    try {
      const permit = await storage.updatePermit(id, parsed.data);
      res.json(permit);
    } catch (error) {
      res.status(404).json({ message: "Permit not found" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
