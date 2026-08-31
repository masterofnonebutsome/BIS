# Workout Generator V4.1

Personal static workout generator for GitHub Pages.

## New in V4.1

- Added **Press for Motivation**.
- Each press randomly chooses from the 54 supplied YouTube videos.
- The same motivation video will not play twice in a row when alternatives are available.
- Videos are stored separately in `motivation.json` so the list is easy to expand.
- `motivation.json` accepts either full YouTube URLs or 11-character video IDs.
- Corrected the overall displayed/cache version to **V4.1**.

## Existing features

- Independent Cardio and Core pickers.
- Smart Chest, Arms, Legs, and Back workout generation.
- Main compound weight tracking and last-used weight.
- Recent-repeat avoidance.
- Completed-workout calendar stored in browser localStorage.
- Delete individual completed workouts and automatically rebuild last compound weights.

## Update on GitHub Pages

Upload all six files to the root of the repository, replacing the existing files with the same names:

- `index.html`
- `styles.css`
- `app.js`
- `workouts.json`
- `motivation.json`
- `README.md`

Do not upload an extra file such as `styles(1).css`; the site uses `styles.css`.

After committing, give GitHub Pages a moment to deploy and refresh the site. The V4.1 cache-busting values are already included.

## Adding motivation videos later

Open `motivation.json` and add another entry inside the `videos` list. You can paste a full YouTube URL or only its 11-character video ID. Keep a comma between entries.

## Storage note

Workout history and compound weights keep using the same `workoutHistory` and `compoundWeights` localStorage keys, so this update does not intentionally reset existing browser history.
