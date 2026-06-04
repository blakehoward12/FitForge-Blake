"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";

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

const AVATARS = [
  "/img/generated/avatar1.jpg",
  "/img/generated/avatar2.jpg",
  "/img/generated/avatar3.jpg",
  "/img/generated/avatar4.jpg",
  "/img/generated/avatar5.jpg",
  "/img/generated/avatar6.jpg",
];

// Deterministically map a user name to one of the six headshots so the same
// athlete always gets the same face across the feed.
function avatarFor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  return AVATARS[hash % AVATARS.length];
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
    locationEmoji: "\u{1F3CB}️",
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
    locationEmoji: "\u{1F3CB}️",
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

// Assign demo posts avatars in order, then map any other name deterministically.
const DEMO_AVATAR_BY_NAME: Record<string, string> = DEMO_POSTS.reduce(
  (acc, post, i) => {
    acc[post.userName] = AVATARS[i % AVATARS.length];
    return acc;
  },
  {} as Record<string, string>,
);

function avatarForPost(name: string) {
  return DEMO_AVATAR_BY_NAME[name] ?? avatarFor(name);
}

function isDemoPost(post: FeedPost | DemoPost): post is DemoPost {
  return !!(post as DemoPost).heroNumber;
}

// Circular next/image avatar — positioned, fixed-size, overflow-hidden.
function Avatar({ src, name, size = 38 }: { src: string; name: string; size?: number }) {
  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        borderRadius: "50%",
        overflow: "hidden",
        flexShrink: 0,
        border: "1px solid var(--br)",
        background: "var(--whh)",
      }}
    >
      <Image src={src} alt={name} fill sizes={`${size}px`} className="object-cover" />
    </div>
  );
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
    padding: "12px 4px",
  };
  const statValueStyle: React.CSSProperties = {
    ...bebasNeue,
    fontSize: "19px",
    color: "var(--whi)",
    lineHeight: 1.1,
  };
  const statLabelStyle: React.CSSProperties = {
    fontSize: "9px",
    fontWeight: 600,
    letterSpacing: "1.5px",
    textTransform: "uppercase" as const,
    color: "var(--whm)",
    marginTop: "3px",
  };
  const actionBtnStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "7px 13px",
    borderRadius: "100px",
    border: "1px solid transparent",
    background: "transparent",
    color: "var(--whm)",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 500,
    transition: "all 0.2s",
    ...dmSans,
  };

  function followButton(userName: string) {
    const isFollowed = followedUsers.has(userName);
    return (
      <button
        onClick={() => handleFollow(userName)}
        style={{
          padding: "7px 16px",
          borderRadius: "100px",
          fontSize: "12px",
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
                background: "linear-gradient(135deg, var(--og), var(--og2), var(--pm))",
                border: "1px solid rgba(224,120,48,0.4)",
                color: "#fff",
              }),
        }}
      >
        {isFollowed ? "Following" : "Follow"}
      </button>
    );
  }

  function actionRow(post: FeedPost | DemoPost, displayLikes: number, isLiked: boolean, comments: number) {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        padding: "12px 18px 16px",
        gap: "6px",
      }}>
        <button
          onClick={() => handleLike(post.id, post.isDemo)}
          style={{
            ...actionBtnStyle,
            color: isLiked ? "#ef4444" : "var(--whm)",
            background: isLiked ? "rgba(239,68,68,0.1)" : "rgba(255,255,255,0.04)",
            borderColor: isLiked ? "rgba(239,68,68,0.25)" : "var(--br)",
          }}
        >
          {isLiked ? "❤️" : "♡"} {displayLikes}
        </button>
        <button style={{ ...actionBtnStyle, background: "rgba(255,255,255,0.04)", borderColor: "var(--br)" }}>
          {"💬"} {comments}
        </button>
        <div style={{ flex: 1 }} />
        <button style={{ ...actionBtnStyle, background: "rgba(255,255,255,0.04)", borderColor: "var(--br)" }}>
          {"\u{1F517}"} Share
        </button>
      </div>
    );
  }

  function renderDemoCard(post: DemoPost) {
    const isLiked = likedIds.has(post.id);
    const displayLikes = post.likes + (isLiked ? 1 : 0);

    return (
      <div key={post.id} className="card animate-fadeUp" style={{ padding: 0 }}>
        {/* Hero stat block */}
        <div style={{
          background: post.heroGradient,
          padding: "34px 24px 30px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(circle at 30% 15%, rgba(255,255,255,0.16) 0%, transparent 55%), radial-gradient(circle at 75% 90%, rgba(0,0,0,0.22) 0%, transparent 55%)",
            pointerEvents: "none",
          }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ fontSize: "34px", marginBottom: "6px" }}>{post.emoji}</div>
            <div style={{
              ...bebasNeue,
              fontSize: "66px",
              lineHeight: 0.95,
              color: "#fff",
              textShadow: "0 2px 24px rgba(0,0,0,0.35)",
            }}>
              {post.heroNumber}
            </div>
            <div style={{
              ...bebasNeue,
              fontSize: "21px",
              letterSpacing: "4px",
              color: "rgba(255,255,255,0.92)",
              marginTop: "2px",
            }}>
              {post.heroSubtitle}
            </div>
            <div style={{
              fontSize: "12px",
              fontWeight: 400,
              color: "rgba(255,255,255,0.72)",
              marginTop: "8px",
              ...dmSans,
            }}>
              {post.heroSubSubtitle}
            </div>
          </div>
        </div>

        {/* User Info Row */}
        <div style={{ padding: "16px 18px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "11px" }}>
            <Avatar src={avatarForPost(post.userName)} name={post.userName} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <span style={{ fontWeight: 600, fontSize: "14px" }}>{post.userName}</span>
                <span style={{ fontSize: "13px", color: "var(--og)" }}>{"✓"}</span>
              </div>
              <div style={{ fontSize: "12px", color: "var(--whm)", fontWeight: 400, marginTop: "1px" }}>
                {post.locationEmoji} {post.location} · {post.equipment} · {post.timeLabel}
              </div>
            </div>
            {followButton(post.userName)}
          </div>
        </div>

        {/* Stats Row */}
        <div style={{
          display: "flex",
          margin: "16px 18px 0",
          borderRadius: "14px",
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
        <div style={{ padding: "16px 18px 0" }}>
          <p style={{ fontSize: "14px", lineHeight: 1.65, margin: 0, color: "rgba(255,255,255,0.82)", fontWeight: 300 }}>
            {post.caption}
          </p>
        </div>

        {actionRow(post, displayLikes, isLiked, commentCounts[post.id] ?? post.comments)}
      </div>
    );
  }

  function renderApiCard(post: FeedPost) {
    const isLiked = likedIds.has(post.id);
    const displayLikes = post.likes + (isLiked ? 1 : 0);

    return (
      <div key={post.id} className="card animate-fadeUp" style={{ padding: 0 }}>
        {/* Hero stat block */}
        <div style={{
          background: "linear-gradient(135deg, var(--og), var(--og2), var(--pm))",
          padding: "30px 24px 26px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(circle at 30% 15%, rgba(255,255,255,0.16) 0%, transparent 55%)",
            pointerEvents: "none",
          }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ fontSize: "32px", marginBottom: "4px" }}>{"\u{1F4AA}"}</div>
            <div style={{
              ...bebasNeue,
              fontSize: "50px",
              lineHeight: 1,
              color: "#fff",
              textShadow: "0 2px 24px rgba(0,0,0,0.35)",
            }}>
              WORKOUT
            </div>
            <div style={{
              ...bebasNeue,
              fontSize: "19px",
              letterSpacing: "4px",
              color: "rgba(255,255,255,0.9)",
              marginTop: "2px",
            }}>
              COMPLETE
            </div>
            <div style={{
              fontSize: "12px",
              fontWeight: 400,
              color: "rgba(255,255,255,0.7)",
              marginTop: "8px",
              ...dmSans,
            }}>
              FitForge workout logged
            </div>
          </div>
        </div>

        {/* User Info Row */}
        <div style={{ padding: "16px 18px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "11px" }}>
            <Avatar src={avatarForPost(post.userName)} name={post.userName} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <span style={{ fontWeight: 600, fontSize: "14px" }}>{post.userName}</span>
              </div>
              <div style={{ fontSize: "12px", color: "var(--whm)", fontWeight: 400, marginTop: "1px" }}>
                {"\u{1F3CB}️"} FitForge · {timeAgo(post.createdAt)}
              </div>
            </div>
            {followButton(post.userName)}
          </div>
        </div>

        {/* Caption */}
        <div style={{ padding: "16px 18px 0" }}>
          <p style={{ fontSize: "14px", lineHeight: 1.65, margin: 0, color: "rgba(255,255,255,0.82)", fontWeight: 300 }}>
            {post.caption}
          </p>
        </div>

        {actionRow(post, displayLikes, isLiked, 0)}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "560px", margin: "0 auto", padding: "32px 16px 60px" }}>
      {/* Branded page header */}
      <header style={{ marginBottom: "26px" }} className="animate-fadeUp">
        <span className="chip" style={{ marginBottom: "14px", display: "inline-block" }}>The social feed</span>
        <h1 style={{ ...bebasNeue, fontSize: "clamp(44px,12vw,64px)", lineHeight: 0.9, letterSpacing: "1px", margin: 0 }}>
          <span className="text-gradient-white">THE </span>
          <span className="text-gradient-brand">FITFEED</span>
        </h1>
        <p style={{ fontSize: "14px", lineHeight: 1.6, fontWeight: 300, color: "var(--whm)", marginTop: "10px", maxWidth: "420px" }}>
          Real PRs, real streaks, real people. Follow the athletes who push you and
          celebrate every rep with your crew.
        </p>
      </header>

      {/* Post Composer or Auth CTA */}
      {isAuth ? (
        <div className="card animate-fadeUp" style={{ padding: "18px", marginBottom: "20px", borderColor: "rgba(224,120,48,.18)" }}>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <Avatar
              src={session?.user?.image || avatarFor(session?.user?.name || "avatar2")}
              name={session?.user?.name || "You"}
            />
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
                  style={{ padding: "8px 18px", fontSize: "12px" }}
                >
                  {posting ? "Posting..." : "Post \u{1F525}"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="auth-cta animate-fadeUp" style={{ marginBottom: "20px", marginTop: 0 }}>
          <div>
            <p style={{ fontSize: "13px", fontWeight: 600, margin: 0 }}>Create an account to post</p>
            <p style={{ fontSize: "12px", color: "var(--whm)", fontWeight: 300, margin: "4px 0 0" }}>
              Share your PRs and connect with the community.
            </p>
          </div>
          <a href="/login?returnUrl=/feed" className="btn-primary" style={{ textDecoration: "none", padding: "9px 16px", fontSize: "12px" }}>
            Join Free {"→"}
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

      {/* Supporting content */}
      <section style={{ marginTop: "44px", paddingTop: "32px", borderTop: "1px solid var(--br)" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", color: "rgba(255,255,255,.55)", fontWeight: 300, fontSize: "15px", lineHeight: 1.8 }}>
          <h2 style={{ ...bebasNeue, fontSize: "clamp(24px,7vw,32px)", color: "#fff", lineHeight: 1 }}>About the FitForge social feed</h2>
          <p>
            Progress is easier when you&apos;re not doing it alone. The FitFeed is where the FitForge community shares
            personal records, workout wins, and day-to-day progress — the real, unfiltered grind, not highlight-reel
            perfection. It&apos;s built to keep you motivated by people who are actually putting in the work.
          </p>
          <p>
            Follow athletes who push you, react to their PRs, and post your own milestones straight from the tracker
            the moment you finish a session. Every workout you complete can be shared with a tap, complete with the
            volume, sets, and XP you earned — so your crew can celebrate the win with you and you can return the favor.
          </p>
          <p>
            Friendly competition is part of the fun: challenge friends, chase streaks together, and stay accountable
            when motivation dips. Whether you train at a packed commercial gym or alone in your garage, the feed makes
            sure there&apos;s always a crew behind you.
          </p>
          <p>
            Every post is tied to a real, completed workout, so what you see is genuine effort rather than staged
            content. Hit a new bench press personal record, finish a brutal conditioning circuit, or simply close out
            a tough week — share it in a tap and let the community cheer you on. Over time, your profile becomes a
            visual history of how far you&apos;ve come: streaks, PRs, achievements, and total volume moved.
          </p>
          <p>
            You decide who you follow and what you share. Keep it to a tight circle of training partners for
            accountability, or follow athletes across strength, hypertrophy, fat loss, mobility, and conditioning for
            fresh ideas and motivation. The result is a feed that actually helps you train — not another infinite
            scroll designed to waste your time. Create a free account to start posting, following, and challenging
            your friends today.
          </p>
        </div>
      </section>
    </div>
  );
}
