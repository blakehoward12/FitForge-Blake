'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { GeneratedWorkout, WorkoutDay } from '@/lib/exercises';

const STORAGE_WORKOUT_KEY = 'ff_generated_workout';

function formatReps(ex: { sets: number; reps: number }): string {
  if (ex.sets === 1) return `${ex.reps} reps`;
  return `${ex.sets} \u00d7 ${ex.reps}`;
}

export default function ReviewPage() {
  const router = useRouter();
  const [workout, setWorkout] = useState<GeneratedWorkout | null>(null);
  const [activeDay, setActiveDay] = useState(0);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_WORKOUT_KEY);
    if (!raw) { router.replace('/builder'); return; }
    try { setWorkout(JSON.parse(raw)); } catch { router.replace('/builder'); }
  }, [router]);

  if (!workout) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--whm)' }}>Loading workout...</div>
      </main>
    );
  }

  const day = workout.days[activeDay];

  return (
    <main style={{ minHeight: '100vh', paddingBottom: '6rem' }}>
      <div style={{ maxWidth: 660, margin: '0 auto', padding: '24px 20px' }}>

        {/* Day tabs */}
        {workout.days.length > 1 && (
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '20px' }}>
            {workout.days.map((d, i) => (
              <button
                key={i}
                onClick={() => setActiveDay(i)}
                className="chip"
                style={{
                  whiteSpace: 'nowrap',
                  background: i === activeDay ? 'rgba(224,120,48,0.15)' : undefined,
                  borderColor: i === activeDay ? 'var(--og)' : undefined,
                  color: i === activeDay ? '#fff' : undefined,
                  cursor: 'pointer',
                }}
              >
                Day {i + 1}: {d.name}
              </button>
            ))}
          </div>
        )}

        {/* Warm Up Section */}
        <div style={{
          borderRadius: 20, padding: '24px',
          background: 'rgba(34,197,94,0.04)',
          border: '1px solid rgba(34,197,94,0.15)',
          marginBottom: '20px',
        }}>
          {/* Section Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
            <div style={{
              width: 48, height: 48, borderRadius: '50%',
              background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.25rem', flexShrink: 0,
            }}>🔥</div>
            <div>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.1rem', letterSpacing: 3, color: 'var(--gr)', margin: 0 }}>WARM UP</h2>
              <p style={{ color: 'var(--whm)', fontSize: '0.8rem', margin: '2px 0 0' }}>{day.warmup.length} exercises</p>
            </div>
          </div>

          {/* Warmup Exercises */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {day.warmup.map((w, i) => {
              const parts = w.match(/^(.+?)(\d+\s*.*)$/);
              const name = parts ? parts[1].trim() : w;
              const reps = parts ? parts[2].trim() : '';
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '14px 18px', borderRadius: '12px',
                  background: 'rgba(34,197,94,0.04)', border: '1px solid rgba(34,197,94,0.08)',
                }}>
                  <span style={{ fontSize: '0.9rem', color: '#fff' }}>{name}</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--gr)' }}>{reps || `${8 + i * 2} reps`}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Workout Section */}
        <div style={{
          borderRadius: 20, padding: '24px',
          background: 'rgba(224,120,48,0.03)',
          border: '1px solid rgba(224,120,48,0.12)',
          marginBottom: '20px',
        }}>
          {/* Section Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
            <div style={{
              width: 48, height: 48, borderRadius: '50%',
              background: 'rgba(224,120,48,0.1)', border: '1px solid rgba(224,120,48,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.25rem', flexShrink: 0,
            }}>💪</div>
            <div>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.1rem', letterSpacing: 3, color: 'var(--og)', margin: 0 }}>MAIN WORKOUT</h2>
              <p style={{ color: 'var(--whm)', fontSize: '0.8rem', margin: '2px 0 0' }}>{day.exercises.length} exercises</p>
            </div>
          </div>

          {/* Main Exercises */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {day.exercises.map((ex) => (
              <div key={ex.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 18px', borderRadius: '12px',
                background: 'rgba(224,120,48,0.03)', border: '1px solid rgba(224,120,48,0.06)',
              }}>
                <span style={{ fontSize: '0.9rem', color: '#fff' }}>
                  {ex.emoji} {ex.name}
                </span>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--og)' }}>
                  {formatReps(ex)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Cool Down Section */}
        <div style={{
          borderRadius: 20, padding: '24px',
          background: 'rgba(155,94,203,0.04)',
          border: '1px solid rgba(155,94,203,0.12)',
          marginBottom: '24px',
        }}>
          {/* Section Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
            <div style={{
              width: 48, height: 48, borderRadius: '50%',
              background: 'rgba(155,94,203,0.1)', border: '1px solid rgba(155,94,203,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.25rem', flexShrink: 0,
            }}>🧊</div>
            <div>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.1rem', letterSpacing: 3, color: 'var(--pl)', margin: 0 }}>COOL DOWN</h2>
              <p style={{ color: 'var(--whm)', fontSize: '0.8rem', margin: '2px 0 0' }}>{day.cooldown.length} exercises</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {day.cooldown.map((c, i) => {
              const parts = c.match(/^(.+?)(\d+\s*.*)$/);
              const name = parts ? parts[1].trim() : c;
              const reps = parts ? parts[2].trim() : '';
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '14px 18px', borderRadius: '12px',
                  background: 'rgba(155,94,203,0.03)', border: '1px solid rgba(155,94,203,0.06)',
                }}>
                  <span style={{ fontSize: '0.9rem', color: '#fff' }}>{name}</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--pl)' }}>{reps || '30s'}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            className="animate-glow"
            style={{
              width: '100%', padding: 22, borderRadius: 18,
              background: 'linear-gradient(135deg,var(--oe),var(--og2),var(--pm))',
              boxShadow: '0 12px 40px rgba(120,45,15,.35)',
              color: '#fff', fontSize: 26, letterSpacing: 3,
              border: 'none', cursor: 'pointer', textTransform: 'uppercase',
              fontFamily: "'Bebas Neue', sans-serif",
              transition: 'transform .3s, box-shadow .3s',
            }}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
            onClick={() => router.push('/tracker')}
          >
            LET&apos;S GO 🔥
          </button>
          <button
            className="btn-ghost"
            onClick={() => router.push('/builder')}
            style={{ width: '100%', justifyContent: 'center', display: 'flex' }}
          >
            &larr; Change Selections
          </button>
        </div>
      </div>
    </main>
  );
}
