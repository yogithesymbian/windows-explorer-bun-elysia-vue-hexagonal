import type { FolderDTO } from "../../shared/folder.dto";

export interface FolderPort {
  getChildren(folderId: string): Promise<FolderDTO[]>;
  getSubTree(folderId: string): Promise<FolderDTO[]>;
  getBreadcrumbs(folderId: string): Promise<FolderDTO[]>;
  search(keyword: string): Promise<FolderDTO[]>;
}
