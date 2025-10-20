// src/application/ports/folder.port.ts
import type { FolderEntity } from "@/application/domain/folder.entity";

export interface GetChildrenParams {
  limit?: number;
  offset?: number;
}

export interface SearchParams {
  type?: string; // "file" | "folder"
  limit?: number;
  offset?: number;
}

export interface FolderPort {
  /**
   * Get subtree starting from rootPath with optional depth control
   */
  getSubTree(rootPath: string, maxDepth: number): Promise<FolderEntity[]>;

  /**
   * Get direct children of a folder by ID
   */
  getChildren(folderId: string, params?: GetChildrenParams): Promise<FolderEntity[]>;

  /**
   * Get breadcrumb trail for a folder
   */
  getBreadcrumbs(folderId: string): Promise<FolderEntity[]>;

  /**
   * Search folder or file metadata
   * #TODO: refine params
   */
  search(query: string, params?: SearchParams): Promise<FolderEntity[]>;
}
