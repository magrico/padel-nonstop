import type {
  Manager,
  Court,
  Player,
  Session,
  Nonstop,
  RecommendedAction,
  Task,
  LeaderboardEntry,
} from "./types";

export const manager: Manager = {
  id: "mgr-1",
  name: "Carlos Martinez",
  email: "carlos@padelnonstop.com",
};

export const courts: Court[] = [
  { id: "court-1", name: "Court 1", type: "indoor" },
  { id: "court-2", name: "Court 2", type: "indoor" },
  { id: "court-3", name: "Court 3", type: "outdoor" },
  { id: "court-4", name: "Court 4", type: "outdoor" },
];

export const players: Player[] = [
  { id: "p-1", name: "Ana Garcia", email: "ana@email.com", level: "advanced" },
  { id: "p-2", name: "Luis Fernandez", email: "luis@email.com", level: "intermediate" },
  { id: "p-3", name: "Maria Lopez", email: "maria@email.com", level: "advanced" },
  { id: "p-4", name: "Pedro Sanchez", email: "pedro@email.com", level: "beginner" },
  { id: "p-5", name: "Sofia Torres", email: "sofia@email.com", level: "intermediate" },
  { id: "p-6", name: "Diego Ruiz", email: "diego@email.com", level: "advanced" },
  { id: "p-7", name: "Laura Moreno", email: "laura@email.com", level: "intermediate" },
  { id: "p-8", name: "Javier Diaz", email: "javier@email.com", level: "beginner" },
  { id: "p-9", name: "Elena Navarro", email: "elena@email.com", level: "advanced" },
  { id: "p-10", name: "Roberto Gil", email: "roberto@email.com", level: "intermediate" },
  { id: "p-11", name: "Carmen Vega", email: "carmen@email.com", level: "beginner" },
  { id: "p-12", name: "Miguel Reyes", email: "miguel@email.com", level: "advanced" },
];

// The single nonstop definition
export const nonstop: Nonstop = {
  id: "ns-1",
  name: "Beer, Padel & Friends",
  description: "Every Sunday we play padel, drink beer, and have a great time. All levels welcome!",
  dayOfWeek: 0, // Sunday
  defaultTime: "11:00",
  defaultDuration: 120,
  defaultCourts: ["court-1", "court-2"],
  defaultMaxPlayers: 8,
};

// Helper: compute Sunday dates relative to today
const today = new Date();
const formatDate = (d: Date) => d.toISOString().split("T")[0];

function getSunday(weeksOffset: number): Date {
  const d = new Date(today);
  const dayOfWeek = d.getDay(); // 0=Sun
  const daysUntilSunday = (7 - dayOfWeek) % 7;
  d.setDate(d.getDate() + daysUntilSunday + weeksOffset * 7);
  // If today is Sunday and offset is 0, use today
  if (weeksOffset === 0 && dayOfWeek === 0) {
    return new Date(today);
  }
  return d;
}

const nextSunday = getSunday(0);
const lastSunday = new Date(today);
lastSunday.setDate(today.getDate() - ((today.getDay() + 7) % 7 || 7));
const twoSundaysAgo = new Date(lastSunday);
twoSundaysAgo.setDate(lastSunday.getDate() - 7);
const threeSundaysAgo = new Date(twoSundaysAgo);
threeSundaysAgo.setDate(twoSundaysAgo.getDate() - 7);

const NONSTOP_NAME = "Beer, Padel & Friends";

// Editions of the nonstop (sessions that all share the same name)
export const sessions: Session[] = [
  // Next Sunday — OPEN (upcoming)
  {
    id: "ed-1",
    name: NONSTOP_NAME,
    date: formatDate(nextSunday),
    time: "11:00",
    duration: 120,
    courtIds: ["court-1", "court-2"],
    status: "OPEN",
    maxPlayers: 8,
    registrations: [
      { playerId: "p-1", sessionId: "ed-1", status: "confirmed", checkedIn: false, registeredAt: "2026-03-02T10:00:00" },
      { playerId: "p-3", sessionId: "ed-1", status: "confirmed", checkedIn: false, registeredAt: "2026-03-02T12:00:00" },
      { playerId: "p-5", sessionId: "ed-1", status: "confirmed", checkedIn: false, registeredAt: "2026-03-03T08:00:00" },
      { playerId: "p-6", sessionId: "ed-1", status: "confirmed", checkedIn: false, registeredAt: "2026-03-03T09:00:00" },
      { playerId: "p-9", sessionId: "ed-1", status: "confirmed", checkedIn: false, registeredAt: "2026-03-03T14:00:00" },
      { playerId: "p-2", sessionId: "ed-1", status: "cancelled", checkedIn: false, registeredAt: "2026-03-02T11:00:00" },
      { playerId: "p-8", sessionId: "ed-1", status: "cancelled", checkedIn: false, registeredAt: "2026-03-03T10:00:00" },
    ],
    scores: [],
  },
  // Last Sunday — COMPLETED with scores
  {
    id: "ed-2",
    name: NONSTOP_NAME,
    date: formatDate(lastSunday),
    time: "11:00",
    duration: 120,
    courtIds: ["court-1", "court-2"],
    status: "COMPLETED",
    maxPlayers: 8,
    registrations: [
      { playerId: "p-1", sessionId: "ed-2", status: "confirmed", checkedIn: true, registeredAt: "2026-02-23T10:00:00" },
      { playerId: "p-2", sessionId: "ed-2", status: "confirmed", checkedIn: true, registeredAt: "2026-02-23T11:00:00" },
      { playerId: "p-3", sessionId: "ed-2", status: "confirmed", checkedIn: true, registeredAt: "2026-02-23T12:00:00" },
      { playerId: "p-6", sessionId: "ed-2", status: "confirmed", checkedIn: true, registeredAt: "2026-02-23T13:00:00" },
      { playerId: "p-7", sessionId: "ed-2", status: "confirmed", checkedIn: true, registeredAt: "2026-02-24T08:00:00" },
      { playerId: "p-9", sessionId: "ed-2", status: "confirmed", checkedIn: true, registeredAt: "2026-02-24T09:00:00" },
      { playerId: "p-10", sessionId: "ed-2", status: "confirmed", checkedIn: true, registeredAt: "2026-02-24T10:00:00" },
      { playerId: "p-12", sessionId: "ed-2", status: "confirmed", checkedIn: true, registeredAt: "2026-02-24T11:00:00" },
    ],
    scores: [
      { sessionId: "ed-2", round: 1, team1: ["p-1", "p-3"], team2: ["p-6", "p-7"], score1: 6, score2: 4 },
      { sessionId: "ed-2", round: 1, team1: ["p-2", "p-9"], team2: ["p-10", "p-12"], score1: 6, score2: 3 },
      { sessionId: "ed-2", round: 2, team1: ["p-1", "p-10"], team2: ["p-2", "p-6"], score1: 6, score2: 5 },
      { sessionId: "ed-2", round: 2, team1: ["p-3", "p-12"], team2: ["p-7", "p-9"], score1: 6, score2: 2 },
    ],
  },
  // 2 Sundays ago — COMPLETED
  {
    id: "ed-3",
    name: NONSTOP_NAME,
    date: formatDate(twoSundaysAgo),
    time: "11:00",
    duration: 120,
    courtIds: ["court-1", "court-2"],
    status: "COMPLETED",
    maxPlayers: 8,
    registrations: [
      { playerId: "p-1", sessionId: "ed-3", status: "confirmed", checkedIn: true, registeredAt: "2026-02-16T10:00:00" },
      { playerId: "p-3", sessionId: "ed-3", status: "confirmed", checkedIn: true, registeredAt: "2026-02-16T11:00:00" },
      { playerId: "p-5", sessionId: "ed-3", status: "confirmed", checkedIn: true, registeredAt: "2026-02-16T12:00:00" },
      { playerId: "p-6", sessionId: "ed-3", status: "confirmed", checkedIn: true, registeredAt: "2026-02-16T13:00:00" },
      { playerId: "p-9", sessionId: "ed-3", status: "confirmed", checkedIn: true, registeredAt: "2026-02-17T08:00:00" },
      { playerId: "p-10", sessionId: "ed-3", status: "confirmed", checkedIn: true, registeredAt: "2026-02-17T09:00:00" },
      { playerId: "p-11", sessionId: "ed-3", status: "confirmed", checkedIn: true, registeredAt: "2026-02-17T10:00:00" },
      { playerId: "p-12", sessionId: "ed-3", status: "confirmed", checkedIn: true, registeredAt: "2026-02-17T11:00:00" },
    ],
    scores: [
      { sessionId: "ed-3", round: 1, team1: ["p-1", "p-5"], team2: ["p-3", "p-6"], score1: 4, score2: 6 },
      { sessionId: "ed-3", round: 1, team1: ["p-9", "p-11"], team2: ["p-10", "p-12"], score1: 6, score2: 3 },
      { sessionId: "ed-3", round: 2, team1: ["p-1", "p-12"], team2: ["p-5", "p-9"], score1: 6, score2: 4 },
      { sessionId: "ed-3", round: 2, team1: ["p-3", "p-10"], team2: ["p-6", "p-11"], score1: 5, score2: 6 },
    ],
  },
  // 3 Sundays ago — CANCELLED
  {
    id: "ed-4",
    name: NONSTOP_NAME,
    date: formatDate(threeSundaysAgo),
    time: "11:00",
    duration: 120,
    courtIds: ["court-1", "court-2"],
    status: "CANCELLED",
    maxPlayers: 8,
    cancelReason: "Rain forecast — outdoor courts unavailable, indoor courts booked",
    registrations: [
      { playerId: "p-1", sessionId: "ed-4", status: "cancelled", checkedIn: false, registeredAt: "2026-02-09T10:00:00" },
      { playerId: "p-3", sessionId: "ed-4", status: "cancelled", checkedIn: false, registeredAt: "2026-02-09T11:00:00" },
      { playerId: "p-6", sessionId: "ed-4", status: "cancelled", checkedIn: false, registeredAt: "2026-02-09T12:00:00" },
    ],
    scores: [],
  },
];

// Recommended actions scoped to the next edition
export const recommendedActions: RecommendedAction[] = [
  {
    id: "ra-1",
    sessionId: "ed-1",
    title: "3 spots left — promote this Sunday",
    description: "Beer, Padel & Friends has 5/8 players. Send a reminder to regulars who haven't signed up.",
    priority: "high",
    type: "fill-rate",
    createdAt: "2026-03-04T10:00:00",
  },
  {
    id: "ra-2",
    sessionId: "ed-2",
    title: "Review last Sunday's scores",
    description: "Last edition completed — verify final scores and update leaderboard.",
    priority: "medium",
    type: "scores",
    createdAt: "2026-03-03T09:00:00",
  },
  {
    id: "ra-3",
    sessionId: "ed-1",
    title: "Confirm court availability",
    description: "Check that Court 1 and Court 2 are reserved for this Sunday at 11:00.",
    priority: "medium",
    type: "review",
    createdAt: "2026-03-04T08:00:00",
  },
];

// Tasks scoped to the current/next edition
export const tasks: Task[] = [
  { id: "t-1", title: "Send reminder to regulars for Sunday", completed: false, sessionId: "ed-1", dueDate: formatDate(nextSunday) },
  { id: "t-2", title: "Confirm court reservation", completed: false, sessionId: "ed-1", dueDate: formatDate(nextSunday) },
  { id: "t-3", title: "Buy beers for Sunday", completed: false, sessionId: "ed-1", dueDate: formatDate(nextSunday) },
  { id: "t-4", title: "Update leaderboard with last week's results", completed: true, sessionId: "ed-2" },
  { id: "t-5", title: "Post last Sunday's recap to group chat", completed: false, sessionId: "ed-2" },
];

export const leaderboard: LeaderboardEntry[] = [
  { playerId: "p-1", wins: 12, losses: 3, points: 156, rank: 1 },
  { playerId: "p-3", wins: 10, losses: 4, points: 138, rank: 2 },
  { playerId: "p-6", wins: 9, losses: 5, points: 127, rank: 3 },
  { playerId: "p-9", wins: 8, losses: 5, points: 118, rank: 4 },
  { playerId: "p-12", wins: 8, losses: 6, points: 112, rank: 5 },
  { playerId: "p-2", wins: 7, losses: 6, points: 103, rank: 6 },
  { playerId: "p-10", wins: 6, losses: 7, points: 91, rank: 7 },
  { playerId: "p-5", wins: 5, losses: 7, points: 82, rank: 8 },
];

export function getPlayerById(id: string): Player | undefined {
  return players.find((p) => p.id === id);
}

export function getSessionById(id: string): Session | undefined {
  return sessions.find((s) => s.id === id);
}

export function getCourtById(id: string): Court | undefined {
  return courts.find((c) => c.id === id);
}

export function getNextEdition(): Session | undefined {
  const todayStr = formatDate(new Date());
  return sessions
    .filter((s) => s.date >= todayStr && s.status !== "COMPLETED" && s.status !== "CANCELLED")
    .sort((a, b) => a.date.localeCompare(b.date))[0];
}

export function getPastEditions(): Session[] {
  const todayStr = formatDate(new Date());
  return sessions
    .filter((s) => s.date < todayStr || s.status === "COMPLETED" || s.status === "CANCELLED")
    .sort((a, b) => b.date.localeCompare(a.date));
}
