// src/infrastructure/api/file.api.ts
import type { FilePort } from "../../application/ports/file.port";
import type { FileDTO } from "../../shared/file.dto";
import { ApiClient } from "../core/api-client";

export class FileApiAdapter implements FilePort {
  constructor(private api: ApiClient) {}

  listFiles(folderId: string): Promise<FileDTO[]> {
    return this.api.get(`/files`, { params: { folderId } });
  }
}
