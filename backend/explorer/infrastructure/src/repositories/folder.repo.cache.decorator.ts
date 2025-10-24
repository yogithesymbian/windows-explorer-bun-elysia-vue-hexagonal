// backend/explorer/infrastructure/src/repositories/folder.repo.cache.decorator.ts
import { FolderRow, IFoldersRepository } from '@application/ports/folder-repo.port';
import { ICache } from '@application/ports/cache.port'; // Port Cache

export class CachedFoldersRepository implements IFoldersRepository {
  // Repositori yang didekorasi (contoh: FolderRepositoryPg)
  private readonly CACHE_TTL = 360; // TTL Cache dalam detik (6 menit)

  constructor(
    private readonly nextRepo: IFoldersRepository,
    private readonly cacheService: ICache // Disuntikkan RedisCache
  ) {}
  async getSubtreeByPath(rootPath: string, maxDepth: number): Promise<FolderRow[] | null> {
    const cacheKey = `subtree:${rootPath}:${maxDepth}`;

    // 1. Cek Cache (Logika Teknis)
    const cached = await this.cacheService.get<FolderRow[]>(cacheKey);
    if (cached) return cached;

    // 2. Delegasikan ke Repositori Asli (Hit DB/API)
    const result = await this.nextRepo.getSubtreeByPath(rootPath, maxDepth);

    // 3. Simpan ke Cache (Logika Teknis)
    if (result && result.length > 0) {
      await this.cacheService.set(cacheKey, result, this.CACHE_TTL);
    }

    return result;
  }
  getChildren(parentId: string, paging: { limit: number; offset: number; }): Promise<FolderRow[]> {
    return this.nextRepo.getChildren(parentId, paging);
  }
  getBreadcrumbs(id: string): Promise<FolderRow[]> {
    return this.nextRepo.getBreadcrumbs(id);
  }
  searchFolders(q: string, paging: { limit: number; offset: number; }): Promise<FolderRow[]> {
    return this.nextRepo.searchFolders(q, paging);
  }

  
}