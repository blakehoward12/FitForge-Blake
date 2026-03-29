'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { GeneratedWorkout, WorkoutDay } from '@/lib/exercises';

const STORAGE_WORKOUT_KEY = 'ff_generated_workout';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function totalSets(days: WorkoutDay[]): number {
  return days.reduce((sum, d) => sum + d.exercises.reduce((s, e) => s + e.sets, 0), 0);
}

function totalExercises(days: WorkoutDay[]): number {
  return days.reduce((sum, d) => sum + d.exercises.length, 0);
}

function estimatedMinutes(days: WorkoutDay[]): number {
  // ~2 min per set + warmup/cooldown
  const setTime = totalSets(days) * 2;
  return Math.round(setTime + days.length * 8);
}

const goalLabels: Record<string, string> = {
  muscle: 'Build Muscle', strength: 'Get Strong', tone: 'Tone & Define',
  fat_loss: 'Burn Fat', athletic: 'Athletic Power', endurance: 'Endurance',
};

const equipLabels: Record<string, string> = {
  bodyweight: 'Bodyweight', dumbbells: 'Dumbbells', barbell: 'Barbell',
  cables: 'Cables', bands: 'Bands', bench: 'Bench', pullup: 'Pull-Up Bar',
  full_gym: 'Full Gym',
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ReviewPage() {
  const router = useRouter();
  const [workout, setWorkout] = useState<GeneratedWorkout | null>(null);
  const [activeDay, setActiveDay] = useState(0);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_WORKOUT_KEY);
    if (!raw) {
      router.replace('/builder');
      return;
    }
    try {
      setWorkout(JSON.parse(raw));
    } catch {
      router.replace('/builder');
    }
  }, [router]);

  if (!workout) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading workout...</div>
      </main>
    );
  }

  const day = workout.days[activeDay];
  const firstDayName = workout.days[0]?.name?.toUpperCase() || 'WORKOUT';
  const equipList = workout.equipment.map((e) => equipLabels[e] || e).join(', ');

  return (
    <main className="min-h-screen pb-24">
      {/* Header */}
      <div style={{ maxWidth: 660, padding: '40px 20px 16px', marginBottom: 32 }} className="mx-auto">
        <span className="chip" style={{ marginBottom: 12, display: 'inline-block' }}>Your Workout</span>
        <h1
          className="font-[family-name:var(--font-heading)]"
          style={{ fontSize: 'clamp(44px,8vw,80px)', lineHeight: 0.93, marginBottom: 10, marginTop: 0 }}
        >
          <span className="text-gradient-white" style={{ display: 'block' }}>{firstDayName}</span>
          <span className="text-gradient-brand" style={{ display: 'block' }}>READY</span>
        </h1>
        <p style={{ color: 'var(--whm)', fontSize: 13, fontWeight: 300, marginTop: 10, lineHeight: 1.6, marginBottom: 4 }}>
          {goalLabels[workout.goal]} &middot; {equipList}
        </p>
        <p style={{ color: 'var(--og)', fontSize: 12, fontWeight: 500, marginTop: 4 }}>
          {equipList}
        </p>
      </div>

      {/* Auth CTA banner */}
      <div style={{ maxWidth: 660, padding: '0 20px' }} className="mx-auto">
        <div className="auth-cta">
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>Save your progress &amp; track PRs</div>
            <div style={{ fontSize: 12, color: 'var(--whm)', fontWeight: 300, marginTop: 4 }}>
              Create a free account to save this workout, log weights, and see your streak.
            </div>
          </div>
          <button className="btn-primary" style={{ whiteSpace: 'nowrap', padding: '10px 20px', fontSize: 11, flexShrink: 0 }}>
            Sign Up Free &rarr;
          </button>
        </div>
      </div>

      {/* Stats grid */}
      <div style={{ maxWidth: 660, padding: '0 20px' }} className="mx-auto">
        <div className="rv-stats">
          <div style={{ background: 'var(--whh)', border: '1px solid var(--br)', borderRadius: 14, padding: '14px 8px', textAlign: 'center' }}>
            <div className="font-[family-name:var(--font-heading)] text-gradient-brand" style={{ fontSize: 26 }}>{totalExercises(workout.days)}</div>
            <div style={{ fontSize: 9, color: 'var(--whm)', letterSpacing: 1, textTransform: 'uppercase', marginTop: 2 }}>Exercises</div>
          </div>
          <div style={{ background: 'var(--whh)', border: '1px solid var(--br)', borderRadius: 14, padding: '14px 8px', textAlign: 'center' }}>
            <div className="font-[family-name:var(--font-heading)] text-gradient-brand" style={{ fontSize: 26 }}>{totalSets(workout.days)}</div>
            <div style={{ fontSize: 9, color: 'var(--whm)', letterSpacing: 1, textTransform: 'uppercase', marginTop: 2 }}>Total Sets</div>
          </div>
          <div style={{ background: 'var(--whh)', border: '1px solid var(--br)', borderRadius: 14, padding: '14px 8px', textAlign: 'center' }}>
            <div className="font-[family-name:var(--font-heading)] text-gradient-brand" style={{ fontSize: 26 }}>~{estimatedMinutes(workout.days)}</div>
            <div style={{ fontSize: 9, color: 'var(--whm)', letterSpacing: 1, textTransform: 'uppercase', marginTop: 2 }}>Minutes</div>
          </div>
          <div style={{ background: 'var(--whh)', border: '1px solid var(--br)', borderRadius: 14, padding: '14px 8px', textAlign: 'center' }}>
            <div style={{ fontSize: 18, marginBottom: 2 }}>🔥</div>
            <div style={{ fontSize: 9, color: 'var(--whm)', letterSpacing: 1, textTransform: 'uppercase', marginTop: 2 }}>22 Streak</div>
          </div>
        </div>
      </div>

      {/* Day tabs */}
      {workout.days.length > 1 && (
        <div style={{ maxWidth: 660, padding: '0 20px', marginBottom: 24 }} className="mx-auto">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {workout.days.map((d, i) => (
              <button
                key={i}
                onClick={() => setActiveDay(i)}
                className={`chip whitespace-nowrap transition-all ${
                  i === activeDay
                    ? 'bg-[var(--og)]/20 border-[var(--og)] text-white'
                    : 'hover:border-white/20'
                }`}
              >
                Day {i + 1}: {d.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div style={{ maxWidth: 660, padding: '0 20px' }} className="mx-auto space-y-6">
        {/* Warm Up */}
        <section>
          <h2 className="font-[family-name:var(--font-heading)] text-lg tracking-wide text-gradient-brand mb-3 flex items-center gap-2">
            <span>🔥</span> WARM UP
          </h2>
          <div className="card space-y-2" style={{ padding: "20px" }}>
            {day.warmup.map((w, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-gray-300 min-w-0">
                <span className="text-[var(--og)] font-bold text-xs w-5 shrink-0">{i + 1}</span>
                <span className="truncate">{w}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Main Workout */}
        <section>
          <h2 className="font-[family-name:var(--font-heading)] text-lg tracking-wide text-gradient-brand mb-3 flex items-center gap-2">
            <span>💪</span> MAIN WORKOUT
          </h2>
          <div className="space-y-3">
            {day.exercises.map((ex) => (
              <div key={ex.id} className="card flex items-center gap-3" style={{ padding: "20px" }}>
                {/* Emoji circle */}
                <div className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xl shrink-0">
                  {ex.emoji}
                </div>
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-white text-sm truncate max-w-[180px] sm:max-w-none">{ex.name}</h3>
                    <span className="chip text-[10px] py-0.5 px-2 shrink-0">{ex.category}</span>
                  </div>
                  <div className="text-[var(--og)] font-bold text-sm mt-0.5">
                    {ex.sets} sets &times; {ex.reps} reps
                  </div>
                  <p className="text-gray-500 text-xs mt-0.5 line-clamp-2">{ex.tip}</p>
                </div>
                {/* YouTube button */}
                <a
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(ex.youtubeQuery)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 w-9 h-9 rounded-full bg-[var(--pl)]/10 border border-[var(--pl)]/20 flex items-center justify-center text-[var(--pl)] hover:text-white hover:bg-[var(--pl)]/20 transition-colors"
                  title="Watch on YouTube"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.5 6.19a3.02 3.02 0 00-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.55A3.02 3.02 0 00.5 6.19 31.6 31.6 0 000 12a31.6 31.6 0 00.5 5.81 3.02 3.02 0 002.12 2.14c1.88.55 9.38.55 9.38.55s7.5 0 9.38-.55a3.02 3.02 0 002.12-2.14A31.6 31.6 0 0024 12a31.6 31.6 0 00-.5-5.81zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
                  </svg>
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Cool Down */}
        <section>
          <h2 className="font-[family-name:var(--font-heading)] text-lg tracking-wide text-gradient-brand mb-3 flex items-center gap-2">
            <span>🧊</span> COOL DOWN
          </h2>
          <div className="card space-y-2" style={{ padding: "20px" }}>
            {day.cooldown.map((c, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-gray-300 min-w-0">
                <span className="text-[var(--pl)] font-bold text-xs w-5 shrink-0">{i + 1}</span>
                <span className="truncate">{c}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Action buttons */}
        <div className="flex flex-col gap-3 pt-4">
          <button
            className="animate-glow font-[family-name:var(--font-heading)]"
            style={{
              width: '100%',
              padding: 22,
              borderRadius: 18,
              background: 'linear-gradient(135deg,var(--oe),var(--og2),var(--pm))',
              boxShadow: '0 12px 40px rgba(120,45,15,.35)',
              color: '#fff',
              fontSize: 26,
              letterSpacing: 3,
              border: 'none',
              cursor: 'pointer',
              textTransform: 'uppercase',
              transition: 'transform .3s, box-shadow .3s',
            }}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
            onClick={() => router.push('/tracker')}
          >
            LET&apos;S GO 🔥
          </button>
          <button
            className="btn-ghost w-full justify-center"
            onClick={() => router.push('/builder')}
          >
            &larr; Change Selections
          </button>
        </div>
      </div>
    </main>
  );
}
