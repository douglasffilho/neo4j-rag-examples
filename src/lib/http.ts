import { createRoute, OpenAPIHono } from '@hono/zod-openapi'
import { Handler, MiddlewareHandler } from 'hono'
import { RouterOptions } from './schema'

export const newRoute = (routerOptions: RouterOptions, handler: Handler) => {
    const { description, method, path, schemas, tags, responseStatusCode, middleware, authType } = routerOptions

    const app = new OpenAPIHono()

    const statusCode = responseStatusCode ?? (method === 'post' ? 201 : 200)

    const corsMiddleware: MiddlewareHandler = (ctx, next) => {
        ctx.res.headers.set('Access-Control-Allow-Origin', '*')

        return middleware ? middleware(ctx, next) : next()
    }

    const routeConfig = createRoute({
        description,
        method,
        path,
        request: {
            query: schemas.query,
            params: schemas.params,
            cookies: schemas.cookies,
            headers: schemas.headers,
            body: schemas.body
                ? {
                    content: {
                        'application/json': {
                            schema: schemas.body
                        }
                    }
                }
                : undefined
        },
        responses: {
            [statusCode]: {
                description: '',
                content: {
                    'application/json': {
                        schema: schemas.response
                    }
                }
            }
        },
        tags,
        middleware: corsMiddleware,
        security: authType ? [{ [authType]: [] }] : undefined
    })

    app.openapi(routeConfig, handler)
    return app
}