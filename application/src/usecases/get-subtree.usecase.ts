import type { IFoldersRepository } from '../ports/folder-repo.port';
import type { FolderDTO } from '../dto/folder.dto';
import { toFolderDTO } from '@infrastructure/mappers/folder.mapper';
import { NotFoundError } from '@application/errors';
import { ICache } from '@application/ports/cache.port';

export class GetSubtree {
  constructor(
    private readonly repo: IFoldersRepository,
    private readonly cache: ICache
  ) {}
  async execute(input: { rootPath: string; maxDepth: number }): Promise<FolderDTO[]> {
    const cacheKey = `subtree:${input.rootPath}:${input.maxDepth}`;
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached as FolderDTO[];

    const rows = await this.repo.getSubtreeByPath(input.rootPath, input.maxDepth);
    if(!rows){
      throw new NotFoundError('Folder', { path: input.rootPath })
    }
    const result = rows.map(toFolderDTO);
    await this.cache.set(cacheKey, result);
    return result;
  }
}