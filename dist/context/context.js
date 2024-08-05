
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
const DEFAULT_EXTENDS_NAME = "sub";
function isExistsContext(value) {
  return value instanceof Object && "ctx" in value && value.ctx instanceof Context;
}
function mountObject(value, ctx) {
  if (!isExistsContext(value)) return value;
  return new Proxy(value, {
    get(target, prop, receiver) {
      if (prop === "ctx") return ctx;
      return Reflect.get(target, prop, receiver);
    }
  });
}
class Context {
  /** Context container */
  [import_tokens.default.container] = /* @__PURE__ */ new Map();
  /** Context container */
  [import_tokens.default.tracker] = /* @__PURE__ */ new Map();
  /** Context record */
  [import_tokens.default.record] = /* @__PURE__ */ new Set();
  /** Context identity */
  identity;
  /** Context root */
  root = this;
  /** Context parent */
  parent;
  constructor(parent, identity) {
    this.root = parent ? parent.root : this;
    this.parent = parent;
    this.identity = identity;
    if (this.parent) {
      Object.setPrototypeOf(this, this.parent);
      this[import_tokens.default.container] = new Map(this.parent[import_tokens.default.container]);
      this[import_tokens.default.tracker] = new Map(this.parent[import_tokens.default.tracker]);
    }
    for (const [key, serviceName] of this[import_tokens.default.tracker]) {
      if (serviceName !== void 0) {
        const service = this.get(serviceName);
        if (isExistsContext(service)) this.mixin(serviceName, [key], true);
        continue;
      }
      if (isExistsContext(this[key])) this.inject(key, true);
    }
    for (const obj of this[import_tokens.default.container].values()) mountObject(obj, this);
    this.provide("events", parent ? parent.get("events") : new import_events.Events());
    this.mixin("events", ["emit", "on", "once", "off", "offAll"]);
    this.provide("modules", new import_modules.default(this));
    this.mixin("modules", ["load", "unload", "service"]);
  }
  /**
   * Get context property.
   *
   * @param prop - Context property
   * @returns Context property
   */
  get(prop) {
    const value = this[import_tokens.default.container].get(prop);
    return value ? mountObject(value, this) : value;
  }
  inject(prop, force = false) {
    if (!force && (this[prop] || !this[import_tokens.default.container].has(prop))) return false;
    this[prop] = mountObject(this.get(prop), this);
    this[import_tokens.default.tracker].set(prop, void 0);
    return true;
  }
  provide(prop, value) {
    if (this[import_tokens.default.container].has(prop)) return false;
    this[import_tokens.default.container].set(prop, value);
    return true;
  }
  mixin(prop, keys, force = false) {
    const instance = this.get(prop);
    if (!instance) return false;
    let succeed = true;
    for (const key of keys) {
      if (!force && (this[key] || !instance[key])) {
        succeed = false;
        continue;
      }
      this[key] = mountObject(
        typeof instance[key] === "function" ? instance[key]?.bind(instance) : instance[key],
        this
      );
      this[import_tokens.default.tracker].set(key, prop);
    }
    return succeed;
  }
  extends(_, arg2) {
    const identity = (typeof _ === "string" || typeof _ === "symbol" ? _ : arg2) ?? this.identity ?? DEFAULT_EXTENDS_NAME;
    const childCtx = new Context(this, identity);
    this[import_tokens.default.record].add(childCtx);
    return childCtx;
  }
  /**
   * Find context by identity.
   *
   * @param identity - Context identity
   * @param mode - Search mode
   * @returns Context
   */
  find(identity, mode = "both") {
    if (identity === this.identity) return this;
    if (mode === "down" || mode === "both") {
      const result = Array.from(this[import_tokens.default.record]).find(
        (ctx) => identity === ctx.identity || ctx.find(identity, "down")
      );
      if (result) return result;
    }
    if ((mode === "up" || mode === "both") && this.parent) {
      if (identity === this.parent.identity) return this.parent;
      const result = this.parent.find(identity, "up");
      if (result) return result;
    }
    return void 0;
  }
}
var context_default = Context;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Context
});
