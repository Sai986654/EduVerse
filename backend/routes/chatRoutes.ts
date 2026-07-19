import { Router } from "express";
import { getChatHistory, postChatMessage } from "../controllers/chatController";

const router = Router();

router.get("/:courseId", getChatHistory);
router.post("/:courseId", postChatMessage);

export default router;
