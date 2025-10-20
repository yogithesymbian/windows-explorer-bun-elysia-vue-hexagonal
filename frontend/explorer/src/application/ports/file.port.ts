import type { FileDTO } from "../../shared/file.dto";

export interface FilePort {
  listFiles(folderId: string): Promise<FileDTO[]>;
}
