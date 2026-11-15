import { writeFileSync } from 'node:fs';
import { REGIONS, STAGE_DATA } from '../frontend/src/features/stages/stageData.js';

// Export only playable stages; keep SQL data changes separate from schema changes.
const catalog = 'spectrum_stages_v1';
const levels = Object.values(REGIONS).flatMap(region => region.stages.map(stage => {
  const key = `${region.id}-${stage.id}`;
  const data = STAGE_DATA[key];
  return {
    chapter: region.id, level_name: stage.name, description: stage.description,
    objective: data.objective, starter_code: data.initialCode || data.codeTemplate || data.buggyCode || '',
    difficulty: data.difficulty >= 4 ? 'Hard' : data.difficulty >= 2 ? 'Medium' : 'Easy',
    map_data: { catalog, stage_key: key, stage_type: data.stageType, xp_reward: data.xpReward, arena: data.arena || null },
  };
}));
const achievements = [
  { title: 'The Awakening', description: 'Complete The Awakening Altar.', unlock_condition: `${catalog}:stage:1-1` },
  ...Object.values(REGIONS).map(r => ({ title: `${r.subtitle} Master`, description: `Complete every stage in ${r.name}.`, unlock_condition: `${catalog}:region:${r.id}` })),
  { title: 'Lost Spectrum Restored', description: `Complete all ${levels.length} stages of the current adventure.`, unlock_condition: `${catalog}:all` },
];
writeFileSync(new URL('../backend/app/game/catalog.json', import.meta.url), JSON.stringify({ catalog, levels, achievements }, null, 2) + '\n');
const quote = value => `'${JSON.stringify(value).replaceAll("'", "''")}'::jsonb`;
const sql = `-- Data only. Existing level IDs, submissions, and player achievements are preserved.
BEGIN;
SELECT pg_advisory_xact_lock(742918);
UPDATE public.levels AS l
SET chapter = x.chapter, level_name = x.level_name, description = x.description,
    objective = x.objective, starter_code = x.starter_code,
    difficulty = x.difficulty, map_data = x.map_data
FROM jsonb_to_recordset(${quote(levels)}) AS x(chapter int, level_name text, description text, objective text, starter_code text, difficulty text, map_data jsonb)
WHERE l.map_data->>'catalog' = x.map_data->>'catalog'
  AND l.map_data->>'stage_key' = x.map_data->>'stage_key';
INSERT INTO public.levels (chapter, level_name, description, objective, starter_code, difficulty, map_data)
SELECT x.chapter, x.level_name, x.description, x.objective, x.starter_code, x.difficulty, x.map_data
FROM jsonb_to_recordset(${quote(levels)}) AS x(chapter int, level_name text, description text, objective text, starter_code text, difficulty text, map_data jsonb)
WHERE NOT EXISTS (SELECT 1 FROM public.levels l WHERE l.map_data->>'catalog' = x.map_data->>'catalog' AND l.map_data->>'stage_key' = x.map_data->>'stage_key');
UPDATE public.achievements AS a
SET title = x.title, description = x.description
FROM jsonb_to_recordset(${quote(achievements)}) AS x(title text, description text, unlock_condition text)
WHERE a.unlock_condition = x.unlock_condition;
INSERT INTO public.achievements (title, description, unlock_condition)
SELECT x.title, x.description, x.unlock_condition
FROM jsonb_to_recordset(${quote(achievements)}) AS x(title text, description text, unlock_condition text)
WHERE NOT EXISTS (SELECT 1 FROM public.achievements a WHERE a.unlock_condition = x.unlock_condition);
COMMIT;
`;
writeFileSync(new URL('../backend/seed_game_catalog.sql', import.meta.url), sql);
console.log(`Exported ${levels.length} stages and ${achievements.length} achievements.`);
