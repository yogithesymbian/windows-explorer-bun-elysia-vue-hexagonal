import { db } from '@infrastructure/db/client';
import { sql } from 'drizzle-orm';
import type { IFoldersRepository, FolderRow } from '@application/ports/folder-repo.port';

export class PgFoldersRepository implements IFoldersRepository {
  async getSubtreeByPath(rootPath: string, maxDepth: number): Promise<FolderRow[]> {
    return db.execute(sql`
      SELECT id, name, parent_id, path::text AS path, depth
      FROM folders
      WHERE ${sql.raw(`path <@ '${rootPath}'`)}
        AND depth <= (SELECT depth FROM folders WHERE path = ${rootPath}::ltree) + ${maxDepth}
      ORDER BY path;
    `);
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
