/**
 * Layering services/repositories mengikuti Hexagonal/Clean (ports & adapters) 
 * serta prinsip SOLID agar mudah diuji & di-maintain. [en.wikipedia.org], [en.wikipedia.org]
 *  */

import { FileRepository } from '../repositories/file.repo';

export class FileService {
  constructor(private readonly repo = new FileRepository()) {}

  listByFolder(folderId: string, limit?: number, offset?: number) {
    return this.repo.listByFolder(folderId, limit, offset);
  }
  search(q: string, limit?: number, offset?: number) {
    return this.repo.searchFiles(q, limit, offset);
  }
}