import { db } from '../../db/client';
import { sql } from 'drizzle-orm';
import type { IFoldersRepository, FolderRow } from '@application/ports/folder-repo.port';

export class PgFoldersRepository implements IFoldersRepository {
  async getSubtreeByPath(rootPath: string, maxDepth: number): Promise<FolderRow[]> {
    try {
      return db.execute<FolderRow>(sql`
        SELECT id, name, parent_id, path::text AS path, depth
        FROM folders
        WHERE path <@ CAST(${rootPath} AS ltree)
          -- depth <= (nlevel(rootPath) - 1) + maxDepth
          AND depth <= (nlevel(CAST(${rootPath} AS ltree)) - 1) + ${maxDepth}
        ORDER BY path;
      `);
    } catch (error) {
      console.error('[getSubtreeByPath] query error', error);
      throw error
    }
  }

  async getChildren(parentId: string, paging: { limit: number; offset: number }): Promise<FolderRow[]> {
    return db.execute(sql`
      SELECT id, name, parent_id, path::text AS path, depth
      FROM folders
      WHERE parent_id = ${parentId}
      ORDER BY name
      LIMIT ${paging.limit} OFFSET ${paging.offset};
    `);
  }

  async getBreadcrumbs(id: string): Promise<FolderRow[]> {
    const [row] = await db.execute(sql`SELECT path FROM folders WHERE id = ${id} LIMIT 1;`) as any[];
    if (!row) return [];
    const currentPath: string = row.path;
    return db.execute(sql`
      SELECT id, name, parent_id, path::text AS path, depth
      FROM folders
      WHERE ${sql.raw(`path @> '${currentPath}'`)}
      ORDER BY depth;
    `);
  }

  async searchFolders(q: string, paging: { limit: number; offset: number }): Promise<FolderRow[]> {
    return db.execute(sql`
      SELECT id, name, parent_id, path::text AS path, depth
      FROM folders
      WHERE name ILIKE ${'%' + q + '%'}
      ORDER BY name
      LIMIT ${paging.limit} OFFSET ${paging.offset};
    `);
  }
}
