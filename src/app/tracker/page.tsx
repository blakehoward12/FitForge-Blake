'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { GeneratedWorkout, WorkoutDay, WorkoutExercise } from '@/lib/exercises';

const STORAGE_WORKOUT_KEY = 'ff_generated_workout';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SetState {
  done: boolean;
}

interface ExerciseState {
  sets: SetState[];
  weight: string;
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
  const [exerciseStates, setExerciseStates] = useState<Record<string, ExerciseState>>({});
  const [showCelebration, setShowCelebration] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);

  // Load workout
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_WORKOUT_KEY);
    if (!raw) {
      router.replace('/builder');
      return;
    }
    try {
      const w: GeneratedWorkout = JSON.parse(raw);
      setWorkout(w);

      // Initialize exercise states for first day
      const states: Record<string, ExerciseState> = {};
      for (const day of w.days) {
        for (const ex of day.exercises) {
          states[ex.id] = {
            sets: Array.from({ length: ex.sets }, () => ({ done: false })),
            weight: '',
          };
        }
        // Warmup & cooldown get simple toggle states
        day.warmup.forEach((_, i) => {
          states[`warmup_${i}`] = { sets: [{ done: false }], weight: '' };
        });
        day.cooldown.forEach((_, i) => {
          states[`cooldown_${i}`] = { sets: [{ done: false }], weight: '' };
        });
      }
      setExerciseStates(states);
    } catch {
      router.replace('/builder');
    }
  }, [router]);

  // Current day
  const day: WorkoutDay | null = workout?.days[activeDay] ?? null;

  // ── Derived stats ──────────────────────────────────────────────────────
  const completedSets = useMemo(() => {
    if (!day) return 0;
    return day.exercises.reduce((sum, ex) => {
      const state = exerciseStates[ex.id];
      if (!state) return sum;
      return sum + state.sets.filter((s) => s.done).length;
    }, 0);
  }, [day, exerciseStates]);

  const totalSets = useMemo(() => {
    if (!day) return 0;
    return day.exercises.reduce((sum, ex) => sum + ex.sets, 0);
  }, [day]);

  const volume = useMemo(() => {
    if (!day) return 0;
    return day.exercises.reduce((sum, ex) => {
      const state = exerciseStates[ex.id];
      if (!state) return sum;
      const w = parseFloat(state.weight) || 0;
      const doneSets = state.sets.filter((s) => s.done).length;
      return sum + w * doneSets * ex.reps;
    }, 0);
  }, [day, exerciseStates]);

  const progressPct = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;

  // XP: 10 per set completed
  useEffect(() => {
    setXpEarned(completedSets * 10);
  }, [completedSets]);

  // ── Check completion ───────────────────────────────────────────────────
  useEffect(() => {
    if (!day || totalSets === 0) return;
    if (completedSets === totalSets && !showCelebration) {
      setShowCelebration(true);
      spawnConfetti();
    }
  }, [completedSets, totalSets, day, showCelebration]);

  // ── Toggle set ─────────────────────────────────────────────────────────
  const toggleSet = useCallback((exerciseId: string, setIndex: number) => {
    setExerciseStates((prev) => {
      const state = prev[exerciseId];
      if (!state) return prev;
      const newSets = [...state.sets];
      newSets[setIndex] = { ...newSets[setIndex], done: !newSets[setIndex].done };
      return { ...prev, [exerciseId]: { ...state, sets: newSets } };
    });
  }, []);

  // ── Update weight ──────────────────────────────────────────────────────
  const updateWeight = useCallback((exerciseId: string, weight: string) => {
    setExerciseStates((prev) => {
      const state = prev[exerciseId];
      if (!state) return prev;
      return { ...prev, [exerciseId]: { ...state, weight } };
    });
  }, []);

  // ── Save completed workout ─────────────────────────────────────────────
  const handleComplete = async () => {
    try {
      await fetch('/api/workouts/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workout: workout,
          day: activeDay,
          volume,
          setsCompleted: completedSets,
          xp: xpEarned,
          completedAt: new Date().toISOString(),
        }),
      });
    } catch {
      // Silently fail if API not available
    }
    setShowCelebration(false);
    router.push('/builder');
  };

  // ── Find current exercise (first incomplete) ──────────────────────────
  const currentExercise: WorkoutExercise | null = useMemo(() => {
    if (!day) return null;
    return day.exercises.find((ex) => {
      const state = exerciseStates[ex.id];
      return state && state.sets.some((s) => !s.done);
    }) ?? null;
  }, [day, exerciseStates]);

  // ── Loading state ──────────────────────────────────────────────────────
  if (!workout || !day) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading tracker...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pb-24">
      {/* ── Celebration Modal ─────────────────────────────────────────── */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="card max-w-md w-full mx-4 text-center space-y-6 !p-8">
            <div className="text-6xl">🎉</div>
            <h2 className="font-[family-name:var(--font-heading)] text-3xl tracking-wide text-gradient-brand">
              WORKOUT COMPLETE!
            </h2>
            <div className="flex items-center justify-around">
              <div className="text-center">
                <div className="text-2xl font-bold text-[var(--gr)]">{volume.toLocaleString()}</div>
                <div className="text-[11px] text-gray-500 uppercase tracking-wider">Volume (lbs)</div>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="text-center">
                <div className="text-2xl font-bold text-[var(--og)]">{completedSets}</div>
                <div className="text-[11px] text-gray-500 uppercase tracking-wider">Sets</div>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="text-center">
                <div className="text-2xl font-bold text-[var(--pl)]">+{xpEarned}</div>
                <div className="text-[11px] text-gray-500 uppercase tracking-wider">XP</div>
              </div>
            </div>
            <div className="flex flex-col gap-3 pt-2">
              <button className="btn-primary w-full" onClick={handleComplete}>
                Save & Continue
              </button>
              <button className="btn-ghost w-full text-sm" onClick={() => setShowCelebration(false)}>
                Keep Editing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Sticky Header ─────────────────────────────────────────────── */}
      <div className="sticky top-0 z-40 bg-[var(--bg)]/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-2xl mx-auto px-4 py-3">
          {/* Current exercise & stats */}
          <div className="flex items-center justify-between mb-2">
            <div className="min-w-0">
              <h2 className="font-[family-name:var(--font-heading)] text-lg tracking-wide text-gradient-white truncate">
                {currentExercise ? `${currentExercise.emoji} ${currentExercise.name}` : 'All Done!'}
              </h2>
              <p className="text-xs text-gray-500">{day.name}</p>
            </div>
            <div className="flex items-center gap-4 shrink-0 text-xs">
              <div className="text-center">
                <div className="font-bold text-[var(--pl)]">+{xpEarned}</div>
                <div className="text-gray-600">XP</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-[var(--og)]">{volume.toLocaleString()}</div>
                <div className="text-gray-600">lbs</div>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-2 rounded-full bg-white/5 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[var(--og)] to-[var(--og2)] transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="text-[10px] text-gray-500 mt-1 text-right">
            {completedSets}/{totalSets} sets &middot; {progressPct}%
          </div>
        </div>
      </div>

      {/* ── Day tabs ──────────────────────────────────────────────────── */}
      {workout.days.length > 1 && (
        <div className="max-w-2xl mx-auto px-4 pt-4 pb-2">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {workout.days.map((d, i) => (
              <button
                key={i}
                onClick={() => { setActiveDay(i); setShowCelebration(false); }}
                className={`chip whitespace-nowrap transition-all ${
                  i === activeDay
                    ? 'bg-[var(--og)]/20 border-[var(--og)] text-white'
                    : 'hover:border-white/20'
                }`}
              >
                Day {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto px-4 pt-4 space-y-6">
        {/* ── Warm Up ─────────────────────────────────────────────────── */}
        <section>
          <h3 className="font-[family-name:var(--font-heading)] text-sm tracking-wider text-gray-500 mb-2">
            WARM UP
          </h3>
          <div className="card space-y-2" style={{ padding: "20px" }}>
            {day.warmup.map((w, i) => {
              const key = `warmup_${i}`;
              const done = exerciseStates[key]?.sets[0]?.done ?? false;
              return (
                <button
                  key={i}
                  onClick={() => toggleSet(key, 0)}
                  className={`flex items-center gap-3 w-full text-left text-sm py-1 transition-colors ${
                    done ? 'text-[var(--gr)] line-through opacity-60' : 'text-gray-300'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs shrink-0 transition-colors ${
                    done ? 'bg-[var(--gr)] border-[var(--gr)] text-black' : 'border-white/20'
                  }`}>
                    {done && '✓'}
                  </span>
                  {w}
                </button>
              );
            })}
          </div>
        </section>

        {/* ── Main Exercises ──────────────────────────────────────────── */}
        <section>
          <h3 className="font-[family-name:var(--font-heading)] text-sm tracking-wider text-gray-500 mb-2">
            MAIN WORKOUT
          </h3>
          <div className="space-y-4">
            {day.exercises.map((ex) => {
              const state = exerciseStates[ex.id];
              if (!state) return null;
              const allDone = state.sets.every((s) => s.done);

              return (
                <div
                  key={ex.id}
                  className={`card transition-all ${allDone ? 'border-[var(--gr)]/30 bg-[var(--gr)]/5' : ''}`}
                  style={{ padding: "20px" }}
                >
                  {/* Exercise header */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-lg shrink-0">
                      {ex.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-semibold text-sm truncate ${allDone ? 'text-[var(--gr)]' : 'text-white'}`}>
                        {ex.name}
                      </h4>
                      <p className="text-xs text-gray-500 truncate">{ex.sets} &times; {ex.reps} &middot; {ex.category}</p>
                    </div>
                    {allDone && <span className="text-[var(--gr)] text-lg shrink-0">✓</span>}
                  </div>

                  {/* Weight input */}
                  <div className="flex items-center gap-2 mb-3">
                    <label className="text-xs text-gray-500 shrink-0">Weight:</label>
                    <input
                      type="number"
                      inputMode="decimal"
                      placeholder="lbs"
                      value={state.weight}
                      onChange={(e) => updateWeight(ex.id, e.target.value)}
                      className="input-field text-sm py-1.5 px-3 w-24"
                    />
                    <span className="text-xs text-gray-600">lbs</span>
                  </div>

                  {/* Set buttons */}
                  <div className="flex gap-2 flex-wrap">
                    {state.sets.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => toggleSet(ex.id, i)}
                        className={`w-12 h-12 rounded-xl font-bold text-sm flex items-center justify-center transition-all border ${
                          s.done
                            ? 'bg-[var(--gr)] border-[var(--gr)] text-black shadow-[0_0_12px_rgba(34,197,94,0.3)]'
                            : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/25'
                        }`}
                      >
                        {s.done ? '✓' : `S${i + 1}`}
                      </button>
                    ))}
                  </div>

                  {/* Tip */}
                  <p className="text-xs text-gray-600 mt-2 italic line-clamp-2">{ex.tip}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Cool Down ───────────────────────────────────────────────── */}
        <section>
          <h3 className="font-[family-name:var(--font-heading)] text-sm tracking-wider text-gray-500 mb-2">
            COOL DOWN
          </h3>
          <div className="card space-y-2" style={{ padding: "20px" }}>
            {day.cooldown.map((c, i) => {
              const key = `cooldown_${i}`;
              const done = exerciseStates[key]?.sets[0]?.done ?? false;
              return (
                <button
                  key={i}
                  onClick={() => toggleSet(key, 0)}
                  className={`flex items-center gap-3 w-full text-left text-sm py-1 transition-colors ${
                    done ? 'text-[var(--gr)] line-through opacity-60' : 'text-gray-300'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs shrink-0 transition-colors ${
                    done ? 'bg-[var(--gr)] border-[var(--gr)] text-black' : 'border-white/20'
                  }`}>
                    {done && '✓'}
                  </span>
                  {c}
                </button>
              );
            })}
          </div>
        </section>

        {/* ── Bottom actions ──────────────────────────────────────────── */}
        <div className="flex flex-col gap-3 pt-4">
          <button
            className="btn-primary w-full text-lg py-4 btn-glow font-[family-name:var(--font-heading)] tracking-wider disabled:opacity-40 disabled:animate-none"
            disabled={completedSets < totalSets}
            onClick={() => { setShowCelebration(true); spawnConfetti(); }}
          >
            FINISH WORKOUT
          </button>
          <button
            className="btn-ghost w-full"
            onClick={() => router.push('/review')}
          >
            &larr; Back to Review
          </button>
        </div>
      </div>
    </main>
  );
}
