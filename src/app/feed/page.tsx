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

interface DemoPost extends FeedPost {
  emoji: string;
  heroNumber: string;
  heroSubtitle: string;
  heroSubSubtitle: string;
  heroGradient: string;
  location: string;
  locationEmoji: string;
  equipment: string;
  timeLabel: string;
  volume: string;
  sets: string;
  time: string;
  fourthStatLabel: string;
  fourthStatValue: string;
  comments: number;
  avatarGradient: string;
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
const dmSans = { fontFamily: "'DM Sans', sans-serif" };

const DEMO_POSTS: DemoPost[] = [
  {
    id: "demo_1",
    userName: "Marcus R.",
    caption: "Topped my bench PR today. FitForge plan built exactly around my equipment. Numbers don't lie \u{1F4AA}",
    likes: 247,
    liked: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    isDemo: true,
    emoji: "\u{1F3C6}",
    heroNumber: "120",
    heroSubtitle: "KG BENCH PR",
    heroSubSubtitle: "New personal record",
    heroGradient: "linear-gradient(135deg, var(--og), var(--og2), var(--pm))",
    location: "Equinox HY",
    locationEmoji: "\u{1F3CB}\uFE0F",
    equipment: "Barbell + Bench",
    timeLabel: "2h ago",
    volume: "14,200kg",
    sets: "18",
    time: "72 min",
    fourthStatLabel: "NEW PR",
    fourthStatValue: "120kg Bench",
    comments: 3,
    avatarGradient: "linear-gradient(135deg, var(--og), var(--og2))",
  },
  {
    id: "demo_2",
    userName: "Sofia Chen",
    caption: "Two weeks straight! Home gym setup is all you need. The FitForge streak system keeps me going \u{1F525}",
    likes: 189,
    liked: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    isDemo: true,
    emoji: "\u{1F3C5}",
    heroNumber: "14",
    heroSubtitle: "DAY STREAK",
    heroSubSubtitle: "Home gym program",
    heroGradient: "linear-gradient(135deg, #166534, var(--gr), #16a34a)",
    location: "Home Gym",
    locationEmoji: "\u{1F3E0}",
    equipment: "Dumbbells + Bands",
    timeLabel: "4h ago",
    volume: "8,400kg",
    sets: "16",
    time: "48 min",
    fourthStatLabel: "STREAK",
    fourthStatValue: "14\u{1F525}",
    comments: 8,
    avatarGradient: "linear-gradient(135deg, #166534, var(--gr))",
  },
  {
    id: "demo_3",
    userName: "Jordan Park",
    caption: "Monster push day. Bench, incline, cable fly. The equipment-first approach means every exercise hits right.",
    likes: 312,
    liked: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    isDemo: true,
    emoji: "\u{1F4AA}",
    heroNumber: "BUILD",
    heroSubtitle: "MUSCLE",
    heroSubSubtitle: "Workout complete",
    heroGradient: "linear-gradient(135deg, #1e40af, #3b82f6, #60a5fa)",
    location: "CrossFit Box",
    locationEmoji: "\u{1F3CB}\uFE0F",
    equipment: "Full Gym",
    timeLabel: "6h ago",
    volume: "22,100kg",
    sets: "24",
    time: "85 min",
    fourthStatLabel: "GOAL",
    fourthStatValue: "Build Muscle",
    comments: 5,
    avatarGradient: "linear-gradient(135deg, #1e40af, #3b82f6)",
  },
  {
    id: "demo_4",
    userName: "Emma Johnson",
    caption: "Day 1 done! Earned my First Rep achievement \u{1F3C6} FitForge made it so easy to get started.",
    likes: 156,
    liked: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    isDemo: true,
    emoji: "\u{1F947}",
    heroNumber: "FIRST",
    heroSubtitle: "REP ACHIEVEMENT",
    heroSubSubtitle: "Welcome to FitForge",
    heroGradient: "linear-gradient(135deg, var(--og), #f59e0b, var(--og2))",
    location: "Planet Fitness",
    locationEmoji: "\u{1F3E2}",
    equipment: "Bodyweight + Dumbbells",
    timeLabel: "1d ago",
    volume: "3,200kg",
    sets: "12",
    time: "35 min",
    fourthStatLabel: "BADGE",
    fourthStatValue: "First Rep \u{1F947}",
    comments: 12,
    avatarGradient: "linear-gradient(135deg, var(--og), #f59e0b)",
  },
  {
    id: "demo_5",
    userName: "Alex Thompson",
    caption: "Finished my first full 5-day split. Premium was worth every penny. Already seeing definition.",
    likes: 203,
    liked: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    isDemo: true,
    emoji: "\u{1F4AA}",
    heroNumber: "5-DAY",
    heroSubtitle: "SPLIT COMPLETE",
    heroSubSubtitle: "Full program finished",
    heroGradient: "linear-gradient(135deg, var(--pm), var(--pl), var(--og2))",
    location: "Home Gym",
    locationEmoji: "\u{1F3E0}",
    equipment: "Dumbbells + Bench + Bands",
    timeLabel: "1d ago",
    volume: "18,500kg",
    sets: "20",
    time: "65 min",
    fourthStatLabel: "PROGRAM",
    fourthStatValue: "5-Day Split",
    comments: 7,
    avatarGradient: "linear-gradient(135deg, var(--pm), var(--pl))",
  },
];

function isDemoPost(post: FeedPost | DemoPost): post is DemoPost {
  return !!(post as DemoPost).heroNumber;
}

export default function FeedPage() {
  const { data: session, status } = useSession();
  const [posts, setPosts] = useState<(FeedPost | DemoPost)[]>([]);
  const [postText, setPostText] = useState("");
  const [posting, setPosting] = useState(false);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [followedUsers, setFollowedUsers] = useState<Set<string>>(new Set());
  const [commentCounts] = useState<Record<string, number>>({});

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

  function handleFollow(userName: string) {
    setFollowedUsers(prev => {
      const next = new Set(prev);
      if (next.has(userName)) next.delete(userName);
      else next.add(userName);
      return next;
    });
  }

  const isAuth = status === "authenticated";

  // Shared styles
  const statBoxStyle: React.CSSProperties = {
    flex: 1,
    textAlign: "center" as const,
    padding: "10px 4px",
  };
  const statValueStyle: React.CSSProperties = {
    ...bebasNeue,
    fontSize: "18px",
    color: "var(--whi)",
    lineHeight: 1.1,
  };
  const statLabelStyle: React.CSSProperties = {
    fontSize: "9px",
    fontWeight: 600,
    letterSpacing: "1.5px",
    textTransform: "uppercase" as const,
    color: "var(--whm)",
    marginTop: "2px",
  };
  const actionBtnStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "6px 12px",
    borderRadius: "8px",
    border: "none",
    background: "transparent",
    color: "var(--whm)",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 500,
    transition: "all 0.2s",
    ...dmSans,
  };

  function renderDemoCard(post: DemoPost) {
    const isLiked = likedIds.has(post.id);
    const displayLikes = post.likes + (isLiked ? 1 : 0);
    const isFollowed = followedUsers.has(post.userName);

    return (
      <div key={post.id} className="card" style={{ overflow: "hidden" }}>
        {/* Hero Card */}
        <div style={{
          background: post.heroGradient,
          padding: "32px 24px 28px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Subtle pattern overlay */}
          <div style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(0,0,0,0.15) 0%, transparent 50%)",
            pointerEvents: "none",
          }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ fontSize: "36px", marginBottom: "4px" }}>{post.emoji}</div>
            <div style={{
              ...bebasNeue,
              fontSize: "64px",
              lineHeight: 1,
              color: "#fff",
              textShadow: "0 2px 20px rgba(0,0,0,0.3)",
            }}>
              {post.heroNumber}
            </div>
            <div style={{
              ...bebasNeue,
              fontSize: "20px",
              letterSpacing: "4px",
              color: "rgba(255,255,255,0.9)",
              marginTop: "2px",
            }}>
              {post.heroSubtitle}
            </div>
            <div style={{
              fontSize: "12px",
              fontWeight: 400,
              color: "rgba(255,255,255,0.7)",
              marginTop: "6px",
              ...dmSans,
            }}>
              {post.heroSubSubtitle}
            </div>
          </div>
        </div>

        {/* User Info Row */}
        <div style={{ padding: "14px 18px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {/* Avatar */}
            <div style={{
              width: "38px",
              height: "38px",
              borderRadius: "50%",
              background: post.avatarGradient,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
              fontWeight: 700,
              color: "#fff",
              flexShrink: 0,
            }}>
              {getInitials(post.userName)}
            </div>
            {/* Name + info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <span style={{ fontWeight: 600, fontSize: "14px" }}>{post.userName}</span>
                <span style={{ fontSize: "13px", color: "#3b82f6" }}>{"\u2713"}</span>
              </div>
              <div style={{ fontSize: "11px", color: "var(--whm)", fontWeight: 400, marginTop: "1px" }}>
                {post.locationEmoji} {post.location} · {post.equipment} · {post.timeLabel}
              </div>
            </div>
            {/* Follow Button */}
            <button
              onClick={() => handleFollow(post.userName)}
              style={{
                padding: "7px 16px",
                borderRadius: "100px",
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "1px",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "all 0.2s",
                flexShrink: 0,
                ...dmSans,
                ...(isFollowed
                  ? {
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      color: "var(--whm)",
                    }
                  : {
                      background: "linear-gradient(135deg, var(--pm), #3b1a5e)",
                      border: "1px solid rgba(155,94,203,0.4)",
                      color: "#fff",
                    }
                ),
              }}
            >
              {isFollowed ? "Following" : "Follow"}
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div style={{
          display: "flex",
          margin: "14px 18px 0",
          borderRadius: "12px",
          border: "1px solid var(--br)",
          overflow: "hidden",
          background: "var(--whh)",
        }}>
          <div style={statBoxStyle}>
            <div style={statValueStyle}>{post.volume}</div>
            <div style={statLabelStyle}>Volume</div>
          </div>
          <div style={{ width: "1px", background: "var(--br)", alignSelf: "stretch" }} />
          <div style={statBoxStyle}>
            <div style={statValueStyle}>{post.sets}</div>
            <div style={statLabelStyle}>Sets</div>
          </div>
          <div style={{ width: "1px", background: "var(--br)", alignSelf: "stretch" }} />
          <div style={statBoxStyle}>
            <div style={statValueStyle}>{post.time}</div>
            <div style={statLabelStyle}>Time</div>
          </div>
          <div style={{ width: "1px", background: "var(--br)", alignSelf: "stretch" }} />
          <div style={statBoxStyle}>
            <div style={{ ...statValueStyle, fontSize: "14px" }}>{post.fourthStatValue}</div>
            <div style={statLabelStyle}>{post.fourthStatLabel}</div>
          </div>
        </div>

        {/* Caption */}
        <div style={{ padding: "14px 18px 0" }}>
          <p style={{ fontSize: "14px", lineHeight: 1.6, margin: 0, color: "rgba(255,255,255,0.8)", fontWeight: 300 }}>
            {post.caption}
          </p>
        </div>

        {/* Action Row */}
        <div style={{
          display: "flex",
          alignItems: "center",
          padding: "12px 18px 14px",
          gap: "4px",
        }}>
          <button
            onClick={() => handleLike(post.id, post.isDemo)}
            style={{
              ...actionBtnStyle,
              color: isLiked ? "#ef4444" : "var(--whm)",
              background: isLiked ? "rgba(239,68,68,0.1)" : "transparent",
            }}
          >
            {isLiked ? "\u2764\uFE0F" : "\u2661"} {displayLikes}
          </button>
          <button style={actionBtnStyle}>
            {"\uD83D\uDCAC"} {commentCounts[post.id] ?? post.comments}
          </button>
          <div style={{ flex: 1 }} />
          <button style={actionBtnStyle}>
            {"\u{1F517}"}
          </button>
        </div>
      </div>
    );
  }

  function renderApiCard(post: FeedPost) {
    const isLiked = likedIds.has(post.id);
    const displayLikes = post.likes + (isLiked ? 1 : 0);
    const isFollowed = followedUsers.has(post.userName);

    return (
      <div key={post.id} className="card" style={{ overflow: "hidden" }}>
        {/* Hero Card - generic blue for API posts */}
        <div style={{
          background: "linear-gradient(135deg, var(--pm), var(--pl), var(--og2))",
          padding: "28px 24px 24px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)",
            pointerEvents: "none",
          }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ fontSize: "32px", marginBottom: "4px" }}>{"\u{1F4AA}"}</div>
            <div style={{
              ...bebasNeue,
              fontSize: "48px",
              lineHeight: 1,
              color: "#fff",
              textShadow: "0 2px 20px rgba(0,0,0,0.3)",
            }}>
              WORKOUT
            </div>
            <div style={{
              ...bebasNeue,
              fontSize: "18px",
              letterSpacing: "4px",
              color: "rgba(255,255,255,0.85)",
              marginTop: "2px",
            }}>
              COMPLETE
            </div>
            <div style={{
              fontSize: "12px",
              fontWeight: 400,
              color: "rgba(255,255,255,0.65)",
              marginTop: "6px",
              ...dmSans,
            }}>
              FitForge workout logged
            </div>
          </div>
        </div>

        {/* User Info Row */}
        <div style={{ padding: "14px 18px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "38px",
              height: "38px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, var(--pm), var(--og))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
              fontWeight: 700,
              color: "#fff",
              flexShrink: 0,
            }}>
              {getInitials(post.userName)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <span style={{ fontWeight: 600, fontSize: "14px" }}>{post.userName}</span>
              </div>
              <div style={{ fontSize: "11px", color: "var(--whm)", fontWeight: 400, marginTop: "1px" }}>
                {"\u{1F3CB}\uFE0F"} FitForge · {timeAgo(post.createdAt)}
              </div>
            </div>
            <button
              onClick={() => handleFollow(post.userName)}
              style={{
                padding: "7px 16px",
                borderRadius: "100px",
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "1px",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "all 0.2s",
                flexShrink: 0,
                ...dmSans,
                ...(isFollowed
                  ? {
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      color: "var(--whm)",
                    }
                  : {
                      background: "linear-gradient(135deg, var(--pm), #3b1a5e)",
                      border: "1px solid rgba(155,94,203,0.4)",
                      color: "#fff",
                    }
                ),
              }}
            >
              {isFollowed ? "Following" : "Follow"}
            </button>
          </div>
        </div>

        {/* Caption */}
        <div style={{ padding: "14px 18px 0" }}>
          <p style={{ fontSize: "14px", lineHeight: 1.6, margin: 0, color: "rgba(255,255,255,0.8)", fontWeight: 300 }}>
            {post.caption}
          </p>
        </div>

        {/* Action Row */}
        <div style={{
          display: "flex",
          alignItems: "center",
          padding: "12px 18px 14px",
          gap: "4px",
        }}>
          <button
            onClick={() => handleLike(post.id, post.isDemo)}
            style={{
              ...actionBtnStyle,
              color: isLiked ? "#ef4444" : "var(--whm)",
              background: isLiked ? "rgba(239,68,68,0.1)" : "transparent",
            }}
          >
            {isLiked ? "\u2764\uFE0F" : "\u2661"} {displayLikes}
          </button>
          <button style={actionBtnStyle}>
            {"\uD83D\uDCAC"} 0
          </button>
          <div style={{ flex: 1 }} />
          <button style={actionBtnStyle}>
            {"\u{1F517}"}
          </button>
        </div>
      </div>
    );
  }

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
                style={{
                  background: "transparent", border: "none", color: "rgba(255,255,255,.75)",
                  fontSize: "14px", fontWeight: 300, resize: "none", outline: "none",
                  lineHeight: 1.5, width: "100%", ...dmSans,
                }}
              />
              <div style={{
                display: "flex", gap: "0.5rem", justifyContent: "flex-end",
                borderTop: "1px solid var(--br)", marginTop: 10, paddingTop: 10,
              }}>
                <button
                  onClick={handlePost}
                  disabled={posting || !postText.trim()}
                  className="btn-primary"
                  style={{ padding: "8px 18px", fontSize: "11px" }}
                >
                  {posting ? "Posting..." : "Post \u{1F525}"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="auth-cta" style={{ marginBottom: "20px", marginTop: 0 }}>
          <div>
            <p style={{ fontSize: "13px", fontWeight: 600, margin: 0 }}>Create an account to post</p>
            <p style={{ fontSize: "11px", color: "var(--whm)", fontWeight: 300, margin: "4px 0 0" }}>
              Share your PRs and connect with the community.
            </p>
          </div>
          <a href="/login?returnUrl=/feed" className="btn-primary" style={{ textDecoration: "none", padding: "9px 16px", fontSize: "10px" }}>
            Join Free {"\u2192"}
          </a>
        </div>
      )}

      {/* Posts */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {posts.map((post) => {
          if (isDemoPost(post)) {
            return renderDemoCard(post);
          }
          return renderApiCard(post);
        })}
      </div>
    </main>
  );
}
