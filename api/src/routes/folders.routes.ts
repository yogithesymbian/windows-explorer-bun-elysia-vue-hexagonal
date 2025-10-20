import { t, Elysia } from 'elysia';
import type { Deps } from '../di/container';
import { APP_CONFIG } from '@api/config/app.config';

export const foldersRoutes = (deps: Deps) =>
  new Elysia({ prefix: APP_CONFIG.API_PREFIX })
    .get('/tree', ({ query }) => deps.getSubtree.execute({
      rootPath: String(query.rootPath ?? 'root'),
      maxDepth: Number(query.maxDepth ?? 2)
    }), { 
        detail: { summary: 'Ambil tree', tags: ['Folders'] , description: 'Get subtree of folders'},
        query: t.Object({ 
          rootPath: t.Optional(t.String( { description: 'ltree path, contoh root', default: 'root' })), 
          maxDepth: t.Optional(t.Number( { description: 'kedalaman tree relatif terhadap maxDepth', default: 2, })) 
        }),
        response: t.Array(t.Object({
          id: t.String(),
          name: t.String(),
          parentId: t.Nullable(t.String()),
          path: t.String(),
          depth: t.Number()
        }), { description: 'List node dalam tree'})
     })

    .get('/folders/:id/children', ({ params, query }) => deps.getChildren.execute({
      parentId: params.id,
      limit: Number(query.limit ?? 50),
      offset: Number(query.offset ?? 0)
    }), { 
      detail: { summary: 'Ambil subtree', tags: ['Folders'] },
      query: t.Object({ 
        id: t.Optional(t.String( { description: 'folder id' })), 
        limit: t.Optional(t.Integer( { description: 'limit default 50' })),
        offset: t.Optional(t.Integer( { description: 'offset default 0' })) 
      }),
      response: t.Array(t.Object({
        id: t.String(),
        name: t.String(),
        parentId: t.Nullable(t.String()),
        path: t.String(),
        depth: t.Integer()
      }), { description: 'List node dalam subtree'})
    })

    .get('/folders/:id/breadcrumbs', ({ params }) => deps.getBreadcrumbs.execute({ 
      id: params.id 
    }), { 
      detail: { summary: 'Ambil breadcrumbs', tags: ['Folders'] },
      query: t.Object({ 
        id: t.Optional(t.String( { description: 'folder ID' })), 
        limit: t.Optional(t.Integer( { description: 'limit default 50' })),
        offset: t.Optional(t.Integer( { description: 'offset default 0' })) 
      }),
      response: t.Array(t.Object({
        id: t.String(),
        name: t.String(),
        parentId: t.Nullable(t.String()),
        path: t.String(),
        depth: t.Integer()
      }), { description: 'get breadcrumbs'})
    });
