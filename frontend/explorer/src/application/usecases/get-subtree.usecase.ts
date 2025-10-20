// src/application/usecases/get-subtree.usecase.ts
import type { FolderPort } from "../ports/folder.port";
import type { FolderDTO } from "../../shared/folder.dto";

export class GetSubTreeUseCase {
  constructor(private folderPort: FolderPort) {}

  execute(rootPath: string, maxDepth = 2): Promise<FolderDTO[]> {
    return this.folderPort.getSubTree(`${rootPath}?maxDepth=${maxDepth}`);
  }
}
