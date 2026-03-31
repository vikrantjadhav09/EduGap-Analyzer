import express from "express";
import multer from "multer";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  const upload = multer({ storage: multer.memoryStorage() });

  // PDF Parsing endpoint
  app.post("/api/parse-pdf", upload.single("resume"), async (req, res) => {
    try {
      if (!req.file) {
        console.error("No file uploaded in request");
        return res.status(400).json({ error: "No file uploaded" });
      }

      console.log(`Parsing PDF: ${req.file.originalname}, size: ${req.file.size} bytes`);
      
      const data = await pdf(req.file.buffer);
      
      if (!data || !data.text) {
        console.warn("PDF parsed but no text content found");
        return res.json({ text: "" });
      }

      console.log("PDF parsed successfully, text length:", data.text.length);
      res.json({ text: data.text });
    } catch (error) {
      console.error("Error parsing PDF:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      res.status(500).json({ error: "Failed to parse PDF", details: errorMessage });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
