'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = async () => {
    if (!session?.user) {
      router.push('/login?returnUrl=/premium');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/stripe/checkout', { method: 'POST' });
      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else if (data.error === 'Stripe not configured' || data.error === 'Stripe price not configured') {
        setError('Payment system is being set up. Please check back shortly.');
      } else {
        setError(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight: '100vh', paddingBottom: '4rem' }}>
      {/* Hero banner */}
      <div className="relative -mt-[62px] h-[42vh] min-h-[320px] w-full overflow-hidden flex items-end">
        <Image src="/img/generated/premium-hero.png" alt="Triumphant athlete after an intense workout" fill priority sizes="100vw" className="object-cover object-center" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(10,10,15,.7) 0%, rgba(10,10,15,.2) 40%, rgba(10,10,15,.98) 100%)' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 85% 20%, rgba(90,45,130,.4) 0%, transparent 50%)' }} />
        <div className="relative z-10 w-full max-w-[1160px] mx-auto px-6 pb-8 text-center">
          <span className="chip mb-4 inline-block" style={{ color: 'var(--og)' }}>Go further</span>
          <h1 style={{ ...bebas, fontSize: 'clamp(44px,8vw,84px)', letterSpacing: 2, lineHeight: 0.9, margin: 0 }}>
            <span className="text-gradient-white">FITFORGE </span>
            <span className="text-gradient-brand">PREMIUM</span>
          </h1>
        </div>
      </div>

      <div style={{ maxWidth: 520, margin: '0 auto', padding: '36px 20px 0' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <p style={{ color: 'var(--whm)', fontSize: '0.95rem', lineHeight: 1.6, maxWidth: 380, margin: '0 auto' }}>
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

        {/* Error message */}
        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: '12px', padding: '12px 16px', marginBottom: '16px',
            color: '#ef4444', fontSize: '0.85rem', textAlign: 'center',
          }}>
            {error}
          </div>
        )}

        {/* CTA */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            className="btn-primary animate-glow"
            style={{
              width: '100%', padding: '18px', fontSize: '14px', justifyContent: 'center',
              display: 'flex', borderRadius: '16px',
            }}
            onClick={handleSubscribe}
            disabled={loading}
          >
            {loading ? 'Redirecting to checkout...' : session?.user ? 'Subscribe Now — $20/mo' : 'Sign Up & Subscribe — $20/mo'}
          </button>
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
