// src/infrastructure/api/file.api.ts
import type { FilePort, ListFilesParams } from "../../application/ports/file.port";
import { ApiClient } from "../../core/di/api-client";
import type { FileEntity } from "@/application/domain/file.entity";
import type { FileDTO } from "../dto/file.dto";
import { FileMapper } from "../mappers/file.mapper";

export class FileApiAdapter implements FilePort {
  constructor(private api: ApiClient) {}
  listFiles(folderId: string, params?: ListFilesParams): Promise<FileEntity[]> {
    return this.api.get<FileDTO[]>(`/folders/${folderId}/files`, { params })
      .then(dtos => 
        dtos.map(dto => FileMapper.toDomain(dto)));
  }
}
