"use client";

import { useState, useEffect, Suspense } from "react";
import { signIn, useSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const returnUrl = searchParams.get("returnUrl") || "/builder";

  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if already signed in
  useEffect(() => {
    if (status === "authenticated") {
      router.replace(returnUrl);
    }
  }, [status, router, returnUrl]);

  if (status === "loading" || status === "authenticated") {
    return (
      <div style={{ minHeight: "calc(100vh - 3.5rem)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "rgba(255,255,255,0.4)" }}>Loading...</p>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
        name: mode === "signup" ? name : "",
        isSignUp: mode === "signup" ? "true" : "false",
      });

      if (res?.error) {
        setError(res.error === "CredentialsSignin" ? "Invalid email or password." : res.error);
      } else {
        router.push(returnUrl);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const bebasNeue = { fontFamily: "'Bebas Neue', sans-serif" };

  const iconStyle: React.CSSProperties = {
    position: "absolute",
    left: "14px",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "13px",
    color: "var(--whm)",
    pointerEvents: "none",
  };

  const avatarImgs = ["/img/generated/avatar1.jpg", "/img/generated/avatar2.jpg", "/img/generated/avatar3.jpg", "/img/generated/avatar4.jpg"];

  return (
    <>
      <div className="-mt-[62px] min-h-[100svh] grid grid-cols-1 md:grid-cols-2">
        {/* Visual panel */}
        <div className="relative hidden md:block overflow-hidden">
          <Image src="/img/generated/login-side.jpg" alt="Athlete training hard in a dark gym" fill priority sizes="50vw" className="object-cover object-top" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(10,10,15,.5) 0%, rgba(10,10,15,.15) 45%, rgba(10,10,15,.9) 100%)" }} />
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 20% 90%, rgba(120,45,15,.4) 0%, transparent 55%)" }} />
          <div className="absolute bottom-0 left-0 right-0 p-12">
            <h2 className="text-white whitespace-pre-line" style={{ ...bebasNeue, fontSize: "clamp(40px,4vw,60px)", lineHeight: 0.92 }}>
              <span className="text-gradient-white">YOUR NEXT PR</span>
              <br /><span className="text-gradient-brand">STARTS HERE</span>
            </h2>
            <p className="mt-4 max-w-[360px] text-[14px] font-light leading-[1.7]" style={{ color: "rgba(255,255,255,.6)" }}>
              Set your goals, train with guided workouts, earn XP, and forge alongside a community that shows up.
            </p>
          </div>
        </div>

        {/* Form panel */}
        <div className="flex items-center justify-center px-5 py-[90px] md:py-12 relative">
        <div style={{ width: "100%", maxWidth: "420px" }}>
          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: "36px" }}>
            <h1 style={{ display: "inline-flex", alignItems: "baseline", gap: "3px", margin: 0 }}>
              <span style={{ ...bebasNeue, fontSize: "28px", letterSpacing: "3px", color: "#fff" }}>
                FIT
              </span>
              <span
                style={{
                  ...bebasNeue,
                  fontSize: "28px",
                  letterSpacing: "3px",
                  background: "linear-gradient(135deg, var(--og), var(--og2), var(--pm))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                FORGE
              </span>
            </h1>
            <p style={{ color: "rgba(255,255,255,.4)", fontSize: "13px", marginTop: "8px", fontWeight: 300 }}>
              Join 500+ people already forging.
            </p>
          </div>

          {/* Card */}
          <div className="card" style={{ padding: "32px 28px" }}>
            {/* Tab Switcher */}
            <div
              style={{
                display: "flex",
                borderRadius: "100px",
                background: "rgba(255,255,255,0.04)",
                padding: "4px",
                marginBottom: "26px",
              }}
            >
              {(["signin", "signup"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => { setMode(m); setError(""); }}
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: "100px",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "12px",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    fontWeight: 600,
                    background: mode === m ? "linear-gradient(135deg, var(--oe), var(--pm))" : "transparent",
                    color: mode === m ? "#fff" : "var(--whm)",
                    transition: "all 0.2s",
                  }}
                >
                  {m === "signin" ? "Sign In" : "Create Account"}
                </button>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {mode === "signup" && (
                <input
                  className="input-field"
                  type="text"
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              )}
              <div style={{ position: "relative" }}>
                <span style={iconStyle}>✉</span>
                <input
                  className="input-field"
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{ paddingLeft: "40px", width: "100%", boxSizing: "border-box" }}
                />
              </div>
              <div style={{ position: "relative" }}>
                <span style={iconStyle}>🔒</span>
                <input
                  className="input-field"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  style={{ paddingLeft: "40px", width: "100%", boxSizing: "border-box" }}
                />
              </div>

              {error && (
                <p style={{ color: "#ef4444", fontSize: "0.85rem", margin: 0 }}>{error}</p>
              )}

              <button className="btn-primary" type="submit" disabled={loading} style={{ width: "100%", marginTop: "8px", padding: "15px" }}>
                {loading ? "Please wait..." : mode === "signin" ? "Sign In" : "Create Free Account \u2192"}
              </button>
            </form>

            {/* Divider */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                margin: "18px 0",
              }}
            >
              <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.08)" }} />
              <span style={{ color: "var(--whm)", fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase" }}>or</span>
              <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.08)" }} />
            </div>

            {/* Social Buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              <button
                onClick={() => signIn("google", { callbackUrl: returnUrl })}
                style={{
                  color: "var(--whi)",
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "13px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "12px",
                  padding: "12px",
                  borderRadius: "12px",
                  background: "rgba(255,255,255,.03)",
                  border: "1px solid var(--br)",
                  width: "100%",
                }}
              >
                <span style={{ fontWeight: 700 }}>G</span>
                Continue with Google
              </button>

              <button
                onClick={() => alert("Apple Sign-In coming soon!")}
                style={{
                  color: "var(--whi)",
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "13px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "12px",
                  padding: "12px",
                  borderRadius: "12px",
                  background: "rgba(255,255,255,.03)",
                  border: "1px solid var(--br)",
                  width: "100%",
                }}
              >
                <span style={{ fontSize: "16px" }}>🍎</span>
                Continue with Apple
              </button>
            </div>

            {/* Terms */}
            <p
              style={{
                textAlign: "center",
                color: "rgba(255,255,255,.45)",
                fontSize: "11px",
                marginTop: "16px",
                lineHeight: 1.5,
              }}
            >
              By continuing you agree to our{" "}
              <span style={{ color: "var(--og)", cursor: "pointer" }}>Terms</span>
              {" & "}
              <span style={{ color: "var(--og)", cursor: "pointer" }}>Privacy Policy</span>.
            </p>
          </div>

          {/* Social Proof */}
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <p style={{ fontSize: "12px", color: "var(--whm)", fontWeight: 300, marginBottom: "10px" }}>
              Join <strong style={{ color: "#fff" }}>500+ athletes</strong> already using FitForge
            </p>
            <div style={{ display: "inline-flex", justifyContent: "center", alignItems: "center" }}>
              {avatarImgs.map((src, i) => (
                <div
                  key={i}
                  style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "50%",
                    overflow: "hidden",
                    position: "relative",
                    border: "2px solid var(--bg)",
                    marginLeft: i > 0 ? "-10px" : 0,
                  }}
                >
                  <Image src={src} alt="" fill sizes="34px" className="object-cover" />
                </div>
              ))}
              <div style={{ marginLeft: "-10px", width: "34px", height: "34px", borderRadius: "50%", border: "2px solid var(--bg)", background: "rgba(255,255,255,.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: 700, color: "var(--whm)" }}>
                +496
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </>
  );
}
