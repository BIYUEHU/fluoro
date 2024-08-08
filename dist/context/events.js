
/**
 * @Package fluoro
 * @Version 1.1.0
 * @Author Hotaru <biyuehuya@gmail.com>
 * @Copyright 2024 Hotaru. All rights reserved.
 * @License GPL-3.0
 * @Link https://github.com/kotorijs/kotori
 * @Date 2024/8/8 20:53:56
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
var events_exports = {};
__export(events_exports, {
  Events: () => Events,
  default: () => events_default
});
module.exports = __toCommonJS(events_exports);
class Events {
  list = /* @__PURE__ */ new Map();
  emit(type, ...data) {
    const value = this.list.get(type);
    if (!value) return;
    for (const callback of value) callback(...data);
  }
  async parallel(type, ...data) {
    const value = this.list.get(type);
    if (!value) return;
    await Promise.all(
      Array.from(value).map(
        (callback) => new Promise(() => {
          callback(...data);
        })
      )
    );
  }
  on(type, callback) {
    if (!this.list.has(type)) this.list.set(type, /* @__PURE__ */ new Set());
    this.list.get(type)?.add(callback);
  }
  once(type, callback) {
    const fallback = (...data) => {
      this.off(type, fallback);
      return callback(...data);
    };
    this.on(type, fallback);
  }
  /*
  before<T extends EventsBeforeKeys<keyof EventsTool<A>>>(type: T, callback: EventsTool<A>[T extends never ? never : `before_${T}`]) {
    this.on(`before_${type}` as Parameters<typeof this.on>[0], callback as Parameters<typeof this.on>[1]);
  } */
  off(type, callback) {
    if (!this.list.has(type)) return;
    this.list.get(type)?.delete(callback);
  }
  offAll(type) {
    if (!this.list.has(type)) return;
    this.list.delete(type);
  }
}
var events_default = Events;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Events
});
