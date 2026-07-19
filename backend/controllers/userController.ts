import { Request, Response } from "express";
import { query } from "../db/db";

// Helper: map DB user row to frontend keys
function mapUserDbToFrontend(dbUser: any) {
  return {
    fullName: dbUser.full_name,
    email: dbUser.email,
    role: dbUser.role,
    interests: dbUser.interests,
    streakDays: dbUser.streak_days,
    totalPoints: dbUser.total_points,
    hoursSpent: dbUser.hours_spent,
    coursesCompleted: dbUser.courses_completed,
    skillsMastered: dbUser.skills_mastered,
    avatarUrl: dbUser.avatar_url || ""
  };
}

export async function getUser(req: Request, res: Response) {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ error: "Email parameter is required" });
    }
    
    const result = await query(`SELECT * FROM users WHERE email = $1`, [email]);
    if (result.rows.length === 0) {
      // Fallback: seed and return default Alex Rivera profile
      const defaultUser = {
        fullName: "Alex Rivera",
        email: email as string,
        role: "STUDENT",
        interests: ["Software Engineering", "AI & Machine Learning", "UI/UX Design"],
        streakDays: 15,
        totalPoints: 8450,
        hoursSpent: 142,
        coursesCompleted: 12,
        skillsMastered: 34,
        avatarUrl: ""
      };
      await query(
        `INSERT INTO users (email, full_name, role, interests, streak_days, total_points, hours_spent, courses_completed, skills_mastered)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          defaultUser.email,
          defaultUser.fullName,
          defaultUser.role,
          defaultUser.interests,
          defaultUser.streakDays,
          defaultUser.totalPoints,
          defaultUser.hoursSpent,
          defaultUser.coursesCompleted,
          defaultUser.skillsMastered
        ]
      );
      return res.json(defaultUser);
    }
    
    res.json(mapUserDbToFrontend(result.rows[0]));
  } catch (error: any) {
    console.error("Get user controller error:", error);
    res.status(500).json({ error: error?.message || "Failed to fetch user profile" });
  }
}

export async function saveUser(req: Request, res: Response) {
  try {
    const { email, fullName, role, interests, avatarUrl } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const checkUser = await query(`SELECT email FROM users WHERE email = $1`, [email]);
    if (checkUser.rows.length > 0) {
      await query(
        `UPDATE users SET full_name = $1, role = $2, interests = $3, avatar_url = $4 WHERE email = $5`,
        [fullName, role, interests, avatarUrl || null, email]
      );
    } else {
      await query(
        `INSERT INTO users (email, full_name, role, interests, streak_days, total_points, hours_spent, courses_completed, skills_mastered, avatar_url)
         VALUES ($1, $2, $3, $4, 15, 8450, 142, 12, 34, $5)`,
        [email, fullName, role, interests, avatarUrl || null]
      );
    }

    const result = await query(`SELECT * FROM users WHERE email = $1`, [email]);
    res.json(mapUserDbToFrontend(result.rows[0]));
  } catch (error: any) {
    console.error("Save user controller error:", error);
    res.status(500).json({ error: error?.message || "Failed to save user profile" });
  }
}
