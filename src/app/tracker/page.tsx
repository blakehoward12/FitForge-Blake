'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { GeneratedWorkout, WorkoutDay } from '@/lib/exercises';

const STORAGE_WORKOUT_KEY = 'ff_generated_workout';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface FlatExercise {
  id: string;
  name: string;
  emoji: string;
  section: 'warmup' | 'main' | 'cooldown';
  sectionLabel: string;
  sets: number;
  reps: number;
  tip: string;
  youtubeQuery: string;
  category: string;
}

// ---------------------------------------------------------------------------
// Confetti helper
// ---------------------------------------------------------------------------

function spawnConfetti() {
  const colors = ['#e07830', '#c85a8a', '#9b5ecb', '#22c55e', '#5a2d82', '#fff'];
  for (let i = 0; i < 60; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    el.style.left = `${Math.random() * 100}vw`;
    el.style.background = colors[Math.floor(Math.random() * colors.length)];
    el.style.animationDelay = `${Math.random() * 1.5}s`;
    el.style.animationDuration = `${2 + Math.random() * 2}s`;
    el.style.width = `${6 + Math.random() * 8}px`;
    el.style.height = `${6 + Math.random() * 8}px`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 5000);
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function TrackerPage() {
  const router = useRouter();
  const [workout, setWorkout] = useState<GeneratedWorkout | null>(null);
  const [activeDay, setActiveDay] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [weights, setWeights] = useState<Record<string, string>>({});
  const [showCelebration, setShowCelebration] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);

  // Load workout
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_WORKOUT_KEY);
    if (!raw) { router.replace('/builder'); return; }
    try { setWorkout(JSON.parse(raw)); } catch { router.replace('/builder'); }
  }, [router]);

  const day: WorkoutDay | null = workout?.days[activeDay] ?? null;

  // Flatten all exercises into a single ordered list
  const flatExercises: FlatExercise[] = useMemo(() => {
    if (!day) return [];
    const list: FlatExercise[] = [];

    day.warmup.forEach((w, i) => {
      const parts = w.match(/^(.+?)(\d+\s*.*)$/);
      const name = parts ? parts[1].trim() : w;
      const repsStr = parts ? parts[2].trim() : `${8 + i * 2} reps`;
      list.push({
        id: `warmup_${i}`,
        name,
        emoji: ['🐛', '🔵', '🔃', '🔄'][i % 4],
        section: 'warmup',
        sectionLabel: 'WARM UP',
        sets: 1,
        reps: parseInt(repsStr) || 10,
        tip: '',
        youtubeQuery: `${name} exercise form`,
        category: 'warmup',
      });
    });

    day.exercises.forEach((ex) => {
      list.push({
        id: ex.id,
        name: ex.name,
        emoji: ex.emoji,
        section: 'main',
        sectionLabel: 'MAIN WORKOUT',
        sets: ex.sets,
        reps: ex.reps,
        tip: ex.tip,
        youtubeQuery: ex.youtubeQuery,
        category: ex.category,
      });
    });

    day.cooldown.forEach((c, i) => {
      const parts = c.match(/^(.+?)(\d+\s*.*)$/);
      const name = parts ? parts[1].trim() : c;
      list.push({
        id: `cooldown_${i}`,
        name,
        emoji: '🧊',
        section: 'cooldown',
        sectionLabel: 'COOL DOWN',
        sets: 1,
        reps: 1,
        tip: '',
        youtubeQuery: `${name} stretch`,
        category: 'cooldown',
      });
    });

    return list;
  }, [day]);

  const totalExercises = flatExercises.length;
  const currentExercise = flatExercises[currentIndex] ?? null;
  const completedCount = completedIds.size;
  const progressPct = totalExercises > 0 ? Math.round((completedCount / totalExercises) * 100) : 0;

  // Calculate volume
  const volume = useMemo(() => {
    if (!day) return 0;
    let total = 0;
    for (const ex of day.exercises) {
      if (completedIds.has(ex.id)) {
        const w = parseFloat(weights[ex.id] || '0') || 0;
        total += w * ex.sets * ex.reps;
      }
    }
    return total;
  }, [day, completedIds, weights]);

  // XP calculation
  useEffect(() => {
    setXpEarned(completedCount * 10);
  }, [completedCount]);

  // Check completion
  useEffect(() => {
    if (totalExercises > 0 && completedCount === totalExercises && !showCelebration) {
      setShowCelebration(true);
      spawnConfetti();
    }
  }, [completedCount, totalExercises, showCelebration]);

  const markDone = useCallback(() => {
    if (!currentExercise) return;
    setCompletedIds((prev) => {
      const next = new Set(prev);
      next.add(currentExercise.id);
      return next;
    });
    // Auto-advance to next incomplete exercise
    if (currentIndex < totalExercises - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentExercise, currentIndex, totalExercises]);

  const handleComplete = async () => {
    try {
      await fetch('/api/workouts/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workout,
          dayLabel: day?.name || 'Workout',
          totalVolume: volume,
          totalSets: completedCount,
          xpEarned,
          exercises: flatExercises.filter(e => completedIds.has(e.id)).map(e => e.name),
          completedAt: new Date().toISOString(),
        }),
      });
    } catch { /* silently fail */ }
    setShowCelebration(false);
    router.push('/profile');
  };

  if (!workout || !day || !currentExercise) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--whm)' }}>Loading tracker...</div>
      </main>
    );
  }

  const sectionColor = currentExercise.section === 'warmup' ? 'var(--gr)' :
    currentExercise.section === 'cooldown' ? 'var(--pl)' : 'var(--og)';

  const repsLabel = currentExercise.section === 'warmup'
    ? `${currentExercise.reps} each`
    : currentExercise.section === 'cooldown'
      ? '30s hold'
      : `${currentExercise.sets} set${currentExercise.sets > 1 ? 's' : ''} \u00b7 ${currentExercise.reps} reps`;

  return (
    <main style={{ minHeight: '100vh', paddingBottom: '6rem' }}>
      {/* ── Celebration Modal ─────────────────────────────────────────── */}
      {showCelebration && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 50,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
        }}>
          <div className="card" style={{ maxWidth: '400px', width: '100%', margin: '0 16px', textAlign: 'center', padding: '32px' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '16px' }}>🎉</div>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.75rem', letterSpacing: 3, marginBottom: '20px' }} className="text-gradient-brand">
              WORKOUT COMPLETE!
            </h2>
            <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '24px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--gr)' }}>{volume.toLocaleString()}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--whm)', textTransform: 'uppercase', letterSpacing: 1 }}>Volume (lbs)</div>
              </div>
              <div style={{ width: 1, background: 'var(--br)' }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--og)' }}>{completedCount}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--whm)', textTransform: 'uppercase', letterSpacing: 1 }}>Exercises</div>
              </div>
              <div style={{ width: 1, background: 'var(--br)' }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--pl)' }}>+{xpEarned}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--whm)', textTransform: 'uppercase', letterSpacing: 1 }}>XP</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button className="btn-primary" onClick={handleComplete} style={{ width: '100%', justifyContent: 'center', display: 'flex', padding: '14px' }}>Save & Continue</button>
              <button className="btn-ghost" onClick={() => setShowCelebration(false)} style={{ width: '100%', justifyContent: 'center', display: 'flex' }}>Keep Editing</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Sticky Header ─────────────────────────────────────────────── */}
      <div style={{
        position: 'sticky', top: 56, zIndex: 40,
        background: 'rgba(10,10,15,0.95)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{ maxWidth: 660, margin: '0 auto', padding: '12px 20px' }}>
          {/* Top row: section + exercise name + stats + close */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: '0.65rem', color: 'var(--whm)', textTransform: 'uppercase', letterSpacing: 2, margin: 0 }}>
                {currentExercise.section === 'warmup' ? '🔥' : currentExercise.section === 'cooldown' ? '🧊' : '💪'} {currentExercise.sectionLabel}
              </p>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.25rem', letterSpacing: 2, margin: '2px 0 0', color: '#fff' }}>
                {currentExercise.emoji} {currentExercise.name.toUpperCase()}
              </h2>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
              <div style={{
                padding: '6px 12px', borderRadius: '10px',
                background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.2)',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--gr)' }}>{xpEarned}</div>
                <div style={{ fontSize: '0.55rem', color: 'var(--whm)', textTransform: 'uppercase' }}>XP</div>
              </div>
              <div style={{
                padding: '6px 12px', borderRadius: '10px',
                background: 'rgba(255,255,255,0.04)', border: '1px solid var(--br)',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--whm)' }}>{volume}</div>
                <div style={{ fontSize: '0.55rem', color: 'var(--whm)', textTransform: 'uppercase' }}>LBS</div>
              </div>
              <button
                onClick={() => router.push('/review')}
                style={{
                  width: 36, height: 36, borderRadius: '10px',
                  background: 'rgba(255,255,255,0.04)', border: '1px solid var(--br)',
                  color: 'var(--whm)', cursor: 'pointer', fontSize: '1rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                ✕
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 2,
              background: 'linear-gradient(90deg, var(--og), var(--og2))',
              width: `${progressPct}%`, transition: 'width 0.5s',
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
            <span style={{ fontSize: '0.65rem', color: 'var(--whm)' }}>Exercise {currentIndex + 1} of {totalExercises}</span>
            <span style={{ fontSize: '0.65rem', color: 'var(--og)' }}>{progressPct}%</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 660, margin: '0 auto', padding: '16px 20px' }}>
        {/* ── Exercise Pills ──────────────────────────────────────────── */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '20px' }}>
          {flatExercises.map((ex, i) => {
            const isDone = completedIds.has(ex.id);
            const isCurrent = i === currentIndex;
            const pillColor = ex.section === 'warmup' ? 'var(--gr)' : ex.section === 'cooldown' ? 'var(--pl)' : 'var(--whm)';
            return (
              <button
                key={ex.id}
                onClick={() => setCurrentIndex(i)}
                style={{
                  whiteSpace: 'nowrap', cursor: 'pointer', flexShrink: 0,
                  padding: '6px 14px', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 600,
                  border: `1px solid ${isCurrent ? pillColor : isDone ? 'var(--gr)' : 'var(--br)'}`,
                  background: isDone ? 'rgba(34,197,94,0.15)' : isCurrent ? 'rgba(255,255,255,0.06)' : 'transparent',
                  color: isDone ? 'var(--gr)' : isCurrent ? pillColor : 'var(--whm)',
                }}
              >
                {isDone ? '✓' : ''}{ex.emoji} {ex.name}
              </button>
            );
          })}
        </div>

        {/* ── Exercise Card ───────────────────────────────────────────── */}
        <div style={{
          borderRadius: 20, padding: '32px 24px',
          background: currentExercise.section === 'warmup'
            ? 'rgba(34,197,94,0.04)' : currentExercise.section === 'cooldown'
              ? 'rgba(155,94,203,0.04)' : 'rgba(224,120,48,0.03)',
          border: `1px solid ${currentExercise.section === 'warmup'
            ? 'rgba(34,197,94,0.15)' : currentExercise.section === 'cooldown'
              ? 'rgba(155,94,203,0.15)' : 'rgba(224,120,48,0.12)'}`,
          textAlign: 'center',
        }}>
          {/* Emoji + How-to */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div style={{ fontSize: '3rem' }}>{currentExercise.emoji}</div>
            <a
              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(currentExercise.youtubeQuery)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '6px 14px', borderRadius: '10px',
                background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)',
                color: '#ef4444', fontSize: '0.75rem', fontWeight: 600,
                textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px',
              }}
            >
              <span style={{ fontSize: '0.8rem' }}>▶</span> How-to
            </a>
          </div>

          {/* Name */}
          <h2 style={{
            fontFamily: "'Bebas Neue', sans-serif", fontSize: '2rem',
            letterSpacing: 3, margin: '0 0 4px', textAlign: 'left',
          }}>
            {currentExercise.name.toUpperCase()}
          </h2>
          <p style={{ color: 'var(--whm)', fontSize: '0.85rem', textAlign: 'left', marginBottom: '20px' }}>
            {repsLabel}
          </p>

          {/* Weight input for main exercises */}
          {currentExercise.section === 'main' && (
            <div style={{ marginBottom: '16px', textAlign: 'left' }}>
              <label style={{ fontSize: '0.7rem', color: 'var(--whm)', textTransform: 'uppercase', letterSpacing: 1 }}>Weight (lbs)</label>
              <input
                type="number"
                inputMode="decimal"
                placeholder="0"
                value={weights[currentExercise.id] || ''}
                onChange={(e) => setWeights(prev => ({ ...prev, [currentExercise.id]: e.target.value }))}
                className="input-field"
                style={{ marginTop: '6px', fontSize: '1.1rem', padding: '12px 16px' }}
              />
            </div>
          )}

          {/* Tip */}
          {currentExercise.tip && (
            <div style={{
              padding: '14px 18px', borderRadius: '12px',
              background: 'rgba(255,193,7,0.06)', border: '1px solid rgba(255,193,7,0.12)',
              textAlign: 'left', marginBottom: '20px',
            }}>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255,193,7,0.85)', margin: 0 }}>
                💡 {currentExercise.tip}
              </p>
            </div>
          )}

          {/* Mark as Done button */}
          {completedIds.has(currentExercise.id) ? (
            <div style={{
              width: '100%', padding: '18px', borderRadius: '16px',
              background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)',
              color: 'var(--gr)', fontSize: '1rem', fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            }}>
              ✓ Done
            </div>
          ) : (
            <button
              onClick={markDone}
              style={{
                width: '100%', padding: '18px', borderRadius: '16px',
                background: 'rgba(255,255,255,0.06)', border: '1px solid var(--br)',
                color: '#fff', fontSize: '1rem', fontWeight: 600,
                cursor: 'pointer', transition: 'all 0.2s',
              }}
              onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
              onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
            >
              Mark as Done
            </button>
          )}
        </div>

        {/* ── Prev / Next Buttons ─────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '20px' }}>
          <button
            className="btn-ghost"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            style={{ justifyContent: 'center', display: 'flex', padding: '16px' }}
          >
            &larr; Prev
          </button>
          {currentIndex < totalExercises - 1 ? (
            <button
              className="btn-ghost"
              onClick={() => setCurrentIndex(currentIndex + 1)}
              style={{ justifyContent: 'center', display: 'flex', padding: '16px', color: '#fff', borderColor: 'rgba(255,255,255,0.2)' }}
            >
              Next Exercise &rarr;
            </button>
          ) : (
            <button
              className="btn-primary"
              disabled={completedCount < totalExercises}
              onClick={() => { setShowCelebration(true); spawnConfetti(); }}
              style={{ justifyContent: 'center', display: 'flex', padding: '16px' }}
            >
              Finish Workout
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
