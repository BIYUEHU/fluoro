/** Mapping of event names to their callback function signatures */
export interface EventsMapping {
  // before_ready(): void;
  /**
   * Emitted when the bot is ready.
   */
  ready(): void
  /**
   * Emitted when an error occurs.
   *
   * @param error - The error object
   */
  error(error: Error): void
  /**
   * Emitted when the bot is disposed.
   */
  dispose(): void
}

/** Utility type to extract only the event callback functions from a type */
export type EventsList<T = EventsMapping> = {
  // biome-ignore lint:
  [K in keyof T]: T[K] extends (...args: any) => any
    ? Parameters<T[K]>[1] extends never | undefined | null
      ? Parameters<T[K]>[0]
      : [...Parameters<T[K]>]
    : never
}

type EventsTool<T> = {
  [K in keyof T]: T[K] extends EventsCallback ? T[K] : never
}

// biome-ignore lint:
type EventsCallback = (...args: any) => unknown
// type EventsBeforeKeys<T> = T extends `before_${infer U}` ? U : never;

/**
 * Class for managing and emitting events.
 *
 * @template A - The type of events mapping, defaults to EventsMapping
 */
export class Events<A = EventsMapping> {
  protected list: Map<keyof EventsTool<A>, Set<EventsTool<A>[keyof EventsTool<A>]>> = new Map()

  public emit<T extends keyof EventsTool<A>>(type: T, ...data: [...Parameters<EventsTool<A>[T]>]) {
    const value = this.list.get(type)
    if (!value) return
    for (const callback of value) callback(...data)
  }

  public async parallel<T extends keyof EventsTool<A>>(type: T, ...data: [...Parameters<EventsTool<A>[T]>]) {
    const value = this.list.get(type)
    if (!value) return
    await Promise.all(
      Array.from(value).map(
        (callback) =>
          new Promise(() => {
            callback(...data)
          })
      )
    )
  }

  public on<T extends keyof EventsTool<A>>(type: T, callback: EventsTool<A>[T]) {
    if (!this.list.has(type)) this.list.set(type, new Set())
    this.list.get(type)?.add(callback)
  }

  public once<T extends keyof EventsTool<A>>(type: T, callback: EventsTool<A>[T]) {
    const fallback = ((...data: [...Parameters<EventsTool<A>[T]>]) => {
      this.off(type, fallback)
      return callback(...data)
    }) as EventsTool<A>[T]
    this.on(type, fallback)
  }
  /*
  before<T extends EventsBeforeKeys<keyof EventsTool<A>>>(type: T, callback: EventsTool<A>[T extends never ? never : `before_${T}`]) {
    this.on(`before_${type}` as Parameters<typeof this.on>[0], callback as Parameters<typeof this.on>[1]);
  } */

  public off<T extends keyof EventsTool<A>>(type: T, callback: EventsTool<A>[T]) {
    if (!this.list.has(type)) return
    this.list.get(type)?.delete(callback)
  }

  public offAll<T extends keyof EventsTool<A>>(type: T) {
    if (!this.list.has(type)) return
    this.list.delete(type)
  }
}

export default Events
