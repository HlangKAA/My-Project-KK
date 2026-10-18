# Game progress persistence

The React stage page posts each code run to `POST /api/submissions` using the Flask login session. The backend chooses `player_id` from that session, never from the payload. `GET /api/progress` restores completed stages and achievements on login and refresh.

## Existing table mapping

- `levels`: the 18 playable stages use `map_data.catalog = spectrum_stages_v1` and `map_data.stage_key` (for example `1-1`). IDs are allocated by Postgres; the original 8 levels are retained.
- `code_submissions`: each completed run records its actual code, `Success`/`Fail`/`Error`, runtime in seconds, and attempt timestamp. Quiz completions store answers as JSON text in `code`. A retry reuses the exact timestamp and payload; an intentional replay is a new attempt.
- `game_progress`: after a successful submission, `current_level` is the first region not fully completed (1–4, or 5 after finishing everything). Detailed individual stage completion is reconstructed from successful submissions, including out-of-order completions. `last_played` is updated; existing `high_score` values are retained.
- `player_stats`: each submitted attempt creates or updates the player's current region and `last_played` timestamp.
- `game_logs`: each attempt adds a `stage_attempt:<submission_id>` event with the stage key, result, and runtime. Replaying the same request does not duplicate its event.
- `player_achievements`: first stage, four completed regions, and all stages grant six new achievements. Existing achievement definitions and player awards are retained.

Submission, progress, stats, log, and award writes share one transaction. Locking the player's row prevents concurrent requests from creating duplicate progress or stats records without adding a database constraint. Existing primary keys make achievement awards idempotent.

No schema, RLS policy, function, or migration changes are required. Run `node scripts/export-game-catalog.mjs` from the repository root to regenerate `app/game/catalog.json` and `seed_game_catalog.sql` after changing playable stages. The seed SQL adds missing catalog rows without modifying old rows; apply it to the same database configured in `backend/.env`.

## Scope

Code execution and win validation still happen in the browser, as in the existing game. The backend persists those results; it is not a server-side anti-cheat evaluator. XP bonuses and equipped cosmetics remain in browser storage, now separated by player. Completed stages, spell unlocks derived from those stages, and achievement ownership are restored from Supabase. Old guest/local progress is not silently assigned to an account.

## Verification

From the repository root on Windows:

```powershell
backend/venv/Scripts/python.exe backend/tests/test_progress.py
backend/venv/Scripts/python.exe backend/tests/test_progress.py --live
```

`--live` uses the configured Supabase connection, creates two temporary players, exercises actual committed writes, retries, replays, account isolation, all 18 stages, transaction rollback, and concurrent first completions. It then deletes only those players and their test records. It must have network access. No existing player is used for the tests.
