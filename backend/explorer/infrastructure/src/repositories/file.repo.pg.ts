// backend/explorer/infrastructure/src/repositories/file.repo.pg.ts
import { db } from '../../db/client';
import { sql, eq } from 'drizzle-orm';
import type { IFilesRepository, FileRow } from '@application/ports/file-repo.port';
import { files } from '@infrastructure/db/schema';
import { searchFilesFTS } from '@infrastructure/adapter/fts';

export class PgFilesRepository implements IFilesRepository {
  async listByFolder(folderId: string, paging: { limit: number; offset: number }): Promise<FileRow[]> {
    // return db.execute(sql`
    //   SELECT id, folder_id, name, ext, size
    //   FROM files
    //   WHERE folder_id = ${folderId}
    //   ORDER BY name
    //   LIMIT ${paging.limit} OFFSET ${paging.offset};
    // `);
    const sql = await db
      .select({
        id: files.id,
        folder_id: files.folderId,
        name: files.name,
        ext: files.ext,
        size: files.size,
      })
      .from(files)
      .where(eq(files.folderId, folderId))
      .orderBy(files.name)
      .limit(paging.limit)
      .offset(paging.offset);
    return sql;
  }

  async searchFiles(q: string, paging: { limit: number; offset: number }): Promise<FileRow[]> {
    return await searchFilesFTS(q, paging.limit, paging.offset);
  }
}