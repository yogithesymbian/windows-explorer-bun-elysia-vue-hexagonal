import type { IFoldersRepository } from '@application/ports/folder-repo.port';
import type { IFilesRepository } from '@application/ports/file-repo.port';
// Import Repository Asli
import { PgFoldersRepository } from '@infrastructure/repositories/folder.repo.pg';
import { PgFilesRepository } from '@infrastructure/repositories/file.repo.pg';
// Import Cache Decorator BARU
import { CachedFoldersRepository } from '@infrastructure/repositories/folder.repo.cache.decorator';

import { GetSubtree } from '@application/usecases/get-subtree.usecase';
import { GetChildren } from '@application/usecases/get-children.usecase';
import { GetBreadcrumbs } from '@application/usecases/get-breadcrumbs.usecase';
import { ListFiles } from '@application/usecases/list-files.usecase';
import { Search } from '@application/usecases/search.usecase';

// Adapter Cache (Detail Infrastruktur)
import { RedisCache } from '@infrastructure/adapter/redis.cache';
import type { ICache } from '@application/ports/cache.port';

// Cache tetap didefinisikan di sini
export const cache: ICache = new RedisCache();

export interface Deps {
  // Hanya mengekspos Repository yang sudah didekorasi
  foldersRepo: IFoldersRepository;
  filesRepo: IFilesRepository;

  getSubtree: GetSubtree;
  getChildren: GetChildren;
  getBreadcrumbs: GetBreadcrumbs;
  listFiles: ListFiles;
  
  searchUsecase: Search;
}

export const buildDependencies = (override?: Partial<Deps>): Deps => {
  // 1. Inisialisasi Repository Database Murni
  const foldersRepoPg = override?.foldersRepo ?? new PgFoldersRepository();
  const filesRepoPg   = override?.filesRepo   ?? new PgFilesRepository();

  // 2. Terapkan Cache Decorator PADA Repository yang sudah diinisialisasi
  // IFoldersRepository yang disuntikkan ke Use Case adalah hasil DEKORASI
  const foldersRepo: IFoldersRepository = new CachedFoldersRepository(foldersRepoPg, cache);
  const filesRepo   = filesRepoPg; // filesRepo tidak perlu cache

  return {
    foldersRepo, // Menyuntikkan Repository yang sudah di-cache
    filesRepo,
    
    // 3. Hapus 'cache' dari Use Case GetSubtree
    getSubtree:     new GetSubtree(foldersRepo), 
    getChildren:    new GetChildren(foldersRepo),
    getBreadcrumbs: new GetBreadcrumbs(foldersRepo),
    
    listFiles:      new ListFiles(filesRepo),
    searchUsecase:  new Search(foldersRepo, filesRepo),
  };
};