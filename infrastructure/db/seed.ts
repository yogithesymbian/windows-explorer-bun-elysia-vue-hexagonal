import { db } from './client';
import { sql } from 'drizzle-orm';

const makePath = (labels: string[]) => labels.join('.');

await db.execute(sql`INSERT INTO folders (id, name, parent_id, path, depth) VALUES
  (gen_random_uuid(), 'root', NULL, 'root'::ltree, 0),
  (gen_random_uuid(), 'projects', (SELECT id FROM folders WHERE path = 'root'), 'root.projects'::ltree, 1),
  (gen_random_uuid(), 'mobile', (SELECT id FROM folders WHERE path = 'root.projects'), 'root.projects.mobile'::ltree, 2)
;`);

await db.execute(sql`INSERT INTO files (id, folder_id, name, ext, size)
  SELECT gen_random_uuid(), id, 'README', 'md', 1024 FROM folders WHERE path = 'root.projects.mobile';`);

console.log('✅ Seed done');
process.exit(0);