export type SessionStatus =
  | "SCHEDULED"
  | "OPEN"
  | "FULL"
  | "CLOSED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export interface Manager {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface Court {
  id: string;
  name: string;
  type: "indoor" | "outdoor";
}

export interface Player {
  id: string;
  name: string;
  email: string;
  level: "beginner" | "intermediate" | "advanced";
  avatarUrl?: string;
}

export interface Registration {
  playerId: string;
  sessionId: string;
  status: "confirmed" | "waitlist" | "cancelled";
  checkedIn: boolean;
  registeredAt: string;
}

export interface SessionScore {
  sessionId: string;
  round: number;
  team1: string[];
  team2: string[];
  score1: number;
  score2: number;
}

export interface Session {
  id: string;
  name: string;
  date: string;
  time: string;
  duration: number;
  courtIds: string[];
  status: SessionStatus;
  maxPlayers: number;
  registrations: Registration[];
  scores: SessionScore[];
  cancelReason?: string;
}

export interface RecommendedAction {
  id: string;
  sessionId: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  type: "fill-rate" | "check-in" | "scores" | "review";
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  sessionId?: string;
  dueDate?: string;
}

export interface Nonstop {
  id: string;
  name: string;
  description: string;
  dayOfWeek: number; // 0 = Sunday
  defaultTime: string;
  defaultDuration: number;
  defaultCourts: string[];
  defaultMaxPlayers: number;
}

export interface LeaderboardEntry {
  playerId: string;
  wins: number;
  losses: number;
  points: number;
  rank: number;
}
