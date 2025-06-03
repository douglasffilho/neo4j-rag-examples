import { swaggerUI } from '@hono/swagger-ui'
import { OpenAPIHono } from '@hono/zod-openapi'
import { etag } from 'hono/etag'
import { logger } from 'hono/logger'
import dogsRoutes from './domains/dogs'

const app = new OpenAPIHono()

app.use(etag(), logger())

app.doc('/openapi', {
    openapi: '3.0.0',
    info: {
        version: '1.0.0',
        title: 'User Authentication and Authorization'
    }
})
app.get('/reference', swaggerUI({ url: '/openapi' }))

app.route('/', dogsRoutes)

export default app
