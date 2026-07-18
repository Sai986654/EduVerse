export enum Screen {
  Landing = "LANDING",
  Onboarding = "ONBOARDING",
  Dashboard = "DASHBOARD",
  LearningPlayer = "LEARNING_PLAYER"
}

export enum Role {
  Student = "STUDENT",
  Instructor = "INSTRUCTOR"
}

export interface User {
  fullName: string;
  email: string;
  role: Role;
  interests: string[];
  streakDays: number;
  totalPoints: number;
  hoursSpent: number;
  coursesCompleted: number;
  skillsMastered: number;
}

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  instructorName: string;
  instructorTitle: string;
  instructorAvatar: string;
  progressPercent: number;
  totalDuration: string;
  timeRemaining: string;
  image: string;
  isPopular?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  codeBlock?: string;
}

export interface StudyPlan {
  todayFocus: string;
  tasks: {
    title: string;
    done: boolean;
  }[];
}
