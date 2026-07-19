import { Request, Response } from "express";
import { query } from "../db/db";
import { ai } from "../lib/gemini";

export async function getChatHistory(req: Request, res: Response) {
  try {
    const { email } = req.query;
    const { courseId } = req.params;
    if (!email) {
      return res.status(400).json({ error: "Email parameter is required" });
    }
    const result = await query(
      `SELECT * FROM chat_messages WHERE user_email = $1 AND course_id = $2 ORDER BY created_at ASC`,
      [email, courseId]
    );
    const messages = result.rows.map((row: any) => ({
      id: row.id,
      sender: row.sender,
      text: row.text,
      timestamp: row.timestamp,
      codeBlock: row.code_block || undefined
    }));
    res.json(messages);
  } catch (error: any) {
    console.error("Get chat history controller error:", error);
    res.status(500).json({ error: error?.message || "Failed to fetch chat history" });
  }
}

export async function postChatMessage(req: Request, res: Response) {
  try {
    const { email, message, context } = req.body;
    const { courseId } = req.params;

    if (!email || !message) {
      return res.status(400).json({ error: "Email and message are required" });
    }

    // Save user message
    const userMsgId = `msg-user-${Date.now()}`;
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    await query(
      `INSERT INTO chat_messages (id, user_email, course_id, sender, text, timestamp) VALUES ($1, $2, $3, $4, $5, $6)`,
      [userMsgId, email, courseId, 'user', message, timestamp]
    );

    // Call Gemini AI Tutor
    let prompt = message;
    if (context) {
      prompt = `Context from video (current timestamp/focus: ${context}):\nUser Question: ${message}`;
    }

    const chat = ai.chats.create({
      model: "gemini-3.5-flash",
      config: {
        systemInstruction: "You are the EduVerse AI Tutor co-pilot, an expert in neural networks, computer science, design, and product development. Keep your answers clear, elegant, highly educational, and use code blocks when appropriate. Respond with clean, markdown-friendly text."
      }
    });

    const response = await chat.sendMessage({ message: prompt });
    const aiTextRaw = response.text || "I apologize, I didn't catch that.";
    
    // Parse code block if any
    let aiText = aiTextRaw;
    let codeBlock: string | null = null;
    const codeRegex = /```(?:[a-zA-Z0-9]+)?\n([\s\S]*?)```/m;
    const match = aiText.match(codeRegex);
    if (match) {
      codeBlock = match[1];
      aiText = aiText.replace(codeRegex, "").trim();
    }

    const aiMsgId = `msg-ai-${Date.now()}`;
    await query(
      `INSERT INTO chat_messages (id, user_email, course_id, sender, text, code_block, timestamp) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [aiMsgId, email, courseId, 'ai', aiText, codeBlock, timestamp]
    );

    res.json({
      id: aiMsgId,
      sender: "ai",
      text: aiText,
      timestamp,
      codeBlock: codeBlock || undefined
    });
  } catch (error: any) {
    console.error("AI Chat controller error:", error);
    res.status(500).json({ error: error?.message || "Failed to generate AI response" });
  }
}
