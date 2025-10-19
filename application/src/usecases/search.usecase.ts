import type { IFoldersRepository } from '../ports/folder-repo.port';
import type { IFilesRepository } from '../ports/file-repo.port';
import type { FolderDTO } from '../dto/folder.dto';
import type { FileDTO } from '../dto/file.dto';
import { toFolderDTO } from '@infrastructure/mappers/folder.mapper';
import { toFileDTO } from '@infrastructure/mappers/file.mapper';

export class Search {
  constructor(private readonly folders: IFoldersRepository, private readonly files: IFilesRepository) {}

  async execute(input: { q: string; type: 'folder' | 'file'; limit: number; offset: number }): Promise<FolderDTO[] | FileDTO[]> {
    if (input.type === 'file') {
      const rows = await this.files.searchFiles(input.q, { limit: input.limit, offset: input.offset });
      return rows.map(toFileDTO);
    }
    const rows = await this.folders.searchFolders(input.q, { limit: input.limit, offset: input.offset });
    return rows.map(toFolderDTO);
  }
}