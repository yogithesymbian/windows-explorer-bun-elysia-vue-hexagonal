import { db } from './client';
import { sql } from 'drizzle-orm';

const makePath = (labels: string[]) => labels.join('.');

// await db.execute(sql`INSERT INTO folders (id, name, parent_id, path, depth) VALUES
//   (gen_random_uuid(), 'root', NULL, 'root'::ltree, 0),
//   (gen_random_uuid(), 'projects', (SELECT id FROM folders WHERE path = 'root'), 'root.projects'::ltree, 1),
//   (gen_random_uuid(), 'mobile', (SELECT id FROM folders WHERE path = 'root.projects'), 'root.projects.mobile'::ltree, 2)
// ;`);
await db.execute(sql`
  WITH root_folder AS (
    INSERT INTO folders (id, name, parent_id, path, depth)
    VALUES (gen_random_uuid(), 'root', NULL, 'root'::ltree, 0)
    RETURNING id, path, depth
  ),
  projects_folder AS (
    INSERT INTO folders (id, name, parent_id, path, depth)
    SELECT gen_random_uuid(), 'projects', id, path || 'projects'::ltree, depth + 1
    FROM root_folder
    RETURNING id, path, depth
  ),
  mobile_folder AS (
    -- mobile (satu kali saja)
    INSERT INTO folders (id, name, parent_id, path, depth)
    SELECT gen_random_uuid(), 'mobile', id, path || 'mobile'::ltree, depth + 1
    FROM projects_folder
    RETURNING id, path, depth
  ),
  web_folder AS (
    -- web sejajar dengan mobile
    INSERT INTO folders (id, name, parent_id, path, depth)
    SELECT gen_random_uuid(), 'web', id, path || 'web'::ltree, depth + 1
    FROM projects_folder
    RETURNING id, path, depth
  ),
  web_backend AS (
    INSERT INTO folders (id, name, parent_id, path, depth)
    SELECT gen_random_uuid(), 'backend', id, path || 'backend'::ltree, depth + 1
    FROM web_folder
    RETURNING id, path, depth
  ),
  web_frontend AS (
    INSERT INTO folders (id, name, parent_id, path, depth)
    SELECT gen_random_uuid(), 'frontend', id, path || 'frontend'::ltree, depth + 1
    FROM web_folder
    RETURNING id, path, depth
  ),
  web_user_manual AS (
    INSERT INTO folders (id, name, parent_id, path, depth)
    SELECT gen_random_uuid(), 'user_manual', id, path || 'user_manual'::ltree, depth + 1
    FROM web_folder
    RETURNING id, path, depth
  )
  SELECT 1;
`);

await db.execute(sql`
  -- README untuk tiap subfolder web
  INSERT INTO files (id, folder_id, name, ext, size)
  SELECT gen_random_uuid(), id, 'README', 'md', 2048
  FROM folders
  WHERE path IN (
    'root.projects.web.backend'::ltree,
    'root.projects.web.frontend'::ltree,
    'root.projects.web.user_manual'::ltree
  );

  -- Dummy files tambahan
  -- backend: index.ts
  INSERT INTO files (id, folder_id, name, ext, size)
  SELECT gen_random_uuid(), id, 'index', 'ts', 4096
  FROM folders WHERE path = 'root.projects.web.backend'::ltree;

  -- frontend: index.html
  INSERT INTO files (id, folder_id, name, ext, size)
  SELECT gen_random_uuid(), id, 'index', 'html', 3072
  FROM folders WHERE path = 'root.projects.web.frontend'::ltree;

  -- user_manual: guide.pdf
  INSERT INTO files (id, folder_id, name, ext, size)
  SELECT gen_random_uuid(), id, 'guide', 'pdf', 512000
  FROM folders WHERE path = 'root.projects.web.user_manual'::ltree;
`);

console.log('✅ Seed done');
process.exit(0);