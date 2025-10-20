import Elysia from 'elysia';
import { createApp } from './app';
import { registerErrorHandler } from "./error-handler";
import { APP_CONFIG } from './config/app.config';

const app: Elysia = createApp();
registerErrorHandler(app);
app.listen(APP_CONFIG.PORT);

console.log(`🦊 Elysia running at http://localhost:${app.server?.port}`);
console.log(`🦊 UI spec http://localhost:${app.server?.port}/docs`);
console.log(`🦊 RAW spec http://localhost:${app.server?.port}/docs/openapi.json`);