import { app } from './bootstrap/app';
import { port } from './bootstrap/env';

app.listen(port);

console.log(`🦊 Elysia is running at ${app.server?.url ?? `http://localhost:${port}`}`)
