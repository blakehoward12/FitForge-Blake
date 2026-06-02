'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { GeneratedWorkout } from '@/lib/exercises';

const STORAGE_WORKOUT_KEY = 'ff_generated_workout';

/** Parse "High knees (30s)" → { name: "High knees", reps: "30s" } */
function parseWarmupCooldown(str: string): { name: string; reps: string } {
  const match = str.match(/^(.+?)\s*\((.+?)\)\s*$/);
  if (match) return { name: match[1].trim(), reps: match[2].trim() };
  return { name: str, reps: '' };
}

function formatReps(ex: { sets: number; reps: number }): string {
  if (ex.sets === 1) return `${ex.reps} reps`;
  return `${ex.sets} \u00d7 ${ex.reps}`;
}

const goalLabels: Record<string, string> = {
  muscle: 'Build Muscle', strength: 'Strength', tone: 'Tone & Define',
  fat_loss: 'Fat Loss', athletic: 'Athletic', endurance: 'Endurance',
};

const levelLabels: Record<string, string> = {
  beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced',
};

const equipLabels: Record<string, string> = {
  bodyweight: 'Bodyweight', dumbbells: 'Dumbbells', barbell: 'Barbell',
  cables: 'Cables', bands: 'Bands', bench: 'Bench', pullup: 'Pull-Up Bar',
  full_gym: 'Full Gym',
};

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
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--whm)' }}>Loading workout...</div>
      </div>
    );
  }

  const day = workout.days[activeDay];

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '6rem' }}>
      <div style={{ maxWidth: 660, margin: '0 auto', padding: '24px 20px' }}>

        {/* Workout Header */}
        <div style={{ marginBottom: '28px' }}>
          <span className="chip" style={{ marginBottom: 16, display: 'inline-block' }}>
            {goalLabels[workout.goal] || workout.goal} &middot; {levelLabels[workout.level] || workout.level} &middot; {workout.days.length}-Day Plan
          </span>
          <h1 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 'clamp(44px,8vw,80px)', lineHeight: 0.9, letterSpacing: 1,
            margin: '0 0 10px',
          }}>
            <span className="text-gradient-white" style={{ display: 'block' }}>{day.name.toUpperCase()}</span>
            <span className="text-gradient-brand" style={{ display: 'block' }}>READY</span>
          </h1>
          <p style={{ color: 'var(--whm)', fontSize: '0.85rem', fontWeight: 300, margin: '12px 0 8px', lineHeight: 1.6 }}>
            Generated from: your equipment &middot; your goal &middot; {levelLabels[workout.level]?.toLowerCase() || workout.level} level
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.68rem', color: 'var(--whm)', textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 600 }}>Using</span>
            {workout.equipment.map((e) => (
              <span key={e} style={{
                fontSize: '0.72rem', fontWeight: 500, color: 'var(--og)',
                padding: '4px 12px', borderRadius: '100px',
                background: 'rgba(224,120,48,0.08)', border: '1px solid rgba(224,120,48,0.2)',
              }}>{equipLabels[e] || e}</span>
            ))}
          </div>
        </div>

        {/* Day tabs */}
        {workout.days.length > 1 && (
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '20px' }}>
            {workout.days.map((d, i) => (
              <button
                key={i}
                onClick={() => setActiveDay(i)}
                className="chip"
                style={{
                  whiteSpace: 'nowrap', transition: 'all 0.2s',
                  background: i === activeDay ? 'rgba(224,120,48,0.15)' : undefined,
                  borderColor: i === activeDay ? 'var(--og)' : undefined,
                  color: i === activeDay ? '#fff' : undefined,
                  boxShadow: i === activeDay ? '0 0 14px rgba(224,120,48,.25)' : 'none',
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
          borderRadius: 24, padding: '24px',
          background: 'linear-gradient(160deg, rgba(34,197,94,0.07), rgba(34,197,94,0.02))',
          border: '1px solid rgba(34,197,94,0.18)',
          boxShadow: '0 20px 50px rgba(0,0,0,.3)',
          marginBottom: '18px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px' }}>
            <div style={{
              width: 50, height: 50, borderRadius: 16,
              background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.3rem', flexShrink: 0,
            }}>🔥</div>
            <div>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.2rem', letterSpacing: 3, color: 'var(--gr)', margin: 0 }}>WARM UP</h2>
              <p style={{ color: 'var(--whm)', fontSize: '0.78rem', margin: '2px 0 0', letterSpacing: 0.3 }}>{day.warmup.length} exercises</p>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {day.warmup.map((w, i) => {
              const { name, reps } = parseWarmupCooldown(w);
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '14px 18px', borderRadius: '14px',
                  background: 'rgba(34,197,94,0.04)', border: '1px solid rgba(34,197,94,0.1)',
                }}>
                  <span style={{ fontSize: '0.9rem', color: '#fff' }}>{name}</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--gr)' }}>{reps}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Workout Section */}
        <div style={{
          borderRadius: 24, padding: '24px',
          background: 'linear-gradient(160deg, rgba(224,120,48,0.07), rgba(224,120,48,0.02))',
          border: '1px solid rgba(224,120,48,0.18)',
          boxShadow: '0 20px 50px rgba(0,0,0,.3)',
          marginBottom: '18px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px' }}>
            <div style={{
              width: 50, height: 50, borderRadius: 16,
              background: 'rgba(224,120,48,0.12)', border: '1px solid rgba(224,120,48,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.3rem', flexShrink: 0,
            }}>💪</div>
            <div>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.2rem', letterSpacing: 3, color: 'var(--og)', margin: 0 }}>MAIN WORKOUT</h2>
              <p style={{ color: 'var(--whm)', fontSize: '0.78rem', margin: '2px 0 0', letterSpacing: 0.3 }}>{day.exercises.length} exercises</p>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {day.exercises.map((ex) => (
              <div key={ex.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 18px', borderRadius: '14px',
                background: 'rgba(224,120,48,0.04)', border: '1px solid rgba(224,120,48,0.1)',
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
          borderRadius: 24, padding: '24px',
          background: 'linear-gradient(160deg, rgba(155,94,203,0.07), rgba(155,94,203,0.02))',
          border: '1px solid rgba(155,94,203,0.18)',
          boxShadow: '0 20px 50px rgba(0,0,0,.3)',
          marginBottom: '24px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px' }}>
            <div style={{
              width: 50, height: 50, borderRadius: 16,
              background: 'rgba(155,94,203,0.12)', border: '1px solid rgba(155,94,203,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.3rem', flexShrink: 0,
            }}>🧊</div>
            <div>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.2rem', letterSpacing: 3, color: 'var(--pl)', margin: 0 }}>COOL DOWN</h2>
              <p style={{ color: 'var(--whm)', fontSize: '0.78rem', margin: '2px 0 0', letterSpacing: 0.3 }}>{day.cooldown.length} exercises</p>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {day.cooldown.map((c, i) => {
              const { name, reps } = parseWarmupCooldown(c);
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '14px 18px', borderRadius: '14px',
                  background: 'rgba(155,94,203,0.04)', border: '1px solid rgba(155,94,203,0.1)',
                }}>
                  <span style={{ fontSize: '0.9rem', color: '#fff' }}>{name}</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--pl)' }}>{reps}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            className="btn-glow"
            style={{
              width: '100%', padding: 22, borderRadius: 100,
              background: 'linear-gradient(135deg,var(--og),var(--og2),var(--pm))',
              color: '#fff', fontSize: 28, letterSpacing: 3,
              border: 'none', cursor: 'pointer', textTransform: 'uppercase',
              fontFamily: "'Bebas Neue', sans-serif",
              transition: 'transform .3s',
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
    </div>
  );
}
