'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import type { Equipment, Goal, Level } from '@/lib/exercises';
import { generateWorkout } from '@/lib/exercises';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const bebas = { fontFamily: "'Bebas Neue', sans-serif" };

const EQUIPMENT_OPTIONS: { id: Equipment; label: string; emoji: string; sub: string }[] = [
  { id: 'full_gym', label: 'Full Gym', emoji: '🏋️', sub: 'All equipment' },
  { id: 'dumbbells', label: 'Dumbbells', emoji: '💪', sub: 'Fixed or adjustable' },
  { id: 'barbell', label: 'Barbell', emoji: '⚡', sub: '+ plates' },
  { id: 'cables', label: 'Cables', emoji: '🔗', sub: 'Cable machine' },
  { id: 'bands', label: 'Bands', emoji: '🎗️', sub: 'Resistance bands' },
  { id: 'bench', label: 'Bench', emoji: '🛋️', sub: 'Flat or adjustable' },
  { id: 'pullup', label: 'Pull-Up Bar', emoji: '🔝', sub: 'Doorway or rack' },
  { id: 'bodyweight', label: 'Bodyweight', emoji: '🤸', sub: 'Always available' },
];

const GOAL_OPTIONS: { id: Goal; label: string; emoji: string; desc: string }[] = [
  { id: 'muscle', label: 'Build Muscle', emoji: '💪', desc: 'Hypertrophy focus' },
  { id: 'fat_loss', label: 'Fat Loss', emoji: '🔥', desc: 'Burn calories' },
  { id: 'strength', label: 'Strength', emoji: '🏆', desc: 'Move more weight' },
  { id: 'tone', label: 'Tone & Define', emoji: '✨', desc: 'Lean muscle' },
  { id: 'athletic', label: 'Athletic', emoji: '⚡', desc: 'Speed & power' },
  { id: 'endurance', label: 'Endurance', emoji: '🏃', desc: 'Stamina & cardio' },
];

const LEVEL_OPTIONS: { id: Level; label: string; emoji: string; desc: string }[] = [
  { id: 'beginner', label: 'Beginner', emoji: '🌱', desc: 'Under 1 year training' },
  { id: 'intermediate', label: 'Intermediate', emoji: '💪', desc: '1\u20133 years training' },
  { id: 'advanced', label: 'Advanced', emoji: '🔥', desc: '3+ years, structured training' },
];

const DAY_OPTIONS = [
  { days: 1, label: '1 Day', sub: 'Quick workout', price: null, badge: null, premium: false },
  { days: 3, label: '3 Days', sub: 'Mon \u00b7 Wed \u00b7 Fri', price: '$20/mo', badge: '🔒 Premium', premium: true },
  { days: 5, label: '5 Days', sub: 'Mon \u2013 Fri', price: '$20/mo', badge: '⭐ Popular', premium: true },
  { days: 7, label: '7 Days', sub: 'Full week', price: '$20/mo', badge: '🔒 Premium', premium: true },
];

const FREE_WORKOUT_LIMIT = 3;
const STORAGE_COUNT_KEY = 'ff_workout_count';
const STORAGE_WORKOUT_KEY = 'ff_generated_workout';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function BuilderPage() {
  const router = useRouter();
  const { data: session } = useSession();

  // Step state
  const [step, setStep] = useState<1 | 2>(1);

  // Selections
  const [equipment, setEquipment] = useState<Set<Equipment>>(new Set(['bodyweight']));
  const [goal, setGoal] = useState<Goal | null>(null);
  const [level, setLevel] = useState<Level>('intermediate');
  const [planDays, setPlanDays] = useState<number>(1);

  // Modals
  const [showAuthGate, setShowAuthGate] = useState(false);
  const [showPremiumGate, setShowPremiumGate] = useState(false);

  const isPremium = false; // TODO: read from session/user data

  // ── Equipment toggle ──────────────────────────────────────────────────
  const toggleEquipment = useCallback((id: Equipment) => {
    if (id === 'bodyweight') return;
    setEquipment((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  // ── Check free usage ──────────────────────────────────────────────────
  const getFreeCount = (): number => {
    if (typeof window === 'undefined') return 0;
    return parseInt(localStorage.getItem(STORAGE_COUNT_KEY) || '0', 10);
  };
  const incrementCount = () => {
    const c = getFreeCount() + 1;
    localStorage.setItem(STORAGE_COUNT_KEY, String(c));
  };

  // ── Handle clicking premium plan ─────────────────────────────────────
  const handlePremiumPlanClick = (days: number) => {
    if (isPremium) {
      setPlanDays(days);
    } else {
      setShowPremiumGate(true);
    }
  };

  // ── Generate workout ──────────────────────────────────────────────────
  const handleGenerate = () => {
    if (!goal) return;

    const count = getFreeCount();
    if (count >= FREE_WORKOUT_LIMIT) {
      setShowPremiumGate(true);
      return;
    }

    const workout = generateWorkout(goal, level, planDays, Array.from(equipment));
    localStorage.setItem(STORAGE_WORKOUT_KEY, JSON.stringify(workout));
    incrementCount();
    router.push('/review');
  };

  const freeUsed = getFreeCount();

  return (
    <main className="min-h-screen pb-20">
      {/* ── Premium Gate Modal ─────────────────────────────────────── */}
      {showPremiumGate && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 50,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
        }}>
          <div className="card" style={{ maxWidth: '440px', width: '100%', margin: '0 16px', textAlign: 'center', padding: '32px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🚀</div>
            <h2 style={{ ...bebas, fontSize: '1.75rem', letterSpacing: 3, marginBottom: '12px' }} className="text-gradient-brand">
              UPGRADE TO PREMIUM
            </h2>
            <p style={{ color: 'var(--whm)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '24px' }}>
              {freeUsed >= FREE_WORKOUT_LIMIT
                ? `You've used all ${FREE_WORKOUT_LIMIT} free workouts. Upgrade to Premium for unlimited access.`
                : 'Unlock multi-day workout plans with Premium.'}
            </p>

            <div style={{
              background: 'rgba(255,255,255,0.03)', border: '1px solid var(--br)',
              borderRadius: '16px', padding: '20px', marginBottom: '20px', textAlign: 'left',
            }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--og)', marginBottom: '12px', ...bebas, letterSpacing: 2 }}>
                $20/mo
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  'Unlimited workout generation',
                  '3-day, 5-day, and 7-day plans',
                  'Full progress tracking & analytics',
                  'Achievement badges & XP system',
                  'Priority access to new features',
                ].map((feature) => (
                  <div key={feature} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--gr)', fontWeight: 700 }}>✓</span>
                    <span style={{ color: 'var(--whi)' }}>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                className="btn-primary"
                style={{ width: '100%', padding: '14px' }}
                onClick={() => {
                  setShowPremiumGate(false);
                  router.push('/premium');
                }}
              >
                Get Premium →
              </button>
              <button
                className="btn-ghost"
                style={{ width: '100%' }}
                onClick={() => setShowPremiumGate(false)}
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ maxWidth: 820, padding: '48px 24px 0 24px' }} className="mx-auto">
        <span className="chip" style={{ marginBottom: 14, display: 'inline-block' }}>
          Equipment-First &middot; {freeUsed < FREE_WORKOUT_LIMIT ? `${FREE_WORKOUT_LIMIT - freeUsed} Free Workouts Left` : 'Premium Required'}
        </span>
        <h1 style={{ ...bebas, fontSize: 'clamp(44px,7vw,88px)', lineHeight: 0.95, margin: 0, marginBottom: 14 }}>
          <span className="text-gradient-white">BUILD YOUR</span>
          <br />
          <span className="text-gradient-brand">PROGRAM</span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,.4)', fontSize: 14, fontWeight: 300, maxWidth: 460, lineHeight: 1.7, marginBottom: 40, marginTop: 0 }}>
          Select your equipment and goal. We build a program using only what you have. Free accounts get {FREE_WORKOUT_LIMIT} single-day workouts &mdash; upgrade for unlimited multi-day plans.
        </p>

        {/* Step indicator */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 32 }}>
          <div style={{
            width: 26, height: 26, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--oe), var(--pm))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0
          }}>1</div>
          <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: 1, textTransform: 'uppercase' as const, color: step === 1 ? '#fff' : 'var(--whm)' }}>Equipment</span>
          <div style={{ width: 24, height: 1, background: 'var(--br)', flexShrink: 0 }} />
          <div style={{
            width: 26, height: 26, borderRadius: '50%',
            background: step >= 2 ? 'linear-gradient(135deg, var(--oe), var(--pm))' : 'var(--whh)',
            border: step >= 2 ? 'none' : '1px solid var(--br)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 700, color: step >= 2 ? '#fff' : 'var(--whm)', flexShrink: 0
          }}>2</div>
          <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: 1, textTransform: 'uppercase' as const, color: step === 2 ? '#fff' : 'var(--whm)' }}>Goal &amp; Length</span>
        </div>
      </div>

      <div style={{ maxWidth: 820, padding: '0 24px' }} className="mx-auto">
        {/* ── STEP 1: Equipment ──────────────────────────────────────── */}
        {step === 1 && (
          <section>
            <div className="card" style={{ padding: 28, marginBottom: 14 }}>
              <h3 style={{ fontSize: 15, color: '#fff', fontWeight: 600, margin: 0, marginBottom: 4 }}>
                What equipment do you have access to?
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 18 }}>
                <span style={{ fontSize: 11, color: 'var(--whm)', fontWeight: 400 }}>Select all that apply</span>
              </div>
              <div className="eq-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 8 }}>
                {EQUIPMENT_OPTIONS.map((eq) => {
                  const selected = equipment.has(eq.id);
                  const isBodyweight = eq.id === 'bodyweight';
                  return (
                    <button
                      key={eq.id}
                      onClick={() => toggleEquipment(eq.id)}
                      className={`eq-btn ${selected ? 'selected' : ''}`}
                      style={isBodyweight ? {
                        background: 'linear-gradient(135deg,rgba(120,45,15,.25),rgba(90,45,130,.25))',
                        border: '1px solid rgba(224,120,48,.35)',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, textAlign: 'center'
                      } : {
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, textAlign: 'center'
                      }}
                    >
                      <span style={{ fontSize: 22 }}>{eq.emoji}</span>
                      <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.5, color: selected || isBodyweight ? '#fff' : 'rgba(255,255,255,.45)' }}>
                        {eq.label}
                      </span>
                      <span style={{ fontSize: 10, color: isBodyweight ? 'var(--og)' : 'rgba(255,255,255,.25)', fontWeight: 400 }}>
                        {eq.sub}
                      </span>
                    </button>
                  );
                })}
              </div>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,.3)', marginTop: 8, marginBottom: 20 }}>
                💡 Bodyweight exercises are always included. Select additional equipment you have.
              </p>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn-primary" style={{ padding: '12px 28px', fontSize: 12 }} onClick={() => setStep(2)}>
                  Next &rarr;
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ── STEP 2: Goal, Level, Days ──────────────────────────────── */}
        {step === 2 && (
          <section>
            {/* Goal selection */}
            <div className="card" style={{ padding: 28, marginBottom: 14 }}>
              <h3 style={{ fontSize: 15, color: '#fff', fontWeight: 600, margin: 0, marginBottom: 12 }}>
                What&apos;s your primary goal?
              </h3>
              <div className="goal-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                {GOAL_OPTIONS.map((g) => {
                  const selected = goal === g.id;
                  return (
                    <button
                      key={g.id}
                      onClick={() => setGoal(g.id)}
                      style={{
                        padding: '16px 10px', borderRadius: 14,
                        background: selected ? 'linear-gradient(135deg,rgba(120,45,15,.3),rgba(90,45,130,.3))' : 'var(--whh)',
                        border: selected ? '1px solid rgba(224,120,48,.4)' : '1px solid var(--br)',
                        color: selected ? '#fff' : 'var(--whm)', cursor: 'pointer', transition: 'all 0.22s',
                        textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                      }}
                    >
                      <span style={{ fontSize: 24 }}>{g.emoji}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: selected ? '#fff' : 'rgba(255,255,255,.75)' }}>{g.label}</span>
                      <span style={{ fontSize: 11, color: 'var(--whm)' }}>{g.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Level selection */}
            <div className="card" style={{ padding: 28, marginBottom: 14 }}>
              <h3 style={{ fontSize: 15, color: '#fff', fontWeight: 600, margin: 0, marginBottom: 4 }}>Experience level</h3>
              <p style={{ fontSize: 13, color: 'var(--whm)', fontWeight: 300, margin: 0, marginBottom: 18 }}>
                We use this to calibrate your sets, reps, and rest times.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                {LEVEL_OPTIONS.map((l) => {
                  const selected = level === l.id;
                  return (
                    <button
                      key={l.id}
                      onClick={() => setLevel(l.id)}
                      style={{
                        padding: '18px 10px', borderRadius: 14,
                        background: selected ? 'linear-gradient(135deg,rgba(120,45,15,.3),rgba(90,45,130,.3))' : 'var(--whh)',
                        border: selected ? '1px solid rgba(224,120,48,.4)' : '1px solid var(--br)',
                        color: selected ? '#fff' : 'var(--whm)', cursor: 'pointer', transition: 'all 0.22s',
                        textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                      }}
                    >
                      <span style={{ fontSize: 24, marginBottom: 8 }}>{l.emoji}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: selected ? '#fff' : 'rgba(255,255,255,.75)' }}>{l.label}</span>
                      <span style={{ fontSize: 10, color: 'rgba(255,255,255,.35)', fontWeight: 400 }}>{l.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Plan length */}
            <div className="card" style={{ padding: 28, marginBottom: 14 }}>
              <h3 style={{ fontSize: 15, color: '#fff', fontWeight: 600, margin: 0, marginBottom: 6 }}>Plan length</h3>
              <p style={{ fontSize: 13, color: 'var(--whm)', fontWeight: 300, margin: 0, marginBottom: 20 }}>
                1-day is free (up to {FREE_WORKOUT_LIMIT} workouts). Multi-day plans unlock with Premium ($20/mo).
              </p>
              <div className="plan-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                {DAY_OPTIONS.map((d) => {
                  const selected = planDays === d.days;
                  const isFree = !d.premium;
                  return (
                    <button
                      key={d.days}
                      onClick={() => {
                        if (d.premium) handlePremiumPlanClick(d.days);
                        else setPlanDays(d.days);
                      }}
                      style={{
                        position: 'relative', borderRadius: 16, padding: '20px 10px',
                        textAlign: 'center', cursor: 'pointer', transition: 'all 0.22s',
                        border: isFree && selected ? '2px solid #fff' : '1px solid var(--br)',
                        background: isFree && selected ? '#fff' : d.premium ? 'rgba(255,255,255,.04)' : 'rgba(255,255,255,.06)',
                      }}
                    >
                      {d.badge && (
                        <span style={{
                          position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)',
                          fontSize: 9, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' as const,
                          background: d.badge.includes('Popular') ? 'linear-gradient(135deg,#b45309,#92400e)' : 'linear-gradient(135deg,var(--og),var(--og2))',
                          borderRadius: 100, padding: '3px 10px', color: '#fff', whiteSpace: 'nowrap'
                        }}>
                          {d.badge}
                        </span>
                      )}
                      <div style={{ ...bebas, fontSize: 26, color: isFree && selected ? '#07070d' : isFree ? '#fff' : 'rgba(255,255,255,.5)', lineHeight: 1, marginBottom: 3 }}>
                        {d.label}
                      </div>
                      <div style={{ fontSize: 11, color: isFree && selected ? 'rgba(0,0,0,.5)' : 'var(--whm)', marginBottom: 6 }}>
                        {d.sub}
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: isFree ? 'var(--gr)' : 'var(--og)' }}>
                        {d.price ? d.price : '✓ Free'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Free usage counter */}
            <div style={{
              background: 'rgba(255,255,255,.03)', border: '1px solid var(--br)', borderRadius: 12,
              padding: '12px 16px', marginBottom: 14,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,.5)', marginBottom: 6, letterSpacing: 0.5 }}>
                  Free workouts used
                </div>
                <div style={{ display: 'flex', gap: 5 }}>
                  {[0, 1, 2].map((i) => (
                    <div key={i} style={{
                      height: 5, flex: 1, borderRadius: 100,
                      background: i < freeUsed ? 'linear-gradient(135deg, var(--og), var(--og2))' : 'var(--br)',
                      transition: 'background 0.3s',
                    }} />
                  ))}
                </div>
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: freeUsed >= FREE_WORKOUT_LIMIT ? 'var(--og2)' : 'var(--og)', whiteSpace: 'nowrap' }}>
                {freeUsed} / {FREE_WORKOUT_LIMIT} used
              </div>
            </div>

            {/* Bottom buttons */}
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <button className="btn-ghost" style={{ padding: '12px 22px', fontSize: 12 }} onClick={() => setStep(1)}>
                &larr; Back
              </button>
              <button
                className="btn-primary"
                style={{ padding: '12px 26px', fontSize: 12 }}
                onClick={handleGenerate}
                disabled={!goal}
              >
                Generate My Workout &rarr;
              </button>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
