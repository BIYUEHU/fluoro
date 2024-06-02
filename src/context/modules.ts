import { type Context } from './context';
import { Tokens } from './tokens';
import { Service } from './service';

type ModuleInstanceClass = new (ctx: Context, config: ModuleConfig) => void;
type ModuleInstanceFunction = (ctx: Context, config: ModuleConfig) => void;

export interface ModuleExport {
  /*   meta?: {
    name: string;
    files: string[];
    main: string;
    config: ModuleConfig;
  }; */
  name?: string;
  main?: ModuleInstanceFunction;
  Main?: ModuleInstanceClass;
  default?: ModuleInstanceFunction | ModuleInstanceClass;
  inject?: string[];
  config?: ModuleConfig;
}

export interface ModuleConfig {
  filter: object;
}

declare module './events' {
  interface EventsMapping {
    ready_module(data: EventDataModule): void;
    dispose_module(data: EventDataModule): void;
  }
}

declare module './context' {
  interface Context {
    load: Modules['load'];
    unload: Modules['unload'];
    service: Modules['service'];
  }
}

interface EventDataModule {
  instance: ModuleExport /* | string */ | ModuleInstanceFunction | ModuleInstanceClass;
}

function handleFunction(func: ModuleInstanceFunction, ctx: Context, config: ModuleConfig) {
  func(ctx, config);
}

function handleConstructor(Class: ModuleInstanceClass, ctx: Context, config: ModuleConfig) {
  /* eslint-disable-next-line no-new */
  new Class(ctx, config);
}

const DEFAULT_MODULE_CONFIG = { filter: {} };

function isClass(obj: unknown, strict: boolean = true): obj is new (...args: unknown[]) => unknown {
  if (typeof obj !== 'function') return false;
  const str = obj.toString();
  if (obj.prototype === undefined) return false;
  if (obj.prototype.constructor !== obj) return false;
  if (str.slice(0, 5) === 'class') return true;
  if (Object.getOwnPropertyNames(obj.prototype).length >= 2) return true;
  if (/^function\s+\(|^function\s+anonymous\(/.test(str)) return false;
  if (strict && /^function\s+[A-Z]/.test(str)) return true;
  if (!/\b\(this\b|\bthis[.[]\b/.test(str)) return false;
  if (!strict || /classCallCheck\(this/.test(str)) return true;
  return /^function\sdefault_\d+\s*\(/.test(str);
}

export class Modules {
  private readonly ctx: Context;

  public constructor(ctx: Context) {
    this.ctx = ctx;
  }

  public load(instance: EventDataModule['instance']) {
    const ctx = this.ctx.extends(
      {},
      !this.ctx.identity && typeof instance === 'object' ? instance.name : this.ctx.identity
    );

    const injected = (arr: string[]) =>
      arr.forEach((identity) => {
        ctx[Tokens.container].forEach((service, name) => {
          if (!(service instanceof Service) || service.identity !== identity) return;
          ctx.inject(name as Exclude<keyof Context, Tokens | number>);
        });
      });

    if (instance instanceof Function) {
      if (isClass(instance)) handleConstructor(instance, ctx, DEFAULT_MODULE_CONFIG);
      else handleFunction(instance as ModuleInstanceFunction, ctx, DEFAULT_MODULE_CONFIG);
      this.ctx.emit('ready_module', { instance });
      return;
    }

    const { main, Main, inject, default: defaults, config } = instance;
    if (inject) injected(inject);
    if (defaults && isClass(defaults)) {
      const { inject: inject1 } = defaults as { inject?: string[] };
      if (inject1) injected(inject1);
      handleConstructor(defaults, ctx, config ?? DEFAULT_MODULE_CONFIG);
    } else if (defaults && !isClass(defaults)) {
      handleFunction(defaults as ModuleInstanceFunction, ctx, config ?? DEFAULT_MODULE_CONFIG);
    } else if (main) {
      handleFunction(main, ctx, config ?? DEFAULT_MODULE_CONFIG);
    } else if (Main) {
      const { inject: inject1 } = Main as { inject?: string[] };
      if (inject1) injected(inject1);
      handleConstructor(Main, ctx, config ?? DEFAULT_MODULE_CONFIG);
    }
    this.ctx.emit('ready_module', { instance });
  }

  public unload(instance: EventDataModule['instance']) {
    this.ctx.emit('dispose_module', { instance });
  }

  public service(name: string, instance: Service) {
    this.ctx.provide(name, instance);
    this.ctx.on('ready', () => (this.ctx.get(name) as Service).start());
    this.ctx.on('dispose', () => (this.ctx.get(name) as Service).stop());
  }
}

export default Modules;
