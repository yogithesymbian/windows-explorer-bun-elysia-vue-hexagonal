import { FileEntity } from "@/application/domain/file.entity";
import type { FileDTO } from "@infrastructure/dto/file.dto";

export class FileMapper {
  static toDomain(dto: FileDTO): FileEntity {
    return new FileEntity(dto.id, dto.folderId, dto.name, dto.ext, dto.size);
  }

  static toDTO(entity: FileEntity): FileDTO {
    return {
      id: entity.id,
      folderId: entity.folderId,
      name: entity.name,
      ext: entity.ext,
      size: entity.size,
    };
  }
}