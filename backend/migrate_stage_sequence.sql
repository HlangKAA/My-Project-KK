-- Run before seed_game_catalog.sql when upgrading the original 7/6/8/8 catalog.
-- Keep level_id stable so every existing submission and score remains attached.
BEGIN;
SELECT pg_advisory_xact_lock(742918);

DO $$
DECLARE
    catalog_rows integer;
    old_rows integer;
    moved_rows integer;
BEGIN
    SELECT COUNT(*) INTO catalog_rows
    FROM public.levels
    WHERE map_data->>'catalog' = 'spectrum_stages_v1';
    IF catalog_rows <> 29 THEN
        RAISE EXCEPTION 'Expected 29 existing stages; found %', catalog_rows;
    END IF;

    -- The two new Chapter 2 keys identify an already-migrated database.
    IF EXISTS (SELECT 1 FROM public.levels WHERE map_data->>'catalog' = 'spectrum_stages_v1' AND map_data->>'stage_key' = '2-7')
       OR EXISTS (SELECT 1 FROM public.levels WHERE map_data->>'catalog' = 'spectrum_stages_v1' AND map_data->>'stage_key' = '2-8') THEN
        IF NOT EXISTS (SELECT 1 FROM public.levels WHERE map_data->>'catalog' = 'spectrum_stages_v1' AND map_data->>'stage_key' IN ('3-8', '4-8'))
           AND (SELECT COUNT(DISTINCT map_data->>'stage_key') FROM public.levels WHERE map_data->>'catalog' = 'spectrum_stages_v1') = 29 THEN
            RETURN;
        END IF;
        RAISE EXCEPTION 'Stage catalog is only partly migrated';
    END IF;

    SELECT COUNT(*) INTO old_rows
    FROM public.levels
    WHERE map_data->>'catalog' = 'spectrum_stages_v1'
      AND map_data->>'stage_key' IN ('2-6', '3-7', '3-8', '3-6', '4-5', '4-7', '4-8', '4-6');
    IF old_rows <> 8 THEN
        RAISE EXCEPTION 'Expected eight old stage keys; found %', old_rows;
    END IF;

    WITH remap(old_key, new_key, new_chapter) AS (
        VALUES
            ('2-6', '2-8', 2),  -- The Living Atlas stays the Archive boss.
            ('3-7', '2-7', 2),  -- Pixel Trail moves into the first image chapter.
            ('3-8', '3-6', 3),
            ('3-6', '3-7', 3),  -- The Peak Trial moves to the end.
            ('4-5', '2-6', 2),  -- Color mixing moves beside other RGB challenges.
            ('4-7', '4-5', 4),
            ('4-8', '4-6', 4),
            ('4-6', '4-7', 4)   -- Krakk remains the final boss.
    )
    UPDATE public.levels AS l
    SET chapter = remap.new_chapter,
        map_data = jsonb_set(l.map_data, '{stage_key}', to_jsonb(remap.new_key), true)
    FROM remap
    WHERE l.map_data->>'catalog' = 'spectrum_stages_v1'
      AND l.map_data->>'stage_key' = remap.old_key;
    GET DIAGNOSTICS moved_rows = ROW_COUNT;
    IF moved_rows <> 8 THEN
        RAISE EXCEPTION 'Only % stage rows were remapped', moved_rows;
    END IF;

    IF (SELECT COUNT(DISTINCT map_data->>'stage_key') FROM public.levels WHERE map_data->>'catalog' = 'spectrum_stages_v1') <> 29 THEN
        RAISE EXCEPTION 'The remap created duplicate stage keys';
    END IF;
END $$;

COMMIT;
