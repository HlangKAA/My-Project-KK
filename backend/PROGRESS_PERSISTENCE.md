# Game progress persistence

The React stage page posts each code run to `POST /api/submissions` using the Flask login session. The backend chooses `player_id` from that session, never from the payload. `GET /api/progress` restores completed stages and achievements on login and refresh.

`GET /api/leaderboard` returns the top 20 players ranked by server-saved XP, plus the signed-in player's rank when outside the top 20. A player must clear at least one playable stage to qualify. A stage awards XP only on its first successful submission; first-attempt and no-hint bonuses are applied on the server. Ties use completed stage count, then the earliest time that count was reached, then player ID. The response includes player ID, username, score, completed stage count, and rank.

## Existing table mapping

- `levels`: the 25 playable stages use `map_data.catalog = spectrum_stages_v1` and `map_data.stage_key` (for example `1-1`). IDs are allocated by Postgres; existing levels are retained. Archived stages keep their separate catalog and submissions.
- `code_submissions`: each completed run records its actual code, `Success`/`Fail`/`Error`, runtime in seconds, and attempt timestamp. Quiz completions store answers as JSON text in `code`. A retry reuses the exact timestamp and payload; an intentional replay is a new attempt.
- `game_progress`: after a successful submission, `current_level` is the first region not fully completed (1–4, or 5 after finishing everything). Detailed individual stage completion is reconstructed from successful submissions, including out-of-order completions. `last_played` is updated; `high_score` stores the player's server XP.
- `player_stats`: each submitted attempt creates or updates the player's current region and `last_played` timestamp.
- `game_logs`: each attempt adds a `stage_attempt:<submission_id>` event with the stage key, result, runtime, and XP earned. The first successful event also supplies per-stage XP after login.
- `player_achievements`: first stage, four completed regions, and all stages grant six new achievements. Existing achievement definitions and player awards are retained.

Submission, progress, stats, log, and award writes share one transaction. Locking the player's row prevents concurrent requests from creating duplicate progress or stats records without adding a database constraint. Existing primary keys make achievement awards idempotent.

No schema, RLS policy, function, or migration changes are required. Run `node scripts/export-game-catalog.mjs` from the repository root to regenerate `app/game/catalog.json` and `seed_game_catalog.sql` after changing playable stages. The seed SQL adds missing catalog rows without modifying old rows; apply it to the same database configured in `backend/.env`.

Players awarded Chapter 1 before the three new color stages retain that region completion. Their new stages remain individually unplayed until they complete them.

## Scope

Code execution and win validation still happen in the browser, as in the existing game. The backend persists those results; it is not a server-side anti-cheat evaluator. Server XP and first-clear bonuses are restored on login, while equipped cosmetics remain in browser storage, separated by player. Completed stages, spell unlocks derived from those stages, and achievement ownership are restored from Supabase. Old guest/local XP is not imported into the server score.

## Verification

From the repository root on Windows, run `backend/venv/Scripts/python.exe -m compileall -q backend/app` to check Python syntax. For persistence changes, inspect the affected player and related records in Supabase after the operation.
