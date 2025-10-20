// src/application/ports/file.port.ts
import type { FileEntity } from "@application/domain/file.entity";

export interface ListFilesParams {
  limit?: number;
  offset?: number;
}

export interface FilePort {
  /**
   * List files inside folder by folder ID
   */
  listFiles(folderId: string, params?: ListFilesParams): Promise<FileEntity[]>;
}
