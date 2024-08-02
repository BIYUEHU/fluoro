import Tokens from './tokens';
import './events';
interface obj {
    [propName: string | number | symbol]: any;
}
interface ContextOrigin {
    readonly [Tokens.container]: Map<string, obj>;
    readonly [Tokens.table]: Map<string, string[]>;
    root: Context;
    get(prop: string): obj | undefined;
    inject<T extends Keys>(prop: T): void;
    provide<T extends obj>(prop: string, value: T): void;
    mixin<K extends Keys>(prop: string, keys: K[]): void;
    extends<T extends obj>(meta?: T, identity?: string): Context;
}
interface ContextImpl extends ContextOrigin {
}
declare module './context' {
    interface Context {
        identity?: string;
    }
}
type Keys = keyof Omit<Context, keyof ContextOrigin> & string;
export declare class Context implements ContextImpl {
    readonly [Tokens.container]: Map<string, obj>;
    readonly [Tokens.table]: Map<string, string[]>;
    root: Context;
    parent: Context | null;
    constructor(root?: Context);
    get<T = obj | undefined>(prop: string): T;
    inject<T extends Keys>(prop: T): void;
    provide<T extends obj>(prop: string, value: T): void;
    mixin<K extends Keys>(prop: string, keys: K[]): void;
    extends<T extends obj = object>(meta?: T, identity?: string): Context;
}
export default Context;
