// src/application/usecases/search.usecase.ts
import type { FolderPort } from "../ports/folder.port";
import type { FolderEntity } from "@/application/domain/folder.entity";

export interface SearchParams {
  q: string;
  type?: string; // default: file or folder
  limit?: number;
  offset?: number;
}

export class SearchUseCase {
  constructor(private folderPort: FolderPort) {}

  execute(params: SearchParams): Promise<FolderEntity[]> {
    const { q, type = "file", limit = 0, offset = 0 } = params;
    return this.folderPort.search(q, { type, limit, offset });
  }
}
