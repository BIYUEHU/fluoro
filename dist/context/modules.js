
/**
 * @Package fluoro
 * @Version 1.1.0
 * @Author Hotaru <biyuehuya@gmail.com>
 * @Copyright 2024 Hotaru. All rights reserved.
 * @License GPL-3.0
 * @Link https://github.com/kotorijs/kotori
 * @Date 2024/8/4 21:33:20
 */

"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var modules_exports = {};
__export(modules_exports, {
  Modules: () => Modules,
  default: () => modules_default
});
module.exports = __toCommonJS(modules_exports);
var import_tokens = require("./tokens");
var import_service = require("./service");
function handleFunction(func, ctx, config) {
  func(ctx, config);
}
function handleConstructor(Class, ctx, config) {
  new Class(ctx, config);
}
const DEFAULT_MODULE_CONFIG = { filter: {} };
function isClass(obj, strict = true) {
  if (typeof obj !== "function") return false;
  const str = obj.toString();
  if (obj.prototype === void 0) return false;
  if (obj.prototype.constructor !== obj) return false;
  if (str.slice(0, 5) === "class") return true;
  if (Object.getOwnPropertyNames(obj.prototype).length >= 2) return true;
  if (/^function\s+\(|^function\s+anonymous\(/.test(str)) return false;
  if (strict && /^function\s+[A-Z]/.test(str)) return true;
  if (!/\b\(this\b|\bthis[.[]\b/.test(str)) return false;
  if (!strict || /classCallCheck\(this/.test(str)) return true;
  return /^function\sdefault_\d+\s*\(/.test(str);
}
class Modules {
  ctx;
  constructor(ctx) {
    this.ctx = ctx;
  }
  load(instance) {
    const ctx = this.ctx.extends((typeof instance === "object" ? instance.name : void 0) ?? this.ctx.identity);
    const injected = (arr) => {
      for (const identity of arr) {
        const serviceData = Array.from(ctx[import_tokens.Tokens.container]).find(
          ([, service]) => service instanceof import_service.Service && service.identity === identity
        );
        if (serviceData) ctx.inject(serviceData[0]);
      }
    };
    if (instance instanceof Function) {
      if (isClass(instance)) handleConstructor(instance, ctx, DEFAULT_MODULE_CONFIG);
      else handleFunction(instance, ctx, DEFAULT_MODULE_CONFIG);
      this.ctx.emit("ready_module", { instance });
      return;
    }
    const { main, Main, inject, default: defaults, config } = instance;
    if (inject) injected(inject);
    if (defaults && isClass(defaults)) {
      const { inject: inject1 } = defaults;
      if (inject1) injected(inject1);
      handleConstructor(defaults, ctx, config ?? DEFAULT_MODULE_CONFIG);
    } else if (defaults && !isClass(defaults)) {
      handleFunction(defaults, ctx, config ?? DEFAULT_MODULE_CONFIG);
    } else if (main) {
      handleFunction(main, ctx, config ?? DEFAULT_MODULE_CONFIG);
    } else if (Main) {
      const { inject: inject1 } = Main;
      if (inject1) injected(inject1);
      handleConstructor(Main, ctx, config ?? DEFAULT_MODULE_CONFIG);
    }
    this.ctx.emit("ready_module", { instance });
  }
  unload(instance) {
    this.ctx.emit("dispose_module", { instance });
  }
  service(name, instance) {
    this.ctx.provide(name, instance);
    this.ctx.on("ready", () => this.ctx.get(name).start());
    this.ctx.on("dispose", () => this.ctx.get(name).stop());
  }
}
var modules_default = Modules;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Modules
});
