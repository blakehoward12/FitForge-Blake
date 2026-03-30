'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const bebas = { fontFamily: "'Bebas Neue', sans-serif" };

export default function PremiumSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Auto-redirect after 5 seconds
    const timer = setTimeout(() => router.push('/builder'), 5000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '48px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🎉</div>
        <h1 style={{ ...bebas, fontSize: '2.5rem', letterSpacing: 3, marginBottom: '12px' }} className="text-gradient-brand">
          WELCOME TO PREMIUM!
        </h1>
        <p style={{ color: 'var(--whm)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '32px' }}>
          You now have unlimited workouts, multi-day plans, and full progress tracking. Time to forge!
        </p>
        <button
          className="btn-primary animate-glow"
          onClick={() => router.push('/builder')}
          style={{ padding: '16px 32px', fontSize: '14px', borderRadius: '16px' }}
        >
          Start Building →
        </button>
        <p style={{ color: 'var(--whm)', fontSize: '0.75rem', marginTop: '16px' }}>
          Redirecting to builder in 5 seconds...
        </p>
      </div>
    </main>
  );
}
