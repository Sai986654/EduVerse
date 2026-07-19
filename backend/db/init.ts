import { pool } from "./db";
import { coursesList, initialUser, defaultStudyPlan, initialChatHistory } from "./seedData";

async function main() {
  console.log("Initializing database tables...");
  
  // Drop tables in order of foreign key dependencies
  await pool.query(`DROP TABLE IF EXISTS chat_messages CASCADE;`);
  await pool.query(`DROP TABLE IF EXISTS study_plans CASCADE;`);
  await pool.query(`DROP TABLE IF EXISTS courses CASCADE;`);
  await pool.query(`DROP TABLE IF EXISTS users CASCADE;`);

  // Create users table
  await pool.query(`
    CREATE TABLE users (
      email TEXT PRIMARY KEY,
      full_name TEXT NOT NULL,
      role TEXT NOT NULL,
      interests TEXT[] NOT NULL,
      streak_days INTEGER DEFAULT 0,
      total_points INTEGER DEFAULT 0,
      hours_spent INTEGER DEFAULT 0,
      courses_completed INTEGER DEFAULT 0,
      skills_mastered INTEGER DEFAULT 0,
      avatar_url TEXT
    );
  `);
  console.log("Created users table");

  // Create courses table
  await pool.query(`
    CREATE TABLE courses (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      subtitle TEXT NOT NULL,
      description TEXT NOT NULL,
      instructor_name TEXT NOT NULL,
      instructor_title TEXT NOT NULL,
      instructor_avatar TEXT NOT NULL,
      progress_percent INTEGER DEFAULT 0,
      total_duration TEXT NOT NULL,
      time_remaining TEXT NOT NULL,
      image TEXT NOT NULL,
      is_popular BOOLEAN DEFAULT false
    );
  `);
  console.log("Created courses table");

  // Create study_plans table
  await pool.query(`
    CREATE TABLE study_plans (
      id SERIAL PRIMARY KEY,
      user_email TEXT REFERENCES users(email) ON DELETE CASCADE,
      today_focus TEXT NOT NULL,
      tasks JSONB NOT NULL
    );
  `);
  console.log("Created study_plans table");

  // Create chat_messages table
  await pool.query(`
    CREATE TABLE chat_messages (
      id TEXT PRIMARY KEY,
      user_email TEXT REFERENCES users(email) ON DELETE CASCADE,
      course_id TEXT REFERENCES courses(id) ON DELETE CASCADE,
      sender TEXT NOT NULL,
      text TEXT NOT NULL,
      code_block TEXT,
      timestamp TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
  console.log("Created chat_messages table");

  // Seed default data
  console.log("Seeding database...");

  // Seed user
  await pool.query(`
    INSERT INTO users (email, full_name, role, interests, streak_days, total_points, hours_spent, courses_completed, skills_mastered)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);
  `, [
    initialUser.email,
    initialUser.fullName,
    initialUser.role,
    initialUser.interests,
    initialUser.streakDays,
    initialUser.totalPoints,
    initialUser.hoursSpent,
    initialUser.coursesCompleted,
    initialUser.skillsMastered
  ]);

  // Seed courses
  for (const course of coursesList) {
    await pool.query(`
      INSERT INTO courses (id, title, subtitle, description, instructor_name, instructor_title, instructor_avatar, progress_percent, total_duration, time_remaining, image, is_popular)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12);
    `, [
      course.id,
      course.title,
      course.subtitle,
      course.description,
      course.instructorName,
      course.instructorTitle,
      course.instructorAvatar,
      course.progressPercent,
      course.totalDuration,
      course.timeRemaining,
      course.image,
      !!course.isPopular
    ]);
  }

  // Seed study plan
  await pool.query(`
    INSERT INTO study_plans (user_email, today_focus, tasks)
    VALUES ($1, $2, $3);
  `, [
    initialUser.email,
    defaultStudyPlan.todayFocus,
    JSON.stringify(defaultStudyPlan.tasks)
  ]);

  // Seed chat messages (for the default selected course: advanced-neural-architectures)
  for (const chat of initialChatHistory) {
    await pool.query(`
      INSERT INTO chat_messages (id, user_email, course_id, sender, text, code_block, timestamp)
      VALUES ($1, $2, $3, $4, $5, $6, $7);
    `, [
      chat.id,
      initialUser.email,
      "advanced-neural-architectures", // default selected course ID
      chat.sender,
      chat.text,
      chat.codeBlock || null,
      chat.timestamp
    ]);
  }

  console.log("Database initialized and seeded successfully!");
}

main()
  .catch((err) => {
    console.error("Failed to initialize database:", err);
    process.exit(1);
  })
  .finally(() => {
    pool.end();
  });
