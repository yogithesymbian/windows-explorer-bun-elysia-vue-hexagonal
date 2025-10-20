import { t, Elysia } from 'elysia';
import type { Deps } from '../di/container';
import { APP_CONFIG } from '@api/config/app.config';

const SearchEnum = {
    file: 'file',
    folder: 'folder'
} as const;

export const searchRoutes = (deps: Deps) =>
  new Elysia({ prefix: APP_CONFIG.API_PREFIX })
    .get('/search', ({ query }) => deps.searchUsecase.execute({
        q: String(query.q ?? ''),
        type: (query.type === 'file' ? 'file' : 'folder'),
        limit: Number(query.limit ?? 50),
        offset: Number(query.offset ?? 0)
    }), { 
        detail: { summary: 'search folder or file', tags: ['Search'] },
        query: t.Object({ 
          q: t.Optional(t.String({minLength: 5})),
          type: t.Optional(t.Enum(SearchEnum)),
          limit: t.Optional(t.Integer()),
          offset: t.Optional(t.Integer())
        }),
        // response: t.Array(t.Object({
        //   id: t.String(),
        //   name: t.String(),
        //   parentId: t.Nullable(t.String()),
        //   folderId: t.Nullable(t.String()),
        //   path: t.String(),
        //   depth: t.Integer()
        // }), 
        // { description: 'List node dalam tree'})
     })
    ;
