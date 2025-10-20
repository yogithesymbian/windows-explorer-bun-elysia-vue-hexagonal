// src/application/usecases/list-files.usecase.ts
import type { FilePort } from "../ports/file.port";
import type { FileEntity } from "../domain/file.entity";

export interface ListFilesParams {
  folderId: string;
  limit?: number;
  offset?: number;
}

export class ListFilesUseCase {
  constructor(private filePort: FilePort) {}

  execute(params: ListFilesParams): Promise<FileEntity[]> {
    const { folderId, limit = 0, offset = 0 } = params;
    return this.filePort.listFiles(folderId, { limit, offset });
  }
}
