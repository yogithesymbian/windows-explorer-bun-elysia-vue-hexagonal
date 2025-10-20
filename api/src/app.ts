import { Elysia } from 'elysia';
import { buildDependencies, Deps } from './di/container';
import { foldersRoutes } from './routes/folders.routes';
import { filesRoutes } from './routes/files.routes';
import { searchRoutes } from './routes/search.routes';
import { openApiPlugin } from './plugins/openapi.plugin';
// import { DomainError } from '@application/errors';

export const createApp = (depsOverride?: Partial<Deps>) => {
  const deps = buildDependencies(depsOverride);
  return new Elysia()
    .use(openApiPlugin)
    .use(foldersRoutes(deps))
    .use(filesRoutes(deps))
    .use(searchRoutes(deps))
};
