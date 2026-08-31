# Workout Generator V3

V3 implements the full smart workout rules for Cardio, Core, Chest, Arms, Legs, and Back.

## Upload to GitHub Pages
Replace the files in the root of your BIS repository with these files:
- `index.html`
- `styles.css`
- `app.js`
- `workouts.json`

Commit the changes. GitHub Pages will redeploy automatically.

## What is editable
Most exercise names, pools, and schemes live in `workouts.json`. The sequencing/intelligent selection rules live in `app.js`.

## V3 features
- Independent Cardio generator
- Independent Core generator
- Chest complementary-press and shoulder/triceps rules
- 8-movement Arms structure with alternating biceps/triceps
- 6-movement Legs structure with compound-dependent complementary movement and hamstring/quad/calf rotation
- 6-movement Back structure with mandatory trap movement and alternating back/biceps accessories
- Duplicate prevention where specified
- Rep-based and time-based exercise prescriptions
- Calendar/history saved in the browser with `localStorage`

Note: calendar history remains device/browser-specific until cloud sync is added later.
