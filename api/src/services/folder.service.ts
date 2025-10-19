/**
 * Layering services/repositories mengikuti Hexagonal/Clean (ports & adapters) 
 * serta prinsip SOLID agar mudah diuji & di-maintain. [en.wikipedia.org], [en.wikipedia.org]
 *  */

import { FolderRepository } from '../repositories/folder.repo';

export class FolderService {
  constructor(private readonly repo = new FolderRepository()) {}

  getChildren(id: string, limit?: number, offset?: number) {
    return this.repo.getChildren(id, limit, offset);
  }
  getBreadcrumbs(id: string) {
    return this.repo.getBreadcrumbs(id);
  }
  getSubtree(rootPath: string, maxDepth: number) {
    return this.repo.getSubtreeByPath(rootPath, maxDepth);
  }
  search(q: string, limit?: number, offset?: number) {
    return this.repo.searchFolders(q, limit, offset);
  }
}
