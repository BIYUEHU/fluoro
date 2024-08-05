
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
var tokens_exports = {};
__export(tokens_exports, {
  Tokens: () => Tokens,
  default: () => tokens_default
});
module.exports = __toCommonJS(tokens_exports);
class Tokens {
  static container = Symbol.for("fluoro.context.container");
  static tracker = Symbol.for("fluoro.context.tracker");
  static record = Symbol.for("fluoro.context.record");
}
var tokens_default = Tokens;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Tokens
});
