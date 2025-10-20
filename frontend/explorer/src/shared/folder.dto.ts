export interface FolderDTO {
  id: string;
  name: string;
  parentId: string | null;
  path: string;
  depth: number;
}
