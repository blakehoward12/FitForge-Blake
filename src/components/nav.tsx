"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState } from "react";

const bebas = { fontFamily: "'Bebas Neue', sans-serif" };

export function Nav() {
  const { data: session } = useSession();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const initials = session?.user?.name
    ? session.user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "ME";

  const navLinks = [
    { href: "/builder", label: "Build" },
    { href: "/feed", label: "Feed" },
    { href: "/marketplace", label: "Marketplace" },
    { href: "/profile", label: "Profile" },
    { href: "/faq", label: "FAQ" },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[500] px-10 py-3.5 flex items-center justify-between backdrop-blur-[20px]" style={{ background: "rgba(10,10,15,.6)" }}>
        <Link href="/" className="no-underline" style={bebas}>
          <span className="text-[22px] tracking-[3px] text-white opacity-90">
            FIT<span style={{ color: "var(--og)" }}>FORGE</span>
          </span>
        </Link>
        <div className="flex items-center gap-7">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hide-mobile text-[11px] tracking-[2px] uppercase font-medium no-underline transition-colors hover:text-white/85"
              style={{ color: "rgba(255,255,255,.45)" }}
            >
              {link.label}
            </Link>
          ))}
          {session?.user ? (
            <Link
              href="/profile"
              className="hide-mobile flex items-center no-underline rounded-full text-[11px] font-semibold tracking-[1.5px] uppercase"
              style={{
                background: "linear-gradient(135deg,rgba(180,60,30,.7),rgba(120,40,160,.7))",
                color: "#fff", padding: "10px 22px",
                border: "1px solid rgba(255,255,255,.15)",
              }}
            >
              <span className="flex items-center justify-center rounded-full mr-1.5 shrink-0 text-[10px] font-bold" style={{ width: 22, height: 22, background: "linear-gradient(135deg,var(--oe),var(--pm))" }}>
                {initials}
              </span>
              {session.user.name?.split(" ")[0]}
            </Link>
          ) : (
            <Link href="/login" className="hide-mobile no-underline rounded-full text-[11px] font-semibold tracking-[1.5px] uppercase" style={{ background: "linear-gradient(135deg,rgba(180,60,30,.7),rgba(120,40,160,.7))", color: "#fff", padding: "10px 22px", border: "1px solid rgba(255,255,255,.15)" }}>
              Sign In
            </Link>
          )}
          <button className="hidden max-md:flex flex-col gap-[5px] bg-transparent border-none p-1 cursor-pointer" onClick={() => setDrawerOpen(true)} aria-label="Open navigation menu">
            <span className="block w-[22px] h-[2px] bg-white rounded-sm" />
            <span className="block w-[22px] h-[2px] bg-white rounded-sm" />
            <span className="block w-[22px] h-[2px] bg-white rounded-sm" />
          </button>
        </div>
      </nav>

      {drawerOpen && (
        <div className="fixed inset-0 z-[400] flex flex-col items-center justify-center gap-7 backdrop-blur-[24px]" style={{ background: "rgba(10,10,15,.97)" }}>
          <button onClick={() => setDrawerOpen(false)} className="absolute top-5 right-5 bg-transparent border-none text-[28px] cursor-pointer" style={{ color: "var(--whm)" }}>✕</button>
          <Link href="/" onClick={() => setDrawerOpen(false)} className="text-[20px] tracking-[3px] text-white no-underline uppercase font-medium">Home</Link>
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setDrawerOpen(false)} className="text-[20px] tracking-[3px] text-white no-underline uppercase font-medium">{link.label}</Link>
          ))}
          <div className="flex flex-col gap-3 mt-3 w-[220px]">
            {session?.user ? (
              <Link href="/profile" onClick={() => setDrawerOpen(false)} className="btn-primary justify-center py-3.5">Profile</Link>
            ) : (
              <>
                <Link href="/login" onClick={() => setDrawerOpen(false)} className="btn-ghost justify-center py-3.5">Log In</Link>
                <Link href="/login" onClick={() => setDrawerOpen(false)} className="btn-primary justify-center py-3.5">Sign Up Free</Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
