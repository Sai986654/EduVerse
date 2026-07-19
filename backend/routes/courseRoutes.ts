import { Router } from "express";
import { getCourses, updateProgress } from "../controllers/courseController";

const router = Router();

router.get("/", getCourses);
router.post("/:id/progress", updateProgress);

export default router;
