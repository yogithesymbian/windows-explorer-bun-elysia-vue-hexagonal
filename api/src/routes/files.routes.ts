import { t, Elysia } from 'elysia';
import type { Deps } from '../di/container';
import { APP_CONFIG } from '@api/config/app.config';

export const filesRoutes = (deps: Deps) =>
  new Elysia({ prefix: APP_CONFIG.API_PREFIX })
    .get('/folders/:id/files', ({ params, query }) => deps.listFiles.execute({
        folderId: params.id,
        limit: Number(query.limit ?? 50),
        offset: Number(query.offset ?? 0)
    }), { 
        detail: { summary: 'show files by select folder', tags: ['Files'] },
        query: t.Object({ 
            limit: t.Optional(t.Integer()), 
            offset: t.Optional(t.Integer()) 
        }),
        response: t.Array(t.Object({
          id: t.String(),
          folderId: t.String(),
          name: t.String(),
          ext: t.Nullable(t.String()),
          size: t.Nullable(t.Number()),
        }), { description: 'List files'})
     })

    ;
