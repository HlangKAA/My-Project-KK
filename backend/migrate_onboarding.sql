-- Apply before deploying the onboarding API. Existing stage progress is unchanged.
BEGIN;

ALTER TABLE public.players
    ADD COLUMN IF NOT EXISTS onboarding_step smallint NOT NULL DEFAULT 0;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conrelid = 'public.players'::regclass
          AND conname = 'players_onboarding_step_check'
    ) THEN
        ALTER TABLE public.players
            ADD CONSTRAINT players_onboarding_step_check
            CHECK (onboarding_step BETWEEN 0 AND 2);
    END IF;
END $$;

-- Players who have already cleared a stage should not receive first-time prompts.
UPDATE public.players AS p
SET onboarding_step = 2
WHERE onboarding_step < 2
  AND EXISTS (
      SELECT 1
      FROM public.code_submissions AS s
      JOIN public.levels AS l ON l.level_id = s.level_id
      WHERE s.player_id = p.player_id
        AND s.result = 'Success'
        AND l.map_data->>'catalog' = 'spectrum_stages_v1'
  );

COMMIT;
