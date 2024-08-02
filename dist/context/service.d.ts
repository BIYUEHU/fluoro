import type { Context } from './context';
interface ServiceImpl<T extends object = object> {
    readonly identity: string;
    readonly config: T;
    start(): void;
    stop(): void;
}
export declare abstract class Service<T extends object = object> implements ServiceImpl<T> {
    readonly ctx: Context;
    readonly config: T;
    readonly identity: string;
    constructor(ctx: Context, config: T, identity: string);
    start(): void;
    stop(): void;
}
export default Service;
