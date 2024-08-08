import Tokens from './tokens';
import './events';
interface obj {
    [propName: string | number | symbol]: any;
}
/** Context keys */
export type CommonKeys = keyof obj;
/** Context keys */
export type ContextKeys = Exclude<keyof Context, keyof ContextOrigin>;
/** Context identity */
export type IdentityType = string | symbol;
/** Context origin */
export interface ContextOrigin {
    readonly [Tokens.container]: Map<CommonKeys, obj>;
    readonly [Tokens.tracker]: Map<CommonKeys, CommonKeys | undefined>;
    readonly [Tokens.record]: Set<Context>;
    readonly identity?: IdentityType;
    readonly root: Context;
    readonly parent?: Context;
    get(prop: CommonKeys): obj | undefined;
    inject<T extends ContextKeys>(prop: T, force?: boolean): boolean;
    inject(prop: CommonKeys, force?: boolean): boolean;
    provide<T extends obj>(prop: CommonKeys, value: T): boolean;
    mixin<K extends ContextKeys>(prop: CommonKeys, keys: K[], force?: boolean): boolean;
    mixin(prop: CommonKeys, keys: CommonKeys[], force?: boolean): boolean;
    extends(identity?: IdentityType): Context;
    extends(_: Exclude<unknown, IdentityType>, identity?: IdentityType): Context;
}
/**
 * Context.
 */
export declare class Context implements ContextOrigin {
    /** Context container */
    readonly [Tokens.container]: Map<CommonKeys, obj>;
    /** Context container */
    readonly [Tokens.tracker]: Map<CommonKeys, CommonKeys | undefined>;
    /** Context record */
    readonly [Tokens.record]: Set<Context>;
    /** Context identity */
    readonly identity?: IdentityType;
    /** Context root */
    readonly root: Context;
    /** Context parent */
    readonly parent?: Context;
    constructor();
    /**
     * Context parent.
     *
     * @param parent - Context parent
     * @param identity - Context identity
     */
    constructor(parent: Context, identity: IdentityType);
    /**
     * Get context property.
     *
     * @param prop - Context property
     * @returns Context property
     */
    get<T = obj | undefined>(prop: CommonKeys): T;
    /**
     * Inject context.
     *
     * @param prop - Context property
     * @param force - Force inject
     * @returns boolean
     */
    inject<T extends ContextKeys>(prop: T, force?: boolean): boolean;
    inject(prop: CommonKeys, force?: boolean): boolean;
    provide<T extends obj>(prop: CommonKeys, value: T): boolean;
    /**
     * Mixin context.
     *
     * @param prop - Context property
     * @param keys - Context keys
     * @param force - Force mixin
     * @returns boolean
     */
    mixin<T extends ContextKeys>(prop: CommonKeys, keys: T[], force?: boolean): boolean;
    mixin(prop: CommonKeys, keys: CommonKeys[], force?: boolean): boolean;
    /**
     * Extends context.
     *
     * @param identity - Context identity
     * @returns Context
     */
    extends(identity?: IdentityType): Context;
    extends(_: Exclude<unknown, IdentityType>, identity?: IdentityType): Context;
    /**
     * Find context by identity.
     *
     * @param identity - Context identity
     * @param mode - Search mode
     * @returns Context
     */
    find(identity: IdentityType, mode?: 'up' | 'down' | 'both'): Context | undefined;
}
export default Context;
