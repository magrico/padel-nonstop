import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { SessionStatusBadge } from "@/components/sessions/SessionStatusBadge";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
import {
  getSessionById,
  getPlayerById,
  getNextEdition,
  getPastEditions,
  courts,
  leaderboard,
  players,
  nonstop,
} from "@/lib/mock-data";
import type { Session, SessionStatus, Registration } from "@/lib/types";
import {
  ArrowLeft,
  Clock,
  MapPin,
  Users,
  Ban,
  UserPlus,
  UserMinus,
  Send,
  Play,
  BarChart3,
  Trophy,
  Edit,
  AlertTriangle,
  Eye,
} from "lucide-react";

type Tab = "edition" | "history" | "players" | "leaderboard";

function StatusActions({
  status,
  session,
  onStatusChange,
}: {
  status: SessionStatus;
  session: Session;
  onStatusChange: (s: SessionStatus) => void;
}) {
  switch (status) {
    case "SCHEDULED":
      return (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="gap-1" onClick={() => alert("Edit details — coming soon")}>
            <Edit className="h-3.5 w-3.5" /> Edit Details
          </Button>
          <Button size="sm" variant="destructive" className="gap-1" onClick={() => { if (confirm("Cancel this session?")) onStatusChange("CANCELLED"); }}>
            <Ban className="h-3.5 w-3.5" /> Cancel Session
          </Button>
        </div>
      );
    case "OPEN":
      return (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="gap-1" onClick={() => alert("Add player — coming soon")}>
            <UserPlus className="h-3.5 w-3.5" /> Add Player
          </Button>
          <Button size="sm" variant="outline" className="gap-1" onClick={() => alert("Remove player — coming soon")}>
            <UserMinus className="h-3.5 w-3.5" /> Remove Player
          </Button>
          <Button size="sm" variant="destructive" className="gap-1" onClick={() => { if (confirm("Cancel this session?")) onStatusChange("CANCELLED"); }}>
            <Ban className="h-3.5 w-3.5" /> Cancel
          </Button>
        </div>
      );
    case "FULL":
      return (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="gap-1" onClick={() => alert(`Waitlist: ${session.registrations.filter(r => r.status === "waitlist").length} players`)}>
            <Users className="h-3.5 w-3.5" /> View Waitlist
          </Button>
          <Button size="sm" variant="outline" className="gap-1" onClick={() => alert("Intervene — coming soon")}>
            <UserPlus className="h-3.5 w-3.5" /> Intervene
          </Button>
        </div>
      );
    case "CLOSED":
      return (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="gap-1" onClick={() => alert(`Final list: ${session.registrations.filter(r => r.status === "confirmed").length} confirmed players`)}>
            <Users className="h-3.5 w-3.5" /> Review Final List
          </Button>
          <Button size="sm" variant="outline" className="gap-1" onClick={() => alert("Message sent to all players!")}>
            <Send className="h-3.5 w-3.5" /> Send Message
          </Button>
        </div>
      );
    case "IN_PROGRESS":
      return (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="gap-1" onClick={() => alert("Rotation generated!")}>
            <Play className="h-3.5 w-3.5" /> Generate Rotation
          </Button>
          <Button size="sm" variant="outline" className="gap-1" onClick={() => alert("Input scores — coming soon")}>
            <BarChart3 className="h-3.5 w-3.5" /> Input Scores
          </Button>
        </div>
      );
    case "COMPLETED":
      return (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="gap-1" onClick={() => alert("Leaderboard announced!")}>
            <Trophy className="h-3.5 w-3.5" /> Announce Winner
          </Button>
          <Button size="sm" variant="outline" className="gap-1" onClick={() => alert("Correct scores — coming soon")}>
            <Edit className="h-3.5 w-3.5" /> Correct Scores
          </Button>
        </div>
      );
    case "CANCELLED":
      return (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="gap-1" onClick={() => alert(`Reason: ${session.cancelReason ?? "No reason provided"}`)}>
            <AlertTriangle className="h-3.5 w-3.5" /> View Reason
          </Button>
        </div>
      );
  }
}

const chartConfig = {
  confirmed: {
    label: "Confirmed",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

function ConfirmedChart({ confirmed, max }: { confirmed: number; max: number }) {
  const endAngle = (confirmed / max) * 360;
  const chartData = [{ name: "confirmed", value: confirmed, fill: "var(--color-confirmed)" }];

  return (
    <ChartContainer config={chartConfig} className="mx-auto aspect-square h-[140px]">
      <RadialBarChart
        data={chartData}
        startAngle={0}
        endAngle={endAngle}
        innerRadius={50}
        outerRadius={70}
      >
        <PolarGrid
          gridType="circle"
          radialLines={false}
          stroke="none"
          className="first:fill-muted last:fill-background"
          polarRadius={[55, 45]}
        />
        <RadialBar dataKey="value" background cornerRadius={10} />
        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                    <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-2xl font-bold">
                      {confirmed}/{max}
                    </tspan>
                    <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 18} className="fill-muted-foreground text-xs">
                      players
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </PolarRadiusAxis>
      </RadialBarChart>
    </ChartContainer>
  );
}

function EditionTab({
  session,
  status,
  onStatusChange,
  isCheckedIn,
  toggleCheckIn,
}: {
  session: Session;
  status: SessionStatus;
  onStatusChange: (s: SessionStatus) => void;
  isCheckedIn: (reg: Registration) => boolean;
  toggleCheckIn: (playerId: string) => void;
}) {
  const confirmed = session.registrations.filter((r) => r.status === "confirmed");
  const waitlist = session.registrations.filter((r) => r.status === "waitlist");
  const spotsLeft = session.maxPlayers - confirmed.length;
  const courtNames = session.courtIds
    .map((cid) => courts.find((c) => c.id === cid)?.name ?? cid)
    .join(", ");
  const editionDate = new Date(session.date + "T00:00:00");
  const dateLabel = editionDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-6">
      {/* Edition info */}
      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          {dateLabel} at {session.time} ({session.duration} min)
        </span>
        <span className="flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5" />
          {courtNames}
        </span>
      </div>

      {/* Status actions */}
      <div className="flex items-center gap-2">
        <StatusActions status={status} session={session} onStatusChange={onStatusChange} />
      </div>

      {status === "CANCELLED" && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-4 w-4" />
              <p className="text-sm font-medium">Cancellation Reason</p>
            </div>
            <p className="text-sm text-red-600 mt-1">{session.cancelReason ?? "Cancelled by manager"}</p>
          </CardContent>
        </Card>
      )}

      {/* Combined Players + Chart card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center justify-between">
            <span>Players</span>
            <div className="flex items-center gap-2">
              {status === "OPEN" && spotsLeft > 0 && (
                <span className="text-xs font-medium text-amber-600">
                  {spotsLeft} {spotsLeft === 1 ? "spot" : "spots"} left
                </span>
              )}
              {status === "IN_PROGRESS" && (
                <span className="text-xs font-medium text-green-600">Live</span>
              )}
              {waitlist.length > 0 && (
                <Badge variant="secondary">{waitlist.length} waitlisted</Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex gap-6">
            {/* Radial chart */}
            <div className="shrink-0 flex flex-col items-center">
              <ConfirmedChart confirmed={confirmed.length} max={session.maxPlayers} />
            </div>

            {/* Player list */}
            <div className="flex-1 min-w-0">
              {confirmed.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4">No players registered yet.</p>
              ) : (
                <div className="space-y-1">
                  {confirmed.map((reg) => {
                    const player = getPlayerById(reg.playerId);
                    if (!player) return null;
                    const checked = isCheckedIn(reg);
                    return (
                      <div key={reg.playerId} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                        <div className="flex items-center gap-3">
                          {status === "IN_PROGRESS" && (
                            <Checkbox
                              checked={checked}
                              onCheckedChange={() => toggleCheckIn(reg.playerId)}
                            />
                          )}
                          <Avatar className="h-7 w-7">
                            <AvatarFallback className="text-[10px]">
                              {player.name.split(" ").map((n) => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{player.name}</p>
                            <p className="text-xs text-muted-foreground capitalize">{player.level}</p>
                          </div>
                        </div>
                        {status === "IN_PROGRESS" && (
                          <Badge variant={checked ? "default" : "secondary"} className="text-xs">
                            {checked ? "Checked In" : "Pending"}
                          </Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {waitlist.length > 0 && (
                <>
                  <Separator className="my-2" />
                  <p className="text-xs font-medium text-muted-foreground mb-1">Waitlist</p>
                  {waitlist.map((reg) => {
                    const player = getPlayerById(reg.playerId);
                    if (!player) return null;
                    return (
                      <div key={reg.playerId} className="flex items-center gap-3 p-2">
                        <Avatar className="h-7 w-7">
                          <AvatarFallback className="text-[10px]">
                            {player.name.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm">{player.name}</p>
                          <p className="text-xs text-muted-foreground capitalize">{player.level}</p>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scores */}
        {session.scores.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Scores</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              {session.scores.map((score, i) => {
                const t1 = score.team1.map((pid) => getPlayerById(pid)?.name ?? pid).join(" & ");
                const t2 = score.team2.map((pid) => getPlayerById(pid)?.name ?? pid).join(" & ");
                return (
                  <div key={i} className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground mb-1">Round {score.round} — Match {(i % 2) + 1}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className={score.score1 > score.score2 ? "font-semibold" : ""}>{t1}</span>
                      <span className="font-mono text-xs">{score.score1} - {score.score2}</span>
                      <span className={score.score2 > score.score1 ? "font-semibold" : ""}>{t2}</span>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        {/* Session Leaderboard */}
        {status === "COMPLETED" && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Session Leaderboard</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {leaderboard.slice(0, 5).map((entry) => {
                  const player = getPlayerById(entry.playerId);
                  return (
                    <div key={entry.playerId} className="flex items-center justify-between p-2">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-mono w-6 text-muted-foreground">#{entry.rank}</span>
                        <span className="text-sm font-medium">{player?.name}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{entry.wins}W - {entry.losses}L</span>
                        <Badge variant="secondary">{entry.points} pts</Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function HistoryTab() {
  const pastEditions = getPastEditions();

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Courts</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Players</TableHead>
            <TableHead className="w-[80px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {pastEditions.map((edition) => {
            const confirmed = edition.registrations.filter(
              (r) => r.status === "confirmed"
            ).length;
            const courtNames = edition.courtIds
              .map((id) => courts.find((c) => c.id === id)?.name ?? id)
              .join(", ");
            const editionDate = new Date(edition.date + "T00:00:00");
            const dateLabel = editionDate.toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            });

            return (
              <TableRow key={edition.id}>
                <TableCell className="font-medium">{dateLabel}</TableCell>
                <TableCell>{edition.time}</TableCell>
                <TableCell>{courtNames}</TableCell>
                <TableCell>
                  <SessionStatusBadge status={edition.status} />
                </TableCell>
                <TableCell>
                  {confirmed}/{edition.maxPlayers}
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                    <Link to={`/editions/${edition.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
          {pastEditions.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                No past editions yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function PlayersTab() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {players.map((player) => (
        <div key={player.id} className="flex items-center gap-3 p-3 border rounded-lg">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="text-xs">
              {player.name.split(" ").map((n) => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{player.name}</p>
            <p className="text-xs text-muted-foreground truncate">{player.email}</p>
          </div>
          <Badge variant="secondary" className="capitalize text-xs">{player.level}</Badge>
        </div>
      ))}
    </div>
  );
}

function LeaderboardTab() {
  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]">Rank</TableHead>
            <TableHead>Player</TableHead>
            <TableHead>Wins</TableHead>
            <TableHead>Losses</TableHead>
            <TableHead>Points</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leaderboard.map((entry) => {
            const player = getPlayerById(entry.playerId);
            return (
              <TableRow key={entry.playerId}>
                <TableCell className="font-mono">#{entry.rank}</TableCell>
                <TableCell className="font-medium">{player?.name ?? "Unknown"}</TableCell>
                <TableCell>{entry.wins}</TableCell>
                <TableCell>{entry.losses}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{entry.points}</Badge>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

const tabs: { key: Tab; label: string }[] = [
  { key: "edition", label: "Next Edition" },
  { key: "history", label: "History" },
  { key: "players", label: "Players" },
  { key: "leaderboard", label: "Leaderboard" },
];

export default function SessionDetail() {
  const { id } = useParams<{ id: string }>();
  const isLanding = !id;
  const session = isLanding ? getNextEdition() : getSessionById(id);
  const [activeTab, setActiveTab] = useState<Tab>("edition");
  const [currentStatus, setCurrentStatus] = useState<SessionStatus | null>(null);
  const [checkedInPlayers, setCheckedInPlayers] = useState<Set<string>>(new Set());

  const isCheckedIn = (reg: Registration) =>
    checkedInPlayers.has(reg.playerId) || reg.checkedIn;

  const toggleCheckIn = (playerId: string) => {
    setCheckedInPlayers((prev) => {
      const next = new Set(prev);
      if (next.has(playerId)) next.delete(playerId);
      else next.add(playerId);
      return next;
    });
  };

  // When viewing a specific edition from history, show just that edition (no tabs)
  if (!isLanding) {
    if (!session) {
      return (
        <div className="space-y-4">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <p className="text-muted-foreground">Edition not found.</p>
        </div>
      );
    }

    const status = currentStatus ?? session.status;

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold">{nonstop.name}</h1>
            <SessionStatusBadge status={status} />
          </div>
        </div>
        <EditionTab
          session={session}
          status={status}
          onStatusChange={setCurrentStatus}
          isCheckedIn={isCheckedIn}
          toggleCheckIn={toggleCheckIn}
        />
      </div>
    );
  }

  // Landing page — nonstop page with tabs
  const status = currentStatus ?? (session?.status ?? "SCHEDULED");

  return (
    <div className="space-y-6">
      {/* Nonstop header */}
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold">{nonstop.name}</h1>
          {session && <SessionStatusBadge status={status} />}
        </div>
        <p className="text-sm text-muted-foreground mt-0.5">{nonstop.description}</p>
      </div>

      {/* Tab navigation */}
      <div className="flex gap-1 border-b">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm transition-colors relative ${
              activeTab === tab.key
                ? "text-foreground font-medium"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
            {activeTab === tab.key && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground" />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "edition" && session && (
        <EditionTab
          session={session}
          status={status}
          onStatusChange={setCurrentStatus}
          isCheckedIn={isCheckedIn}
          toggleCheckIn={toggleCheckIn}
        />
      )}
      {activeTab === "edition" && !session && (
        <p className="text-muted-foreground py-8 text-center">No upcoming edition. Check back soon!</p>
      )}
      {activeTab === "history" && <HistoryTab />}
      {activeTab === "players" && <PlayersTab />}
      {activeTab === "leaderboard" && <LeaderboardTab />}
    </div>
  );
}
