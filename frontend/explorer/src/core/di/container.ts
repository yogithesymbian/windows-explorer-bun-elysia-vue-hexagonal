import { ApiClient } from '@/core/di/api-client'
import { FolderApiAdapter } from '@/infrastructure/api/folder.api'
import { FileApiAdapter } from '@/infrastructure/api/file.api'
import { GetChildrenUseCase } from '@/application/usecases/get-children.usecase'
import { GetSubTreeUseCase } from '@/application/usecases/get-subtree.usecase'
import { GetBreadcrumbsUseCase } from '@/application/usecases/get-breadcrumbs.usecase'
import { ListFilesUseCase } from '@/application/usecases/list-files.usecase'
import { SearchUseCase } from '@/application/usecases/search.usecase'

const apiBaseUrl = import.meta.env.VITE_API_URL;
const apiBaseVersion = import.meta.env.VITE_API_VERSION;
const apiClient = new ApiClient(`${apiBaseUrl}${apiBaseVersion}`);
// const apiClient = new ApiClient('http://localhost:8080/api/v1')

// Adapters (Infrastructure)
const folderPort = new FolderApiAdapter(apiClient)
const filePort = new FileApiAdapter(apiClient)

// Use Cases (Application Layer)
const getChildrenUseCase = new GetChildrenUseCase(folderPort)
const getSubTreeUseCase = new GetSubTreeUseCase(folderPort)
const getBreadcrumbsUseCase = new GetBreadcrumbsUseCase(folderPort)
const listFilesUseCase = new ListFilesUseCase(filePort)
const searchUseCase = new SearchUseCase(folderPort)

export const container = {
  apiClient,
  folderPort,
  filePort,
  getChildrenUseCase,
  getSubTreeUseCase,
  getBreadcrumbsUseCase,
  listFilesUseCase,
  searchUseCase,
}
