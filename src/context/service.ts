import type { Context } from './context'

interface ServiceImpl<T extends object = object> {
  readonly identity: string
  readonly config: T
  start(): void
  stop(): void
}

export abstract class Service<T extends object = object, C extends Context = Context> implements ServiceImpl<T> {
  public readonly ctx: C

  public readonly config: T

  public readonly identity: string

  public constructor(ctx: C, config: T, identity: string) {
    this.ctx = ctx
    this.config = config
    this.identity = identity
  }

  public start(): void {}

  public stop(): void {}
}

export default Service
