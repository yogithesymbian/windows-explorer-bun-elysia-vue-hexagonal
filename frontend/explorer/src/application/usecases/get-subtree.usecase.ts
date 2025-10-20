// src/application/usecases/get-subtree.usecase.ts
import type { FolderPort } from "../ports/folder.port";
import type { FolderEntity } from "@/application/domain/folder.entity";

export interface GetSubTreeParams {
  rootPath: string;
  maxDepth?: number;
}

export class GetSubTreeUseCase {
  constructor(private folderPort: FolderPort) {}

  execute(params: GetSubTreeParams): Promise<FolderEntity[]> {
    const { rootPath, maxDepth = 2 } = params;
    return this.folderPort.getSubTree(rootPath, maxDepth)
  }
}
