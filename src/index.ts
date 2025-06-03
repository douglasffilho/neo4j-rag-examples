import { serve } from '@hono/node-server';
import app from './app';
import { init } from './domains/dogs/lib/neo4j';

await init();

const port = Number(process.env.PORT ?? '8080');

serve({ fetch: app.fetch, port }, () => {
  console.log(`🚀 Server is running on port ${port}`)
  console.log(`🔍 Environment: ${process.env.NODE_ENV}`)
  console.log(`🔍 OpenAPI: http://localhost:${port}/reference`)
})

export default app;
