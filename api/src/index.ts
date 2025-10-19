import { app } from './server';
app.listen(8080);
console.log(`🦊 Elysia running at http://localhost:${app.server?.port}`);