declare module './context' {
    interface Context {
        /**
         * Emits an event with the given type and data.
         *
         * @template T - The type of the event
         * @param type - The event type to emit
         * @param data - The data to pass to the event listeners
         */
        emit: Events<EventsMapping>['emit'];
        /**
         * Emits an event and waits for all listeners to complete asynchronously.
         *
         * @template T - The type of the event
         * @param type - The event type to emit
         * @param data - The data to pass to the event listeners
         * @returns A promise that resolves when all listeners have completed
         */
        parallel: Events<EventsMapping>['parallel'];
        /**
         * Adds an event listener for the specified event type.
         *
         * @template T - The type of the event
         * @param type - The event type to listen for
         * @param callback - The callback function to be called when the event is emitted
         */
        on: Events<EventsMapping>['on'];
        /**
         * Adds a one-time event listener for the specified event type.
         *
         * @template T - The type of the event
         * @param type - The event type to listen for
         * @param callback - The callback function to be called when the event is emitted
         */
        once: Events<EventsMapping>['once'];
        /**
         * Removes an event listener for the specified event type.
         *
         * @template T - The type of the event
         * @param type - The event type to remove the listener from
         * @param callback - The callback function to be removed
         */
        off: Events<EventsMapping>['off'];
        /**
         * Removes all event listeners for the specified event type.
         *
         * @template - The type of the event
         * @param type - The event type to remove all listeners from
         */
        offAll: Events<EventsMapping>['offAll'];
    }
}
/** Mapping of event names to their callback function signatures */
export interface EventsMapping {
    /**
     * Emitted when the bot is ready.
     */
    ready(): void;
    /**
     * Emitted when an error occurs.
     *
     * @param error - The error object
     */
    error(error: Error): void;
    /**
     * Emitted when the bot is disposed.
     */
    dispose(): void;
}
/** Utility type to extract only the event callback functions from a type */
export type EventsList = {
    [K in keyof EventsMapping]: Parameters<EventsMapping[K]>[1] extends never | undefined | null ? Parameters<EventsMapping[K]>[0] : [...Parameters<EventsMapping[K]>];
};
type EventsTool<T> = {
    [K in keyof T]: T[K] extends EventsCallback ? T[K] : never;
};
type EventsCallback = (...args: any) => unknown;
/**
 * Class for managing and emitting events.
 *
 * @template A - The type of events mapping, defaults to EventsMapping
 */
export declare class Events<A = EventsMapping> {
    protected list: Map<keyof EventsTool<A>, Set<EventsTool<A>[keyof EventsTool<A>]>>;
    emit<T extends keyof EventsTool<A>>(type: T, ...data: [...Parameters<EventsTool<A>[T]>]): void;
    parallel<T extends keyof EventsTool<A>>(type: T, ...data: [...Parameters<EventsTool<A>[T]>]): Promise<void>;
    on<T extends keyof EventsTool<A>>(type: T, callback: EventsTool<A>[T]): void;
    once<T extends keyof EventsTool<A>>(type: T, callback: EventsTool<A>[T]): void;
    off<T extends keyof EventsTool<A>>(type: T, callback: EventsTool<A>[T]): void;
    offAll<T extends keyof EventsTool<A>>(type: T): void;
}
export default Events;
