import { test, expect } from 'bun:test';
import { db } from '@infrastructure/db/client';
import { sql } from 'drizzle-orm';

test('ltree extension enabled', async () => {
  const res = await db.execute(sql`SELECT extname FROM pg_extension WHERE extname = 'ltree';`);
  expect(res.length).toBeGreaterThan(0);
});

test('folders indexes exist', async () => {
  const res = await db.execute(sql`
    SELECT indexname FROM pg_indexes WHERE tablename = 'folders';
  `) as Array<{ indexname: string }>;
  const names = res.map((r) => r.indexname);
  expect(names).toContain('idx_folders_path_gist');
  expect(names).toContain('idx_folders_parent');
  expect(names).toContain('idx_folders_name');
});

test('files indexes exist', async () => {
  const res = await db.execute(sql`
    SELECT indexname FROM pg_indexes WHERE tablename = 'files';
  `) as Array<{ indexname: string }>;
  const names = res.map((r) => r.indexname);
  expect(names).toContain('idx_files_folder');
  expect(names).toContain('idx_files_fts');
});