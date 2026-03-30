"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

interface UserData {
  name: string;
  email: string;
  image?: string;
  createdAt?: string;
  totalXP?: number;
  totalWorkouts?: number;
  streak?: number;
  achievements?: string[];
  recentWorkouts?: { id: string; dayLabel: string; totalVolume: number; totalSets: number; xpEarned: number; completedAt: string }[];
  postCount?: number;
}

interface PR {
  id: string;
  exerciseName: string;
  weight: number;
  reps: number;
  recordedAt: string;
}

const ALL_ACHIEVEMENTS = [
  { key: "first_rep", name: "First Rep", description: "Completed your first workout", emoji: "🥇" },
  { key: "getting_started", name: "Getting Started", description: "Completed 5 workouts", emoji: "🔥" },
  { key: "ten_strong", name: "Ten Strong", description: "Completed 10 workouts", emoji: "💪" },
  { key: "committed", name: "Committed", description: "Completed 25 workouts", emoji: "⚡" },
  { key: "unstoppable", name: "Unstoppable", description: "Completed 50 workouts", emoji: "🏆" },
  { key: "on_a_roll", name: "On a Roll", description: "3-day streak", emoji: "📅" },
  { key: "week_warrior", name: "Week Warrior", description: "7-day streak", emoji: "📅" },
  { key: "monthly_grinder", name: "Monthly Grinder", description: "30-day streak", emoji: "📅" },
  { key: "xp_hunter", name: "XP Hunter", description: "Earned 1,000 XP", emoji: "⭐" },
  { key: "xp_legend", name: "XP Legend", description: "Earned 5,000 XP", emoji: "🌟" },
];

function getInitials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

const bebasNeue = { fontFamily: "'Bebas Neue', sans-serif" };

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [prs, setPrs] = useState<PR[]>([]);
  const [showPrForm, setShowPrForm] = useState(false);
  const [prExercise, setPrExercise] = useState("");
  const [prWeight, setPrWeight] = useState("");
  const [prReps, setPrReps] = useState("");

  const fetchData = useCallback(async () => {
    try {
      const [userRes, prsRes] = await Promise.all([
        fetch("/api/user"),
        fetch("/api/user/prs"),
      ]);
      if (userRes.ok) setUserData(await userRes.json());
      if (prsRes.ok) {
        const data = await prsRes.json();
        setPrs(data.prs ?? data ?? []);
      }
    } catch { /* silently fail */ }
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login?returnUrl=/profile");
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") fetchData();
  }, [status, fetchData]);

  const handleAddPr = async () => {
    if (!prExercise || !prWeight) return;
    try {
      await fetch("/api/user/prs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exerciseName: prExercise,
          weight: parseFloat(prWeight),
          reps: parseInt(prReps) || 1,
        }),
      });
      setPrExercise("");
      setPrWeight("");
      setPrReps("");
      setShowPrForm(false);
      fetchData();
    } catch { /* silently fail */ }
  };

  if (status === "loading") {
    return (
      <main style={{ maxWidth: "40rem", margin: "0 auto", padding: "4rem 1rem", textAlign: "center" }}>
        <p style={{ color: "rgba(255,255,255,0.4)" }}>Loading...</p>
      </main>
    );
  }

  if (status === "unauthenticated") return null;

  const user = session?.user;
  const displayName = userData?.name || user?.name || "Athlete";
  const xp = userData?.totalXP ?? 0;
  const workouts = userData?.totalWorkouts ?? 0;
  const streak = userData?.streak ?? 0;
  const unlockedKeys = new Set(userData?.achievements ?? []);
  const unlockedCount = unlockedKeys.size;
  const recentWorkouts = userData?.recentWorkouts ?? [];
  const postCount = userData?.postCount ?? 0;

  return (
    <main style={{ maxWidth: "40rem", margin: "0 auto", padding: "1rem" }}>
      {/* User Header Card */}
      <div className="card" style={{ padding: "24px", marginBottom: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{
            width: "64px", height: "64px", borderRadius: "50%",
            background: "linear-gradient(135deg, var(--og), var(--og2), var(--pm))",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.5rem", fontWeight: 700, color: "#fff", flexShrink: 0,
          }}>
            {getInitials(displayName)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, margin: 0 }}>{displayName.toLowerCase()}</h2>
            <p style={{ color: "var(--whm)", fontSize: "0.8rem", margin: "2px 0 0" }}>Member &middot; FitForge</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="btn-ghost"
            style={{ padding: "8px 18px", fontSize: "11px" }}
          >
            Sign Out
          </button>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "var(--br)", margin: "20px 0" }} />

        {/* Stats Row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", textAlign: "center" }}>
          <div>
            <div style={{ ...bebasNeue, fontSize: "1.75rem", color: "var(--og2)", letterSpacing: 1 }}>{workouts}</div>
            <div style={{ fontSize: "0.65rem", color: "var(--whm)", textTransform: "uppercase", letterSpacing: 2, fontWeight: 600 }}>Workouts</div>
          </div>
          <div>
            <div style={{ ...bebasNeue, fontSize: "1.75rem", color: "var(--og2)", letterSpacing: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
              {streak}<span style={{ fontSize: "1.2rem" }}>🔥</span>
            </div>
            <div style={{ fontSize: "0.65rem", color: "var(--whm)", textTransform: "uppercase", letterSpacing: 2, fontWeight: 600 }}>Streak</div>
          </div>
          <div>
            <div style={{ ...bebasNeue, fontSize: "1.75rem", color: "var(--og2)", letterSpacing: 1 }}>{xp}</div>
            <div style={{ fontSize: "0.65rem", color: "var(--whm)", textTransform: "uppercase", letterSpacing: 2, fontWeight: 600 }}>XP</div>
          </div>
          <div>
            <div style={{ ...bebasNeue, fontSize: "1.75rem", color: "var(--og2)", letterSpacing: 1 }}>{prs.length}</div>
            <div style={{ fontSize: "0.65rem", color: "var(--whm)", textTransform: "uppercase", letterSpacing: 2, fontWeight: 600 }}>PRs</div>
          </div>
        </div>
      </div>

      {/* Social Stats */}
      <div className="card" style={{ padding: "20px", marginBottom: "12px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", textAlign: "center" }}>
          <div style={{ borderRight: "1px solid var(--br)" }}>
            <div style={{ fontSize: "1.1rem", fontWeight: 700 }}>0</div>
            <div style={{ fontSize: "0.75rem", color: "var(--whm)" }}>Following</div>
          </div>
          <div style={{ borderRight: "1px solid var(--br)" }}>
            <div style={{ fontSize: "1.1rem", fontWeight: 700 }}>0</div>
            <div style={{ fontSize: "0.75rem", color: "var(--whm)" }}>Followers</div>
          </div>
          <div>
            <div style={{ fontSize: "1.1rem", fontWeight: 700 }}>{postCount}</div>
            <div style={{ fontSize: "0.75rem", color: "var(--whm)" }}>Posts</div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="card" style={{ padding: "24px", marginBottom: "12px" }}>
        <h3 style={{ ...bebasNeue, fontSize: "1rem", letterSpacing: 3, textTransform: "uppercase", marginBottom: "16px", display: "flex", alignItems: "center", gap: 8 }}>
          <span>🏆</span> Achievements ({unlockedCount}/{ALL_ACHIEVEMENTS.length})
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          {ALL_ACHIEVEMENTS.map((a) => {
            const unlocked = unlockedKeys.has(a.key);
            return (
              <div
                key={a.key}
                style={{
                  padding: "14px 16px",
                  borderRadius: "14px",
                  background: unlocked ? "rgba(34,197,94,0.08)" : "rgba(255,255,255,0.02)",
                  border: `1px solid ${unlocked ? "rgba(34,197,94,0.2)" : "var(--br)"}`,
                  opacity: unlocked ? 1 : 0.45,
                  display: "flex", alignItems: "center", gap: "12px",
                }}
              >
                <span style={{ fontSize: "1.25rem", flexShrink: 0 }}>{a.emoji}</span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: "0.85rem", color: unlocked ? "#fff" : "var(--whm)" }}>{a.name}</div>
                  <div style={{ fontSize: "0.7rem", color: "var(--whm)", marginTop: 2 }}>{a.description}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Personal Records */}
      <div className="card" style={{ padding: "24px", marginBottom: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
          <h3 style={{ ...bebasNeue, fontSize: "1rem", letterSpacing: 3, textTransform: "uppercase", display: "flex", alignItems: "center", gap: 8, margin: 0 }}>
            <span>💪</span> Personal Records
          </h3>
          <button
            onClick={() => setShowPrForm(!showPrForm)}
            style={{
              padding: "6px 16px", borderRadius: "100px", fontSize: "0.75rem", fontWeight: 600,
              background: "transparent", border: "1px solid var(--og)", color: "var(--og)",
              cursor: "pointer",
            }}
          >
            + Add PR
          </button>
        </div>

        {showPrForm && (
          <div style={{ marginBottom: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
            <input className="input-field" placeholder="Exercise name" value={prExercise} onChange={(e) => setPrExercise(e.target.value)} style={{ fontSize: "14px", padding: "10px 14px" }} />
            <div style={{ display: "flex", gap: "8px" }}>
              <input className="input-field" type="number" placeholder="Weight (lbs)" value={prWeight} onChange={(e) => setPrWeight(e.target.value)} style={{ fontSize: "14px", padding: "10px 14px" }} />
              <input className="input-field" type="number" placeholder="Reps" value={prReps} onChange={(e) => setPrReps(e.target.value)} style={{ fontSize: "14px", padding: "10px 14px" }} />
            </div>
            <button className="btn-primary" onClick={handleAddPr} style={{ width: "100%", justifyContent: "center" }}>Save PR</button>
          </div>
        )}

        {prs.length === 0 ? (
          <p style={{ color: "var(--whm)", fontSize: "0.85rem", textAlign: "center", margin: "8px 0" }}>
            No PRs yet. Add your first one!
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {prs.map((pr) => (
              <div key={pr.id} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "12px 16px", borderRadius: "12px",
                background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.1)",
              }}>
                <div>
                  <p style={{ fontWeight: 600, fontSize: "0.85rem", margin: 0 }}>{pr.exerciseName}</p>
                  <p style={{ color: "var(--whm)", fontSize: "0.7rem", margin: "2px 0 0" }}>
                    {new Date(pr.recordedAt).toLocaleDateString()}
                  </p>
                </div>
                <span style={{ color: "var(--gr)", fontWeight: 700, fontSize: "0.9rem" }}>
                  {pr.weight} lbs &times; {pr.reps}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Workouts */}
      <div className="card" style={{ padding: "24px", marginBottom: "12px" }}>
        <h3 style={{ ...bebasNeue, fontSize: "1rem", letterSpacing: 3, textTransform: "uppercase", marginBottom: "16px", display: "flex", alignItems: "center", gap: 8 }}>
          <span>🗓</span> Recent Workouts
        </h3>
        {recentWorkouts.length === 0 ? (
          <p style={{ color: "var(--whm)", fontSize: "0.85rem", textAlign: "center" }}>
            No workouts logged yet. Head to the builder to create your first!
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {recentWorkouts.map((w) => (
              <div key={w.id} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "12px 16px", borderRadius: "12px", background: "rgba(255,255,255,0.03)",
              }}>
                <div>
                  <p style={{ fontWeight: 600, fontSize: "0.85rem", margin: 0 }}>{w.dayLabel}</p>
                  <p style={{ color: "var(--whm)", fontSize: "0.7rem", margin: "2px 0 0" }}>
                    {w.totalSets} sets &middot; {w.xpEarned} XP
                  </p>
                </div>
                <span style={{ color: "var(--whm)", fontSize: "0.75rem" }}>
                  {new Date(w.completedAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
