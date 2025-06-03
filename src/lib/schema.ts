import { Context, Next } from 'hono'
import { AnyZodObject, ZodArray, ZodDiscriminatedUnion, ZodDiscriminatedUnionOption, ZodEffects, ZodRecord } from 'zod'

export type ZodObjectWithEffect = AnyZodObject | ZodEffects<AnyZodObject, unknown, unknown>
export type ZodObjectBody =
    | AnyZodObject
    | ZodEffects<AnyZodObject, unknown, unknown>
    | ZodDiscriminatedUnion<string, ZodDiscriminatedUnionOption<string>[]>

export interface RouterOptionsSchemas {
    response: AnyZodObject | ZodArray<AnyZodObject> | ZodRecord
    body?: ZodObjectBody
    query?: ZodObjectWithEffect
    params?: ZodObjectWithEffect
    cookies?: ZodObjectWithEffect
    headers?: ZodObjectWithEffect
}

export type RouterOptionsMethod = 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head' | 'trace'

export interface RouterOptions {
    description: string
    method: RouterOptionsMethod
    path: string
    schemas: RouterOptionsSchemas
    tags: string[]
    responseStatusCode?: number
    authType?: 'Basic' | 'Bearer'
    middleware?: (ctx: Context, next: Next) => Promise<void>
}
