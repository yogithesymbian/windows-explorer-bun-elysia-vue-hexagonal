import type { IFoldersRepository } from '@application/ports/folder-repo.port';
import type { IFilesRepository } from '@application/ports/file-repo.port';
import { PgFoldersRepository } from '@infrastructure/repositories/folder.repo.pg';
import { PgFilesRepository } from '@infrastructure/repositories/file.repo.pg';

import { GetSubtree } from '@application/usecases/get-subtree.usecase';
import { GetChildren } from '@application/usecases/get-children.usecase';
import { GetBreadcrumbs } from '@application/usecases/get-breadcrumbs.usecase';
import { ListFiles } from '@application/usecases/list-files.usecase';
import { Search } from '@application/usecases/search.usecase';

import { RedisCache } from '@infrastructure/adapter/redis.cache';
import type { ICache } from '@application/ports/cache.port';
export const cache: ICache = new RedisCache();

export interface Deps {
  foldersRepo: IFoldersRepository;
  filesRepo: IFilesRepository;

  getSubtree: GetSubtree;
  getChildren: GetChildren;
  getBreadcrumbs: GetBreadcrumbs;
  listFiles: ListFiles;
  
  searchUsecase: Search;
}

export const buildDependencies = (override?: Partial<Deps>): Deps => {
  const foldersRepo = override?.foldersRepo ?? new PgFoldersRepository();
  const filesRepo   = override?.filesRepo   ?? new PgFilesRepository();

  return {
    foldersRepo,
    filesRepo,
    getSubtree:     new GetSubtree(foldersRepo, cache),
    getChildren:    new GetChildren(foldersRepo),
    getBreadcrumbs: new GetBreadcrumbs(foldersRepo),
    listFiles:      new ListFiles(filesRepo),
    searchUsecase:  new Search(foldersRepo, filesRepo),
  };
};

// export type Deps = ReturnType<typeof buildDependencies>;
