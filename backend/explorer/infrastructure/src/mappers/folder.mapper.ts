import type { FolderRow } from '@application/ports/folder-repo.port';
import type { FolderDTO } from '@application/dto/folder.dto';

export const toFolderDTO = (row: FolderRow): FolderDTO => ({
  id: row.id,
  name: row.name,
  parentId: row.parent_id,
  path: row.path,
  depth: row.depth
});