# Workout Generator V4.2

Personal static workout generator for GitHub Pages.

## New in V4.2

- Replaced the 9 × 3 compound scheme with a more recoverable 5 × 3 scheme.
- Most accessory work now uses 3 sets instead of 4.
- Back workouts now guarantee horizontal pulling, vertical pulling, and direct rear-delt work.
- Compound weights are remembered separately for each exercise and rep scheme.
- Existing calendar history remains compatible, and older exercise-only weight records are used as a fallback.
- Mint visual theme.

## Existing features

- Independent Cardio and Core pickers.
- Smart Chest, Arms, Legs, and Back workout generation.
- Recent-repeat avoidance.
- Completed-workout calendar stored in browser localStorage.
- Delete individual completed workouts and automatically rebuild last compound weights.
- Random motivation videos.

## Storage note

Workout history and compound weights continue using the same `workoutHistory` and `compoundWeights` localStorage keys. Existing completed-workout history is preserved.
