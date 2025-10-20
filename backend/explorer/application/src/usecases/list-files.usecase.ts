import type { IFilesRepository } from '../ports/file-repo.port';
import type { FileDTO } from '../dto/file.dto';
import { toFileDTO } from '@infrastructure/mappers/file.mapper';

export class ListFiles {
  constructor(private readonly repo: IFilesRepository) {}
  async execute(input: { folderId: string; limit: number; offset: number }): Promise<FileDTO[]> {
    const rows = await this.repo.listByFolder(input.folderId, { limit: input.limit, offset: input.offset });
    return rows.map(toFileDTO);
  }
}