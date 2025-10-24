/**
 * API Adapter for Files Routes in Elysia framework Hexagonal Architecture
 * File ini sama sekali tidak tahu soal database, PostgreSQL, atau SQL. 
 * Tugasnya hanya sebatas HTTP request/response dan delegasi.
 * delegasi: meneruskan ke "Use Case" yang sudah didefinisikan di layer aplikasi.
 * layer aplikasi: berisi logika bisnis aplikasi.
 * layer infrastruktur: berisi implementasi teknis seperti database, penyimpanan file, dll.
 * 
*/
import { t, Elysia } from 'elysia';
import type { Deps } from '../di/container';
import { APP_CONFIG } from '@api/config/app.config';

export const filesRoutes = (deps: Deps) =>
  new Elysia({ prefix: APP_CONFIG.API_PREFIX })
    .get('/folders/:id/files', ({ params, query }) => 
      // 3. Panggil "Use Case" | "jantung" logikanya
      deps.listFiles.execute({
        folderId: params.id,
        limit: Number(query.limit ?? 50),
        offset: Number(query.offset ?? 0)
    }), { 
        // 1. Definisikan endpoint
        detail: { summary: 'show files by select folder', tags: ['Files'] },
        // 2. Validasi input ELysia 
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
