import express from "express";
import multer from "multer";
import protect from "../middleware/auth.js";
import {
  uploadDocument,
  getMyDocuments,
  getDocumentDetails,
  deleteDocument,
  chatWithDocument,
  generateStudyMaterial,
} from "../controllers/documentRagController.js";

const router = express.Router();

// Configure Multer in-memory storage with 25MB limit
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB limit
  },
  fileFilter: (req, file, cb) => {
    const ext = file.originalname.split(".").pop().toLowerCase();
    const allowed = ["pdf", "docx", "pptx", "ppt", "txt"];
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file type. Please upload PDF, DOCX, PPT, PPTX, or TXT."));
    }
  },
});

router.post("/upload", protect, upload.single("file"), uploadDocument);
router.get("/", protect, getMyDocuments);
router.get("/:id", protect, getDocumentDetails);
router.delete("/:id", protect, deleteDocument);
router.post("/:id/chat", protect, chatWithDocument);
router.post("/:id/generate", protect, generateStudyMaterial);

export default router;
