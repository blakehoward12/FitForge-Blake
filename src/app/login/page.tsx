"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";

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
  const returnUrl = searchParams.get("returnUrl") || "/builder";

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

  return (
    <>
      <main
        style={{
          minHeight: "calc(100vh - 3.5rem)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem 1rem",
        }}
      >
        <div style={{ width: "100%", maxWidth: "26rem" }}>
          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div style={{ display: "inline-flex", alignItems: "baseline", gap: "3px" }}>
              <span className="text-gradient-white" style={{ ...bebasNeue, fontSize: "2.5rem", letterSpacing: "0.06em" }}>
                FIT
              </span>
              <span className="text-gradient-brand" style={{ ...bebasNeue, fontSize: "2.5rem", letterSpacing: "0.06em" }}>
                FORGE
              </span>
            </div>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem", marginTop: "0.25rem" }}>
              Your AI-powered workout engine
            </p>
          </div>

          {/* Card */}
          <div className="card" style={{ padding: "2rem" }}>
            {/* Tab Switcher */}
            <div
              style={{
                display: "flex",
                borderRadius: "100px",
                background: "rgba(255,255,255,0.04)",
                padding: "4px",
                marginBottom: "1.5rem",
              }}
            >
              {(["signin", "signup"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => { setMode(m); setError(""); }}
                  style={{
                    flex: 1,
                    padding: "0.5rem",
                    borderRadius: "100px",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    background: mode === m ? "rgba(155,94,203,0.2)" : "transparent",
                    color: mode === m ? "#fff" : "rgba(255,255,255,0.45)",
                    transition: "all 0.2s",
                  }}
                >
                  {m === "signin" ? "Sign In" : "Create Account"}
                </button>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
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
              <input
                className="input-field"
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                className="input-field"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />

              {error && (
                <p style={{ color: "#ef4444", fontSize: "0.85rem", margin: 0 }}>{error}</p>
              )}

              <button className="btn-primary" type="submit" disabled={loading} style={{ width: "100%", marginTop: "0.25rem" }}>
                {loading ? "Please wait..." : mode === "signin" ? "Sign In" : "Create Account"}
              </button>
            </form>

            {/* Divider */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                margin: "1.25rem 0",
              }}
            >
              <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.08)" }} />
              <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.8rem" }}>or continue with</span>
              <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.08)" }} />
            </div>

            {/* Social Buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              <button
                className="btn-ghost"
                onClick={() => signIn("google", { callbackUrl: returnUrl })}
                style={{ width: "100%" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>

              <button
                className="btn-ghost"
                onClick={() => alert("Apple Sign-In coming soon!")}
                style={{ width: "100%" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                Continue with Apple
              </button>
            </div>

            {/* Terms */}
            <p
              style={{
                textAlign: "center",
                color: "rgba(255,255,255,0.3)",
                fontSize: "0.75rem",
                marginTop: "1.25rem",
                lineHeight: 1.5,
              }}
            >
              By continuing you agree to our{" "}
              <span style={{ color: "rgba(255,255,255,0.5)", textDecoration: "underline", cursor: "pointer" }}>Terms</span>
              {" & "}
              <span style={{ color: "rgba(255,255,255,0.5)", textDecoration: "underline", cursor: "pointer" }}>Privacy Policy</span>
            </p>
          </div>

          {/* Social Proof */}
          <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
              {/* Avatar stack */}
              <div style={{ display: "flex" }}>
                {["#5a2d82", "#e07830", "#c85a8a", "#22c55e"].map((bg, i) => (
                  <div
                    key={i}
                    style={{
                      width: "1.75rem",
                      height: "1.75rem",
                      borderRadius: "50%",
                      background: bg,
                      border: "2px solid var(--bg)",
                      marginLeft: i > 0 ? "-0.5rem" : 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.6rem",
                      fontWeight: 700,
                      color: "#fff",
                    }}
                  >
                    {["AJ", "MK", "RS", "TL"][i]}
                  </div>
                ))}
              </div>
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem", fontWeight: 500 }}>
                Join <strong style={{ color: "#22c55e" }}>500+</strong> athletes
              </span>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
