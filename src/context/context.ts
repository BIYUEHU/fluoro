/*
 * @Author: Hotaru biyuehuya@gmail.com
 * @Blog: https://hotaru.icu
 * @Date: 2024-02-07 13:44:38
 * @LastEditors: Hotaru biyuehuya@gmail.com
 * @LastEditTime: 2024-08-03 12:19:31
 */
import Tokens from './tokens'
import { Events, type EventsMapping } from './events'
import Modules from './modules'

interface obj {
  // biome-ignore lint:
  [propName: string | number | symbol]: any
}

/** Context keys */
export type CommonKeys = keyof obj

/** Context keys */
export type ContextKeys = Exclude<keyof Context, keyof ContextOrigin>

/** Context identity */
export type IdentityType = string | symbol

/** Context origin */
export interface ContextOrigin {
  readonly [Tokens.container]: Map<CommonKeys, obj>
  readonly [Tokens.tracker]: Map<CommonKeys, CommonKeys | undefined>
  readonly [Tokens.record]: Set<Context>
  readonly identity?: IdentityType
  readonly root: Context
  readonly parent?: Context
  get(prop: CommonKeys): obj | undefined
  inject<T extends ContextKeys>(prop: T, force?: boolean): boolean
  inject(prop: CommonKeys, force?: boolean): boolean
  provide<T extends obj>(prop: CommonKeys, value: T): boolean
  mixin<K extends ContextKeys>(prop: CommonKeys, keys: K[], force?: boolean): boolean
  mixin(prop: CommonKeys, keys: CommonKeys[], force?: boolean): boolean
  extends(identity?: IdentityType): Context
  extends(_: Exclude<unknown, IdentityType>, identity?: IdentityType): Context
}

const DEFAULT_EXTENDS_NAME = 'sub'

function isExistsContext<T>(value: T): value is T & { ctx: Context } {
  return value instanceof Object && 'ctx' in value && value.ctx instanceof Context
}

function mountObject<T>(value: T, ctx: Context): T {
  if (!isExistsContext(value)) return value
  return new Proxy(value, {
    get(target, prop, receiver) {
      if (prop === 'ctx') return ctx
      return Reflect.get(target, prop, receiver)
    }
  })
}

// function createContainer(ctx: Context) {
//   const container = new Map<CommonKeys, obj>()
//   container.get = new Proxy(container.get, {
//     apply(target, thisArg, argArray) {
//       const value = Reflect.apply(target, thisArg, argArray) ?? ctx.parent?.[Tokens.container].get(argArray[0])
//       return mountObject(value, ctx)
//     }
//   })
//   container
//   container
//   return container as Pick<typeof container, 'get' | 'set' | 'forEach'>
// }

// function createTracker(ctx: Context) {
//   const tracker = new Set<CommonKeys>()
//   tracker.has = new Proxy(tracker.has, {
//     apply(target, thisArg, argArray) {
//       return Reflect.apply(target, thisArg, argArray) ?? ctx.parent?.[Tokens.tracker].has(argArray[0])
//     }
//   })
//   return tracker
// }

/**
 * Context.
 */
export class Context implements ContextOrigin {
  /** Context container */
  public readonly [Tokens.container]: Map<CommonKeys, obj> = new Map()

  /** Context container */
  public readonly [Tokens.tracker]: Map<CommonKeys, CommonKeys | undefined> = new Map()

  /** Context record */
  public readonly [Tokens.record] = new Set<Context>()

  /** Context identity */
  public readonly identity?: IdentityType

  /** Context root */
  public readonly root: Context = this

  /** Context parent */
  public readonly parent?: Context

  public constructor()
  /**
   * Context parent.
   *
   * @param parent - Context parent
   * @param identity - Context identity
   */
  public constructor(parent: Context, identity: IdentityType)
  public constructor(parent?: Context, identity?: IdentityType) {
    this.root = parent ? parent.root : this
    this.parent = parent
    this.identity = identity
    if (this.parent) {
      Object.setPrototypeOf(this, this.parent)
      this[Tokens.container] = new Map(this.parent[Tokens.container])
      this[Tokens.tracker] = new Map(this.parent[Tokens.tracker])
    }

    for (const [key, serviceName] of this[Tokens.tracker]) {
      /* Mixins update context */
      if (serviceName !== undefined) {
        const service = this.get(serviceName)
        if (isExistsContext(service)) this.mixin(serviceName, [key], true)
        continue
      }
      if (isExistsContext(this[key as ContextKeys])) this.inject(key, true)
    }
    /* Injected update context */
    for (const obj of this[Tokens.container].values()) mountObject(obj, this)

    this.provide('events', parent ? (parent.get('events') as obj) : new Events<EventsMapping>())
    this.mixin('events', ['emit', 'on', 'once', 'off', 'offAll'])
    this.provide('modules', new Modules(this))
    this.mixin('modules', ['load', 'unload', 'service'])
  }

  /**
   * Get context property.
   *
   * @param prop - Context property
   * @returns Context property
   */
  public get<T = obj | undefined>(prop: CommonKeys) {
    const value = this[Tokens.container].get(prop) as T
    return value ? mountObject(value, this) : value
  }

  /**
   * Inject context.
   *
   * @param prop - Context property
   * @param force - Force inject
   * @returns boolean
   */
  public inject<T extends ContextKeys>(prop: T, force?: boolean): boolean
  public inject(prop: CommonKeys, force?: boolean): boolean
  public inject(prop: CommonKeys, force = false) {
    if (!force && (this[prop as ContextKeys] || !this[Tokens.container].has(prop))) return false
    this[prop as ContextKeys] = mountObject(this.get(prop), this)
    this[Tokens.tracker].set(prop, undefined)
    return true
  }

  public provide<T extends obj>(prop: CommonKeys, value: T) {
    if (this[Tokens.container].has(prop)) return false
    this[Tokens.container].set(prop, value)
    return true
  }

  /**
   * Mixin context.
   *
   * @param prop - Context property
   * @param keys - Context keys
   * @param force - Force mixin
   * @returns boolean
   */
  public mixin<T extends ContextKeys>(prop: CommonKeys, keys: T[], force?: boolean): boolean
  public mixin(prop: CommonKeys, keys: CommonKeys[], force?: boolean): boolean
  public mixin(prop: CommonKeys, keys: CommonKeys[], force = false) {
    const instance = this.get(prop)
    if (!instance) return false

    let succeed = true
    for (const key of keys) {
      if (!force && (this[key as ContextKeys] || !instance[key])) {
        succeed = false
        continue
      }
      this[key as ContextKeys] = mountObject(
        typeof instance[key] === 'function' ? instance[key]?.bind(instance) : instance[key],
        this
      )
      this[Tokens.tracker].set(key, prop)
    }
    return succeed
  }

  /**
   * Extends context.
   *
   * @param identity - Context identity
   * @returns Context
   */
  public extends(identity?: IdentityType): Context
  public extends(_: Exclude<unknown, IdentityType>, identity?: IdentityType): Context
  public extends(_: unknown, arg2?: IdentityType) {
    const identity =
      (typeof _ === 'string' || typeof _ === 'symbol' ? _ : arg2) ?? this.identity ?? DEFAULT_EXTENDS_NAME
    const childCtx = new Context(this, identity)
    this[Tokens.record].add(childCtx)
    return childCtx
  }

  /**
   * Find context by identity.
   *
   * @param identity - Context identity
   * @param mode - Search mode
   * @returns Context
   */
  public find(identity: IdentityType, mode: 'up' | 'down' | 'both' = 'both'): Context | undefined {
    if (identity === this.identity) return this
    if (mode === 'down' || mode === 'both') {
      const result = Array.from(this[Tokens.record]).find(
        (ctx) => identity === ctx.identity || ctx.find(identity, 'down')
      )
      if (result) return result
    }
    if ((mode === 'up' || mode === 'both') && this.parent) {
      if (identity === this.parent.identity) return this.parent
      const result = this.parent.find(identity, 'up')
      if (result) return result
    }
    return undefined
  }
}

export default Context
