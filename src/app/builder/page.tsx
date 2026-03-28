'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { Equipment, Goal, Level } from '@/lib/exercises';
import { generateWorkout } from '@/lib/exercises';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const EQUIPMENT_OPTIONS: { id: Equipment; label: string; emoji: string }[] = [
  { id: 'bodyweight', label: 'Bodyweight', emoji: '🤸' },
  { id: 'dumbbells', label: 'Dumbbells', emoji: '🏋️' },
  { id: 'barbell', label: 'Barbell', emoji: '🏗️' },
  { id: 'cables', label: 'Cables', emoji: '📡' },
  { id: 'bands', label: 'Bands', emoji: '🔗' },
  { id: 'bench', label: 'Bench', emoji: '🪑' },
  { id: 'pullup', label: 'Pull-Up Bar', emoji: '🧗' },
  { id: 'full_gym', label: 'Full Gym', emoji: '🏢' },
];

const GOAL_OPTIONS: { id: Goal; label: string; emoji: string; desc: string }[] = [
  { id: 'muscle', label: 'Build Muscle', emoji: '💪', desc: 'Hypertrophy-focused training' },
  { id: 'strength', label: 'Get Strong', emoji: '🏋️', desc: 'Heavy compound lifts' },
  { id: 'tone', label: 'Tone & Define', emoji: '✨', desc: 'Lean muscle definition' },
  { id: 'fat_loss', label: 'Burn Fat', emoji: '🔥', desc: 'High-rep metabolic work' },
  { id: 'athletic', label: 'Athletic Power', emoji: '⚡', desc: 'Explosive performance' },
  { id: 'endurance', label: 'Endurance', emoji: '🏃', desc: 'Stamina & work capacity' },
];

const LEVEL_OPTIONS: { id: Level; label: string; emoji: string }[] = [
  { id: 'beginner', label: 'Beginner', emoji: '🌱' },
  { id: 'intermediate', label: 'Intermediate', emoji: '🌿' },
  { id: 'advanced', label: 'Advanced', emoji: '🌳' },
];

const DAY_OPTIONS = [
  { days: 1, label: '1 Day', premium: false },
  { days: 3, label: '3 Days', premium: false },
  { days: 5, label: '5 Days', premium: true },
  { days: 7, label: '7 Days', premium: true },
];

const FREE_WORKOUT_LIMIT = 3;
const STORAGE_COUNT_KEY = 'ff_workout_count';
const STORAGE_WORKOUT_KEY = 'ff_generated_workout';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function BuilderPage() {
  const router = useRouter();

  // Step state
  const [step, setStep] = useState<1 | 2>(1);

  // Selections
  const [equipment, setEquipment] = useState<Set<Equipment>>(new Set(['bodyweight']));
  const [goal, setGoal] = useState<Goal | null>(null);
  const [level, setLevel] = useState<Level>('intermediate');
  const [planDays, setPlanDays] = useState<number>(3);

  // Auth gate
  const [showAuthGate, setShowAuthGate] = useState(false);

  // ── Equipment toggle ──────────────────────────────────────────────────
  const toggleEquipment = useCallback((id: Equipment) => {
    if (id === 'bodyweight') return; // Always selected
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

  // ── Generate workout ──────────────────────────────────────────────────
  const handleGenerate = () => {
    if (!goal) return;

    // Check free usage (simple client-side check; no auth integration wired yet)
    const count = getFreeCount();
    if (count >= FREE_WORKOUT_LIMIT) {
      setShowAuthGate(true);
      return;
    }

    const workout = generateWorkout(goal, level, planDays, Array.from(equipment));
    localStorage.setItem(STORAGE_WORKOUT_KEY, JSON.stringify(workout));
    incrementCount();
    router.push('/review');
  };

  // ── Auth gate modal ───────────────────────────────────────────────────
  const AuthGateModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="card max-w-md w-full mx-4 text-center space-y-5">
        <div className="text-5xl">🔒</div>
        <h2 className="font-[family-name:var(--font-heading)] text-2xl tracking-wide text-gradient-brand">
          Free Limit Reached
        </h2>
        <p className="text-gray-400 text-sm leading-relaxed">
          You&apos;ve used {FREE_WORKOUT_LIMIT} free workouts. Sign in to generate unlimited plans and track your progress.
        </p>
        <div className="flex flex-col gap-3">
          <button
            className="btn-primary w-full"
            onClick={() => router.push('/login?returnUrl=/builder')}
          >
            Sign In / Sign Up
          </button>
          <button
            className="btn-ghost w-full"
            onClick={() => setShowAuthGate(false)}
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen pb-20">
      {showAuthGate && <AuthGateModal />}

      {/* Header */}
      <div className="max-w-2xl mx-auto px-4 pt-10 pb-6 text-center">
        <h1 className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl tracking-wide text-gradient-white">
          BUILD YOUR WORKOUT
        </h1>
        <p className="text-gray-400 mt-2 text-sm">
          Step {step} of 2 &mdash;{' '}
          {step === 1 ? 'Select your equipment' : 'Choose your goal & settings'}
        </p>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-3 mt-5">
          <div
            className={`h-1.5 w-16 rounded-full transition-colors ${
              step >= 1 ? 'bg-gradient-to-r from-[var(--og)] to-[var(--og2)]' : 'bg-white/10'
            }`}
          />
          <div
            className={`h-1.5 w-16 rounded-full transition-colors ${
              step >= 2 ? 'bg-gradient-to-r from-[var(--og)] to-[var(--og2)]' : 'bg-white/10'
            }`}
          />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4">
        {/* ── STEP 1: Equipment ──────────────────────────────────────── */}
        {step === 1 && (
          <section className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {EQUIPMENT_OPTIONS.map((eq) => {
                const selected = equipment.has(eq.id);
                return (
                  <button
                    key={eq.id}
                    onClick={() => toggleEquipment(eq.id)}
                    className={`card flex flex-col items-center gap-2 py-5 cursor-pointer transition-all ${
                      selected
                        ? 'border-[var(--og)] bg-[var(--og)]/10 shadow-[0_0_20px_rgba(224,120,48,0.15)]'
                        : 'hover:border-white/20'
                    } ${eq.id === 'bodyweight' ? 'opacity-90 ring-1 ring-[var(--gr)]/30' : ''}`}
                  >
                    <span className="text-3xl">{eq.emoji}</span>
                    <span className={`text-sm font-medium ${selected ? 'text-white' : 'text-gray-400'}`}>
                      {eq.label}
                    </span>
                    {eq.id === 'bodyweight' && (
                      <span className="text-[10px] text-[var(--gr)] font-semibold uppercase tracking-wider">
                        Always On
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <button
              className="btn-primary w-full text-lg"
              onClick={() => setStep(2)}
            >
              Continue &rarr;
            </button>
          </section>
        )}

        {/* ── STEP 2: Goal, Level, Days ──────────────────────────────── */}
        {step === 2 && (
          <section className="space-y-8">
            {/* Back button */}
            <button className="btn-ghost text-sm py-2 px-4" onClick={() => setStep(1)}>
              &larr; Back to Equipment
            </button>

            {/* Goal selection */}
            <div>
              <h2 className="font-[family-name:var(--font-heading)] text-xl tracking-wide text-gradient-brand mb-3">
                YOUR GOAL
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {GOAL_OPTIONS.map((g) => {
                  const selected = goal === g.id;
                  return (
                    <button
                      key={g.id}
                      onClick={() => setGoal(g.id)}
                      className={`card flex flex-col items-center gap-1.5 py-4 cursor-pointer transition-all text-center ${
                        selected
                          ? 'border-[var(--og)] bg-[var(--og)]/10 shadow-[0_0_20px_rgba(224,120,48,0.15)]'
                          : 'hover:border-white/20'
                      }`}
                    >
                      <span className="text-2xl">{g.emoji}</span>
                      <span className={`text-sm font-semibold ${selected ? 'text-white' : 'text-gray-300'}`}>
                        {g.label}
                      </span>
                      <span className="text-[11px] text-gray-500">{g.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Level selection */}
            <div>
              <h2 className="font-[family-name:var(--font-heading)] text-xl tracking-wide text-gradient-brand mb-3">
                EXPERIENCE LEVEL
              </h2>
              <div className="flex gap-3">
                {LEVEL_OPTIONS.map((l) => {
                  const selected = level === l.id;
                  return (
                    <button
                      key={l.id}
                      onClick={() => setLevel(l.id)}
                      className={`card flex-1 flex flex-col items-center gap-1.5 py-4 cursor-pointer transition-all ${
                        selected
                          ? 'border-[var(--pl)] bg-[var(--pl)]/10 shadow-[0_0_20px_rgba(155,94,203,0.15)]'
                          : 'hover:border-white/20'
                      }`}
                    >
                      <span className="text-xl">{l.emoji}</span>
                      <span className={`text-sm font-semibold ${selected ? 'text-white' : 'text-gray-300'}`}>
                        {l.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Plan length */}
            <div>
              <h2 className="font-[family-name:var(--font-heading)] text-xl tracking-wide text-gradient-brand mb-3">
                PLAN LENGTH
              </h2>
              <div className="flex gap-3">
                {DAY_OPTIONS.map((d) => {
                  const selected = planDays === d.days;
                  return (
                    <button
                      key={d.days}
                      onClick={() => !d.premium && setPlanDays(d.days)}
                      className={`card flex-1 flex flex-col items-center gap-1 py-4 cursor-pointer transition-all relative ${
                        selected
                          ? 'border-[var(--og)] bg-[var(--og)]/10'
                          : d.premium
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:border-white/20'
                      }`}
                    >
                      <span className={`text-lg font-bold ${selected ? 'text-white' : 'text-gray-300'}`}>
                        {d.label}
                      </span>
                      {d.premium && (
                        <span className="text-[10px] text-[var(--og)] font-semibold uppercase tracking-wider">
                          Premium
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Generate button */}
            <button
              className="btn-primary w-full text-lg py-4 disabled:opacity-40"
              onClick={handleGenerate}
              disabled={!goal}
            >
              Generate My Workout &rarr;
            </button>

            {/* Free counter */}
            <p className="text-center text-xs text-gray-500">
              {FREE_WORKOUT_LIMIT - getFreeCount()} free workout{FREE_WORKOUT_LIMIT - getFreeCount() !== 1 ? 's' : ''} remaining
            </p>
          </section>
        )}
      </div>
    </main>
  );
}
