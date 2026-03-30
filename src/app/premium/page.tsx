'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const bebas = { fontFamily: "'Bebas Neue', sans-serif" };

const FEATURES = [
  { emoji: '♾️', title: 'Unlimited Workouts', desc: 'Generate as many workouts as you want — no daily caps.' },
  { emoji: '📅', title: 'Multi-Day Plans', desc: '3-day, 5-day, and 7-day structured splits (PPL, Upper/Lower, Full Body).' },
  { emoji: '📊', title: 'Progress Analytics', desc: 'Track volume, PRs, and streaks with detailed workout history.' },
  { emoji: '🏆', title: 'Achievements & XP', desc: 'Full gamification — unlock badges, earn XP, compete on streaks.' },
  { emoji: '🔥', title: 'Priority Features', desc: 'Early access to Creator Marketplace, custom plans, and more.' },
];

export default function PremiumPage() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <main style={{ minHeight: '100vh', paddingBottom: '4rem' }}>
      <div style={{ maxWidth: 520, margin: '0 auto', padding: '48px 20px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🚀</div>
          <h1 style={{ ...bebas, fontSize: 'clamp(36px,6vw,56px)', letterSpacing: 3, lineHeight: 1, margin: '0 0 8px' }}>
            <span className="text-gradient-white">FIT</span>
            <span className="text-gradient-brand">FORGE</span>
            <span className="text-gradient-white" style={{ display: 'block', fontSize: 'clamp(28px,5vw,44px)', marginTop: 4 }}>PREMIUM</span>
          </h1>
          <p style={{ color: 'var(--whm)', fontSize: '0.9rem', lineHeight: 1.6, maxWidth: 380, margin: '0 auto' }}>
            Unlock the full FitForge experience. Unlimited workouts, multi-day plans, and complete progress tracking.
          </p>
        </div>

        {/* Price Card */}
        <div className="card" style={{
          padding: '32px', textAlign: 'center', marginBottom: '24px',
          background: 'linear-gradient(135deg, rgba(120,45,15,0.15), rgba(90,45,130,0.15))',
          border: '1px solid rgba(224,120,48,0.25)',
        }}>
          <div style={{ ...bebas, fontSize: '4rem', letterSpacing: 2, color: 'var(--og)', lineHeight: 1 }}>$20</div>
          <div style={{ color: 'var(--whm)', fontSize: '0.85rem', marginBottom: '24px' }}>per month</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
            {FEATURES.map((f) => (
              <div key={f.title} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>{f.emoji}</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#fff' }}>{f.title}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--whm)', marginTop: 2 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {session?.user ? (
            <button
              className="btn-primary animate-glow"
              style={{
                width: '100%', padding: '18px', fontSize: '14px', justifyContent: 'center',
                display: 'flex', borderRadius: '16px',
              }}
              onClick={() => {
                // In production, this would redirect to Stripe Checkout
                // For now, show coming soon
                alert('Stripe checkout integration coming soon! Premium features will be activated after payment.');
              }}
            >
              Subscribe Now — $20/mo
            </button>
          ) : (
            <button
              className="btn-primary animate-glow"
              style={{
                width: '100%', padding: '18px', fontSize: '14px', justifyContent: 'center',
                display: 'flex', borderRadius: '16px',
              }}
              onClick={() => router.push('/login?returnUrl=/premium')}
            >
              Sign Up & Get Premium →
            </button>
          )}
          <button
            className="btn-ghost"
            onClick={() => router.push('/builder')}
            style={{ width: '100%', justifyContent: 'center', display: 'flex' }}
          >
            ← Back to Builder
          </button>
        </div>

        {/* Social proof */}
        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <p style={{ color: 'var(--whm)', fontSize: '0.8rem' }}>
            Join <strong style={{ color: '#fff' }}>200+ premium members</strong> already forging
          </p>
        </div>
      </div>
    </main>
  );
}
