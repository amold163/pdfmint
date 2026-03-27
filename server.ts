import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import multer from "multer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Configure multer for temporary file storage
  const upload = multer({ dest: 'uploads/' });

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "PDFmint API is running" });
  });

  // Placeholder for Word to PDF conversion (Complex - usually requires external tools)
  app.post("/api/convert/word-to-pdf", upload.single('file'), (req, res) => {
    // In a real production app, you'd use a library like 'libreoffice-convert' 
    // or an external API. For this demo, we'll return a message.
    res.status(501).json({ error: "Word to PDF conversion requires server-side binaries (like LibreOffice) not available in this environment." });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
