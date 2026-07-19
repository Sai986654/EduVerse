import { Router } from "express";
import { getUser, saveUser } from "../controllers/userController";

const router = Router();

router.get("/", getUser);
router.post("/", saveUser);

export default router;
