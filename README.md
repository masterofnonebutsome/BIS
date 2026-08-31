# Workout Generator

A beginner-friendly workout generator designed for GitHub Pages.

## Features

- Random cardio selection
- Chest, Arms, Legs, and Back workout types
- Random compound movement selection
- Accessory exercises tied to the selected compound movement
- Randomized sets, reps, and rest periods
- Complete Workout button
- Workout history stored in browser localStorage
- Monthly calendar showing completed workout days
- Mobile-friendly layout

## Run it locally

Download the project and open `index.html` in a browser.

For the best experience, you can also use VS Code with the Live Server extension.

## Publish with GitHub Pages

1. Create a new GitHub repository.
2. Upload `index.html`, `styles.css`, and `app.js`.
3. Open the repository's Settings.
4. Go to Pages.
5. Under Build and deployment, choose "Deploy from a branch".
6. Select the `main` branch and `/ (root)`.
7. Save.
8. GitHub will provide the public website address.

## Customize your workouts

Edit the `workoutData` object near the top of `app.js`.

You can change:

- Cardio options
- Compound exercises
- Accessory pools
- Compound set/rep schemes
- Accessory set/rep schemes
- Rest times

## Current limitation

Workout history uses browser localStorage. This means workout history is saved on the specific browser/device you are using.

A later version can use a cloud database so history syncs between your phone, tablet, and computer.
