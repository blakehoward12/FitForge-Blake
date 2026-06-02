"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

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

  const stats: { value: React.ReactNode; label: string }[] = [
    { value: workouts, label: "Workouts" },
    { value: <>{streak}<span style={{ fontSize: "1.1rem", marginLeft: 4 }}>🔥</span></>, label: "Streak" },
    { value: xp, label: "XP" },
    { value: prs.length, label: "PRs" },
  ];

  return (
    <main style={{ maxWidth: "40rem", margin: "0 auto", padding: "0 1rem 1rem" }}>
      {/* ── Strava-style cover banner ───────────────────────────────── */}
      <div className="relative animate-fadeUp" style={{ borderRadius: "0 0 24px 24px", overflow: "hidden" }}>
        <div className="relative" style={{ height: 200, width: "100%" }}>
          <Image
            src="/img/generated/profile-cover.png"
            alt="Athlete training with battle ropes in a moody gym"
            fill
            priority
            sizes="(max-width: 640px) 100vw, 640px"
            style={{ objectFit: "cover", objectPosition: "center 30%" }}
          />
          {/* dark gradient overlay */}
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(10,10,15,.35) 0%, rgba(10,10,15,.2) 40%, rgba(10,10,15,.92) 100%)" }} />
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 85% 10%, rgba(90,45,130,.4) 0%, transparent 55%), radial-gradient(ellipse at 10% 90%, rgba(120,45,15,.4) 0%, transparent 55%)" }} />
        </div>
      </div>

      {/* User Header Card (overlaps banner) */}
      <div className="card animate-fadeUp" style={{ padding: "20px 22px 22px", marginTop: "-58px", position: "relative", zIndex: 2, background: "rgba(18,18,26,0.85)", backdropFilter: "blur(14px)" }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: "16px" }}>
          {/* Real avatar with brand-gradient ring */}
          <div style={{
            width: "96px", height: "96px", borderRadius: "50%",
            padding: "3px", flexShrink: 0,
            background: "linear-gradient(135deg, var(--og), var(--og2), var(--pm))",
            boxShadow: "0 10px 30px rgba(224,120,48,.3)",
          }}>
            <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: "50%", overflow: "hidden", border: "3px solid var(--bg)" }}>
              <Image
                src="/img/generated/profile-avatar.png"
                alt={displayName}
                fill
                sizes="96px"
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 0, paddingBottom: 4 }}>
            <h2 style={{ ...bebasNeue, fontSize: "1.9rem", letterSpacing: 1, lineHeight: 1, margin: 0 }} className="text-gradient-white">{displayName.toLowerCase()}</h2>
            <p style={{ color: "var(--whm)", fontSize: "0.72rem", margin: "5px 0 0", textTransform: "uppercase", letterSpacing: 2, fontWeight: 600 }}>Member &middot; FitForge</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="btn-ghost"
            style={{ padding: "8px 18px", fontSize: "11px", alignSelf: "center" }}
          >
            Sign Out
          </button>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "var(--br)", margin: "20px 0" }} />

        {/* Stats Row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
          {stats.map((s) => (
            <div
              key={s.label}
              style={{
                textAlign: "center", padding: "12px 4px", borderRadius: "14px",
                background: "rgba(255,255,255,0.03)", border: "1px solid var(--br)",
              }}
            >
              <div style={{ ...bebasNeue, fontSize: "1.85rem", letterSpacing: 1, lineHeight: 1, display: "flex", alignItems: "center", justifyContent: "center" }} className="text-gradient-brand">{s.value}</div>
              <div style={{ fontSize: "0.6rem", color: "var(--whm)", textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 600, marginTop: 6 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Social Stats */}
      <div className="card" style={{ padding: "18px 20px", marginTop: "12px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", textAlign: "center" }}>
          <div style={{ borderRight: "1px solid var(--br)" }}>
            <div style={{ ...bebasNeue, fontSize: "1.5rem", letterSpacing: 1, lineHeight: 1 }}>0</div>
            <div style={{ fontSize: "0.65rem", color: "var(--whm)", textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 600, marginTop: 4 }}>Following</div>
          </div>
          <div style={{ borderRight: "1px solid var(--br)" }}>
            <div style={{ ...bebasNeue, fontSize: "1.5rem", letterSpacing: 1, lineHeight: 1 }}>0</div>
            <div style={{ fontSize: "0.65rem", color: "var(--whm)", textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 600, marginTop: 4 }}>Followers</div>
          </div>
          <div>
            <div style={{ ...bebasNeue, fontSize: "1.5rem", letterSpacing: 1, lineHeight: 1 }}>{postCount}</div>
            <div style={{ fontSize: "0.65rem", color: "var(--whm)", textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 600, marginTop: 4 }}>Posts</div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="card" style={{ padding: "24px", marginTop: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
          <h3 style={{ ...bebasNeue, fontSize: "1.15rem", letterSpacing: 3, textTransform: "uppercase", display: "flex", alignItems: "center", gap: 8, margin: 0 }}>
            <span>🏆</span> Achievements
          </h3>
          <span className="chip" style={{ color: "var(--gr)", borderColor: "rgba(34,197,94,0.3)" }}>{unlockedCount}/{ALL_ACHIEVEMENTS.length}</span>
        </div>
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
      <div className="card" style={{ padding: "24px", marginTop: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
          <h3 style={{ ...bebasNeue, fontSize: "1.15rem", letterSpacing: 3, textTransform: "uppercase", display: "flex", alignItems: "center", gap: 8, margin: 0 }}>
            <span>💪</span> Personal Records
          </h3>
          <button
            onClick={() => setShowPrForm(!showPrForm)}
            style={{
              padding: "7px 18px", borderRadius: "100px", fontSize: "0.7rem", fontWeight: 700,
              letterSpacing: 1, textTransform: "uppercase",
              background: "rgba(224,120,48,0.1)", border: "1px solid rgba(224,120,48,0.4)", color: "var(--og)",
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
                padding: "13px 16px", borderRadius: "14px",
                background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.18)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                  <span style={{ fontSize: "1.1rem", flexShrink: 0 }}>🏋️</span>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontWeight: 600, fontSize: "0.9rem", margin: 0 }}>{pr.exerciseName}</p>
                    <p style={{ color: "var(--whm)", fontSize: "0.7rem", margin: "2px 0 0" }}>
                      {new Date(pr.recordedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span style={{ ...bebasNeue, color: "var(--gr)", fontWeight: 400, fontSize: "1.25rem", letterSpacing: 0.5, flexShrink: 0 }}>
                  {pr.weight} lbs &times; {pr.reps}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Workouts */}
      <div className="card" style={{ padding: "24px", marginTop: "12px" }}>
        <h3 style={{ ...bebasNeue, fontSize: "1.15rem", letterSpacing: 3, textTransform: "uppercase", marginBottom: "16px", display: "flex", alignItems: "center", gap: 8 }}>
          <span>🗓</span> Recent Workouts
        </h3>
        {recentWorkouts.length === 0 ? (
          <p style={{ color: "var(--whm)", fontSize: "0.85rem", textAlign: "center" }}>
            No workouts logged yet. Head to the builder to create your first!
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {recentWorkouts.map((w) => (
              <div
                key={w.id}
                onClick={() => {
                  // If there's a workout in localStorage, go to tracker flow
                  const saved = localStorage.getItem('ff_generated_workout');
                  if (saved) {
                    router.push('/review');
                  } else {
                    router.push('/builder');
                  }
                }}
                style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "13px 16px", borderRadius: "14px", background: "rgba(255,255,255,0.03)",
                  border: "1px solid var(--br)",
                  cursor: "pointer", transition: "background 0.2s",
                }}
                onMouseOver={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
                onMouseOut={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
              >
                <div>
                  <p style={{ fontWeight: 600, fontSize: "0.9rem", margin: 0 }}>{w.dayLabel}</p>
                  <p style={{ color: "var(--whm)", fontSize: "0.7rem", margin: "2px 0 0" }}>
                    {w.totalSets} sets &middot; {w.xpEarned} XP
                  </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ color: "var(--whm)", fontSize: "0.75rem" }}>
                    {new Date(w.completedAt).toLocaleDateString()}
                  </span>
                  <span style={{ color: "var(--og)", fontSize: "0.8rem" }}>→</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
