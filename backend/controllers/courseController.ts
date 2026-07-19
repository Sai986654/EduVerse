import { Request, Response } from "express";
import { query } from "../db/db";

// Helper: map DB course row to frontend keys
function mapCourseDbToFrontend(dbCourse: any) {
  return {
    id: dbCourse.id,
    title: dbCourse.title,
    subtitle: dbCourse.subtitle,
    description: dbCourse.description,
    instructorName: dbCourse.instructor_name,
    instructorTitle: dbCourse.instructor_title,
    instructorAvatar: dbCourse.instructor_avatar,
    progressPercent: dbCourse.progress_percent,
    totalDuration: dbCourse.total_duration,
    timeRemaining: dbCourse.time_remaining,
    image: dbCourse.image,
    isPopular: dbCourse.is_popular
  };
}

export async function getCourses(req: Request, res: Response) {
  try {
    const result = await query(`SELECT * FROM courses`);
    const courses = result.rows.map(mapCourseDbToFrontend);
    res.json(courses);
  } catch (error: any) {
    console.error("Get courses controller error:", error);
    res.status(500).json({ error: error?.message || "Failed to fetch courses" });
  }
}

export async function updateProgress(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { progressPercent } = req.body;
    await query(`UPDATE courses SET progress_percent = $1 WHERE id = $2`, [progressPercent, id]);
    res.json({ success: true });
  } catch (error: any) {
    console.error("Update progress controller error:", error);
    res.status(500).json({ error: error?.message || "Failed to update course progress" });
  }
}
