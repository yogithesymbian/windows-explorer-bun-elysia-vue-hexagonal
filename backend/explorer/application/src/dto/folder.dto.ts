export type FolderDTO = {
  id: string;
  name: string;
  parentId: string | null;
  path: string;
  depth: number;
};