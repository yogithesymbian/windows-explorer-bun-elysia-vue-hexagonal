export type FileRow = {
  id: string;
  folder_id: string;
  name: string;
  ext: string | null;
  size: number | null;
};

export interface IFilesRepository {
  listByFolder(folderId: string, paging: { limit: number; offset: number }): Promise<FileRow[]>;
  searchFiles(q: string, paging: { limit: number; offset: number }): Promise<FileRow[]>;
}