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

  public readonly name: string

  public constructor(ctx: C, config: T, name: string) {
    this.ctx = ctx
    this.config = config
    this.identity = name
    this.name = name
  }

  public start(): void {}

  public stop(): void {}
}

export default Service
