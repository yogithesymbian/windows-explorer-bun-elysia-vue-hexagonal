import { Elysia, t } from 'elysia';
import type { IFoldersRepository } from '@application/ports/folder-repo.port';
import type { IFilesRepository } from '@application/ports/file-repo.port';
import { PgFoldersRepository } from '@infrastructure/repositories/folder.repo.pg';
import { PgFilesRepository } from '@infrastructure/repositories/file.repo.pg';
import { GetSubtree } from '@application/usecases/get-subtree.usecase';
import { GetChildren } from '@application/usecases/get-children.usecase';
import { GetBreadcrumbs } from '@application/usecases/get-breadcrumbs.usecase';
import { ListFiles } from '@application/usecases/list-files.usecase';
import { Search } from '@application/usecases/search.usecase';

export type Deps = {
  foldersRepo: IFoldersRepository;
  filesRepo: IFilesRepository;
};

export const createApp = (deps?: Partial<Deps>) => {
  const foldersRepo = deps?.foldersRepo ?? new PgFoldersRepository();
  const filesRepo   = deps?.filesRepo   ?? new PgFilesRepository();

  const getSubtree     = new GetSubtree(foldersRepo);
  const getChildren    = new GetChildren(foldersRepo);
  const getBreadcrumbs = new GetBreadcrumbs(foldersRepo);
  const listFiles      = new ListFiles(filesRepo);
  const searchUsecase  = new Search(foldersRepo, filesRepo);

  // type SearchType = 'file' | 'folder';

  const SearchEnum = {
    file: 'file',
    folder: 'folder'
  } as const;

  const app = new Elysia()
    .onError(({ code, set }) => { if (code === 'VALIDATION') { set.status = 400; return { message: 'Invalid input' }; } })

    // /api/v1/tree
    .get('/api/v1/tree',
      ({ query }) => getSubtree.execute({
        rootPath: String(query.rootPath ?? 'root'),
        maxDepth: Number(query.maxDepth ?? 2)
      }),
      {
        query: t.Object({ rootPath: t.Optional(t.String()), maxDepth: t.Optional(t.Integer()) })
      }
    )

    // /api/v1/folders/:id/children
    .get('/api/v1/folders/:id/children',
      ({ params, query }) => getChildren.execute({
        parentId: params.id,
        limit: Number(query.limit ?? 50),
        offset: Number(query.offset ?? 0)
      }),
      {
        params: t.Object({ id: t.String() }),
        query: t.Object({ limit: t.Optional(t.Integer()), offset: t.Optional(t.Integer()) })
      }
    )

    // /api/v1/folders/:id/breadcrumbs
    .get('/api/v1/folders/:id/breadcrumbs',
      ({ params }) => getBreadcrumbs.execute({ id: params.id }),
      { params: t.Object({ id: t.String() }) }
    )

    // /api/v1/folders/:id/files
    .get('/api/v1/folders/:id/files',
      ({ params, query }) => listFiles.execute({
        folderId: params.id,
        limit: Number(query.limit ?? 50),
        offset: Number(query.offset ?? 0)
      }),
      {
        params: t.Object({ id: t.String() }),
        query: t.Object({ limit: t.Optional(t.Integer()), offset: t.Optional(t.Integer()) })
      }
    )

    
    // /api/v1/search
    .get('/api/v1/search',
      ({ query }) => searchUsecase.execute({
        q: String(query.q ?? ''),
        type: (query.type === 'file' ? 'file' : 'folder'),
        limit: Number(query.limit ?? 50),
        offset: Number(query.offset ?? 0)
      }),
      {
        query: t.Object({
          q: t.Optional(t.String()),
          type: t.Optional(t.Enum(SearchEnum)),
          limit: t.Optional(t.Integer()),
          offset: t.Optional(t.Integer())
        })
      }
    );

  return app;
};

// default app untuk dev
export const app = createApp();