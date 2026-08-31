# Workout Generator V3.2

Personal static workout generator for GitHub Pages.

## New in V3.2

- Main compound weight tracking.
- Shows the last saved weight for each compound.
- Saves today's compound weight when **Complete Workout** is pressed.
- Completed-workout history also records the compound weight used.
- Prevents the same main compound from appearing in two consecutive completed workouts of the same type.
- Accessories favor exercises that were not used in the most recent completed workout of that type, while preserving all workout-structure rules and avoiding duplicates where required.

## Existing features

- Independent Cardio picker.
- Independent Core picker.
- Smart Chest, Arms, Legs, and Back workout generation.
- Sets, reps, and rest prescriptions.
- Completed-workout calendar stored locally in the browser.

## Install / update on GitHub Pages

Upload these files to the root of the repository, replacing the old versions:

- `index.html`
- `styles.css`
- `app.js`
- `workouts.json`

After committing the files, give GitHub Pages a moment to deploy, then refresh the site. A hard refresh may help if your browser cached an older version.

## Storage note

Workout history and compound weights are stored in that browser's localStorage. They do not sync across devices and are not shared with other people who open the same website.
