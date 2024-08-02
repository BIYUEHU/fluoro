
/**
 * @Package fluoro
 * @Version 1.1.0
 * @Author Hotaru <biyuehuya@gmail.com>
 * @Copyright 2024 Hotaru. All rights reserved.
 * @License GPL-3.0
 * @Link https://github.com/kotorijs/kotori
 * @Date 2024/8/1 21:44:10
 */

"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var context_exports = {};
__export(context_exports, {
  Context: () => Context,
  default: () => context_default
});
module.exports = __toCommonJS(context_exports);
var import_tokens = __toESM(require("./tokens"));
var import_events = require("./events");
var import_modules = __toESM(require("./modules"));
const handler = (value, ctx) => {
  if (!value || typeof value !== "object" || !(value.ctx instanceof Context)) return value;
  return new Proxy(value, {
    get(target, prop, receiver) {
      if (prop === "ctx") return ctx;
      return Reflect.get(target, prop, receiver);
    }
  });
};
const DEFAULT_EXTENDS_NAME = "sub";
class Context {
  [import_tokens.default.container] = /* @__PURE__ */ new Map();
  [import_tokens.default.table] = /* @__PURE__ */ new Map();
  root;
  parent = null;
  constructor(root) {
    this.root = root || this;
    this.provide("events", root ? root.get("events") : new import_events.Events());
    this.mixin("events", ["emit", "on", "once", "off", "offAll"]);
    this.provide("modules", new import_modules.default(this));
    this.mixin("modules", ["load", "unload", "service"]);
  }
  get(prop) {
    return this[import_tokens.default.container].get(prop);
  }
  inject(prop) {
    if (this[prop] && !this[import_tokens.default.container].has(prop)) return;
    this[prop] = this.get(prop);
  }
  provide(prop, value) {
    if (this[import_tokens.default.container].has(prop)) return;
    this[import_tokens.default.container].set(prop, value);
  }
  mixin(prop, keys) {
    this[import_tokens.default.table].set(prop, keys);
    const instance = this.get(prop);
    if (!instance) return;
    this[import_tokens.default.table].set(prop, keys);
    for (const key of keys) {
      if (this[key] || !instance[key]) continue;
      this[key] = instance[key];
      if (typeof this[key] === "function") {
        this[key] = this[key]?.bind(instance);
      }
    }
  }
  extends(meta, identity) {
    const metaHandle = meta ?? {};
    for (const key of Object.keys(metaHandle)) if (typeof this[key] === "function") delete metaHandle[key];
    const ctx = new Proxy(new Context(this.root), {
      get: (target, prop) => {
        if (prop === "identity") return identity ?? this.identity ?? DEFAULT_EXTENDS_NAME;
        if (prop === "parent") return this;
        if (target[prop]) return handler(target[prop], ctx);
        let value;
        this[import_tokens.default.table].forEach((keys, key) => {
          if (value || typeof prop === "string" && !keys.includes(prop)) return;
          const instance = ctx[import_tokens.default.container].get(key);
          if (!instance) return;
          value = instance[prop];
          if (typeof value === "function") value = value.bind(instance);
        });
        if (value !== void 0) return value;
        if (metaHandle[prop]) return handler(metaHandle[prop], ctx);
        return handler(this[prop], ctx);
      }
    });
    this[import_tokens.default.table].forEach((value, key) => ctx[import_tokens.default.table].set(key, value));
    this[import_tokens.default.container].forEach((value, key) => {
      if (!value.ctx) return ctx[import_tokens.default.container].set(key, value);
      return ctx[import_tokens.default.container].set(key, handler(value, ctx));
    });
    return ctx;
  }
}
var context_default = Context;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Context
});
