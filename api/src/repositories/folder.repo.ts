/**
 * Repository memanfaatkan operator ltree (@>, <@) & FTS (@@) yang ter-indeks 
 * untuk performa jutaan data. [postgresql.org], [postgresql.org]
 *  */

import { db } from '../../../infrastructure/db/client';
import { sql } from 'drizzle-orm';

export type FolderRow = {
  id: string; name: string; parent_id: string | null; path: string; depth: number;
};

export class FolderRepository {
  async getChildren(parentId: string, limit = 50, offset = 0): Promise<FolderRow[]> {
    return db.execute(sql`
      SELECT id, name, parent_id, path::text AS path, depth
      FROM folders
      WHERE parent_id = ${parentId}
      ORDER BY name
      LIMIT ${limit} OFFSET ${offset};
    `);
  }

  async getBreadcrumbs(id: string): Promise<FolderRow[]> {
    const [row] = await db.execute(sql`
      SELECT path FROM folders WHERE id = ${id} LIMIT 1;
    `) as any[];
    if (!row) return [];
    const currentPath: string = row.path;
    return db.execute(sql`
      SELECT id, name, parent_id, path::text AS path, depth
      FROM folders
      WHERE ${sql.raw(`path @> '${currentPath}'`)}
      ORDER BY depth;
    `);
  }

  async getSubtreeByPath(rootPath: string, maxDepth: number): Promise<FolderRow[]> {
    return db.execute(sql`
      SELECT id, name, parent_id, path::text AS path, depth
      FROM folders
      WHERE ${sql.raw(`path <@ '${rootPath}'`)}
        AND depth <= (
          SELECT depth FROM folders WHERE path = ${rootPath}::ltree
        ) + ${maxDepth}
      ORDER BY path;
    `);
  }

  async searchFolders(q: string, limit = 50, offset = 0): Promise<FolderRow[]> {
    return db.execute(sql`
      SELECT id, name, parent_id, path::text AS path, depth
      FROM folders
      WHERE name ILIKE ${'%' + q + '%'}
      ORDER BY name
      LIMIT ${limit} OFFSET ${offset};
    `);
  }
}
``