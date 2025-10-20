
import type { FolderPort } from "../../application/ports/folder.port";
import type { FolderDTO } from "../../shared/folder.dto";
import { ApiClient } from "../core/api-client";

export class FolderApiAdapter implements FolderPort {
  constructor(private api: ApiClient) {}

  getChildren(folderId: string): Promise<FolderDTO[]> {
    return this.api.get(`/folders/${folderId}/children`);
  }

  getSubTree(folderId: string): Promise<FolderDTO[]> {
    return this.api.get(`/folders/${folderId}/subtree`);
  }

  getBreadcrumbs(folderId: string): Promise<FolderDTO[]> {
    return this.api.get(`/folders/${folderId}/breadcrumbs`);
  }

  search(keyword: string): Promise<FolderDTO[]> {
    return this.api.get(`/folders/search`, { params: { q: keyword } });
  }
}
