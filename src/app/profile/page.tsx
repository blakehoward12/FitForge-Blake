"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";


interface UserData {
  name: string;
  email: string;
  image?: string;
  createdAt?: string;
  xp?: number;
  workouts?: number;
  streak?: number;
  achievements?: { name: string; emoji: string; unlockedAt: string }[];
  recentWorkouts?: { id: string; name: string; date: string; exercises: number }[];
}

interface PR {
  id: string;
  exercise: string;
  value: string;
  date: string;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const bebasNeue = { fontFamily: "'Bebas Neue', sans-serif" };

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [prs, setPrs] = useState<PR[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const [userRes, prsRes] = await Promise.all([
        fetch("/api/user"),
        fetch("/api/user/prs"),
      ]);
      if (userRes.ok) {
        const data = await userRes.json();
        setUserData(data);
      }
      if (prsRes.ok) {
        const data = await prsRes.json();
        setPrs(data.prs ?? data ?? []);
      }
    } catch {
      // silently fail
    }
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?returnUrl=/profile");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchData();
    }
  }, [status, fetchData]);

  if (status === "loading") {
    return (
      <>
          <main style={{ maxWidth: "40rem", margin: "0 auto", padding: "4rem 1rem", textAlign: "center" }}>
          <p style={{ color: "rgba(255,255,255,0.4)" }}>Loading...</p>
        </main>
      </>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  const user = session?.user;
  const displayName = userData?.name || user?.name || "Athlete";
  const displayEmail = userData?.email || user?.email || "";
  const xp = userData?.xp ?? 0;
  const workouts = userData?.workouts ?? 0;
  const streak = userData?.streak ?? 0;
  const achievements = userData?.achievements ?? [];
  const recentWorkouts = userData?.recentWorkouts ?? [];
  const memberSince = userData?.createdAt
    ? new Date(userData.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "Recently";

  const stats = [
    { label: "Total XP", value: xp.toLocaleString(), color: "var(--pl)" },
    { label: "Workouts", value: workouts.toString(), color: "var(--og)" },
    { label: "Streak", value: `${streak}d`, color: "var(--gr)" },
    { label: "PRs", value: prs.length.toString(), color: "var(--og2)" },
  ];

  return (
    <>
      <main style={{ maxWidth: "40rem", margin: "0 auto", padding: "2rem 1rem" }}>
        {/* Header */}
        <h1 style={{ ...bebasNeue, fontSize: "2.5rem", letterSpacing: "0.04em", marginBottom: "1.5rem" }}>
          <span className="text-gradient-white">MY</span>{" "}
          <span className="text-gradient-brand">PROFILE</span>
        </h1>

        {/* User Info */}
        <div className="card" style={{ textAlign: "center", marginBottom: "1.25rem", padding: "2rem" }}>
          <div
            style={{
              width: "5rem",
              height: "5rem",
              borderRadius: "50%",
              background: "linear-gradient(135deg, var(--pm), var(--og2))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "#fff",
              margin: "0 auto 1rem",
            }}
          >
            {getInitials(displayName)}
          </div>
          <h2 style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: "0.25rem" }}>{displayName}</h2>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.9rem", marginBottom: "0.25rem" }}>
            {displayEmail}
          </p>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.8rem" }}>
            Member since {memberSince}
          </p>
        </div>

        {/* Stats Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "0.75rem",
            marginBottom: "1.25rem",
          }}
        >
          {stats.map((s) => (
            <div key={s.label} className="card" style={{ textAlign: "center", padding: "1.25rem" }}>
              <p
                style={{
                  fontSize: "1.75rem",
                  fontWeight: 800,
                  color: s.color,
                  margin: "0 0 0.25rem",
                  ...bebasNeue,
                  letterSpacing: "0.03em",
                }}
              >
                {s.value}
              </p>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.8rem", margin: 0, fontWeight: 600 }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* Achievements */}
        {achievements.length > 0 && (
          <div className="card" style={{ marginBottom: "1.25rem" }}>
            <h3 style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "0.75rem" }}>Achievements</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {achievements.map((a) => (
                <div
                  key={a.name}
                  className="chip"
                  title={`Unlocked: ${new Date(a.unlockedAt).toLocaleDateString()}`}
                >
                  <span>{a.emoji}</span>
                  {a.name}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Workouts */}
        <div className="card" style={{ marginBottom: "1.25rem" }}>
          <h3 style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "0.75rem" }}>Recent Workouts</h3>
          {recentWorkouts.length === 0 ? (
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.875rem" }}>
              No workouts logged yet. Head to the builder to create your first!
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {recentWorkouts.map((w) => (
                <div
                  key={w.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0.625rem 0.875rem",
                    borderRadius: "0.625rem",
                    background: "rgba(255,255,255,0.03)",
                  }}
                >
                  <div>
                    <p style={{ fontWeight: 600, fontSize: "0.875rem", margin: 0 }}>{w.name}</p>
                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.75rem", margin: 0 }}>
                      {w.exercises} exercises
                    </p>
                  </div>
                  <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.75rem" }}>
                    {new Date(w.date).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Personal Records */}
        {prs.length > 0 && (
          <div className="card" style={{ marginBottom: "1.25rem" }}>
            <h3 style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "0.75rem" }}>Personal Records</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {prs.map((pr) => (
                <div
                  key={pr.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0.625rem 0.875rem",
                    borderRadius: "0.625rem",
                    background: "rgba(34,197,94,0.06)",
                    border: "1px solid rgba(34,197,94,0.1)",
                  }}
                >
                  <div>
                    <p style={{ fontWeight: 600, fontSize: "0.875rem", margin: 0 }}>{pr.exercise}</p>
                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.75rem", margin: 0 }}>
                      {new Date(pr.date).toLocaleDateString()}
                    </p>
                  </div>
                  <span style={{ color: "var(--gr)", fontWeight: 700, fontSize: "0.9rem" }}>{pr.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sign Out */}
        <button
          className="btn-ghost"
          onClick={() => signOut({ callbackUrl: "/" })}
          style={{ width: "100%", color: "#ef4444", borderColor: "rgba(239,68,68,0.2)" }}
        >
          Sign Out
        </button>
      </main>
    </>
  );
}
