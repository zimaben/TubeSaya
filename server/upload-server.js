// server/upload-server.js
//
// Local file-upload server for TubeSaya. Accepts image uploads (including
// SVG) via multipart/form-data, writes them to public/uploads/, sanitizes
// SVG content server-side, and returns a relative path suitable for
// writing into db.json's macro.src field (consumed via staticFile() in
// remotion/Root.jsx).

import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { JSDOM } from "jsdom";
import DOMPurify from "dompurify";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__dirname, "..", "public", "uploads");

fs.mkdirSync(uploadDir, { recursive: true });

// --- SVG sanitizer setup ---
const window = new JSDOM("").window;
const purify = DOMPurify(window);

// --- Multer storage config ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const original = path.basename(file.originalname);
    const ext = path.extname(original).toLowerCase();
    const base = path.basename(original, ext).replace(/[^a-zA-Z0-9_-]/g, "_") || "upload";

    let name = `${base}${ext}`;
    let counter = 1;
    while (fs.existsSync(path.join(uploadDir, name))) {
      name = `${base}-${counter++}${ext}`;
    }
    cb(null, name);
  },
});

const ALLOWED_EXTENSIONS = /\.(jpeg|jpg|png|webp|gif|svg)$/i;
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB cap
  fileFilter: (req, file, cb) => {
    const extOk = ALLOWED_EXTENSIONS.test(path.extname(file.originalname));
    const mimeOk = ALLOWED_MIME_TYPES.has(file.mimetype);
    if (extOk && mimeOk) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file type"));
    }
  },
});

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.post("/upload", (req, res) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message || "Upload failed" });
    }
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = path.join(uploadDir, req.file.filename);
    const isSvg = path.extname(req.file.filename).toLowerCase() === ".svg";

    if (isSvg) {
      try {
        const raw = fs.readFileSync(filePath, "utf8");
        const clean = purify.sanitize(raw, {
          USE_PROFILES: { svg: true, svgFilters: true },
        });
        fs.writeFileSync(filePath, clean);
      } catch (sanitizeErr) {
        // If sanitization fails, don't leave a possibly-unsafe file on disk.
        fs.unlinkSync(filePath);
        return res.status(500).json({ error: "SVG sanitization failed" });
      }
    }

    res.json({ src: `uploads/${req.file.filename}` });
  });
});

app.delete("/upload/:filename", (req, res) => {
  const filePath = path.join(uploadDir, path.basename(req.params.filename));
  fs.rm(filePath, { force: true }, (err) => {
    if (err) return res.status(500).json({ error: "Delete failed" });
    res.json({ ok: true });
  });
});

// Basic error handler for anything else (e.g. malformed multipart body)
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message || "Server error" });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Upload server running on http://localhost:${PORT}`);
});