// FitForge Exercise Database & Workout Engine
// ==============================================

export type Goal = 'muscle' | 'strength' | 'tone' | 'fat_loss' | 'athletic' | 'endurance';
export type Level = 'beginner' | 'intermediate' | 'advanced';
export type Category = 'chest' | 'shoulders' | 'back' | 'biceps' | 'triceps' | 'quads' | 'hamstrings' | 'glutes' | 'calves' | 'core';
export type Equipment = 'bodyweight' | 'dumbbells' | 'barbell' | 'cables' | 'bands' | 'bench' | 'pullup' | 'full_gym';
export type DayType = 'push' | 'pull' | 'legs' | 'fullA' | 'fullB' | 'upper' | 'lower' | 'power' | 'cardio';

export interface Exercise {
  name: string;
  emoji: string;
  equipment: Equipment[];
  category: Category;
  youtubeQuery: string;
  tip: string;
  sets: Record<Goal, [number, number]>;
}

export interface WorkoutExercise {
  id: string;
  name: string;
  emoji: string;
  sets: number;
  reps: number;
  tip: string;
  youtubeQuery: string;
  category: Category;
}

export interface WorkoutDay {
  name: string;
  type: DayType;
  warmup: string[];
  exercises: WorkoutExercise[];
  cooldown: string[];
}

export interface GeneratedWorkout {
  goal: Goal;
  level: Level;
  days: WorkoutDay[];
  equipment: Equipment[];
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Compound: muscle:[4,8], strength:[5,5], tone:[3,12], fat_loss:[3,12], athletic:[4,6], endurance:[3,15]
// Isolation: muscle:[3,12], strength:[3,10], tone:[3,15], fat_loss:[3,15], athletic:[3,12], endurance:[3,20]
// Bodyweight: muscle:[4,12], strength:[4,15], tone:[3,15], fat_loss:[4,20], athletic:[4,15], endurance:[4,25]
// ---------------------------------------------------------------------------

const COMPOUND: Record<Goal, [number, number]> = {
  muscle: [4, 8], strength: [5, 5], tone: [3, 12], fat_loss: [3, 12], athletic: [4, 6], endurance: [3, 15],
};
const ISOLATION: Record<Goal, [number, number]> = {
  muscle: [3, 12], strength: [3, 10], tone: [3, 15], fat_loss: [3, 15], athletic: [3, 12], endurance: [3, 20],
};
const BODYWEIGHT: Record<Goal, [number, number]> = {
  muscle: [4, 12], strength: [4, 15], tone: [3, 15], fat_loss: [4, 20], athletic: [4, 15], endurance: [4, 25],
};

export const EXERCISES: Record<string, Exercise> = {
  // ── CHEST ──────────────────────────────────────────────────────────────
  bench_press: {
    name: 'Bench Press', emoji: '🏋️', equipment: ['barbell', 'bench'], category: 'chest',
    youtubeQuery: 'bench press proper form', tip: 'Retract shoulder blades, arch slightly, drive feet into floor.',
    sets: COMPOUND,
  },
  db_bench: {
    name: 'DB Bench Press', emoji: '💪', equipment: ['dumbbells', 'bench'], category: 'chest',
    youtubeQuery: 'dumbbell bench press form', tip: 'Lower dumbbells to chest level, press up and slightly inward.',
    sets: COMPOUND,
  },
  incline_bb: {
    name: 'Incline Barbell Press', emoji: '📐', equipment: ['barbell', 'bench'], category: 'chest',
    youtubeQuery: 'incline barbell press form', tip: 'Set bench to 30-45 degrees. Keep wrists stacked over elbows.',
    sets: COMPOUND,
  },
  incline_db: {
    name: 'Incline DB Press', emoji: '🔺', equipment: ['dumbbells', 'bench'], category: 'chest',
    youtubeQuery: 'incline dumbbell press form', tip: 'Set bench to 30 degrees for upper chest emphasis.',
    sets: COMPOUND,
  },
  cable_fly: {
    name: 'Cable Fly', emoji: '🦅', equipment: ['cables'], category: 'chest',
    youtubeQuery: 'cable fly form', tip: 'Keep a slight bend in elbows, squeeze at the center.',
    sets: ISOLATION,
  },
  pushup: {
    name: 'Push-Ups', emoji: '🫸', equipment: ['bodyweight'], category: 'chest',
    youtubeQuery: 'push up proper form', tip: 'Keep core tight, elbows at 45 degrees, full range of motion.',
    sets: BODYWEIGHT,
  },
  decline_push: {
    name: 'Decline Push-Ups', emoji: '⬇️', equipment: ['bodyweight'], category: 'chest',
    youtubeQuery: 'decline push ups form', tip: 'Elevate feet on a bench or step for upper chest focus.',
    sets: BODYWEIGHT,
  },
  band_chest: {
    name: 'Band Chest Press', emoji: '🔗', equipment: ['bands'], category: 'chest',
    youtubeQuery: 'resistance band chest press', tip: 'Anchor band behind you, press forward with control.',
    sets: ISOLATION,
  },

  // ── SHOULDERS ──────────────────────────────────────────────────────────
  ohp: {
    name: 'Barbell OHP', emoji: '🏗️', equipment: ['barbell'], category: 'shoulders',
    youtubeQuery: 'overhead press form', tip: 'Brace core, press straight up, move head through at top.',
    sets: COMPOUND,
  },
  db_ohp: {
    name: 'DB Shoulder Press', emoji: '🎯', equipment: ['dumbbells'], category: 'shoulders',
    youtubeQuery: 'dumbbell shoulder press form', tip: 'Press from ear level, avoid excessive arching.',
    sets: COMPOUND,
  },
  lat_raise: {
    name: 'Lateral Raises', emoji: '🪽', equipment: ['dumbbells'], category: 'shoulders',
    youtubeQuery: 'lateral raise form', tip: 'Slight bend in elbows, raise to shoulder height, control the negative.',
    sets: ISOLATION,
  },
  cable_lat: {
    name: 'Cable Lateral Raises', emoji: '📡', equipment: ['cables'], category: 'shoulders',
    youtubeQuery: 'cable lateral raise form', tip: 'Constant tension throughout the range. Lead with the elbow.',
    sets: ISOLATION,
  },
  band_raise: {
    name: 'Band Lateral Raises', emoji: '🎗️', equipment: ['bands'], category: 'shoulders',
    youtubeQuery: 'band lateral raise', tip: 'Stand on the band, raise arms to sides with control.',
    sets: ISOLATION,
  },
  pike_push: {
    name: 'Pike Push-Ups', emoji: '⛰️', equipment: ['bodyweight'], category: 'shoulders',
    youtubeQuery: 'pike push up form', tip: 'Hips high, head between arms, lower forehead toward ground.',
    sets: BODYWEIGHT,
  },

  // ── BACK ───────────────────────────────────────────────────────────────
  deadlift: {
    name: 'Deadlift', emoji: '🔥', equipment: ['barbell'], category: 'back',
    youtubeQuery: 'deadlift proper form', tip: 'Hinge at hips, keep bar close, neutral spine throughout.',
    sets: COMPOUND,
  },
  bent_row: {
    name: 'Bent-Over Row', emoji: '🚣', equipment: ['barbell'], category: 'back',
    youtubeQuery: 'barbell bent over row form', tip: 'Hinge to 45 degrees, pull to lower chest, squeeze shoulder blades.',
    sets: COMPOUND,
  },
  db_row: {
    name: 'Single-Arm DB Row', emoji: '💪', equipment: ['dumbbells'], category: 'back',
    youtubeQuery: 'single arm dumbbell row form', tip: 'Brace on bench, pull to hip, keep torso stable.',
    sets: COMPOUND,
  },
  pullup: {
    name: 'Pull-Ups', emoji: '🧗', equipment: ['pullup'], category: 'back',
    youtubeQuery: 'pull up proper form', tip: 'Dead hang start, pull until chin clears bar, control descent.',
    sets: BODYWEIGHT,
  },
  chinup: {
    name: 'Chin-Ups', emoji: '💪', equipment: ['pullup'], category: 'back',
    youtubeQuery: 'chin up form', tip: 'Supinated grip, pull chin over bar, great for biceps too.',
    sets: BODYWEIGHT,
  },
  lat_pull: {
    name: 'Lat Pulldown', emoji: '⬇️', equipment: ['cables'], category: 'back',
    youtubeQuery: 'lat pulldown form', tip: 'Pull to upper chest, lean back slightly, squeeze lats.',
    sets: COMPOUND,
  },
  cable_row: {
    name: 'Seated Cable Row', emoji: '🚣', equipment: ['cables'], category: 'back',
    youtubeQuery: 'seated cable row form', tip: 'Sit tall, pull to navel, squeeze shoulder blades together.',
    sets: COMPOUND,
  },
  band_row: {
    name: 'Band Rows', emoji: '🔗', equipment: ['bands'], category: 'back',
    youtubeQuery: 'resistance band row', tip: 'Anchor low, pull to waist, keep elbows close.',
    sets: ISOLATION,
  },
  inverted_row: {
    name: 'Inverted Rows', emoji: '🔄', equipment: ['pullup'], category: 'back',
    youtubeQuery: 'inverted row form', tip: 'Keep body straight, pull chest to bar, scale by adjusting angle.',
    sets: BODYWEIGHT,
  },

  // ── BICEPS ─────────────────────────────────────────────────────────────
  barbell_curl: {
    name: 'Barbell Curl', emoji: '💪', equipment: ['barbell'], category: 'biceps',
    youtubeQuery: 'barbell curl form', tip: 'Keep elbows pinned to sides, full range of motion.',
    sets: ISOLATION,
  },
  db_curl: {
    name: 'Dumbbell Curl', emoji: '🏋️', equipment: ['dumbbells'], category: 'biceps',
    youtubeQuery: 'dumbbell curl form', tip: 'Supinate wrists at the top for peak contraction.',
    sets: ISOLATION,
  },
  hammer_curl: {
    name: 'Hammer Curl', emoji: '🔨', equipment: ['dumbbells'], category: 'biceps',
    youtubeQuery: 'hammer curl form', tip: 'Neutral grip targets brachialis and forearms.',
    sets: ISOLATION,
  },
  cable_curl: {
    name: 'Cable Curl', emoji: '📡', equipment: ['cables'], category: 'biceps',
    youtubeQuery: 'cable curl form', tip: 'Constant tension throughout — great finisher.',
    sets: ISOLATION,
  },
  band_curl: {
    name: 'Band Curl', emoji: '🔗', equipment: ['bands'], category: 'biceps',
    youtubeQuery: 'resistance band curl', tip: 'Stand on the band, curl with control.',
    sets: ISOLATION,
  },

  // ── TRICEPS ────────────────────────────────────────────────────────────
  skull_crusher: {
    name: 'Skull Crushers', emoji: '💀', equipment: ['barbell', 'bench'], category: 'triceps',
    youtubeQuery: 'skull crusher form', tip: 'Lower to forehead, keep elbows pointed at ceiling.',
    sets: ISOLATION,
  },
  db_tricep: {
    name: 'DB Tricep Extension', emoji: '🔺', equipment: ['dumbbells'], category: 'triceps',
    youtubeQuery: 'dumbbell tricep extension form', tip: 'Keep elbows close to head, full stretch at bottom.',
    sets: ISOLATION,
  },
  pushdown: {
    name: 'Tricep Pushdown', emoji: '⬇️', equipment: ['cables'], category: 'triceps',
    youtubeQuery: 'tricep pushdown form', tip: 'Keep elbows pinned, squeeze at the bottom.',
    sets: ISOLATION,
  },
  band_pushdown: {
    name: 'Band Pushdown', emoji: '🔗', equipment: ['bands'], category: 'triceps',
    youtubeQuery: 'resistance band tricep pushdown', tip: 'Anchor band high, press down with control.',
    sets: ISOLATION,
  },
  tricep_dip: {
    name: 'Tricep Dips', emoji: '🪑', equipment: ['bench'], category: 'triceps',
    youtubeQuery: 'bench tricep dip form', tip: 'Hands on bench edge, lower to 90 degrees, press up.',
    sets: BODYWEIGHT,
  },
  diamond_push: {
    name: 'Diamond Push-Ups', emoji: '💎', equipment: ['bodyweight'], category: 'triceps',
    youtubeQuery: 'diamond push up form', tip: 'Hands together under chest, elbows stay close to body.',
    sets: BODYWEIGHT,
  },

  // ── QUADS ──────────────────────────────────────────────────────────────
  bw_split_squat: {
    name: 'Split Squat', emoji: '🦵', equipment: ['bodyweight'], category: 'quads',
    youtubeQuery: 'split squat form', tip: 'Keep torso upright, lower back knee toward floor.',
    sets: BODYWEIGHT,
  },
  squat: {
    name: 'Barbell Back Squat', emoji: '🏋️', equipment: ['barbell'], category: 'quads',
    youtubeQuery: 'barbell back squat form', tip: 'Break at hips and knees simultaneously, hit parallel or below.',
    sets: COMPOUND,
  },
  goblet: {
    name: 'Goblet Squat', emoji: '🏆', equipment: ['dumbbells'], category: 'quads',
    youtubeQuery: 'goblet squat form', tip: 'Hold dumbbell at chest, sit between heels, elbows inside knees.',
    sets: COMPOUND,
  },
  split_squat: {
    name: 'Bulgarian Split Squat', emoji: '🇧🇬', equipment: ['dumbbells'], category: 'quads',
    youtubeQuery: 'bulgarian split squat form', tip: 'Rear foot elevated, lean slightly forward, drive through front heel.',
    sets: COMPOUND,
  },
  leg_press: {
    name: 'Leg Press', emoji: '🦿', equipment: ['full_gym'], category: 'quads',
    youtubeQuery: 'leg press form', tip: 'Feet shoulder-width, lower until 90 degrees, do not lock knees.',
    sets: COMPOUND,
  },
  lunges: {
    name: 'Walking Lunges', emoji: '🚶', equipment: ['bodyweight'], category: 'quads',
    youtubeQuery: 'walking lunges form', tip: 'Long steps, both knees to 90 degrees, stay upright.',
    sets: BODYWEIGHT,
  },
  db_lunge: {
    name: 'Dumbbell Lunges', emoji: '🏋️', equipment: ['dumbbells'], category: 'quads',
    youtubeQuery: 'dumbbell lunges form', tip: 'Hold dumbbells at sides, alternate legs, keep balance.',
    sets: COMPOUND,
  },

  // ── HAMSTRINGS ─────────────────────────────────────────────────────────
  rdl: {
    name: 'Romanian Deadlift', emoji: '🔥', equipment: ['barbell'], category: 'hamstrings',
    youtubeQuery: 'romanian deadlift form', tip: 'Soft knees, push hips back, feel the stretch in hamstrings.',
    sets: COMPOUND,
  },
  db_rdl: {
    name: 'DB Romanian Deadlift', emoji: '🏋️', equipment: ['dumbbells'], category: 'hamstrings',
    youtubeQuery: 'dumbbell romanian deadlift form', tip: 'Same hip hinge pattern, dumbbells slide down thighs.',
    sets: COMPOUND,
  },

  // ── GLUTES ─────────────────────────────────────────────────────────────
  hip_thrust: {
    name: 'Hip Thrust', emoji: '🍑', equipment: ['barbell', 'bench'], category: 'glutes',
    youtubeQuery: 'hip thrust form', tip: 'Back against bench, drive hips up, squeeze glutes at top.',
    sets: COMPOUND,
  },
  glute_bridge: {
    name: 'Glute Bridge', emoji: '🌉', equipment: ['bodyweight'], category: 'glutes',
    youtubeQuery: 'glute bridge form', tip: 'Feet flat, drive hips up, hold and squeeze at top.',
    sets: BODYWEIGHT,
  },
  band_glute: {
    name: 'Band Glute Kickback', emoji: '🔗', equipment: ['bands'], category: 'glutes',
    youtubeQuery: 'band glute kickback', tip: 'Loop band around ankles, kick back with control.',
    sets: ISOLATION,
  },

  // ── CALVES ─────────────────────────────────────────────────────────────
  calf_raise: {
    name: 'Calf Raises', emoji: '🦶', equipment: ['bodyweight'], category: 'calves',
    youtubeQuery: 'calf raise form', tip: 'Full stretch at bottom, pause at top, slow negatives.',
    sets: BODYWEIGHT,
  },

  // ── CORE ───────────────────────────────────────────────────────────────
  plank: {
    name: 'Plank', emoji: '🧱', equipment: ['bodyweight'], category: 'core',
    youtubeQuery: 'plank proper form', tip: 'Straight line from head to heels, brace core, breathe.',
    sets: BODYWEIGHT,
  },
  hanging_knee: {
    name: 'Hanging Knee Raise', emoji: '🦵', equipment: ['pullup'], category: 'core',
    youtubeQuery: 'hanging knee raise form', tip: 'Hang from bar, curl knees to chest, avoid swinging.',
    sets: BODYWEIGHT,
  },
  ab_wheel: {
    name: 'Ab Wheel Rollout', emoji: '🛞', equipment: ['full_gym'], category: 'core',
    youtubeQuery: 'ab wheel rollout form', tip: 'Start on knees, roll out slowly, keep core braced.',
    sets: BODYWEIGHT,
  },
  cable_crunch: {
    name: 'Cable Crunch', emoji: '📡', equipment: ['cables'], category: 'core',
    youtubeQuery: 'cable crunch form', tip: 'Kneel facing cable, crunch down bringing elbows to knees.',
    sets: ISOLATION,
  },
};

// ---------------------------------------------------------------------------
// Warmup & Cooldown Pools
// ---------------------------------------------------------------------------

export const WARMUP_POOL: string[] = [
  'Arm circles (30s)',
  'Leg swings (30s each)',
  'Hip circles (30s)',
  'High knees (30s)',
  'Butt kicks (30s)',
  'Jumping jacks (30s)',
  'Bodyweight squats (10 reps)',
  'Inchworms (5 reps)',
  'Cat-cow stretch (30s)',
  'Band pull-aparts (15 reps)',
  'Shoulder dislocations (10 reps)',
  'Glute bridges (10 reps)',
];

export const COOLDOWN_POOL: string[] = [
  'Standing quad stretch (30s each)',
  'Standing hamstring stretch (30s each)',
  'Chest doorway stretch (30s)',
  'Cross-body shoulder stretch (30s each)',
  'Seated forward fold (45s)',
  'Child\'s pose (45s)',
  'Supine twist (30s each)',
  'Hip flexor stretch (30s each)',
  'Calf stretch (30s each)',
  'Neck rolls (30s)',
  'Deep breathing (1 min)',
  'Foam rolling (2 min)',
];

// ---------------------------------------------------------------------------
// Day Templates – which categories each day type trains
// ---------------------------------------------------------------------------

const DAY_TEMPLATES: Record<DayType, Category[]> = {
  push: ['chest', 'shoulders', 'triceps'],
  pull: ['back', 'biceps'],
  legs: ['quads', 'hamstrings', 'glutes', 'calves'],
  fullA: ['chest', 'back', 'quads', 'core'],
  fullB: ['shoulders', 'hamstrings', 'glutes', 'biceps', 'triceps'],
  upper: ['chest', 'back', 'shoulders', 'biceps', 'triceps'],
  lower: ['quads', 'hamstrings', 'glutes', 'calves', 'core'],
  power: ['chest', 'back', 'quads', 'shoulders'],
  cardio: ['core', 'quads', 'glutes'],
};

// ---------------------------------------------------------------------------
// Split templates: days × goal → day-type sequence
// ---------------------------------------------------------------------------

export const SPLITS: Record<number, Record<Goal, DayType[]>> = {
  1: {
    muscle: ['fullA'],
    strength: ['power'],
    tone: ['fullA'],
    fat_loss: ['fullA'],
    athletic: ['power'],
    endurance: ['fullA'],
  },
  3: {
    muscle: ['push', 'pull', 'legs'],
    strength: ['push', 'pull', 'legs'],
    tone: ['fullA', 'fullB', 'legs'],
    fat_loss: ['fullA', 'fullB', 'cardio'],
    athletic: ['power', 'pull', 'legs'],
    endurance: ['fullA', 'fullB', 'cardio'],
  },
  5: {
    muscle: ['push', 'pull', 'legs', 'upper', 'lower'],
    strength: ['push', 'pull', 'legs', 'power', 'upper'],
    tone: ['fullA', 'fullB', 'legs', 'upper', 'cardio'],
    fat_loss: ['fullA', 'cardio', 'fullB', 'legs', 'cardio'],
    athletic: ['power', 'pull', 'legs', 'push', 'cardio'],
    endurance: ['fullA', 'cardio', 'fullB', 'cardio', 'legs'],
  },
  7: {
    muscle: ['push', 'pull', 'legs', 'push', 'pull', 'legs', 'fullA'],
    strength: ['push', 'pull', 'legs', 'power', 'upper', 'lower', 'power'],
    tone: ['fullA', 'cardio', 'fullB', 'legs', 'upper', 'cardio', 'lower'],
    fat_loss: ['fullA', 'cardio', 'fullB', 'cardio', 'legs', 'cardio', 'fullA'],
    athletic: ['power', 'pull', 'legs', 'push', 'cardio', 'power', 'legs'],
    endurance: ['fullA', 'cardio', 'fullB', 'cardio', 'legs', 'cardio', 'fullA'],
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Check whether the user's equipment covers everything an exercise requires */
export function canDo(exercise: Exercise, userEquipment: Equipment[]): boolean {
  return exercise.equipment.every((eq) => userEquipment.includes(eq));
}

/** Shuffle an array (Fisher-Yates) */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Pick N random items from pool */
function pickN<T>(pool: T[], n: number): T[] {
  return shuffle(pool).slice(0, n);
}

/** Modify sets/reps based on experience level */
export function applyLevelModifier(
  sets: number,
  reps: number,
  level: Level,
): { sets: number; reps: number } {
  switch (level) {
    case 'beginner':
      return { sets: Math.max(2, sets - 1), reps };
    case 'advanced':
      return { sets: sets + 1, reps };
    default:
      return { sets, reps };
  }
}

/** Build a single workout day */
export function buildDay(
  dayType: DayType,
  goal: Goal,
  level: Level,
  userEquipment: Equipment[],
): WorkoutDay {
  const categories = DAY_TEMPLATES[dayType];

  // Get exercises that match category + equipment
  const available: Record<string, Exercise> = {};
  for (const [id, ex] of Object.entries(EXERCISES)) {
    if (categories.includes(ex.category) && canDo(ex, userEquipment)) {
      available[id] = ex;
    }
  }

  // Pick exercises: up to 2 per category, max ~6 total
  const picked: WorkoutExercise[] = [];
  for (const cat of categories) {
    const catExercises = Object.entries(available).filter(([, ex]) => ex.category === cat);
    const chosen = shuffle(catExercises).slice(0, 2);
    for (const [id, ex] of chosen) {
      const [baseSets, baseReps] = ex.sets[goal];
      const { sets, reps } = applyLevelModifier(baseSets, baseReps, level);
      picked.push({
        id,
        name: ex.name,
        emoji: ex.emoji,
        sets,
        reps,
        tip: ex.tip,
        youtubeQuery: ex.youtubeQuery,
        category: ex.category,
      });
    }
  }

  // Limit to 6-8 exercises
  const limited = picked.slice(0, 8);

  // Day name mapping
  const dayNames: Record<DayType, string> = {
    push: 'Push Day', pull: 'Pull Day', legs: 'Leg Day',
    fullA: 'Full Body A', fullB: 'Full Body B',
    upper: 'Upper Body', lower: 'Lower Body',
    power: 'Power Day', cardio: 'Cardio & Core',
  };

  return {
    name: dayNames[dayType],
    type: dayType,
    warmup: pickN(WARMUP_POOL, 4),
    exercises: limited,
    cooldown: pickN(COOLDOWN_POOL, 3),
  };
}

/** Generate a complete workout plan */
export function generateWorkout(
  goal: Goal,
  level: Level,
  days: number,
  equipment: Equipment[],
): GeneratedWorkout {
  const validDays = [1, 3, 5, 7].includes(days) ? days : 3;
  const split = SPLITS[validDays][goal];

  return {
    goal,
    level,
    equipment,
    createdAt: new Date().toISOString(),
    days: split.map((dayType) => buildDay(dayType, goal, level, equipment)),
  };
}
