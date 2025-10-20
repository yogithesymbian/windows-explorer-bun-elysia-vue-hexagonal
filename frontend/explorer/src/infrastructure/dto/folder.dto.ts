export interface FolderDTO {
  id: string;
  name: string;
  parentId: string | null;
  // parent_id: string | null;
  path: string;
  depth: number;
}
