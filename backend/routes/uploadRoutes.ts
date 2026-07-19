import { Router } from "express";
import multer from "multer";
import { uploadFile } from "../controllers/uploadController";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

router.post("/", upload.single("file"), uploadFile);

export default router;
