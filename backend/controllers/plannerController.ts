import { Request, Response } from "express";
import { query } from "../db/db";
import { ai } from "../lib/gemini";

export async function getPlanner(req: Request, res: Response) {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    const result = await query(
      `SELECT * FROM study_plans WHERE user_email = $1 ORDER BY id DESC LIMIT 1`,
      [email]
    );
    if (result.rows.length === 0) {
      return res.json({ todayFocus: "Select a topic to generate study plan", tasks: [] });
    }
    const row = result.rows[0];
    res.json({
      todayFocus: row.today_focus,
      tasks: row.tasks
    });
  } catch (error: any) {
    console.error("Get study plan controller error:", error);
    res.status(500).json({ error: error?.message || "Failed to fetch study plan" });
  }
}

export async function generatePlan(req: Request, res: Response) {
  try {
    const { email, focus, interests } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    const interestStr = interests && interests.length > 0 ? interests.join(", ") : "AI, UI/UX, Technology";
    const prompt = `Generate a personalized daily study focus and 3 action items for a student focusing on "${focus || 'Advanced Design'}". Interests: "${interestStr}". Output must be valid JSON matching this schema: { "todayFocus": "Focus area name", "tasks": [{ "title": "Task 1", "done": false }, { "title": "Task 2", "done": false }, { "title": "Task 3", "done": false }] }`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const parsedPlan = JSON.parse(response.text || "{}");
    
    // Save/upsert study plan
    const checkExist = await query(`SELECT id FROM study_plans WHERE user_email = $1 ORDER BY id DESC LIMIT 1`, [email]);
    if (checkExist.rows.length > 0) {
      await query(
        `UPDATE study_plans SET today_focus = $1, tasks = $2 WHERE id = $3`,
        [parsedPlan.todayFocus, JSON.stringify(parsedPlan.tasks), checkExist.rows[0].id]
      );
    } else {
      await query(
        `INSERT INTO study_plans (user_email, today_focus, tasks) VALUES ($1, $2, $3)`,
        [email, parsedPlan.todayFocus, JSON.stringify(parsedPlan.tasks)]
      );
    }

    res.json(parsedPlan);
  } catch (error: any) {
    console.error("AI Planner controller error:", error);
    res.status(500).json({ error: error?.message || "Failed to generate plan" });
  }
}

export async function syncTasks(req: Request, res: Response) {
  try {
    const { email, tasks } = req.body;
    if (!email || !tasks) {
      return res.status(400).json({ error: "Email and tasks are required" });
    }
    const checkExist = await query(`SELECT id FROM study_plans WHERE user_email = $1 ORDER BY id DESC LIMIT 1`, [email]);
    if (checkExist.rows.length > 0) {
      await query(
        `UPDATE study_plans SET tasks = $1 WHERE id = $2`,
        [JSON.stringify(tasks), checkExist.rows[0].id]
      );
      res.json({ success: true });
    } else {
      res.status(404).json({ error: "Study plan not found to update tasks" });
    }
  } catch (error: any) {
    console.error("Update tasks controller error:", error);
    res.status(500).json({ error: error?.message || "Failed to update study plan tasks" });
  }
}

export async function searchCourses(req: Request, res: Response) {
  try {
    const { query: searchQuery } = req.body;
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `The user is searching for educational courses, topics, or notes in EduVerse. Search Query: "${searchQuery}". Suggest 2 matches in JSON format matching the query. Output must be valid JSON matching this schema: [{"title": "Course Name", "description": "Short description of what the course covers", "matchPercent": 95, "module": "Module/Lesson ID"}]. Keep recommendations matching advanced computer science, neural networks, or UI/UX design.`,
      config: {
        responseMimeType: "application/json"
      }
    });
    res.json(JSON.parse(response.text || "[]"));
  } catch (error: any) {
    console.error("AI Search controller error:", error);
    res.status(500).json({ error: error?.message || "Failed to search" });
  }
}
