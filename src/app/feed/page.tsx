"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";


interface FeedPost {
  id: string;
  user: { name: string; image?: string };
  caption: string;
  workout?: { name: string; exercises: number; duration: string };
  likes: number;
  liked: boolean;
  createdAt: string;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function timeAgo(dateStr: string) {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const bebasNeue = { fontFamily: "'Bebas Neue', sans-serif" };

export default function FeedPage() {
  const { data: session, status } = useSession();
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [postText, setPostText] = useState("");
  const [posting, setPosting] = useState(false);

  const fetchPosts = useCallback(async () => {
    try {
      const res = await fetch("/api/feed");
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts ?? data ?? []);
      }
    } catch {
      // silently fail
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  async function handlePost() {
    if (!postText.trim()) return;
    setPosting(true);
    try {
      const res = await fetch("/api/feed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caption: postText }),
      });
      if (res.ok) {
        setPostText("");
        fetchPosts();
      }
    } catch {
      // silently fail
    } finally {
      setPosting(false);
    }
  }

  async function handleLike(postId: string) {
    try {
      await fetch("/api/feed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "like", postId }),
      });
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
            : p
        )
      );
    } catch {
      // silently fail
    }
  }

  const isAuth = status === "authenticated";

  return (
    <>
      <main style={{ maxWidth: "560px", margin: "0 auto", padding: "20px 16px 60px" }}>
        {/* Header */}
        <h1 style={{ ...bebasNeue, fontSize: "36px", marginBottom: "22px" }}>
          <span className="text-gradient-white">FIT</span>
          <span className="text-gradient-brand">FEED</span>
        </h1>

        {/* Post Composer or Auth CTA */}
        {isAuth ? (
          <div className="card" style={{ padding: "18px", marginBottom: "20px", borderColor: "rgba(224,120,48,.18)" }}>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <div
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, var(--oe), var(--pm))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#fff",
                  flexShrink: 0,
                }}
              >
                {session?.user?.name ? getInitials(session.user.name) : "ME"}
              </div>
              <div style={{ flex: 1 }}>
                <textarea
                  placeholder="Share your workout, PR, or progress..."
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                  rows={2}
                  style={{ background: "transparent", border: "none", color: "rgba(255,255,255,.75)", fontSize: "14px", fontWeight: 300, resize: "none", outline: "none", lineHeight: 1.5, width: "100%", fontFamily: "'DM Sans', sans-serif" }}
                />
                <div style={{ display: "flex", gap: "0.5rem", justifyContent: "space-between", borderTop: "1px solid var(--br)", marginTop: 10, paddingTop: 10 }}>
                  <button style={{ background: "rgba(224,120,48,.1)", border: "1px solid rgba(224,120,48,.2)", color: "var(--og)", borderRadius: "100px", padding: "6px 12px", fontSize: "11px", fontWeight: 600, cursor: "pointer" }}>
                    💪 Attach Workout
                  </button>
                  <button
                    onClick={handlePost}
                    disabled={posting || !postText.trim()}
                    style={{ background: "linear-gradient(135deg,var(--oe),var(--pm))", border: "none", color: "#fff", borderRadius: "100px", padding: "8px 18px", fontSize: "11px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase" as const, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}
                  >
                    {posting ? "Posting..." : "Post 🔥"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div
            style={{
              background: "linear-gradient(135deg,rgba(120,45,15,.2),rgba(90,45,130,.2))",
              border: "1px solid rgba(224,120,48,.2)",
              borderRadius: "16px",
              padding: "18px 22px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "16px",
              flexWrap: "wrap" as const,
              marginBottom: "20px",
            }}
          >
            <div>
              <p style={{ fontSize: "13px", fontWeight: 600, margin: 0 }}>
                Create an account to post
              </p>
              <p style={{ fontSize: "11px", color: "var(--whm)", fontWeight: 300, margin: "4px 0 0" }}>
                Share your PRs and connect with the community.
              </p>
            </div>
            <a href="/login?returnUrl=/feed" className="btn-primary" style={{ textDecoration: "none", padding: "9px 16px", fontSize: "10px" }}>
              Join Free →
            </a>
          </div>
        )}

        {/* Posts */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {posts.length === 0 && (
            <div style={{ textAlign: "center", padding: "3rem 1rem", color: "rgba(255,255,255,0.35)" }}>
              <p style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>No posts yet</p>
              <p style={{ fontSize: "0.9rem" }}>Be the first to share your workout!</p>
            </div>
          )}

          {posts.map((post) => (
            <div key={post.id} className="card" style={{ padding: "18px" }}>
              {/* Post Header */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                <div
                  style={{
                    width: "2.25rem",
                    height: "2.25rem",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, var(--pm), var(--og))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    color: "#fff",
                    flexShrink: 0,
                  }}
                >
                  {getInitials(post.user.name)}
                </div>
                <div>
                  <p style={{ fontWeight: 600, fontSize: "0.9rem", margin: 0 }}>{post.user.name}</p>
                  <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.75rem", margin: 0 }}>
                    {timeAgo(post.createdAt)}
                  </p>
                </div>
              </div>

              {/* Caption */}
              <p style={{ fontSize: "0.95rem", lineHeight: 1.6, margin: "0 0 0.75rem", overflowWrap: "break-word" }}>
                {post.caption}
              </p>

              {/* Attached Workout */}
              {post.workout && (
                <div
                  style={{
                    padding: "0.75rem 1rem",
                    borderRadius: "0.625rem",
                    background: "rgba(34,197,94,0.08)",
                    border: "1px solid rgba(34,197,94,0.15)",
                    marginBottom: "0.75rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <span style={{ fontSize: "1.25rem" }}>&#x1F4AA;</span>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: "0.85rem", margin: 0 }}>{post.workout.name}</p>
                    <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.75rem", margin: 0 }}>
                      {post.workout.exercises} exercises &middot; {post.workout.duration}
                    </p>
                  </div>
                </div>
              )}

              {/* Like Button */}
              <button
                onClick={() => handleLike(post.id)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.375rem",
                  padding: "0.375rem 0.75rem",
                  borderRadius: "0.5rem",
                  border: "none",
                  background: post.liked ? "rgba(239,68,68,0.12)" : "rgba(255,255,255,0.04)",
                  color: post.liked ? "#ef4444" : "rgba(255,255,255,0.5)",
                  cursor: "pointer",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  transition: "all 0.2s",
                }}
              >
                {post.liked ? "\u2764\uFE0F" : "\u2661"} {post.likes}
              </button>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
