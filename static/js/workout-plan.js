const EASYFIT_GOALS_KEY = "easyfit.selectedGoals";
const EASYFIT_WORKOUT_SETUP_KEY = "easyfit.workoutSetup";
const EASYFIT_GENERATED_WORKOUT_KEY = "easyfit.generatedWorkoutPlan";
const EASYFIT_GENERATED_WORKOUT_VERSION = 4;
const LEGACY_GOALS_KEY = "easfit.selectedGoals";
const LEGACY_WORKOUT_SETUP_KEY = "easfit.workoutSetup";
const LEGACY_GENERATED_WORKOUT_KEY = "easfit.generatedWorkoutPlan";

const DEFAULT_GOALS = ["Muscle Growth", "Reduce body fat"];
const DEFAULT_SETUP = {
  intensity: "Moderate",
  daysPerWeek: 3,
  beginner: "Yes"
};

const DEMO_EXERCISES = {
  "Deep Squat": {
    image: "deepsquat.png",
    focus: "lower-body strength and control",
    minutes: 6,
    beginnerReps: 10,
    moderateReps: 12,
    intenseReps: 14,
    instructions: [
      "Stand shoulder-width apart and brace your core.",
      "Lower by pushing your hips back and bending your knees.",
      "Keep your chest lifted and heels grounded.",
      "Drive through your feet to stand tall again."
    ],
    alternative: "Goblet Squat"
  },
  "Goblet Squat": {
    image: "deepsquat.png",
    focus: "lower-body strength and control",
    minutes: 6,
    beginnerReps: 10,
    moderateReps: 12,
    intenseReps: 14,
    instructions: [
      "Hold the weight close to your chest and stand tall.",
      "Lower into your squat with your core braced.",
      "Keep your knees tracking naturally and chest up.",
      "Press through your feet to return to standing."
    ]
  },
  "Wide Push Ups": {
    image: "widepushups.png",
    focus: "upper-body pushing strength",
    minutes: 5,
    beginnerReps: 8,
    moderateReps: 10,
    intenseReps: 12,
    instructions: [
      "Start in a plank with your hands slightly wider than shoulder-width.",
      "Keep your body in one line and lower with control.",
      "Let your elbows bend naturally to the side.",
      "Press back up to the start."
    ],
    alternative: "Incline Push Ups"
  },
  "Incline Push Ups": {
    image: "widepushups.png",
    focus: "upper-body pushing strength",
    minutes: 5,
    beginnerReps: 8,
    moderateReps: 10,
    intenseReps: 12,
    instructions: [
      "Place your hands on a bench or sturdy surface.",
      "Step your feet back and keep your body straight.",
      "Lower your chest toward the surface with control.",
      "Press through your palms to return to the start."
    ]
  },
  "Chest Dips": {
    image: "chestdips.png",
    focus: "upper-body pushing strength",
    minutes: 5,
    beginnerReps: 6,
    moderateReps: 8,
    intenseReps: 10,
    instructions: [
      "Support yourself on the bars with your shoulders set.",
      "Lean slightly forward and lower with control.",
      "Stop when your shoulders stay comfortable.",
      "Press back up without rushing."
    ],
    alternative: "Bench Dips"
  },
  "Bench Dips": {
    image: "chestdips.png",
    focus: "upper-body pushing strength",
    minutes: 5,
    beginnerReps: 6,
    moderateReps: 8,
    intenseReps: 10,
    instructions: [
      "Place your hands behind you on a bench or sturdy chair.",
      "Slide forward with your knees bent and chest lifted.",
      "Lower a short distance by bending your elbows.",
      "Press through your hands to come back up."
    ]
  },
  "Chin Ups": {
    image: "chinups.png",
    focus: "upper-body pulling strength",
    minutes: 5,
    beginnerReps: 4,
    moderateReps: 6,
    intenseReps: 8,
    instructions: [
      "Grab the bar with palms facing you.",
      "Brace your core and pull by driving your elbows down.",
      "Lift until your chin clears the bar if possible.",
      "Lower back down with control."
    ],
    alternative: "Assisted Chin Ups"
  },
  "Assisted Chin Ups": {
    image: "chinups.png",
    focus: "upper-body pulling strength",
    minutes: 5,
    beginnerReps: 4,
    moderateReps: 6,
    intenseReps: 8,
    instructions: [
      "Set up with a band or assisted support under you.",
      "Keep your chest lifted and pull steadily.",
      "Aim to clear the bar without swinging.",
      "Lower slowly before the next rep."
    ]
  },
  "Push Press": {
    image: "shoulderpress.png",
    focus: "shoulder and upper-body power",
    minutes: 5,
    beginnerReps: 8,
    moderateReps: 10,
    intenseReps: 12,
    instructions: [
      "Hold the weight near shoulder height with your core braced.",
      "Dip slightly through the knees.",
      "Drive up and press the weight overhead.",
      "Lower back to your shoulders with control."
    ]
  },
  Situps: {
    image: "situps.png",
    focus: "core strength and control",
    minutes: 4,
    beginnerReps: 10,
    moderateReps: 12,
    intenseReps: 16,
    instructions: [
      "Lie on your back with your knees bent.",
      "Brace your core and curl your chest upward.",
      "Lift only as high as feels controlled.",
      "Lower back down slowly."
    ]
  }
};

function migrateLegacyStorageKey(legacyKey, nextKey) {
  const nextValue = localStorage.getItem(nextKey);

  if (nextValue !== null) {
    return;
  }

  const legacyValue = localStorage.getItem(legacyKey);

  if (legacyValue === null) {
    return;
  }

  localStorage.setItem(nextKey, legacyValue);
  localStorage.removeItem(legacyKey);
}

function migrateEasyFitStorage() {
  migrateLegacyStorageKey(LEGACY_GOALS_KEY, EASYFIT_GOALS_KEY);
  migrateLegacyStorageKey(LEGACY_WORKOUT_SETUP_KEY, EASYFIT_WORKOUT_SETUP_KEY);
  migrateLegacyStorageKey(LEGACY_GENERATED_WORKOUT_KEY, EASYFIT_GENERATED_WORKOUT_KEY);
}

function safeParseLocalStorage(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch (error) {
    return null;
  }
}

function loadSelectedGoalsFromStorage() {
  const savedGoals = safeParseLocalStorage(EASYFIT_GOALS_KEY);
  return Array.isArray(savedGoals) && savedGoals.length > 0
    ? savedGoals.slice(0, 2)
    : DEFAULT_GOALS.slice();
}

function loadWorkoutSetupFromStorage() {
  const savedSetup = safeParseLocalStorage(EASYFIT_WORKOUT_SETUP_KEY);

  if (!savedSetup || typeof savedSetup !== "object") {
    return { ...DEFAULT_SETUP };
  }

  return {
    intensity: savedSetup.intensity || DEFAULT_SETUP.intensity,
    daysPerWeek: savedSetup.daysPerWeek || DEFAULT_SETUP.daysPerWeek,
    beginner: savedSetup.beginner || DEFAULT_SETUP.beginner
  };
}

function createSessionState() {
  return {
    currentExerciseIndex: 0,
    isCompleted: false,
    breakState: null
  };
}

function getWorkoutSignature(goals, setup) {
  return JSON.stringify({
    goals,
    intensity: setup.intensity,
    daysPerWeek: setup.daysPerWeek,
    beginner: setup.beginner
  });
}

function getPrimaryGoal(goals) {
  return goals[0] || "Workout";
}

function getExerciseNamesForDemo(goals, setup) {
  const primaryGoal = getPrimaryGoal(goals);
  const easyCount = setup.beginner === "Yes" || setup.intensity === "Easy" ? 4 : 5;

  let names = ["Deep Squat", "Wide Push Ups", "Push Press", "Situps", "Chest Dips"];

  if (primaryGoal === "Muscle Growth") {
    names = ["Deep Squat", "Wide Push Ups", "Chest Dips", "Chin Ups", "Situps"];
  } else if (primaryGoal === "Reduce body fat") {
    names = ["Deep Squat", "Push Press", "Wide Push Ups", "Situps", "Chest Dips"];
  } else if (
    primaryGoal === "Prevent injury" ||
    primaryGoal === "Strengthen stabilizer muscles" ||
    primaryGoal === "Reduce stiffness"
  ) {
    names = ["Situps", "Deep Squat", "Wide Push Ups", "Push Press", "Chin Ups"];
  }

  return names.slice(0, easyCount);
}

function getExerciseReps(exerciseName, setup) {
  const exercise = DEMO_EXERCISES[exerciseName];

  if (setup.beginner === "Yes") {
    return exercise.beginnerReps;
  }

  if (setup.intensity === "Intense") {
    return exercise.intenseReps;
  }

  return exercise.moderateReps;
}

function getExerciseSets(setup) {
  if (setup.beginner === "Yes") {
    return 2;
  }

  if (setup.intensity === "Intense") {
    return 4;
  }

  return 3;
}

function buildExercise(exerciseName, setup) {
  const exercise = DEMO_EXERCISES[exerciseName];

  return {
    name: exerciseName,
    prescription: `${getExerciseSets(setup)} sets x ${getExerciseReps(exerciseName, setup)} reps`,
    instructions: exercise.instructions.slice(),
    durationMinutes: exercise.minutes
  };
}

function generateWorkoutPlan(goals, setup) {
  const safeGoals = Array.isArray(goals) && goals.length > 0 ? goals.slice(0, 2) : DEFAULT_GOALS.slice();
  const safeSetup = {
    intensity: setup.intensity || DEFAULT_SETUP.intensity,
    daysPerWeek: setup.daysPerWeek || DEFAULT_SETUP.daysPerWeek,
    beginner: setup.beginner || DEFAULT_SETUP.beginner
  };
  const exerciseNames = getExerciseNamesForDemo(safeGoals, safeSetup);
  const exercises = exerciseNames.map((name) => buildExercise(name, safeSetup));
  const estimatedSessionMinutes = exercises.reduce(
    (total, exercise) => total + exercise.durationMinutes,
    0
  );
  const primaryGoal = getPrimaryGoal(safeGoals);

  return {
    planVersion: EASYFIT_GENERATED_WORKOUT_VERSION,
    signature: getWorkoutSignature(safeGoals, safeSetup),
    title: `${safeSetup.intensity} ${primaryGoal}`,
    summary: `Built for ${safeGoals.join(" + ").toLowerCase()} with a ${safeSetup.intensity.toLowerCase()} pace.`,
    totalWorkouts: safeSetup.daysPerWeek,
    estimatedSessionMinutes,
    estimatedTotalMinutes: estimatedSessionMinutes * safeSetup.daysPerWeek,
    goals: safeGoals,
    intensity: safeSetup.intensity,
    beginner: safeSetup.beginner,
    daysPerWeek: safeSetup.daysPerWeek,
    exercises,
    session: createSessionState()
  };
}

function saveGeneratedWorkoutPlan(plan) {
  localStorage.setItem(EASYFIT_GENERATED_WORKOUT_KEY, JSON.stringify(plan));
}

function loadGeneratedWorkoutPlan() {
  return safeParseLocalStorage(EASYFIT_GENERATED_WORKOUT_KEY);
}

function getOrCreateGeneratedWorkoutPlan() {
  const goals = loadSelectedGoalsFromStorage();
  const setup = loadWorkoutSetupFromStorage();
  const signature = getWorkoutSignature(goals, setup);
  const savedPlan = loadGeneratedWorkoutPlan();

  if (
    savedPlan &&
    savedPlan.planVersion === EASYFIT_GENERATED_WORKOUT_VERSION &&
    savedPlan.signature === signature &&
    Array.isArray(savedPlan.exercises)
  ) {
    return ensureSessionState(savedPlan);
  }

  const nextPlan = generateWorkoutPlan(goals, setup);
  saveGeneratedWorkoutPlan(nextPlan);
  return nextPlan;
}

function ensureSessionState(plan) {
  if (!plan.session || typeof plan.session !== "object") {
    plan.session = createSessionState();
  }

  if (typeof plan.session.currentExerciseIndex !== "number") {
    plan.session.currentExerciseIndex = 0;
  }

  if (typeof plan.session.isCompleted !== "boolean") {
    plan.session.isCompleted = false;
  }

  if (
    plan.session.breakState &&
    typeof plan.session.breakState.nextExerciseIndex !== "number"
  ) {
    plan.session.breakState = null;
  }

  plan.session.currentExerciseIndex = Math.max(
    0,
    Math.min(plan.session.currentExerciseIndex, plan.exercises.length - 1)
  );

  return plan;
}

function resetWorkoutSession(plan) {
  plan.session = createSessionState();
  saveGeneratedWorkoutPlan(plan);
}

function getRemainingSessionMinutes(plan, exerciseIndex) {
  return plan.exercises.slice(exerciseIndex).reduce((total, exercise) => {
    return total + exercise.durationMinutes;
  }, 0);
}

function getAlternativeExercise(plan, exerciseIndex) {
  const currentExercise = plan.exercises[exerciseIndex];
  const alternativeName =
    currentExercise && DEMO_EXERCISES[currentExercise.name]
      ? DEMO_EXERCISES[currentExercise.name].alternative
      : "";

  if (!alternativeName) {
    return null;
  }

  if (plan.exercises.some((exercise) => exercise.name === alternativeName)) {
    return null;
  }

  return buildExercise(alternativeName, {
    intensity: plan.intensity,
    beginner: plan.beginner
  });
}

function getExerciseFocusText(exerciseName) {
  return DEMO_EXERCISES[exerciseName]
    ? DEMO_EXERCISES[exerciseName].focus
    : "full-body control";
}

function getExerciseImageSrc(exerciseName) {
  if (DEMO_EXERCISES[exerciseName]) {
    return `/static/images/${DEMO_EXERCISES[exerciseName].image}`;
  }

  if (exerciseName.includes("Squat")) {
    return "/static/images/deepsquat.png";
  }

  if (exerciseName.includes("Push")) {
    return "/static/images/widepushups.png";
  }

  if (exerciseName.includes("Dips")) {
    return "/static/images/chestdips.png";
  }

  if (exerciseName.includes("Chin")) {
    return "/static/images/chinups.png";
  }

  if (exerciseName.includes("Press")) {
    return "/static/images/shoulderpress.png";
  }

  return "/static/images/situps.png";
}

function getChatbotResponse(plan, exercise, rawQuestion) {
  const question = String(rawQuestion || "").toLowerCase();
  const goals = plan.goals && plan.goals.length ? plan.goals.join(" + ").toLowerCase() : "general fitness";
  const alternative = getAlternativeExercise(plan, plan.session.currentExerciseIndex);
  const alternativeLine = alternative ? ` You could also try ${alternative.name}.` : "";

  if (
    question.includes("pain") ||
    question.includes("hurt") ||
    question.includes("knee") ||
    question.includes("back")
  ) {
    return (
      `I cannot diagnose pain. Stop if the pain feels sharp or keeps getting worse. ` +
      `Try lowering the intensity, using an easier variation, or checking with a professional if needed.${alternativeLine}`
    );
  }

  if (
    question.includes("equipment") ||
    question.includes("machine") ||
    question.includes("dumbbell") ||
    question.includes("bar")
  ) {
    if (
      exercise.name === "Chest Dips" ||
      exercise.name === "Bench Dips" ||
      exercise.name === "Chin Ups" ||
      exercise.name === "Assisted Chin Ups" ||
      exercise.name === "Push Press"
    ) {
      return `${exercise.name} may need equipment or a sturdy setup for this demo.${alternativeLine}`;
    }

    return `${exercise.name} is meant to feel bodyweight-friendly in this prototype.`;
  }

  if (
    question.includes("hard") ||
    question.includes("difficult") ||
    question.includes("easier") ||
    question.includes("too much")
  ) {
    return (
      `${exercise.name} can feel challenging at ${plan.intensity.toLowerCase()} intensity. ` +
      `Slow down, shorten the range, or rest longer between sets.${alternativeLine}`
    );
  }

  return (
    `${exercise.name} supports ${goals} by building ${getExerciseFocusText(exercise.name)}. ` +
    `This version matches your ${plan.intensity.toLowerCase()} setup and ${plan.beginner === "Yes" ? "keeps things beginner-friendly." : "adds a little more challenge."}`
  );
}

migrateEasyFitStorage();
