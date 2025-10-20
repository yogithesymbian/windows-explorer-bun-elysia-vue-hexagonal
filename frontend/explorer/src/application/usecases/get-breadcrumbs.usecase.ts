// src/application/usecases/get-breadcrumbs.usecase.ts
import type { FolderPort } from "../ports/folder.port";
import type { FolderDTO } from "../../shared/folder.dto";

export class GetBreadcrumbsUseCase {
  constructor(private folderPort: FolderPort) {}

  execute(folderId: string): Promise<FolderDTO[]> {
    return this.folderPort.getBreadcrumbs(folderId);
  }
}
