"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";

interface FeedPost {
  id: string;
  userName: string;
  caption: string;
  likes: number;
  liked: boolean;
  createdAt: string;
  isDemo?: boolean;
}

function getInitials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
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

// Demo posts to make the feed feel alive
const DEMO_POSTS: FeedPost[] = [
  {
    id: "demo_1",
    userName: "Sarah Chen",
    caption: "Just hit a new PR on deadlifts! 225 lbs x 5 reps 🔥💪 Feeling unstoppable today. The grind is paying off! #FitForge #Strength",
    likes: 24,
    liked: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    isDemo: true,
  },
  {
    id: "demo_2",
    userName: "Marcus Rivera",
    caption: "Crushed my Build Muscle workout this morning! 💪 Push-Ups, DB Shoulder Press, Decline Push-Ups + 5 more exercises. Moved 8,400 lbs total. Using Dumbbells, Bench. #FitForge",
    likes: 18,
    liked: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    isDemo: true,
  },
  {
    id: "demo_3",
    userName: "Jordan Park",
    caption: "Week 3 of my 5-day split and I'm already seeing definition in my shoulders 🔥 FitForge workout generator is legit. Bodyweight + bands only!",
    likes: 42,
    liked: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    isDemo: true,
  },
  {
    id: "demo_4",
    userName: "Emma Johnson",
    caption: "First workout done! Starting my fitness journey with FitForge. The gamified tracking makes it so fun — earned 120 XP today 🎮✨ #FirstRep",
    likes: 31,
    liked: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    isDemo: true,
  },
  {
    id: "demo_5",
    userName: "Alex Thompson",
    caption: "7-day streak! 🔥🔥🔥 The streak system keeps me accountable. Today was legs — squats, lunges, glute bridges. Volume: 12,500 lbs. Let's keep it going!",
    likes: 56,
    liked: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    isDemo: true,
  },
  {
    id: "demo_6",
    userName: "Priya Sharma",
    caption: "Just unlocked the 'Ten Strong' achievement — 10 workouts completed! 🏆 Love how FitForge tracks everything automatically. Next goal: Committed (25 workouts).",
    likes: 29,
    liked: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    isDemo: true,
  },
];

const AVATAR_GRADIENTS = [
  "linear-gradient(135deg, var(--pm), var(--og))",
  "linear-gradient(135deg, #4a1a6a, #8a3ab0)",
  "linear-gradient(135deg, #1a6a4a, #3ab080)",
  "linear-gradient(135deg, #6a1a1a, #b03a3a)",
  "linear-gradient(135deg, var(--oe), var(--og2))",
  "linear-gradient(135deg, #1a4a6a, #3a80b0)",
];

export default function FeedPage() {
  const { data: session, status } = useSession();
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [postText, setPostText] = useState("");
  const [posting, setPosting] = useState(false);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());

  const fetchPosts = useCallback(async () => {
    try {
      const res = await fetch("/api/feed");
      if (res.ok) {
        const data = await res.json();
        const apiPosts: FeedPost[] = (Array.isArray(data) ? data : data.posts ?? []).map((p: Record<string, unknown>) => ({
          id: p.id as string,
          userName: (p.userName as string) || "Athlete",
          caption: p.caption as string,
          likes: (p.likes as number) || 0,
          liked: false,
          createdAt: p.createdAt as string,
        }));
        // Merge real posts + demo posts (demo only if no real posts cover it)
        setPosts([...apiPosts, ...DEMO_POSTS]);
      } else {
        setPosts(DEMO_POSTS);
      }
    } catch {
      setPosts(DEMO_POSTS);
    }
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

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
    } catch { /* silently fail */ }
    setPosting(false);
  }

  async function handleLike(postId: string, isDemo?: boolean) {
    setLikedIds(prev => {
      const next = new Set(prev);
      if (next.has(postId)) next.delete(postId);
      else next.add(postId);
      return next;
    });

    if (!isDemo) {
      try {
        await fetch("/api/feed", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "like", postId }),
        });
      } catch { /* silently fail */ }
    }
  }

  const isAuth = status === "authenticated";

  return (
    <main style={{ maxWidth: "560px", margin: "0 auto", padding: "20px 16px 60px" }}>
      <h1 style={{ ...bebasNeue, fontSize: "36px", marginBottom: "22px" }}>
        <span className="text-gradient-white">FIT</span>
        <span className="text-gradient-brand">FEED</span>
      </h1>

      {/* Post Composer or Auth CTA */}
      {isAuth ? (
        <div className="card" style={{ padding: "18px", marginBottom: "20px", borderColor: "rgba(224,120,48,.18)" }}>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <div style={{
              width: "38px", height: "38px", borderRadius: "50%",
              background: "linear-gradient(135deg, var(--oe), var(--pm))",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "12px", fontWeight: 700, color: "#fff", flexShrink: 0,
            }}>
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
              <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end", borderTop: "1px solid var(--br)", marginTop: 10, paddingTop: 10 }}>
                <button
                  onClick={handlePost}
                  disabled={posting || !postText.trim()}
                  style={{ background: "linear-gradient(135deg,var(--oe),var(--pm))", border: "none", color: "#fff", borderRadius: "100px", padding: "8px 18px", fontSize: "11px", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}
                >
                  {posting ? "Posting..." : "Post 🔥"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{
          background: "linear-gradient(135deg,rgba(120,45,15,.2),rgba(90,45,130,.2))",
          border: "1px solid rgba(224,120,48,.2)", borderRadius: "16px",
          padding: "18px 22px", display: "flex", alignItems: "center",
          justifyContent: "space-between", gap: "16px", flexWrap: "wrap", marginBottom: "20px",
        }}>
          <div>
            <p style={{ fontSize: "13px", fontWeight: 600, margin: 0 }}>Create an account to post</p>
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
        {posts.map((post, idx) => {
          const isLiked = likedIds.has(post.id);
          const displayLikes = post.likes + (isLiked ? 1 : 0);
          const gradientIdx = post.isDemo ? idx % AVATAR_GRADIENTS.length : 0;
          return (
            <div key={post.id} className="card" style={{ padding: "18px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                <div style={{
                  width: "2.25rem", height: "2.25rem", borderRadius: "50%",
                  background: AVATAR_GRADIENTS[gradientIdx],
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.7rem", fontWeight: 700, color: "#fff", flexShrink: 0,
                }}>
                  {getInitials(post.userName)}
                </div>
                <div>
                  <p style={{ fontWeight: 600, fontSize: "0.9rem", margin: 0 }}>{post.userName}</p>
                  <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.75rem", margin: 0 }}>
                    {timeAgo(post.createdAt)}
                  </p>
                </div>
              </div>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.6, margin: "0 0 0.75rem", overflowWrap: "break-word" }}>
                {post.caption}
              </p>
              <button
                onClick={() => handleLike(post.id, post.isDemo)}
                style={{
                  display: "inline-flex", alignItems: "center", gap: "0.375rem",
                  padding: "0.375rem 0.75rem", borderRadius: "0.5rem", border: "none",
                  background: isLiked ? "rgba(239,68,68,0.12)" : "rgba(255,255,255,0.04)",
                  color: isLiked ? "#ef4444" : "rgba(255,255,255,0.5)",
                  cursor: "pointer", fontSize: "0.8rem", fontWeight: 600, transition: "all 0.2s",
                }}
              >
                {isLiked ? "❤️" : "♡"} {displayLikes}
              </button>
            </div>
          );
        })}
      </div>
    </main>
  );
}
