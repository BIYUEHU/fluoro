
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
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var context_exports = {};
module.exports = __toCommonJS(context_exports);
__reExport(context_exports, require("./context"), module.exports);
__reExport(context_exports, require("./events"), module.exports);
__reExport(context_exports, require("./modules"), module.exports);
__reExport(context_exports, require("./service"), module.exports);
__reExport(context_exports, require("./tokens"), module.exports);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ...require("./context"),
  ...require("./events"),
  ...require("./modules"),
  ...require("./service"),
  ...require("./tokens")
});
