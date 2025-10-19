import { db } from '@infrastructure/db/client';
import { sql } from 'drizzle-orm';
import type { IFilesRepository, FileRow } from '@application/ports/file-repo.port';

export class PgFilesRepository implements IFilesRepository {
  async listByFolder(folderId: string, paging: { limit: number; offset: number }): Promise<FileRow[]> {
    return db.execute(sql`
      SELECT id, folder_id, name, ext, size
      FROM files
      WHERE folder_id = ${folderId}
      ORDER BY name
      LIMIT ${paging.limit} OFFSET ${paging.offset};
    `);
  }

  async searchFiles(q: string, paging: { limit: number; offset: number }): Promise<FileRow[]> {
    return db.execute(sql`
      SELECT id, folder_id, name, ext, size
      FROM files
      WHERE search_vector @@ plainto_tsquery('english', ${q})
      ORDER BY name
      LIMIT ${paging.limit} OFFSET ${paging.offset};
    `);
  }
}