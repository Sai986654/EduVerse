import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini API
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// API endpoint for AI Tutor
app.post("/api/tutor", async (req, res) => {
  try {
    const { message, context, history } = req.body;
    
    // Build context parameters
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

    // Send history if we want to simulate dialogue
    if (history && history.length > 0) {
      for (const h of history) {
        // Simple chat simulation context can be appended or loaded
      }
    }
    
    const response = await chat.sendMessage({ message: prompt });
    res.json({ text: response.text });
  } catch (error: any) {
    console.error("AI Tutor Error:", error);
    res.status(500).json({ error: error?.message || "Failed to generate AI response" });
  }
});

// API endpoint for AI Search (curriculum finding, topics, notes)
app.post("/api/search", async (req, res) => {
  try {
    const { query } = req.body;
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `The user is searching for educational courses, topics, or notes in EduVerse. Search Query: "${query}". Suggest 2 matches in JSON format matching the query. Output must be valid JSON matching this schema: [{"title": "Course Name", "description": "Short description of what the course covers", "matchPercent": 95, "module": "Module/Lesson ID"}]. Keep recommendations matching advanced computer science, neural networks, or UI/UX design.`,
      config: {
        responseMimeType: "application/json"
      }
    });
    res.json(JSON.parse(response.text || "[]"));
  } catch (error: any) {
    console.error("AI Search Error:", error);
    res.status(500).json({ error: error?.message || "Failed to search" });
  }
});

// API endpoint to generate a personalized Study Plan
app.post("/api/planner", async (req, res) => {
  try {
    const { focus, interests } = req.body;
    const interestStr = interests && interests.length > 0 ? interests.join(", ") : "AI, UI/UX, Technology";
    const prompt = `Generate a personalized daily study focus and 3 action items for a student focusing on "${focus || 'Advanced Design'}". Interests: "${interestStr}". Output must be valid JSON matching this schema: { "todayFocus": "Focus area name", "tasks": [{ "title": "Task 1", "done": false }, { "title": "Task 2", "done": false }, { "title": "Task 3", "done": false }] }`;
    
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });
    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.error("AI Planner Error:", error);
    res.status(500).json({ error: error?.message || "Failed to generate plan" });
  }
});

// Serve Vite in dev, static files in prod
async function startServer() {
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
