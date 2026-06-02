'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import type { GeneratedWorkout, WorkoutDay } from '@/lib/exercises';

const STORAGE_WORKOUT_KEY = 'ff_generated_workout';

const equipLabels: Record<string, string> = {
  bodyweight: 'Bodyweight', dumbbells: 'Dumbbells', barbell: 'Barbell',
  cables: 'Cables', bands: 'Bands', bench: 'Bench', pullup: 'Pull-Up Bar',
  full_gym: 'Full Gym',
};

const goalLabels: Record<string, string> = {
  muscle: 'Build Muscle', strength: 'Strength', tone: 'Tone & Define',
  fat_loss: 'Fat Loss', athletic: 'Athletic', endurance: 'Endurance',
};

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
  repsLabel: string;
  tip: string;
  youtubeQuery: string;
  category: string;
}

/** Parse "High knees (30s)" → { name: "High knees", reps: "30s" } */
function parseWarmupCooldown(str: string): { name: string; reps: string } {
  const match = str.match(/^(.+?)\s*\((.+?)\)\s*$/);
  if (match) return { name: match[1].trim(), reps: match[2].trim() };
  return { name: str, reps: '' };
}

// ---------------------------------------------------------------------------
// High-quality confetti
// ---------------------------------------------------------------------------

function spawnConfetti() {
  const colors = ['#e07830', '#c85a8a', '#9b5ecb', '#22c55e', '#5a2d82', '#fff', '#fbbf24', '#ef4444'];
  const shapes = ['circle', 'rect', 'rect'];
  const container = document.createElement('div');
  container.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9999;overflow:hidden;';
  document.body.appendChild(container);

  for (let i = 0; i < 120; i++) {
    const el = document.createElement('div');
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = 6 + Math.random() * 10;
    const x = Math.random() * 100;
    const rotation = Math.random() * 360;
    const duration = 1.8 + Math.random() * 1.5;
    const drift = (Math.random() - 0.5) * 200;

    el.style.cssText = `
      position:absolute;
      top:-20px;
      left:${x}%;
      width:${shape === 'circle' ? size : size * 0.6}px;
      height:${size}px;
      background:${color};
      border-radius:${shape === 'circle' ? '50%' : '2px'};
      transform:rotate(${rotation}deg);
      animation:confetti-burst ${duration}s cubic-bezier(.25,.46,.45,.94) forwards;
      --drift:${drift}px;
      opacity:0.9;
    `;
    container.appendChild(el);
  }

  setTimeout(() => container.remove(), 4000);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function TrackerPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [workout, setWorkout] = useState<GeneratedWorkout | null>(null);
  const [activeDay, setActiveDay] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [weights, setWeights] = useState<Record<string, string>>({});
  const [showCelebration, setShowCelebration] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [feedCaption, setFeedCaption] = useState('');
  const [postingToFeed, setPostingToFeed] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_WORKOUT_KEY);
    if (!raw) { router.replace('/builder'); return; }
    try { setWorkout(JSON.parse(raw)); } catch { router.replace('/builder'); }
  }, [router]);

  const day: WorkoutDay | null = workout?.days[activeDay] ?? null;

  const flatExercises: FlatExercise[] = useMemo(() => {
    if (!day) return [];
    const list: FlatExercise[] = [];

    day.warmup.forEach((w, i) => {
      const { name, reps } = parseWarmupCooldown(w);
      list.push({
        id: `warmup_${i}`, name, emoji: ['🔥', '🔵', '🔃', '🔄'][i % 4],
        section: 'warmup', sectionLabel: 'WARM UP',
        sets: 1, reps: parseInt(reps) || 10, repsLabel: reps || '30s',
        tip: '', youtubeQuery: `${name} exercise form`, category: 'warmup',
      });
    });

    day.exercises.forEach((ex) => {
      list.push({
        id: ex.id, name: ex.name, emoji: ex.emoji,
        section: 'main', sectionLabel: 'MAIN WORKOUT',
        sets: ex.sets, reps: ex.reps,
        repsLabel: `${ex.sets} set${ex.sets > 1 ? 's' : ''} \u00b7 ${ex.reps} reps`,
        tip: ex.tip, youtubeQuery: ex.youtubeQuery, category: ex.category,
      });
    });

    day.cooldown.forEach((c, i) => {
      const { name, reps } = parseWarmupCooldown(c);
      list.push({
        id: `cooldown_${i}`, name, emoji: '🧊',
        section: 'cooldown', sectionLabel: 'COOL DOWN',
        sets: 1, reps: 1, repsLabel: reps || '30s',
        tip: '', youtubeQuery: `${name} stretch`, category: 'cooldown',
      });
    });

    return list;
  }, [day]);

  const totalExercises = flatExercises.length;
  const currentExercise = flatExercises[currentIndex] ?? null;
  const completedCount = completedIds.size;
  const progressPct = totalExercises > 0 ? Math.round((completedCount / totalExercises) * 100) : 0;

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

  useEffect(() => { setXpEarned(completedCount * 10); }, [completedCount]);

  // Auto-generate caption when celebration shows
  useEffect(() => {
    if (showCelebration && workout && day) {
      const equipList = workout.equipment.map(e => equipLabels[e] || e).join(', ');
      const goalLabel = goalLabels[workout.goal] || workout.goal;
      const exerciseNames = day.exercises.slice(0, 3).map(e => e.name).join(', ');
      const moreCount = day.exercises.length > 3 ? ` +${day.exercises.length - 3} more` : '';
      setFeedCaption(
        `Just crushed my ${goalLabel} workout! 💪🔥 ${day.exercises.length} exercises including ${exerciseNames}${moreCount}. ${volume > 0 ? `Moved ${volume.toLocaleString()} lbs total. ` : ''}Using ${equipList}. #FitForge`
      );
    }
  }, [showCelebration, workout, day, volume]);

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
    if (currentIndex < totalExercises - 1) setCurrentIndex(currentIndex + 1);
  }, [currentExercise, currentIndex, totalExercises]);

  const handlePostAndContinue = async () => {
    setPostingToFeed(true);
    try {
      // Save completed workout
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
      // Post to feed if caption exists
      if (feedCaption.trim() && session?.user) {
        await fetch('/api/feed', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ caption: feedCaption }),
        });
      }
    } catch { /* silently fail */ }
    setPostingToFeed(false);
    setShowCelebration(false);
    router.push('/feed');
  };

  if (!workout || !day || !currentExercise) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--whm)' }}>Loading tracker...</div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: '100vh', paddingBottom: '6rem' }}>
      {/* ── Celebration Modal ─────────────────────────────────────────── */}
      {showCelebration && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 50,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(5,5,9,0.82)', backdropFilter: 'blur(14px)',
          animation: 'fadeUp 0.4s ease both',
        }}>
          {/* Brand glow behind the modal */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'radial-gradient(ellipse at 50% 42%, rgba(224,120,48,.22) 0%, transparent 55%)',
          }} />
          <div className="card animate-pop" style={{
            position: 'relative', maxWidth: '440px', width: '100%', margin: '0 16px',
            textAlign: 'center', padding: '40px 32px',
            background: 'linear-gradient(160deg, rgba(255,255,255,.05), rgba(255,255,255,.02))',
            boxShadow: '0 40px 100px rgba(0,0,0,.6)',
          }}>
            <div style={{
              width: 76, height: 76, margin: '0 auto 18px', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.6rem',
              background: 'linear-gradient(135deg, var(--og), var(--og2), var(--pm))',
              boxShadow: '0 12px 40px rgba(224,120,48,.45)',
            }}>🎉</div>
            <p style={{ fontSize: '0.65rem', color: 'var(--whm)', textTransform: 'uppercase', letterSpacing: 2.5, margin: '0 0 6px' }}>
              Session forged
            </p>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.4rem', letterSpacing: 2, lineHeight: 0.95, marginBottom: '24px' }} className="text-gradient-brand">
              WORKOUT COMPLETE!
            </h2>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
              {[
                { v: volume.toLocaleString(), l: 'Volume (lbs)', c: 'var(--gr)', bg: 'rgba(34,197,94,0.08)', br: 'rgba(34,197,94,0.18)' },
                { v: completedCount, l: 'Exercises', c: 'var(--og)', bg: 'rgba(224,120,48,0.08)', br: 'rgba(224,120,48,0.18)' },
                { v: `+${xpEarned}`, l: 'XP', c: 'var(--pl)', bg: 'rgba(155,94,203,0.08)', br: 'rgba(155,94,203,0.18)' },
              ].map((s) => (
                <div key={s.l} style={{ flex: 1, padding: '14px 6px', borderRadius: '14px', background: s.bg, border: `1px solid ${s.br}` }}>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.7rem', letterSpacing: 1, color: s.c, lineHeight: 1 }}>{s.v}</div>
                  <div style={{ fontSize: '0.58rem', color: 'var(--whm)', textTransform: 'uppercase', letterSpacing: 1, marginTop: 4 }}>{s.l}</div>
                </div>
              ))}
            </div>

            {/* Share to Feed */}
            <div style={{
              background: 'rgba(255,255,255,0.03)', border: '1px solid var(--br)',
              borderRadius: '16px', padding: '16px', marginBottom: '20px', textAlign: 'left',
            }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--whm)', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: '10px' }}>
                Share to Feed
              </div>
              <textarea
                value={feedCaption}
                onChange={(e) => setFeedCaption(e.target.value)}
                rows={3}
                style={{
                  width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--br)',
                  borderRadius: '12px', padding: '12px 14px', color: '#fff', fontSize: '0.85rem',
                  resize: 'none', outline: 'none', fontFamily: "'DM Sans', sans-serif",
                  lineHeight: 1.5, boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                className="btn-primary animate-glow"
                onClick={handlePostAndContinue}
                disabled={postingToFeed}
                style={{ width: '100%', justifyContent: 'center', display: 'flex', padding: '16px', borderRadius: '100px', fontSize: '12px' }}
              >
                {postingToFeed ? 'Posting...' : 'Post & Continue 🔥'}
              </button>
              <button className="btn-ghost" onClick={() => setShowCelebration(false)} style={{ width: '100%', justifyContent: 'center', display: 'flex' }}>Keep Editing</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Sticky Header ─────────────────────────────────────────────── */}
      <div style={{
        position: 'sticky', top: 56, zIndex: 40,
        background: 'rgba(10,10,15,0.78)', backdropFilter: 'blur(18px)',
        borderBottom: '1px solid var(--br)',
        boxShadow: '0 8px 30px rgba(0,0,0,.35)',
      }}>
        <div style={{ maxWidth: 660, margin: '0 auto', padding: '14px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: '0.62rem', color: 'var(--og)', textTransform: 'uppercase', letterSpacing: 2.5, margin: 0, fontWeight: 600 }}>
                {currentExercise.section === 'warmup' ? '🔥' : currentExercise.section === 'cooldown' ? '🧊' : '💪'} {currentExercise.sectionLabel}
              </p>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.35rem', letterSpacing: 2, margin: '3px 0 0', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {currentExercise.emoji} {currentExercise.name.toUpperCase()}
              </h2>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
              <div style={{ padding: '7px 12px', borderRadius: '12px', background: 'rgba(155,94,203,0.12)', border: '1px solid rgba(155,94,203,0.22)', textAlign: 'center' }}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.05rem', letterSpacing: 1, color: 'var(--pl)', lineHeight: 1 }}>{xpEarned}</div>
                <div style={{ fontSize: '0.5rem', color: 'var(--whm)', textTransform: 'uppercase', letterSpacing: 1, marginTop: 2 }}>XP</div>
              </div>
              <div style={{ padding: '7px 12px', borderRadius: '12px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', textAlign: 'center' }}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.05rem', letterSpacing: 1, color: 'var(--gr)', lineHeight: 1 }}>{volume}</div>
                <div style={{ fontSize: '0.5rem', color: 'var(--whm)', textTransform: 'uppercase', letterSpacing: 1, marginTop: 2 }}>LBS</div>
              </div>
              <button
                onClick={() => router.push('/review')}
                style={{
                  width: 38, height: 38, borderRadius: '12px',
                  background: 'rgba(255,255,255,0.04)', border: '1px solid var(--br)',
                  color: 'var(--whm)', cursor: 'pointer', fontSize: '1rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s',
                }}
                onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#fff'; }}
                onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'var(--whm)'; }}
              >✕</button>
            </div>
          </div>
          <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: 3, background: 'linear-gradient(90deg, var(--og), var(--og2), var(--pl))', width: `${progressPct}%`, transition: 'width 0.5s', boxShadow: '0 0 12px rgba(224,120,48,.5)' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
            <span style={{ fontSize: '0.65rem', color: 'var(--whm)', letterSpacing: 0.5 }}>Exercise {currentIndex + 1} of {totalExercises}</span>
            <span style={{ fontSize: '0.65rem', color: 'var(--og)', fontWeight: 600 }}>{progressPct}%</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 660, margin: '0 auto', padding: '16px 20px' }}>
        {/* ── Exercise Pills ──────────────────────────────────────────── */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '20px' }}>
          {flatExercises.map((ex, i) => {
            const isDone = completedIds.has(ex.id);
            const isCurrent = i === currentIndex;
            const pillColor = ex.section === 'warmup' ? 'var(--gr)' : ex.section === 'cooldown' ? 'var(--pl)' : 'var(--og)';
            return (
              <button
                key={ex.id}
                onClick={() => setCurrentIndex(i)}
                style={{
                  whiteSpace: 'nowrap', cursor: 'pointer', flexShrink: 0,
                  padding: '7px 15px', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 600,
                  letterSpacing: 0.3, transition: 'all 0.2s',
                  border: `1px solid ${isCurrent ? pillColor : isDone ? 'rgba(34,197,94,0.35)' : 'var(--br)'}`,
                  background: isDone ? 'rgba(34,197,94,0.12)' : isCurrent ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.02)',
                  color: isDone ? 'var(--gr)' : isCurrent ? pillColor : 'var(--whm)',
                  boxShadow: isCurrent ? `0 0 14px ${ex.section === 'warmup' ? 'rgba(34,197,94,.2)' : ex.section === 'cooldown' ? 'rgba(155,94,203,.2)' : 'rgba(224,120,48,.2)'}` : 'none',
                }}
              >
                {isDone ? '✓ ' : ''}{ex.emoji} {ex.name}
              </button>
            );
          })}
        </div>

        {/* ── Exercise Card ───────────────────────────────────────────── */}
        <div style={{
          position: 'relative', borderRadius: 24, padding: '32px 24px', overflow: 'hidden',
          background: currentExercise.section === 'warmup'
            ? 'linear-gradient(160deg, rgba(34,197,94,0.07), rgba(34,197,94,0.02))' : currentExercise.section === 'cooldown'
              ? 'linear-gradient(160deg, rgba(155,94,203,0.07), rgba(155,94,203,0.02))' : 'linear-gradient(160deg, rgba(224,120,48,0.07), rgba(224,120,48,0.02))',
          border: `1px solid ${currentExercise.section === 'warmup'
            ? 'rgba(34,197,94,0.18)' : currentExercise.section === 'cooldown'
              ? 'rgba(155,94,203,0.18)' : 'rgba(224,120,48,0.16)'}`,
          boxShadow: '0 24px 60px rgba(0,0,0,.35)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
            <div style={{
              width: 68, height: 68, borderRadius: 18, fontSize: '2.4rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(255,255,255,0.05)', border: '1px solid var(--br)',
            }}>{currentExercise.emoji}</div>
            <a
              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(currentExercise.youtubeQuery)}`}
              target="_blank" rel="noopener noreferrer"
              style={{
                padding: '8px 15px', borderRadius: '100px',
                background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)',
                color: '#ef4444', fontSize: '0.72rem', fontWeight: 600, letterSpacing: 0.5,
                textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px',
              }}
            >
              <span style={{ fontSize: '0.8rem' }}>▶</span> How-to
            </a>
          </div>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.3rem', letterSpacing: 2.5, lineHeight: 0.95, margin: '0 0 6px', textAlign: 'left' }}>
            {currentExercise.name.toUpperCase()}
          </h2>
          <p style={{ color: 'var(--whm)', fontSize: '0.85rem', textAlign: 'left', marginBottom: '22px', letterSpacing: 0.3 }}>
            {currentExercise.repsLabel}
          </p>

          {currentExercise.section === 'main' && (
            <div style={{ marginBottom: '16px', textAlign: 'left' }}>
              <label style={{ fontSize: '0.68rem', color: 'var(--whm)', textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 600 }}>Weight (lbs)</label>
              <input
                type="number" inputMode="decimal" placeholder="0"
                value={weights[currentExercise.id] || ''}
                onChange={(e) => setWeights(prev => ({ ...prev, [currentExercise.id]: e.target.value }))}
                className="input-field"
                style={{ marginTop: '8px', fontSize: '1.1rem', padding: '12px 16px' }}
              />
            </div>
          )}

          {currentExercise.tip && (
            <div style={{
              padding: '14px 18px', borderRadius: '14px',
              background: 'rgba(255,193,7,0.06)', border: '1px solid rgba(255,193,7,0.14)',
              textAlign: 'left', marginBottom: '20px',
            }}>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255,193,7,0.85)', margin: 0, lineHeight: 1.55 }}>
                💡 {currentExercise.tip}
              </p>
            </div>
          )}

          {completedIds.has(currentExercise.id) ? (
            <div style={{
              width: '100%', padding: '18px', borderRadius: '100px',
              background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)',
              color: 'var(--gr)', fontSize: '0.95rem', fontWeight: 700, letterSpacing: 1,
              textTransform: 'uppercase',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            }}>✓ Done</div>
          ) : (
            <button
              className="btn-primary"
              onClick={markDone}
              style={{
                width: '100%', justifyContent: 'center', display: 'flex',
                padding: '18px', borderRadius: '100px', fontSize: '12px',
              }}
            >Mark as Done ✓</button>
          )}
        </div>

        {/* ── Prev / Next Buttons ─────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '20px' }}>
          <button className="btn-ghost" disabled={currentIndex === 0} onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))} style={{ justifyContent: 'center', display: 'flex', padding: '16px' }}>
            &larr; Prev
          </button>
          {currentIndex < totalExercises - 1 ? (
            <button className="btn-ghost" onClick={() => setCurrentIndex(currentIndex + 1)} style={{ justifyContent: 'center', display: 'flex', padding: '16px', color: '#fff', borderColor: 'rgba(255,255,255,0.2)' }}>
              Next Exercise &rarr;
            </button>
          ) : (
            <button className="btn-primary btn-glow" disabled={completedCount < totalExercises} onClick={() => { setShowCelebration(true); spawnConfetti(); }} style={{ justifyContent: 'center', display: 'flex', padding: '16px' }}>
              Finish Workout 🔥
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
