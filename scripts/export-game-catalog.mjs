import { writeFileSync } from 'node:fs';
import { REGIONS, STAGE_DATA } from '../frontend/src/data/stageData.js';

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
  { title: 'Lost Spectrum Restored', description: 'Complete all 18 stages of the current adventure.', unlock_condition: `${catalog}:all` },
];
writeFileSync(new URL('../backend/app/game/catalog.json', import.meta.url), JSON.stringify({ catalog, levels, achievements }, null, 2) + '\n');
const quote = value => `'${JSON.stringify(value).replaceAll("'", "''")}'::jsonb`;
const sql = `-- Data only. Existing levels and achievements are preserved.\nBEGIN;\nSELECT pg_advisory_xact_lock(742918);\nINSERT INTO public.levels (chapter, level_name, description, objective, starter_code, difficulty, map_data)\nSELECT x.chapter, x.level_name, x.description, x.objective, x.starter_code, x.difficulty, x.map_data\nFROM jsonb_to_recordset(${quote(levels)}) AS x(chapter int, level_name text, description text, objective text, starter_code text, difficulty text, map_data jsonb)\nWHERE NOT EXISTS (SELECT 1 FROM public.levels l WHERE l.map_data->>'catalog' = x.map_data->>'catalog' AND l.map_data->>'stage_key' = x.map_data->>'stage_key');\nINSERT INTO public.achievements (title, description, unlock_condition)\nSELECT x.title, x.description, x.unlock_condition\nFROM jsonb_to_recordset(${quote(achievements)}) AS x(title text, description text, unlock_condition text)\nWHERE NOT EXISTS (SELECT 1 FROM public.achievements a WHERE a.unlock_condition = x.unlock_condition);\nCOMMIT;\n`;
writeFileSync(new URL('../backend/seed_game_catalog.sql', import.meta.url), sql);
console.log(`Exported ${levels.length} stages and ${achievements.length} achievements.`);
