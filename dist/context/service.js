
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
var service_exports = {};
__export(service_exports, {
  Service: () => Service,
  default: () => service_default
});
module.exports = __toCommonJS(service_exports);
class Service {
  ctx;
  config;
  identity;
  constructor(ctx, config, identity) {
    this.ctx = ctx;
    this.config = config;
    this.identity = identity;
  }
  start() {
  }
  stop() {
  }
}
var service_default = Service;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Service
});
