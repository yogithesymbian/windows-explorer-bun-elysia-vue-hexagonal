// src/application/usecases/get-children.usecase.ts
import type { FolderEntity } from "@/application/domain/folder.entity";
import type { FolderPort } from "../ports/folder.port";

export interface GetChildrenParams {
  folderId: string;
  limit?: number;
  offset?: number;
}

export class GetChildrenUseCase {
  constructor(private folderPort: FolderPort) {}

  execute(params: GetChildrenParams): Promise<FolderEntity[]> {
    const { folderId, limit = 0, offset = 0 } = params;
    return this.folderPort.getChildren(folderId, { limit, offset });
  }
}
