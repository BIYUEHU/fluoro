import type { Context } from './context'

interface ServiceImpl<T extends object = object> {
  readonly identity: string
  readonly config: T
  start(): void
  stop(): void
}

export abstract class Service<T extends object = object> implements ServiceImpl<T> {
  public readonly ctx: Context

  public readonly config: T

  public readonly identity: string

  public constructor(ctx: Context, config: T, identity: string) {
    this.ctx = ctx
    this.config = config
    this.identity = identity
  }

  public start(): void {}

  public stop(): void {}
}

export default Service
