/**
 * Repository memanfaatkan operator ltree (@>, <@) & FTS (@@) yang ter-indeks 
 * untuk performa jutaan data. [postgresql.org], [postgresql.org]
 *  */

import { db } from '../../../infrastructure/db/client';
import { sql } from 'drizzle-orm';

export type FileRow = {
  id: string; name: string; ext: string | null; size: number; folder_id: string;
};

export class FileRepository {
  async listByFolder(folderId: string, limit = 50, offset = 0): Promise<FileRow[]> {
    return db.execute(sql`
      SELECT id, name, ext, size, folder_id
      FROM files
      WHERE folder_id = ${folderId}
      ORDER BY name
      LIMIT ${limit} OFFSET ${offset};
    `);
  }

  async searchFiles(q: string, limit = 50, offset = 0): Promise<FileRow[]> {
    // gunakan plainto_tsquery agar user bebas ketik
    return db.execute(sql`
      SELECT id, name, ext, size, folder_id
      FROM files
      WHERE search_vector @@ plainto_tsquery('english', ${q})
      ORDER BY name
      LIMIT ${limit} OFFSET ${offset};
    `);
  }
}
