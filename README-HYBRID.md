# Daily Fuel — hybrid AI calorie tracker

## What's included
- Daily calorie and macro dashboard.
- Indian food search, custom foods, meal diary, 7-day history, and local JSON backup/import.
- AI meal-photo estimate workflow with portion, calories, protein, carbs and fat.
- Serverless AI endpoint (`api/analyze.js`); the OpenAI API key stays server-side.

## Deploy the hybrid version
GitHub Pages only hosts static files. It cannot execute `api/analyze.js`. Deploy this repo to Vercel:
1. Sign in to Vercel using GitHub and import `maniksalaria-Mm/calorie-tracker`.
2. Use the **Other** framework preset; leave build and output settings blank/default.
3. In Project Settings → Environment Variables, add `OPENAI_API_KEY` (your secret key). Optionally define `OPENAI_VISION_MODEL`.
4. Redeploy after adding the variable.
5. Open the Vercel URL in iPhone Safari → Share → Add to Home Screen.

## Privacy and accuracy
Diary, goals and custom foods remain in this browser's local storage on this device. The selected meal photo is sent to the server and then to the AI API for analysis; do not photograph sensitive material. Photo analysis needs internet. Food estimates are approximate; check ingredients and portions before logging. Clearing Safari site data can erase the local diary, so export backups regularly.

Never place `OPENAI_API_KEY` in `app.js`, HTML, CSS, or other public files.
