import type { IFoldersRepository } from '../ports/folder-repo.port';
import type { FolderDTO } from '../dto/folder.dto';
import { toFolderDTO } from '@infrastructure/mappers/folder.mapper';

export class GetChildren {
  constructor(private readonly repo: IFoldersRepository) {}
  async execute(input: { parentId: string; limit: number; offset: number }): Promise<FolderDTO[]> {
    const rows = await this.repo.getChildren(input.parentId, { limit: input.limit, offset: input.offset });
    return rows.map(toFolderDTO);
  }
}