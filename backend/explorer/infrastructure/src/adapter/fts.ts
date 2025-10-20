import { db } from '@infrastructure/db/client';
import { sql } from 'drizzle-orm';

export async function searchFilesFTS(q: string, limit: number, offset: number) {
  return db.execute(sql`
    SELECT id, folder_id, name, ext, size
    FROM files
    WHERE search_vector @@ plainto_tsquery('english', ${q})
    ORDER BY name
    LIMIT ${limit} OFFSET ${offset};
  `);
}