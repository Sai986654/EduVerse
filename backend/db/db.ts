import pg from "pg";
import dotenv from "dotenv";
import path from "path";
import { coursesList, initialUser, defaultStudyPlan, initialChatHistory } from "./seedData";

dotenv.config({ path: [path.join(process.cwd(), ".env.local"), path.join(process.cwd(), ".env")] });

const connectionString = process.env.DATABASE_URL;

export const pool = new pg.Pool({
  connectionString,
  ssl: connectionString?.includes("supabase") || process.env.NODE_ENV === "production"
    ? { rejectUnauthorized: false }
    : false,
});

// In-Memory Simulated Database for Developer Fallback
const memoryDB = {
  users: [
    {
      email: initialUser.email,
      full_name: initialUser.fullName,
      role: initialUser.role,
      interests: initialUser.interests,
      streak_days: initialUser.streakDays,
      total_points: initialUser.totalPoints,
      hours_spent: initialUser.hoursSpent,
      courses_completed: initialUser.coursesCompleted,
      skills_mastered: initialUser.skillsMastered,
      avatar_url: ""
    }
  ],
  courses: coursesList.map(c => ({
    id: c.id,
    title: c.title,
    subtitle: c.subtitle,
    description: c.description,
    instructor_name: c.instructorName,
    instructor_title: c.instructorTitle,
    instructor_avatar: c.instructorAvatar,
    progress_percent: c.progressPercent,
    total_duration: c.totalDuration,
    time_remaining: c.timeRemaining,
    image: c.image,
    is_popular: c.isPopular
  })),
  studyPlans: [
    {
      id: 1,
      user_email: initialUser.email,
      today_focus: defaultStudyPlan.todayFocus,
      tasks: defaultStudyPlan.tasks
    }
  ],
  chatMessages: initialChatHistory.map(h => ({
    id: h.id,
    user_email: initialUser.email,
    course_id: "advanced-neural-architectures",
    sender: h.sender,
    text: h.text,
    code_block: h.codeBlock || null,
    timestamp: h.timestamp,
    created_at: new Date()
  }))
};

let useLocalMemory = false;

// Simulated query handler
function simulateQuery(text: string, params: any[] = []): { rows: any[]; rowCount: number } {
  console.log(`[SIMULATED DB] Executing query: ${text}`);
  
  // 1. SELECT * FROM users WHERE email = $1
  if (text.includes("SELECT * FROM users WHERE email = $1")) {
    const email = params[0];
    const match = memoryDB.users.find(u => u.email === email);
    return { rows: match ? [match] : [], rowCount: match ? 1 : 0 };
  }

  // 2. INSERT INTO users (email, full_name, role, interests, streak_days, total_points, hours_spent, courses_completed, skills_mastered)
  if (text.startsWith("INSERT INTO users")) {
    const [email, full_name, role, interests, streak_days, total_points, hours_spent, courses_completed, skills_mastered] = params;
    const existingIdx = memoryDB.users.findIndex(u => u.email === email);
    const newUser = {
      email,
      full_name,
      role,
      interests,
      streak_days: streak_days || 15,
      total_points: total_points || 8450,
      hours_spent: hours_spent || 142,
      courses_completed: courses_completed || 12,
      skills_mastered: skills_mastered || 34,
      avatar_url: params[9] || ""
    };
    if (existingIdx >= 0) {
      memoryDB.users[existingIdx] = newUser;
    } else {
      memoryDB.users.push(newUser);
    }
    return { rows: [newUser], rowCount: 1 };
  }

  // 3. UPDATE users SET full_name = $1, role = $2, interests = $3, avatar_url = $4 WHERE email = $5
  if (text.startsWith("UPDATE users SET")) {
    const [full_name, role, interests, avatar_url, email] = params;
    const user = memoryDB.users.find(u => u.email === email);
    if (user) {
      user.full_name = full_name;
      user.role = role;
      user.interests = interests;
      user.avatar_url = avatar_url;
      return { rows: [user], rowCount: 1 };
    }
    return { rows: [], rowCount: 0 };
  }

  // 4. SELECT * FROM courses
  if (text.includes("SELECT * FROM courses")) {
    return { rows: memoryDB.courses, rowCount: memoryDB.courses.length };
  }

  // 5. UPDATE courses SET progress_percent = $1 WHERE id = $2
  if (text.includes("UPDATE courses SET progress_percent = $1 WHERE id = $2")) {
    const [progress, id] = params;
    const course = memoryDB.courses.find(c => c.id === id);
    if (course) {
      course.progress_percent = progress;
      return { rows: [course], rowCount: 1 };
    }
    return { rows: [], rowCount: 0 };
  }

  // 6. SELECT study_plans WHERE user_email = $1
  if (text.includes("study_plans WHERE user_email = $1")) {
    const email = params[0];
    const plans = memoryDB.studyPlans.filter(p => p.user_email === email);
    const lastPlan = plans[plans.length - 1];
    return { rows: lastPlan ? [lastPlan] : [], rowCount: lastPlan ? 1 : 0 };
  }

  // UPDATE study_plans SET tasks = $1 WHERE id = $2
  if (text.includes("UPDATE study_plans SET tasks = $1 WHERE id = $2")) {
    const [tasks, id] = params;
    const plan = memoryDB.studyPlans.find(p => p.id === id);
    if (plan) {
      plan.tasks = typeof tasks === 'string' ? JSON.parse(tasks) : tasks;
      return { rows: [plan], rowCount: 1 };
    }
    return { rows: [], rowCount: 0 };
  }

  // 7. UPDATE study_plans SET today_focus = $1, tasks = $2 WHERE id = $3
  if (text.startsWith("UPDATE study_plans SET")) {
    const [focus, tasks, id] = params;
    const plan = memoryDB.studyPlans.find(p => p.id === id);
    if (plan) {
      plan.today_focus = focus;
      plan.tasks = typeof tasks === 'string' ? JSON.parse(tasks) : tasks;
      return { rows: [plan], rowCount: 1 };
    }
    return { rows: [], rowCount: 0 };
  }

  // 8. INSERT INTO study_plans (user_email, today_focus, tasks) VALUES ($1, $2, $3)
  if (text.startsWith("INSERT INTO study_plans")) {
    const [email, focus, tasks] = params;
    const newPlan = {
      id: memoryDB.studyPlans.length + 1,
      user_email: email,
      today_focus: focus,
      tasks: typeof tasks === 'string' ? JSON.parse(tasks) : tasks
    };
    memoryDB.studyPlans.push(newPlan);
    return { rows: [newPlan], rowCount: 1 };
  }

  // 9. SELECT * FROM chat_messages WHERE user_email = $1 AND course_id = $2
  if (text.includes("SELECT * FROM chat_messages")) {
    const [email, courseId] = params;
    const matches = memoryDB.chatMessages.filter(m => m.user_email === email && m.course_id === courseId);
    return { rows: matches, rowCount: matches.length };
  }

  // 10. INSERT INTO chat_messages (id, user_email, course_id, sender, text, code_block, timestamp)
  if (text.startsWith("INSERT INTO chat_messages")) {
    const [id, email, courseId, sender, text, code_block, timestamp] = params;
    const newMsg = {
      id,
      user_email: email,
      course_id: courseId,
      sender,
      text,
      code_block: code_block || null,
      timestamp,
      created_at: new Date()
    };
    memoryDB.chatMessages.push(newMsg);
    return { rows: [newMsg], rowCount: 1 };
  }

  return { rows: [], rowCount: 0 };
}

export async function query(text: string, params?: any[]) {
  const start = Date.now();
  if (useLocalMemory || !connectionString || connectionString.includes("localhost") || connectionString.includes("127.0.0.1")) {
    // Force simulation if localhost (to prevent ECONNREFUSED delays)
    useLocalMemory = true;
    return simulateQuery(text, params);
  }

  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log("Executed query", { text, duration, rows: res.rowCount });
    return res;
  } catch (error: any) {
    console.warn("Database connection failed. Falling back to in-memory simulated database.", error.message);
    useLocalMemory = true;
    return simulateQuery(text, params);
  }
}
