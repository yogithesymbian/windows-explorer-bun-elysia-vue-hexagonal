import type { IFoldersRepository } from '../ports/folder-repo.port';
import type { FolderDTO } from '../dto/folder.dto';
import { toFolderDTO } from '@infrastructure/mappers/folder.mapper';

export class GetSubtree {
  constructor(private readonly repo: IFoldersRepository) {}
  async execute(input: { rootPath: string; maxDepth: number }): Promise<FolderDTO[]> {
    const rows = await this.repo.getSubtreeByPath(input.rootPath, input.maxDepth);
    return rows.map(toFolderDTO);
  }
}