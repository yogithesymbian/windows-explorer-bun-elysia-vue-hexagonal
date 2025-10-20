import { FolderEntity } from '@/application/domain/folder.entity';
import type { FolderDTO } from '@infrastructure/dto/folder.dto';

export class FolderMapper {
  static toDomain(dto: FolderDTO): FolderEntity {
    return new FolderEntity(dto.id, dto.name, dto.parentId, dto.path, dto.depth);
  }

  static toDTO(entity: FolderEntity): FolderDTO {
    return {
      id: entity.id,
      name: entity.name,
      parentId: entity.parentId,
      path: entity.path,
      depth: entity.depth,
    };
  }
}
