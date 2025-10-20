export type FolderRow = {
  id: string;
  name: string;
  parent_id: string | null;
  path: string; // ltree::text
  depth: number;
};

export interface IFoldersRepository {
  getSubtreeByPath(rootPath: string, maxDepth: number): Promise<FolderRow[]>;
  getChildren(parentId: string, paging: { limit: number; offset: number }): Promise<FolderRow[]>;
  getBreadcrumbs(id: string): Promise<FolderRow[]>;
  searchFolders(q: string, paging: { limit: number; offset: number }): Promise<FolderRow[]>;
}