import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { fileCodeSchema, insertFileSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express) {
  // Clean expired files periodically
  setInterval(() => storage.deleteExpiredFiles(), 1000 * 60 * 15); // Every 15 minutes

  app.post("/api/files", async (req, res) => {
    try {
      const fileData = insertFileSchema.parse(req.body);
      const file = await storage.createFile(fileData);
      res.json(file);
    } catch (err) {
      if (err instanceof Error) {
        res.status(400).json({ message: fromZodError(err).message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.get("/api/files/:code", async (req, res) => {
    try {
      const { code } = fileCodeSchema.parse({ code: req.params.code });
      const file = await storage.getFileByCode(code);
      
      if (!file) {
        return res.status(404).json({ message: "File not found or expired" });
      }

      res.json(file);
    } catch (err) {
      if (err instanceof Error) {
        res.status(400).json({ message: fromZodError(err).message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  return createServer(app);
}
