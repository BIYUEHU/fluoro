import type { Context } from './context';
import { Service } from './service';
type ModuleInstanceClass = new (ctx: Context, config: ModuleConfig) => void;
type ModuleInstanceFunction = (ctx: Context, config: ModuleConfig) => void;
/** Represents the structure of a module export */
export interface ModuleExport {
    /** The name of the module */
    name?: string;
    /** The main function of the module */
    main?: ModuleInstanceFunction;
    /** The main class of the module */
    Main?: ModuleInstanceClass;
    /** The default export of the module */
    default?: ModuleInstanceFunction | ModuleInstanceClass;
    /** The dependencies of the module */
    inject?: string[];
    /** The configuration of the module */
    config?: ModuleConfig;
}
export interface ModuleConfig {
}
declare module './events' {
    interface EventsMapping {
        /**
         * Emitted when a module is ready.
         *
         * @param data - The data to pass to the event listeners
         */
        ready_module(data: EventDataModule): void;
        /**
         * Emitted when a module is disposed.
         *
         * @param data - The data to pass to the event listeners
         */
        dispose_module(data: EventDataModule): void;
    }
}
declare module './context' {
    interface Context {
        /**
         * Loads a module.
         *
         * @param instance - The module to load
         */
        load: Modules['load'];
        /**
         * Unloads a module.
         *
         * @param instance - The module to unload
         */
        unload: Modules['unload'];
        /**
         * Loads a service.
         *
         * @param instance - The service to load
         */
        service: Modules['service'];
    }
}
interface EventDataModule {
    instance: ModuleExport | ModuleInstanceFunction | ModuleInstanceClass;
}
/**
 * The module system.
 */
export declare class Modules {
    private readonly ctx;
    constructor(ctx: Context);
    load(instance: EventDataModule['instance']): void;
    unload(instance: EventDataModule['instance']): void;
    service(name: string, instance: Service): void;
}
export default Modules;
