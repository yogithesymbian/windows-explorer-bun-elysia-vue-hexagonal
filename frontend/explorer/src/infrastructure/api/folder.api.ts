
import type { FolderPort, GetChildrenParams, SearchParams } from "../../application/ports/folder.port";
import type { FolderDTO } from "../dto/folder.dto";
import type { FolderEntity } from "@/application/domain/folder.entity";
import { ApiClient } from "../../core/di/api-client";
import { FolderMapper } from "../mappers/folder.mapper";

export class FolderApiAdapter implements FolderPort {
  constructor(private api: ApiClient) {}
  
  getSubTree(rootPath: string, maxDepth: number): Promise<FolderEntity[]> {
    return this.api.get<FolderDTO[]>(`/tree`, { params: { rootPath, maxDepth } })
    .then(dtos =>
      dtos.map(dto => FolderMapper.toDomain(dto))
    );
  }
  getChildren(folderId: string, params?: GetChildrenParams): Promise<FolderEntity[]> {
    return this.api.get<FolderDTO[]>(`/folders/${folderId}/children`, { params }).then(dtos =>
      dtos.map(dto => FolderMapper.toDomain(dto))
    );
  }

  getBreadcrumbs(folderId: string): Promise<FolderEntity[]> {
    return this.api.get<FolderDTO[]>(`/folders/${folderId}/breadcrumbs`).then(dtos =>
      dtos.map(dto => FolderMapper.toDomain(dto))
    );
  }
  search(query: string, params?: SearchParams): Promise<FolderEntity[]> {
    return this.api.get<FolderDTO[]>(`/folders/search`, { params }).then(dtos =>
      dtos.map(dto => FolderMapper.toDomain(dto))
    );
  }
}
