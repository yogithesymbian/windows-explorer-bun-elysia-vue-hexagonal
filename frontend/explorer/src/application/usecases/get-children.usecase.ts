// src/application/usecases/get-children.usecase.ts
import type { FolderPort } from "../ports/folder.port";
import type { FolderDTO } from "../../shared/folder.dto";

export class GetChildrenUseCase {
  constructor(private folderPort: FolderPort) {}

  execute(folderId: string, limit = 0, offset = 0): Promise<FolderDTO[]> {
    return this.folderPort.getChildren(`${folderId}?limit=${limit}&offset=${offset}`);
  }
}
