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

  return (
    <main className="min-h-screen pb-24">
      {/* Header */}
      <div className="max-w-2xl mx-auto px-4 pt-10 pb-4 text-center">
        <h1 className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl tracking-wide text-gradient-white">
          YOUR WORKOUT PLAN
        </h1>
        <p className="text-gray-400 mt-1 text-sm">
          {goalLabels[workout.goal]} &middot; {workout.level} &middot; {workout.days.length} day{workout.days.length > 1 ? 's' : ''}
        </p>
      </div>

      {/* Stats bar */}
      <div className="max-w-2xl mx-auto px-4 mb-6">
        <div className="card flex items-center justify-around py-4">
          <div className="text-center">
            <div className="text-xl font-bold text-gradient-brand">{totalExercises(workout.days)}</div>
            <div className="text-[11px] text-gray-500 uppercase tracking-wider">Exercises</div>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center">
            <div className="text-xl font-bold text-gradient-brand">{totalSets(workout.days)}</div>
            <div className="text-[11px] text-gray-500 uppercase tracking-wider">Total Sets</div>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center">
            <div className="text-xl font-bold text-gradient-brand">~{estimatedMinutes(workout.days)}</div>
            <div className="text-[11px] text-gray-500 uppercase tracking-wider">Minutes</div>
          </div>
        </div>
      </div>

      {/* Day tabs */}
      {workout.days.length > 1 && (
        <div className="max-w-2xl mx-auto px-4 mb-6">
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

      <div className="max-w-2xl mx-auto px-4 space-y-6">
        {/* Warm Up */}
        <section>
          <h2 className="font-[family-name:var(--font-heading)] text-lg tracking-wide text-gradient-brand mb-3 flex items-center gap-2">
            <span>🔥</span> WARM UP
          </h2>
          <div className="card space-y-2">
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
              <div key={ex.id} className="card flex items-center gap-3">
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
          <div className="card space-y-2">
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
            className="btn-primary w-full !text-xl !py-5 btn-glow font-[family-name:var(--font-heading)] tracking-wider justify-center"
            onClick={() => router.push('/tracker')}
          >
            LET&apos;S GO &rarr;
          </button>
          <button
            className="btn-ghost w-full"
            onClick={() => router.push('/builder')}
          >
            &larr; Change Selections
          </button>
        </div>
      </div>
    </main>
  );
}
