# Workout Generator V2

This version separates the workout database from the application logic.

## Files

- `index.html` — page structure
- `styles.css` — appearance
- `app.js` — generator and calendar logic
- `workouts.json` — workout content you can edit yourself

## Editing your workouts

For routine workout changes, edit only `workouts.json`.

Example cardio entry:

```json
{
  "name": "Stair Climber",
  "detail": "10 min • moderate intensity"
}
```

Example compound:

```json
{
  "name": "Barbell Bench Press",
  "schemes": [
    {
      "sets": 5,
      "reps": "5",
      "rest": "3 min"
    }
  ],
  "accessories": [
    "Incline Dumbbell Press",
    "Cable Fly",
    "Triceps Pushdown"
  ]
}
```

## Important JSON rules

1. Text must be inside double quotes.
2. Separate items with commas.
3. Do not place a comma after the final item in a list.
4. Keep brackets and braces paired correctly.
5. Keep workout type keys (`CHEST`, `ARMS`, `LEGS`, `BACK`) uppercase unless you also change the app logic.

## GitHub Pages

Upload all four web files to the root of your repository:

- `index.html`
- `styles.css`
- `app.js`
- `workouts.json`

Commit the changes. GitHub Pages will redeploy automatically.

## Local testing

Because `app.js` loads `workouts.json` with `fetch()`, opening `index.html` directly as a `file://` page may be blocked by your browser.

The GitHub Pages version will work normally. For local development, use a simple local web server such as VS Code Live Server.
