<!-- markdownlint-disable -->

<div align="center">
<img src="https://kotori.js.org/fluoro.png" width="200px" height="200px" alt="logo"/>

# Fluoro

⚡ A modern and universal Meta-Framework to construct other frameworks. ⚡

</div>

<!-- markdownlint-enable -->

It refers to thoughts which are Aspect-Oriented Programming, Inversion of Control and Dependency Injection.

## ❓ Why is `Fluoro`?

**Fluoro**, its original word is `Fluorine` (F₂), it is the strongest monatomic oxidant in nature, except for some inert gases, it can react with almost all elements, and its compounds are extremely rich and diverse and have stability. Take this name, hoping Fluoro has strong ability, thus build various diversified frameworks and provide strong underlying support.

## 🛠️ Class & Interface

- Context
- Events
- Modules
- Services
- Tokens

## 🧊 Usage

### Provide, get & mixin, inject

```typescript
declare class Server {}

declare interface Context {
  config: typeof config;
  display: (typeof demo)['display'];
}

const demo = {
  name: 'hello, kotori!',
  display() {
    return this.name;
  }
};

const ctx = new Context();

ctx.provide('config', {
  port: 3000,
  host: 'localhost'
});
ctx.provide('server', new Server());

const config = ctx.get('config'); // { port: 3000 }
const server = ctx.get('server'); // Server {}

ctx.config.port; // TypeError: Cannot read properties of undefined (reading 'port')
ctx.inject('config');
ctx.config.port; // 3000

ctx.display(); // Uncaught TypeError: ctx.display is not a function
ctx.mixin('demo', ['display']);
ctx.display(); // hello, kotori!
```

### Extends

```typescript
const ctx = new Context();
const ctxChild1 = ctx.extends();
const ctxChild2 = ctx.extends();

ctx.provide('data1', { value: 1 });
ctx.inject('data1');
ctx.data1.value; // 1
ctxChild1.data1.value; // 1

ctxChild1.provide('data2', { value: 2 });
ctxChild1.inject('data2');
ctx.data2; // undefined
ctxChild1.data2.value; // 2

ctxChild2.provide('data3', { value: 3 });
ctxChild2.inject('data3');
ctx.data3; // undefined
ctxChild1.data3; // undefined
ctxChild2.data3.value; // 3

const ctx = new Context();
const ctxChild1 = ctx.extends();
const ctxChild2 = ctx.extends({meta: 'some meta data', 'child2'});

ctx.meta; // undefined
ctxChild1.meta; // undefined
ctxChild2.meta; //'some meta data'

ctx.identity; // undefined
ctxChild1.identity; // 'sub'
ctxChild2.identity; // 'child2'
```

### Modules

```typescript
/* types */
type ModuleInstanceClass = new (ctx: Context, config: ModuleConfig) => void;
type ModuleInstanceFunction = (ctx: Context, config: ModuleConfig) => void;

interface ModuleExport {
  name?: string;
  main?: ModuleInstanceFunction;
  Main?: ModuleInstanceClass;
  default?: ModuleInstanceFunction | ModuleInstanceClass;
  inject?: string[];
  config?: ModuleConfig;
}

interface EventDataModule {
  instance: ModuleExport | string | ModuleInstanceFunction | ModuleInstanceClass;
}

/* index.ts */
function plugin1(ctx: Context) {
  ctx.logger.debug('plugin1 loaded');
}

export function main(ctx: Context) {
  // output: module(main plugin) loaded
  ctx.on('read_module', (data: EventDataModule) => {
    if (data.instance === main) ctx.logger.debug('module(main plugin) loaded');
    else if (data.instance === plugin1) ctx.logger.debug('plugin1(sub plugin) loaded');
  });
  ctx.load(plugin1); // output: plugin1(sub plugin) loaded
}

export const config = Tsu.Object({
  value: Tsu.String()
});

// Others

export function main(ctx: Context, cfg: Tsu.infer<typeof config>) {
  ctx.logger.debug(ctx.identity, cfg.value); // my-project here is a string
  const subCfg = {
    value: 233
  }
  ctx.load({
    name: 'plugin1',
    main: (subCtx: Context, cfg: typeof 233) => {
      subCtx.logger.debug(subCtx.identity, cfg.value); // plugin1 233
    }
  });
}
```

## 📜 Applications

**Kotori Bot** is a crossing-platform chatbot framework,its core (`@kotori-bot/core`) depends on Fluoro,
and is a fine reference to help you build your own framework.

- [Kotori Docs](https://kotori.js.org/)

**Misakura** is a galgame(Visual novel games) made framework based on tauri, PIXI.js (solid.js) and Fluoro.

- [Misakura Docs](https://misakura.js.org/)

> Welcome you to join us!
