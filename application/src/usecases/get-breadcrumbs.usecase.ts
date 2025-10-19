import type { IFoldersRepository } from '../ports/folder-repo.port';
import type { FolderDTO } from '../dto/folder.dto';
import { toFolderDTO } from '@infrastructure/mappers/folder.mapper';

export class GetBreadcrumbs {
  constructor(private readonly repo: IFoldersRepository) {}
  async execute(input: { id: string }): Promise<FolderDTO[]> {
    const rows = await this.repo.getBreadcrumbs(input.id);
    return rows.map(toFolderDTO);
  }
}
