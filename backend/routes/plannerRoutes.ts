import { Router } from "express";
import { getPlanner, generatePlan, syncTasks } from "../controllers/plannerController";

const router = Router();

router.get("/", getPlanner);
router.post("/", generatePlan);
router.post("/tasks", syncTasks);

export default router;
