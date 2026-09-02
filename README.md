# Workout Generator V4.3

A simple strength-focused workout generator for GitHub Pages.

## Strength progression

- The original Chest, Arms, Legs, and Back split is preserved.
- Each day has a consistent anchor lift:
  - Chest: Flat Barbell Bench Press
  - Arms: Barbell Overhead Press
  - Legs: Back Squat
  - Back: Weighted Pull-Ups
- Anchor lifts alternate systematically between 5 × 5 and 5 × 3 based on the last completed workout of that type.
- Compound sets use 3–5 minute rest periods and stop with approximately 1–3 clean repetitions remaining.
- The weight panel remembers each exercise and scheme separately.
- After a successful exposure, it recommends adding 5 lb on upper-body anchors or 10 lb on the squat. If the target was missed, repeat the previous load.
- Accessories remain randomized, avoid recent repeats, and generally use three working sets.
- Arms day uses one fewer isolation slot to control fatigue.

## Storage

Existing history remains in the same browser-local `workoutHistory` and `compoundWeights` records. No account is required, and each browser keeps separate data.
