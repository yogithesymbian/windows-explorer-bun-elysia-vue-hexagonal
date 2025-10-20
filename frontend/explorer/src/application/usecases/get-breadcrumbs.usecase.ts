// src/application/usecases/get-breadcrumbs.usecase.ts
import type { FolderPort } from "../ports/folder.port";
import type { FolderEntity } from "@/application/domain/folder.entity";

export class GetBreadcrumbsUseCase {
  constructor(private folderPort: FolderPort) {}

  execute(folderId: string): Promise<FolderEntity[]> {
    return this.folderPort.getBreadcrumbs(folderId);
  }
}
