import type { FileRow } from '@application/ports/file-repo.port';
import type { FileDTO } from '@application/dto/file.dto';

export const toFileDTO = (row: FileRow): FileDTO => ({
  id: row.id,
  folderId: row.folder_id,
  name: row.name,
  ext: row.ext,
  size: row.size ?? null
});